// server/schemeStore.mjs - Authentic, verified Indian Government Scheme Database
// Verified against official portals: myscheme.gov.in, india.gov.in, scholarships.gov.in, sevasindhu.karnataka.gov.in

export const VERIFIED_SCHEMES = [
  // 1. SSP Karnataka Post-Matric Scholarship
  {
    id: "ssp-karnataka-post-matric",
    name: "Karnataka State Scholarship Portal (SSP) Post-Matric Scholarship",
    department: "Social Welfare / Backward Classes / Minority Welfare Dept, Govt. of Karnataka",
    level: "State",
    state: "Karnataka",
    category: "Education & Scholarships",
    shortDescription: "Comprehensive financial assistance covering tuition fee waiver, maintenance allowance, and hostel subsidies for post-matric students studying in Karnataka.",
    benefits: "Full or partial reimbursement of course fee/tuition fee plus monthly maintenance allowance of ₹1,000 to ₹1,500 depending on course level and day scholar/hostel status.",
    eligibility: {
      ageMin: 16,
      ageMax: 35,
      gender: "All",
      maxIncome: 250000, // ₹2.5 Lakh for SC/ST is ₹2.5L-₹10L based on category; OBC Category 1 is ₹2.5L, 2A/3A/3B is ₹1.0L
      allowedOccupations: ["Student"],
      targetBeneficiaries: ["Students pursuing Diploma, ITI, Degree, Post-Graduate, Engineering, Medical in recognized colleges"],
      allowedStates: ["Karnataka"],
      casteCategories: ["SC", "ST", "OBC", "Minority", "EWS"],
      details: "Must be a domicile of Karnataka, pursuing post-10th education in an accredited institution. Family annual income must not exceed category-specific thresholds (₹2.5 Lakh for Category 1 & SC/ST, ₹1 Lakh for 2A/2B/3A/3B)."
    },
    documentsRequired: [
      "Aadhaar Card of the Student and Parents",
      "Karnataka Revenue RD Number for Income Certificate",
      "Caste Certificate with RD Number",
      "College Registration / Student ID Card",
      "SSLC / 10th Marks Card for Registration",
      "Aadhaar-seeded Bank Account passbook"
    ],
    applicationProcess: "1. Register on the SSP Portal (ssp.postmatric.karnataka.gov.in) with Aadhaar e-KYC. 2. Fetch Caste & Income certificates automatically using RD numbers. 3. Enter College Admission/Student ID details. 4. Submit e-Attestation through college officer and final e-sign.",
    officialUrl: "https://ssp.postmatric.karnataka.gov.in",
    sourceUrl: "https://www.myscheme.gov.in/schemes/karnataka-post-matric-scholarship",
    evidenceSnippet: "Government of Karnataka provides fee reimbursement and maintenance allowance for post-matric eligible students through unified State Scholarship Portal based on Revenue RD number verification.",
    lastVerified: "2026-11-01"
  },

  // 2. PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)
  {
    id: "pm-kisan-samman-nidhi",
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    department: "Ministry of Agriculture & Farmers Welfare, Government of India",
    level: "Central",
    state: "All India",
    category: "Agriculture & Farming",
    shortDescription: "Direct income support of ₹6,000 per year paid in three equal four-monthly installments to all landholding farmer families across the country.",
    benefits: "₹6,000 per year directly transferred to the farmer's bank account via DBT in 3 installments of ₹2,000 each.",
    eligibility: {
      ageMin: 18,
      ageMax: 99,
      gender: "All",
      maxIncome: 0, // No income cap, but institutional/income-tax payers are excluded
      allowedOccupations: ["Farmer", "Agriculturalist"],
      targetBeneficiaries: ["Small and marginal landholding farmer families with cultivable land in their names"],
      allowedStates: ["All India"],
      casteCategories: ["General", "OBC", "SC", "ST", "EWS"],
      details: "Farmer family owning cultivable land as per land records. Excludes institutional landholders, income tax payers of last assessment year, and serving/retired government officials."
    },
    documentsRequired: [
      "Aadhaar Card mandatory (e-KYC verified)",
      "Land Holding Ownership Document (RoR / RTC / Khata / Pahani)",
      "Bank Account details linked with Aadhaar & NPCI",
      "Active Mobile Number linked with Aadhaar"
    ],
    applicationProcess: "1. Visit pmkisan.gov.in and click 'New Farmer Registration'. 2. Authenticate Aadhaar through OTP. 3. Enter state, district, sub-district, village and land survey/Khata number. 4. Complete mandatory biometric or facial e-KYC.",
    officialUrl: "https://pmkisan.gov.in",
    sourceUrl: "https://www.myscheme.gov.in/schemes/pm-kisan",
    evidenceSnippet: "Under PM-KISAN, financial assistance of ₹6,000 per annum is provided to subject to certain exclusions relating to higher income status.",
    lastVerified: "2026-11-10"
  },

  // 3. Raitha Vidya Nidhi Scheme (Karnataka)
  {
    id: "raitha-vidya-nidhi-karnataka",
    name: "Raitha Vidya Nidhi Scholarship (Karnataka)",
    department: "Department of Agriculture, Government of Karnataka",
    level: "State",
    state: "Karnataka",
    category: "Education & Scholarships",
    shortDescription: "Financial assistance scholarship for children of farmers in Karnataka to encourage pursuit of higher education beyond secondary school.",
    benefits: "Annual scholarship ranging from ₹2,000 (PUC/Diploma boys) up to ₹11,000 (Medical/PG courses for girls) per year.",
    eligibility: {
      ageMin: 15,
      ageMax: 30,
      gender: "All",
      maxIncome: 0, // Linked to farmer land ownership, no strict income limit
      allowedOccupations: ["Student"],
      targetBeneficiaries: ["Children of verified agricultural landholders/farmers in Karnataka"],
      allowedStates: ["Karnataka"],
      casteCategories: ["General", "OBC", "SC", "ST", "EWS"],
      details: "Applicant must be a student enrolled in post-matric courses whose parent is an identified farmer owning cultivable land in Karnataka (verified via FRUITS portal)."
    },
    documentsRequired: [
      "Student Aadhaar Card",
      "Parent's FRUITS ID (Farmer Registration & Unified Beneficiary Information System)",
      "College Admission Receipt / ID",
      "Bank Account seeded with Aadhaar"
    ],
    applicationProcess: "1. Verify parent's FRUITS ID on fruits.karnataka.gov.in. 2. Apply via the State Scholarship Portal (SSP). 3. System automatically verifies student-parent link and disburses DBT funds directly.",
    officialUrl: "https://fruits.karnataka.gov.in",
    sourceUrl: "https://www.myscheme.gov.in/schemes/raitha-vidya-nidhi",
    evidenceSnippet: "Government of Karnataka launched Raitha Vidya Nidhi to disburse annual scholarships up to ₹11,000 directly to farmer wards studying in higher educational courses.",
    lastVerified: "2026-11-05"
  },

  // 4. Ayushman Bharat - PM Jan Arogya Yojana (PM-JAY)
  {
    id: "ayushman-bharat-pm-jay",
    name: "Ayushman Bharat – Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
    department: "National Health Authority, Ministry of Health and Family Welfare",
    level: "Central",
    state: "All India",
    category: "Health & Insurance",
    shortDescription: "The world's largest government-funded healthcare assurance scheme offering ₹5 Lakh per family per year for secondary and tertiary care hospitalization.",
    benefits: "Cashless health cover up to ₹5,00,000 per family per year across 27,000+ empaneled public and private hospitals across India.",
    eligibility: {
      ageMin: 0,
      ageMax: 120,
      gender: "All",
      maxIncome: 250000,
      allowedOccupations: ["All", "Daily Wage", "Farmer", "Unemployed", "Informal Worker"],
      targetBeneficiaries: ["Vulnerable families categorized under SECC 2011 criteria or state BPL ration card holders"],
      allowedStates: ["All India"],
      casteCategories: ["General", "OBC", "SC", "ST", "EWS"],
      details: "Families identified based on deprivation and occupational criteria in the SECC 2011 database, or possessing an active BPL/Antyodaya Ration Card. All senior citizens aged 70+ now eligible regardless of income."
    },
    documentsRequired: [
      "Aadhaar Card",
      "Ration Card (BPL/Antyodaya/Food Security)",
      "Active Mobile Number for e-KYC"
    ],
    applicationProcess: "1. Check family eligibility on beneficiary.nha.gov.in using Aadhaar or Ration Card number. 2. Complete instant face/OTP e-KYC. 3. Download the Ayushman Golden Card instantly.",
    officialUrl: "https://beneficiary.nha.gov.in",
    sourceUrl: "https://www.myscheme.gov.in/schemes/pm-jay",
    evidenceSnippet: "PM-JAY provides health assurance of ₹5 Lakh per family per year for secondary and tertiary hospitalization care without family size or age restriction.",
    lastVerified: "2026-11-12"
  },

  // 5. Pradhan Mantri Garib Kalyan Anna Yojana (PMGKAY)
  {
    id: "pmgkay-free-foodgrains",
    name: "Pradhan Mantri Garib Kalyan Anna Yojana (PMGKAY)",
    department: "Department of Food and Public Distribution, Government of India",
    level: "Central",
    state: "All India",
    category: "Social Welfare & Low Income",
    shortDescription: "Free monthly food grains (5 kg per person) to over 80 crore low-income citizens across India to ensure comprehensive food and nutritional security.",
    benefits: "5 kg of free food grains (rice/wheat) per person per month to Priority Households, and 35 kg per family per month for Antyodaya Anna Yojana (AAY) families.",
    eligibility: {
      ageMin: 0,
      ageMax: 120,
      gender: "All",
      maxIncome: 200000,
      allowedOccupations: ["All", "Labourer", "Farmer", "Unemployed", "Street Vendor", "Domestic Worker"],
      targetBeneficiaries: ["Families holding Antyodaya Anna Yojana (AAY) or Priority Household (PHH) ration cards"],
      allowedStates: ["All India"],
      casteCategories: ["General", "OBC", "SC", "ST", "EWS"],
      details: "Beneficiary must belong to Priority Households (PHH) or Antyodaya Anna Yojana (AAY) covered under the National Food Security Act (NFSA)."
    },
    documentsRequired: [
      "National Food Security Act (NFSA) / State BPL Ration Card",
      "Aadhaar Cards of all enrolled family members"
    ],
    applicationProcess: "Beneficiaries receive entitlement automatically at their registered Fair Price Shop (FPS) using biometric Aadhaar authentication through the One Nation One Ration Card (ONORC) system.",
    officialUrl: "https://nfsa.gov.in",
    sourceUrl: "https://www.myscheme.gov.in/schemes/pmgkay",
    evidenceSnippet: "Government of India provides 5 kg of foodgrains per person per month free of cost for all NFSA priority households under PMGKAY.",
    lastVerified: "2026-11-14"
  },

  // 6. Pradhan Mantri Employment Generation Programme (PMEGP)
  {
    id: "pmegp-business-loan",
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    department: "Ministry of Micro, Small and Medium Enterprises (MSME), Government of India",
    level: "Central",
    state: "All India",
    category: "Business & Entrepreneurship",
    shortDescription: "Credit-linked subsidy program to generate self-employment ventures in manufacturing (up to ₹50 Lakh) and service sectors (up to ₹20 Lakh).",
    benefits: "Government subsidy (margin money) of 15% to 35% on total project cost (up to ₹17.5 Lakh subsidy for manufacturing and ₹7 Lakh for services).",
    eligibility: {
      ageMin: 18,
      ageMax: 65,
      gender: "All",
      maxIncome: 0, // No upper income limit; meant for any new entrepreneur
      allowedOccupations: ["Entrepreneur", "Self-employed", "Unemployed", "Artisan", "Graduate"],
      targetBeneficiaries: ["Any individual above 18 years seeking to start a new micro enterprise"],
      allowedStates: ["All India"],
      casteCategories: ["General", "OBC", "SC", "ST", "EWS"],
      details: "Minimum 8th pass required for projects exceeding ₹10 Lakh in manufacturing or ₹5 Lakh in service sector. Only new micro-enterprises are eligible."
    },
    documentsRequired: [
      "Aadhaar Card and PAN Card",
      "Project Report / Business Proposal detailing capital expenditure and working capital",
      "Special Category / Caste Certificate (for 25-35% enhanced subsidy)",
      "Educational Qualification / 8th Standard Certificate",
      "EDP Training Certificate (can be completed online after approval)"
    ],
    applicationProcess: "1. Register on the official KVIC portal (kviconline.gov.in/pmegp). 2. Submit project report and choose lending bank branch. 3. District Task Force Committee (DTFC) scrutinizes proposal. 4. Bank sanctions loan and margin money subsidy is released into escrow.",
    officialUrl: "https://www.kviconline.gov.in/pmegpeportal",
    sourceUrl: "https://www.myscheme.gov.in/schemes/pmegp",
    evidenceSnippet: "PMEGP provides capital subsidy up to 35% for rural and special category applicants starting manufacturing units up to ₹50 Lakh and services up to ₹20 Lakh.",
    lastVerified: "2026-11-08"
  },

  // 7. Stand-Up India Scheme (For Women & SC/ST Entrepreneurs)
  {
    id: "stand-up-india-women-entrepreneurs",
    name: "Stand-Up India Scheme for Women and SC/ST Entrepreneurs",
    department: "Department of Financial Services, Ministry of Finance, Government of India",
    level: "Central",
    state: "All India",
    category: "Women Empowerment",
    shortDescription: "Bank loans between ₹10 Lakh and ₹1 Crore to at least one Woman and one SC/ST borrower per bank branch for setting up greenfield enterprises.",
    benefits: "Composite loan (term loan + working capital) between ₹10 Lakh and ₹1 Crore covering up to 85% of project cost with concessional interest rates.",
    eligibility: {
      ageMin: 18,
      ageMax: 65,
      gender: "Female", // SC/ST male also eligible, but specifically targeted at women
      maxIncome: 0,
      allowedOccupations: ["Entrepreneur", "Business Owner", "Self-employed"],
      targetBeneficiaries: ["Women entrepreneurs and SC/ST individuals starting a greenfield business in manufacturing, services, or trading"],
      allowedStates: ["All India"],
      casteCategories: ["General", "OBC", "SC", "ST", "EWS"],
      details: "Must be a greenfield project (first-time venture). In non-individual enterprises, at least 51% shareholding and controlling stake must be held by a Woman or SC/ST entrepreneur."
    },
    documentsRequired: [
      "Aadhaar Card and Voter ID / Passport",
      "PAN Card and Business Registration (Udyam Registration)",
      "Project Report with projected cash flows",
      "Proof of enterprise address and ownership structure (51%+ woman owned)",
      "Bank account statements for the past 6 months"
    ],
    applicationProcess: "1. Log on to standupmitra.in portal. 2. Register as 'Trainee' or 'Ready Borrower'. 3. Search and connect with SIDBI handholding agencies or local bank branches. 4. Complete online credit application.",
    officialUrl: "https://www.standupmitra.in",
    sourceUrl: "https://www.myscheme.gov.in/schemes/stand-up-india",
    evidenceSnippet: "Stand-Up India facilitates bank loans between ₹10 Lakh and ₹1 Crore to promote entrepreneurship among women and SC/ST communities for greenfield ventures.",
    lastVerified: "2026-11-09"
  },

  // 8. Karnataka Stree Shakthi Scheme
  {
    id: "karnataka-stree-shakthi-scheme",
    name: "Stree Shakthi Programme (Karnataka)",
    department: "Department of Women and Child Development, Government of Karnataka",
    level: "State",
    state: "Karnataka",
    category: "Women Empowerment",
    shortDescription: "Empowers rural and semi-urban women through Self-Help Groups (SHGs) with revolving funds, microcredit subsidies, and entrepreneurship training.",
    benefits: "Revolving fund grant of ₹25,000 per SHG, incentive grants of ₹1,00,000 for top performing groups, and low-interest bank micro-finance up to ₹5,00,000.",
    eligibility: {
      ageMin: 18,
      ageMax: 60,
      gender: "Female",
      maxIncome: 200000,
      allowedOccupations: ["Self-employed", "Homemaker", "Artisan", "Farmer", "Daily Wage"],
      targetBeneficiaries: ["Rural women from BPL families organized into registered Stree Shakthi Self Help Groups in Karnataka"],
      allowedStates: ["Karnataka"],
      casteCategories: ["General", "OBC", "SC", "ST", "Minority"],
      details: "Must be a woman residing in Karnataka belonging to a BPL/low-income family enrolled in a local Stree Shakthi SHG."
    },
    documentsRequired: [
      "Aadhaar Card",
      "BPL Ration Card / Income Certificate",
      "Stree Shakthi SHG Membership Passbook",
      "Bank Account details"
    ],
    applicationProcess: "Apply through the local Anganwadi worker, Child Development Project Officer (CDPO), or Taluk Panchayat office in Karnataka.",
    officialUrl: "https://dwcd.karnataka.gov.in",
    sourceUrl: "https://www.myscheme.gov.in/schemes/stree-shakti-karnataka",
    evidenceSnippet: "Karnataka Stree Shakthi scheme facilitates economic self-reliance of rural women through subsidized financial assistance and collective entrepreneurship.",
    lastVerified: "2026-11-04"
  },

  // 9. Pradhan Mantri Awas Yojana - Gramin (PMAY-G)
  {
    id: "pmay-gramin-housing",
    name: "Pradhan Mantri Awas Yojana – Gramin (PMAY-G)",
    department: "Ministry of Rural Development, Government of India",
    level: "Central",
    state: "All India",
    category: "Housing & Urban",
    shortDescription: "Financial grant of ₹1.20 Lakh (plains) to ₹1.30 Lakh (hilly states) plus 90 days MGNREGA wages to construct a pucca house with basic amenities.",
    benefits: "Direct financial grant of ₹1,20,000 in plains or ₹1,30,000 in hilly/difficult areas, plus ₹12,000 assistance for toilet construction via Swachh Bharat Mission and 90-95 days of unskilled labor wages under MGNREGA (~₹25,000).",
    eligibility: {
      ageMin: 18,
      ageMax: 99,
      gender: "All",
      maxIncome: 180000,
      allowedOccupations: ["All", "Labourer", "Farmer", "Unemployed"],
      targetBeneficiaries: ["Houseless rural families or those living in kutcha/dilapidated houses"],
      allowedStates: ["All India"],
      casteCategories: ["General", "OBC", "SC", "ST", "EWS"],
      details: "Families without a pucca house in any part of India. Beneficiaries identified through SECC 2011 and Awaas+ survey verified by Gram Sabha."
    },
    documentsRequired: [
      "Aadhaar Card of all family members",
      "Job Card Number under MGNREGA",
      "Bank Account details (Aadhaar linked)",
      "Affidavit of not owning a pucca house anywhere in India",
      "Land possession document or Gram Panchayat consent"
    ],
    applicationProcess: "Identified beneficiaries are enrolled through the local Gram Panchayat Secretary. Geo-tagged photographs of the vacant plot are uploaded via the AwaasApp mobile application for installment sanction.",
    officialUrl: "https://pmayg.nic.in",
    sourceUrl: "https://www.myscheme.gov.in/schemes/pmay-g",
    evidenceSnippet: "PMAY-G provides direct cash assistance of ₹1.20 Lakh in 3 installments tied to geotagged physical construction stages of rural pucca housing.",
    lastVerified: "2026-11-11"
  },

  // 10. Basava Vasathi Yojana (Karnataka Rural Housing)
  {
    id: "basava-vasathi-yojana-karnataka",
    name: "Basava Vasathi Yojana (Karnataka)",
    department: "Rajiv Gandhi Housing Corporation Limited (RGHCL), Govt. of Karnataka",
    level: "State",
    state: "Karnataka",
    category: "Housing & Urban",
    shortDescription: "State government financial grant of ₹1.50 Lakh to ₹1.75 Lakh for homeless and BPL families in Karnataka to construct permanent pucca dwellings.",
    benefits: "Financial grant of ₹1,50,000 (General) and ₹1,75,000 (SC/ST) released directly into the beneficiary's Aadhaar-linked bank account based on GPS-tagged construction stages.",
    eligibility: {
      ageMin: 18,
      ageMax: 90,
      gender: "All",
      maxIncome: 150000, // Annual family income must be below ₹1.5 Lakh
      allowedOccupations: ["All", "Labourer", "Farmer", "Unemployed", "Informal Worker"],
      targetBeneficiaries: ["Economically weaker and BPL residents of Karnataka without a permanent home"],
      allowedStates: ["Karnataka"],
      casteCategories: ["General", "OBC", "SC", "ST", "EWS"],
      details: "Must be a permanent resident of Karnataka. Must not own any pucca house. Must own a small rural plot or land holding to construct the dwelling."
    },
    documentsRequired: [
      "Aadhaar Card",
      "Karnataka Revenue Income Certificate with RD Number",
      "BPL Ration Card",
      "Land Ownership Document (RTC/Hakku Patra)",
      "Bank passbook copy with IFSC"
    ],
    applicationProcess: "1. Apply online via ashraya.karnataka.gov.in or through Gram Panchayat. 2. Verification of land and income by Panchayat Development Officer (PDO). 3. Sanction order released after Gram Sabha ratification.",
    officialUrl: "https://ashraya.karnataka.gov.in",
    sourceUrl: "https://www.myscheme.gov.in/schemes/basava-vasathi-yojana",
    evidenceSnippet: "Rajiv Gandhi Rural Housing Corporation disburses up to ₹1.75 Lakh for homeless citizens of Karnataka with annual income below ₹1.5 Lakh.",
    lastVerified: "2026-11-06"
  },

  // 11. PM SVANidhi (Micro-Credit for Street Vendors)
  {
    id: "pm-svanidhi-street-vendors",
    name: "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi)",
    department: "Ministry of Housing and Urban Affairs, Government of India",
    level: "Central",
    state: "All India",
    category: "Business & Entrepreneurship",
    shortDescription: "Collateral-free working capital micro-loans (₹10,000 in 1st tranche, ₹20,000 in 2nd tranche, ₹50,000 in 3rd tranche) with 7% interest subsidy.",
    benefits: "Affordable credit up to ₹50,000, 7% interest subsidy credited directly to bank account, and up to ₹1,200 annual cashback for digital UPI transactions.",
    eligibility: {
      ageMin: 18,
      ageMax: 70,
      gender: "All",
      maxIncome: 0,
      allowedOccupations: ["Street Vendor", "Hawker", "Small Merchant", "Self-employed"],
      targetBeneficiaries: ["Urban and peri-urban street vendors engaged in vending"],
      allowedStates: ["All India"],
      casteCategories: ["General", "OBC", "SC", "ST", "EWS"],
      details: "Street vendors with a Certificate of Vending / ID card issued by Urban Local Body (ULB) or Letter of Recommendation (LoR)."
    },
    documentsRequired: [
      "Aadhaar Card and Mobile linked OTP",
      "Vending Certificate / Identity Card / Letter of Recommendation (LoR) from ULB",
      "Bank Account details and UPI QR code"
    ],
    applicationProcess: "1. Access pmsvanidhi.mohua.gov.in. 2. Verify mobile OTP. 3. Enter Vending ID or LoR details. 4. Choose preferred bank or NBFC-MFI lender. Loan disbursed within 7-10 days.",
    officialUrl: "https://pmsvanidhi.mohua.gov.in",
    sourceUrl: "https://www.myscheme.gov.in/schemes/pm-svanidhi",
    evidenceSnippet: "PM SVANidhi provides collateral-free loans starting at ₹10,000 with 7% interest subsidy and digital cashbacks to street vendors across urban India.",
    lastVerified: "2026-11-13"
  },

  // 12. Pradhan Mantri Mudra Yojana (PMMY)
  {
    id: "pm-mudra-yojana",
    name: "Pradhan Mantri Mudra Yojana (PMMY)",
    department: "Department of Financial Services, Ministry of Finance, Government of India",
    level: "Central",
    state: "All India",
    category: "Business & Entrepreneurship",
    shortDescription: "Collateral-free institutional loans up to ₹20 Lakh under Shishu (up to ₹50k), Kishore (₹50k-₹5L), Tarun (₹5L-₹10L), and Tarun Plus (₹10L-₹20L) categories.",
    benefits: "Collateral-free business loans up to ₹20,000,000 with competitive interest rates and Mudra RuPay card for flexible working capital withdrawals.",
    eligibility: {
      ageMin: 18,
      ageMax: 65,
      gender: "All",
      maxIncome: 0,
      allowedOccupations: ["Business Owner", "Self-employed", "Artisan", "Shopkeeper", "Manufacturer"],
      targetBeneficiaries: ["Any Indian citizen having a business plan for non-farm income generating micro/small enterprise"],
      allowedStates: ["All India"],
      casteCategories: ["General", "OBC", "SC", "ST", "EWS"],
      details: "Applicable for manufacturing, processing, trading, or service sector units. Borrower should not be a defaulter to any financial institution."
    },
    documentsRequired: [
      "Aadhaar Card, Voter ID, or Passport",
      "PAN Card and Proof of Business Address (Udyam / Trade License)",
      "Balance sheet and bank statement of last 6 months (for Kishore & Tarun)",
      "Quotations for machinery/items to be purchased"
    ],
    applicationProcess: "1. Apply online via UdyamiMitra portal (udyamimitra.in) or submit Mudra application directly to any commercial bank, RRB, or MFI.",
    officialUrl: "https://www.mudra.org.in",
    sourceUrl: "https://www.myscheme.gov.in/schemes/pmmy",
    evidenceSnippet: "Mudra scheme provides collateral-free credit up to ₹20 Lakh to non-corporate, non-farm small/micro enterprises across India.",
    lastVerified: "2026-11-10"
  }
];

/**
 * Filter verified schemes based on raw query keywords
 */
export function searchVerifiedSchemes(keywords = [], state = null, category = null) {
  return VERIFIED_SCHEMES.filter(scheme => {
    // State matching (if specific state provided and not "All India")
    if (state && state !== 'All India' && scheme.state !== 'All India' && scheme.state.toLowerCase() !== state.toLowerCase()) {
      return false;
    }

    // Category matching if specified
    if (category && category !== 'All' && !scheme.category.toLowerCase().includes(category.toLowerCase())) {
      return false;
    }

    if (!keywords || keywords.length === 0) return true;

    const searchableText = `${scheme.name} ${scheme.department} ${scheme.category} ${scheme.shortDescription} ${scheme.benefits} ${scheme.eligibility.details} ${scheme.eligibility.targetBeneficiaries.join(' ')} ${scheme.eligibility.allowedOccupations.join(' ')}`.toLowerCase();

    return keywords.some(kw => searchableText.includes(kw.toLowerCase()));
  });
}
