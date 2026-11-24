// server/aiEngine.mjs - Comprehensive AI reasoning, profile parsing & eligibility engine
import { claudeService } from './claudeService.mjs';

/**
 * Natural language parser to extract citizen profile variables from user queries
 */
export function parseUserProfileFromText(text = '', currentProfile = {}) {
  const t = (text || '').toLowerCase();
  const profile = { ...currentProfile };

  // 1. Age extraction (e.g. "22-year-old", "22 years old", "age 22", "I am 22", "65 yrs")
  const ageMatch = t.match(/\b(?:i am |age |aged )?(\d{1,2})(?:-|\s)*(?:year|yr)s?(?:-|\s)*(?:old)?\b/i);
  if (ageMatch && ageMatch[1]) {
    const ageVal = parseInt(ageMatch[1], 10);
    if (ageVal >= 5 && ageVal <= 110) {
      profile.age = ageVal;
    }
  }

  // 2. State extraction
  const states = [
    'karnataka', 'maharashtra', 'tamil nadu', 'kerala', 'andhra pradesh',
    'telangana', 'uttar pradesh', 'bihar', 'gujarat', 'rajasthan',
    'madhya pradesh', 'west bengal', 'delhi', 'punjab', 'haryana', 'odisha'
  ];
  for (const st of states) {
    if (t.includes(st) || (st === 'karnataka' && (t.includes('bengaluru') || t.includes('bangalore') || t.includes('mysuru') || t.includes('hubli')))) {
      profile.state = st.charAt(0).toUpperCase() + st.slice(1);
      break;
    }
  }

  // 3. Occupation extraction
  if (t.includes('student') || t.includes('studying') || t.includes('college') || t.includes('university') || t.includes('scholarship')) {
    profile.occupation = 'Student';
  } else if (t.includes('farmer') || t.includes('agriculture') || t.includes('farming') || t.includes('cultivator') || t.includes('raitha')) {
    profile.occupation = 'Farmer';
  } else if (t.includes('business') || t.includes('start a business') || t.includes('startup') || t.includes('entrepreneur') || t.includes('shopkeeper') || t.includes('msme')) {
    profile.occupation = 'Entrepreneur';
  } else if (t.includes('street vendor') || t.includes('vendor') || t.includes('hawker')) {
    profile.occupation = 'Street Vendor';
  } else if (t.includes('unemployed') || t.includes('job seeker')) {
    profile.occupation = 'Unemployed';
  } else if (t.includes('daily wage') || t.includes('labourer') || t.includes('worker')) {
    profile.occupation = 'Labourer';
  }

  // 4. Annual Income extraction (e.g. "below 2 lakh", "below ₹2 lakh", "under 1.5L", "income 80000", "bpl")
  if (t.includes('below 2 lakh') || t.includes('under 2 lakh') || t.includes('< 2 lakh') || t.includes('less than 2 lakh') || t.includes('below 2l') || t.includes('below ₹2 lakh')) {
    profile.annualIncome = 180000;
  } else if (t.includes('below 1 lakh') || t.includes('under 1 lakh') || t.includes('below 1.5 lakh') || t.includes('under 1.5 lakh')) {
    profile.annualIncome = 120000;
  } else if (t.includes('below 3 lakh') || t.includes('under 3 lakh') || t.includes('below 2.5 lakh')) {
    profile.annualIncome = 240000;
  } else if (t.includes('below 5 lakh') || t.includes('under 5 lakh')) {
    profile.annualIncome = 450000;
  } else if (t.includes('bpl') || t.includes('poverty line') || t.includes('poor')) {
    profile.annualIncome = 100000;
  }

  // 5. Gender extraction
  if (t.includes('woman') || t.includes('women') || t.includes('female') || t.includes('girl') || t.includes('mother') || t.includes('stree')) {
    profile.gender = 'Female';
  } else if (t.includes('man') || t.includes('male') || t.includes('boy')) {
    profile.gender = 'Male';
  }

  // 6. Category / Caste extraction
  if (t.includes('sc') || t.includes('scheduled caste')) {
    profile.category = 'SC';
  } else if (t.includes('st') || t.includes('scheduled tribe')) {
    profile.category = 'ST';
  } else if (t.includes('obc') || t.includes('backward class')) {
    profile.category = 'OBC';
  } else if (t.includes('ews') || t.includes('economically weaker')) {
    profile.category = 'EWS';
  } else if (t.includes('minority') || t.includes('muslim') || t.includes('christian') || t.includes('jain') || t.includes('sikh')) {
    profile.category = 'Minority';
  }

  return profile;
}

/**
 * Multi-point eligibility evaluation algorithm
 * Strict classification into:
 * 1. Likely eligible
 * 2. Possibly eligible – verification required
 * 3. Not eligible based on available information
 */
export function evaluateSchemeEligibility(scheme, userProfile = {}) {
  const crit = scheme.eligibility || {};
  let matchScore = 65; // Base baseline
  const matchReasons = [];
  const missingRequirements = [];
  const flags = [];

  // 1. Age Verification
  const userAge = typeof userProfile.age === 'number' ? userProfile.age : null;
  if (userAge !== null) {
    if (crit.ageMin && userAge < crit.ageMin) {
      return {
        status: 'Not eligible based on available information',
        matchScore: 15,
        whyItMatches: `Minimum age requirement is ${crit.ageMin} years (your recorded age is ${userAge} years).`,
        missingRequirements: [],
        disqualificationReason: `Age (${userAge}) is below the scheme minimum threshold of ${crit.ageMin} years.`
      };
    }
    if (crit.ageMax && userAge > crit.ageMax) {
      return {
        status: 'Not eligible based on available information',
        matchScore: 15,
        whyItMatches: `Maximum age limit is ${crit.ageMax} years (your recorded age is ${userAge} years).`,
        missingRequirements: [],
        disqualificationReason: `Age (${userAge}) exceeds the scheme upper limit of ${crit.ageMax} years.`
      };
    }
    matchScore += 10;
    matchReasons.push(`Age (${userAge} years) falls within the eligible bracket of ${crit.ageMin || 0}-${crit.ageMax || 100} years.`);
  } else {
    missingRequirements.push('Age not specified (Scheme requires applicant to be between ' + (crit.ageMin || 18) + ' and ' + (crit.ageMax || 70) + ' years).');
    flags.push('age_unspecified');
  }

  // 2. State & Domicile Verification
  const userState = (userProfile.state || '').trim();
  const schemeState = (scheme.state || 'All India').trim();

  if (schemeState !== 'All India') {
    if (userState) {
      if (userState.toLowerCase() === schemeState.toLowerCase()) {
        matchScore += 15;
        matchReasons.push(`Resident of ${schemeState}, satisfying the state domicile criteria.`);
      } else {
        return {
          status: 'Not eligible based on available information',
          matchScore: 10,
          whyItMatches: `This is a state-specific scheme for permanent residents of ${schemeState}.`,
          missingRequirements: [],
          disqualificationReason: `Scheme is restricted to residents of ${schemeState}; your location is indicated as ${userState}.`
        };
      }
    } else {
      missingRequirements.push(`Domicile confirmation required (Scheme is exclusively for residents of ${schemeState}).`);
      flags.push('state_unspecified');
    }
  } else {
    matchScore += 5;
    matchReasons.push(`Central Scheme available across all States and Union Territories.`);
  }

  // 3. Occupation / Activity Verification
  const userOcc = (userProfile.occupation || '').toLowerCase();
  const allowedOccs = (crit.allowedOccupations || ['All']).map(o => o.toLowerCase());

  if (!allowedOccs.includes('all')) {
    if (userOcc) {
      const occMatch = allowedOccs.some(ao => userOcc.includes(ao) || ao.includes(userOcc));
      if (occMatch) {
        matchScore += 15;
        matchReasons.push(`Occupation (${userProfile.occupation}) directly matches the target beneficiary category.`);
      } else {
        // Soft match or mismatch
        matchScore -= 10;
        flags.push('occupation_mismatch');
      }
    } else {
      missingRequirements.push(`Occupation verification required (Targeted at: ${allowedOccs.join(', ')}).`);
      flags.push('occupation_unspecified');
    }
  } else {
    matchScore += 5;
    matchReasons.push(`Open to all occupations including formal, informal, and student applicants.`);
  }

  // 4. Annual Income Verification
  const userIncome = typeof userProfile.annualIncome === 'number' ? userProfile.annualIncome : null;
  const maxIncome = crit.maxIncome || 0;

  if (maxIncome > 0) {
    if (userIncome !== null) {
      if (userIncome <= maxIncome) {
        matchScore += 15;
        matchReasons.push(`Annual income (₹${userIncome.toLocaleString('en-IN')}) is within the permissible limit of ₹${maxIncome.toLocaleString('en-IN')}.`);
      } else {
        return {
          status: 'Not eligible based on available information',
          matchScore: 20,
          whyItMatches: `Annual family income limit is ₹${maxIncome.toLocaleString('en-IN')}.`,
          missingRequirements: [],
          disqualificationReason: `Reported annual income of ₹${userIncome.toLocaleString('en-IN')} exceeds the ceiling of ₹${maxIncome.toLocaleString('en-IN')}.`
        };
      }
    } else {
      missingRequirements.push(`Income Certificate verification required (Family income must be below ₹${maxIncome.toLocaleString('en-IN')}/year).`);
      flags.push('income_unspecified');
    }
  }

  // 5. Gender Specific Criteria
  const schemeGender = crit.gender || 'All';
  const userGender = userProfile.gender || null;

  if (schemeGender !== 'All') {
    if (userGender) {
      if (userGender.toLowerCase() === schemeGender.toLowerCase()) {
        matchScore += 10;
        matchReasons.push(`Specially prioritized for ${schemeGender} applicants.`);
      } else {
        return {
          status: 'Not eligible based on available information',
          matchScore: 5,
          whyItMatches: `Scheme is exclusively earmarked for ${schemeGender} beneficiaries.`,
          missingRequirements: [],
          disqualificationReason: `Scheme is only open to ${schemeGender} applicants.`
        };
      }
    } else {
      missingRequirements.push(`Gender confirmation needed (Prioritized for ${schemeGender} applicants).`);
      flags.push('gender_unspecified');
    }
  }

  // 6. Category / Quota
  if (userProfile.category && crit.casteCategories) {
    if (crit.casteCategories.includes(userProfile.category)) {
      matchReasons.push(`Category (${userProfile.category}) is recognized for prioritized assistance/quotas.`);
      matchScore += 5;
    }
  }

  // Final 3-tier classification determination
  let status = 'Possibly eligible – verification required';
  if (flags.length === 0 && missingRequirements.length === 0 && matchScore >= 70) {
    status = 'Likely eligible';
  } else {
    status = 'Possibly eligible – verification required';
    matchScore = Math.min(matchScore, 74);
  }

  return {
    status,
    matchScore: Math.min(Math.max(matchScore, 30), 98),
    whyItMatches: matchReasons.length > 0
      ? matchReasons.join(' ')
      : `Matches the general objective of ${scheme.category} assistance based on your interest.`,
    missingRequirements,
    flags
  };
}

/**
 * Generate context-aware follow-up questions when user details are incomplete
 */
export function generateFollowUpQuestions(userProfile = {}, query = '') {
  const questions = [];
  const qLower = query.toLowerCase();

  if (!userProfile.state) {
    questions.push({
      id: 'state',
      text: 'Which State or Union Territory do you permanently reside in?',
      options: ['Karnataka', 'Maharashtra', 'Delhi', 'Tamil Nadu', 'Uttar Pradesh', 'Other State']
    });
  }

  if (userProfile.annualIncome === undefined || userProfile.annualIncome === null) {
    questions.push({
      id: 'income',
      text: 'What is your approximate annual family income?',
      options: ['Below ₹1.5 Lakh (BPL)', '₹1.5 Lakh - ₹2.5 Lakh', '₹2.5 Lakh - ₹5 Lakh', 'Above ₹5 Lakh']
    });
  }

  if (!userProfile.occupation) {
    if (qLower.includes('scholarship') || qLower.includes('study')) {
      questions.push({
        id: 'occupation',
        text: 'What course or level of education are you currently pursuing?',
        options: ['Pre-Matric (School)', 'Post-Matric / PUC', 'Undergraduate Degree', 'Engineering / Medical', 'Post-Graduate']
      });
    } else if (qLower.includes('farm') || qLower.includes('kisan')) {
      questions.push({
        id: 'land',
        text: 'Do you or your family own cultivable agricultural land?',
        options: ['Yes (Small/Marginal < 2 Hectares)', 'Yes (Large Landholder)', 'Tenant / Agricultural Labourer']
      });
    } else {
      questions.push({
        id: 'occupation',
        text: 'What is your primary occupation or current status?',
        options: ['Student', 'Farmer', 'Self-Employed / Small Business', 'Daily Wage Labourer', 'Unemployed']
      });
    }
  }

  if (!userProfile.category) {
    questions.push({
      id: 'category',
      text: 'Do you belong to any specific reservation or welfare category for enhanced subsidies?',
      options: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority']
    });
  }

  return questions.slice(0, 2); // Return top 2 most urgent questions to prevent cognitive overload
}

/**
 * Synthesize comprehensive citizen advice and scheme recommendations
 */
export async function synthesizeSchemeAdvice({ query, userProfile, candidateSchemes, isLiveWeb = false }) {
  // First evaluate all candidate schemes with deterministic engine
  const evaluatedSchemes = candidateSchemes.map(scheme => {
    const evalResult = evaluateSchemeEligibility(scheme, userProfile);
    return {
      ...scheme,
      eligibilityStatus: evalResult.status,
      matchScore: evalResult.matchScore,
      whyItMatches: evalResult.whyItMatches,
      missingRequirements: evalResult.missingRequirements,
      disqualificationReason: evalResult.disqualificationReason || null,
    };
  });

  // Sort by match score (highest first) and eligibility status
  evaluatedSchemes.sort((a, b) => {
    const statusWeight = {
      'Likely eligible': 3,
      'Possibly eligible – verification required': 2,
      'Not eligible based on available information': 1
    };
    const diff = (statusWeight[b.eligibilityStatus] || 0) - (statusWeight[a.eligibilityStatus] || 0);
    if (diff !== 0) return diff;
    return b.matchScore - a.matchScore;
  });

  const followUpQuestions = generateFollowUpQuestions(userProfile, query);

  // If Claude API is available, optionally enrich reasoning
  let claudeEnrichment = null;
  if (claudeService.isConfigured()) {
    try {
      claudeEnrichment = await claudeService.generateReasoning({
        userProfile,
        query,
        matchedSchemes: evaluatedSchemes.slice(0, 5)
      });
    } catch (err) {
      console.warn('Claude reasoning skipped:', err.message);
    }
  }

  // Count by tier
  const summaryCounts = {
    likelyEligible: evaluatedSchemes.filter(s => s.eligibilityStatus === 'Likely eligible').length,
    possiblyEligible: evaluatedSchemes.filter(s => s.eligibilityStatus === 'Possibly eligible – verification required').length,
    notEligible: evaluatedSchemes.filter(s => s.eligibilityStatus === 'Not eligible based on available information').length,
    total: evaluatedSchemes.length
  };

  // Generate empathetic conversational reply
  let assistantMessage = '';
  if (summaryCounts.likelyEligible > 0) {
    assistantMessage = `I found **${summaryCounts.likelyEligible} scheme(s)** you are **likely eligible** for, plus **${summaryCounts.possiblyEligible} scheme(s)** that may apply after verifying specific certificates or income limits.`;
  } else if (summaryCounts.possiblyEligible > 0) {
    assistantMessage = `I found **${summaryCounts.possiblyEligible} potential scheme(s)**. You may qualify for these, but a few eligibility factors (such as income certificate or domicile documentation) require verification.`;
  } else {
    assistantMessage = `Based on your current details, none of the searched schemes strictly matched your criteria. You can review the details below or update your profile filters.`;
  }

  const disclaimer = 'Disclaimer: JanSahayak AI provides automated guidance based on published government norms. Official sanction is granted solely by the respective government department upon formal application and document verification.';

  return {
    assistantMessage: claudeEnrichment?.summary || assistantMessage,
    summaryCounts,
    userProfile,
    schemes: evaluatedSchemes,
    followUpQuestions: claudeEnrichment?.followUpQuestions || followUpQuestions,
    disclaimer,
    isLiveWeb,
    timestamp: new Date().toISOString()
  };
}
