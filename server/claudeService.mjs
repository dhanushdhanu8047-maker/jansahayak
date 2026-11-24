// server/claudeService.mjs - Optional Claude API reasoning layer
import { config } from './config.mjs';

export class ClaudeService {
  constructor() {
    this.endpoint = 'https://api.anthropic.com/v1/messages';
  }

  getApiKey() {
    return (config.claude.apiKey || '').trim();
  }

  isConfigured() {
    return Boolean(this.getApiKey() && this.getApiKey().length > 5);
  }

  /**
   * Deep semantic reasoning and policy explanation using Claude API
   */
  async generateReasoning({ userProfile, query, matchedSchemes }) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return null; // Return null so fallback rule-based engine handles it
    }

    const systemPrompt = `You are JanSahayak AI, an expert, empathetic, and strictly factual Government Scheme Advisor for Indian citizens.
Your job is to evaluate government schemes for a citizen, determine eligibility, explain why they match, identify any missing verification data, and provide clear next steps.
Rules:
1. Never guarantee government approval or sanction. Clearly state that actual grant depends on document verification by competent government authorities.
2. Differentiate between verified factual requirements and AI explanations.
3. Be respectful, encouraging, and provide clear step-by-step guidance.
4. Output your analysis in structured JSON format.`;

    const userContent = `Citizen Query: "${query}"
Citizen Profile:
- Age: ${userProfile.age || 'Not specified'}
- State: ${userProfile.state || 'Not specified'}
- Occupation: ${userProfile.occupation || 'Not specified'}
- Annual Income: ${userProfile.annualIncome ? '₹' + userProfile.annualIncome : 'Not specified'}
- Category: ${userProfile.category || 'Not specified'}
- Gender: ${userProfile.gender || 'Not specified'}

Retrieved Scheme Candidates (${matchedSchemes.length}):
${JSON.stringify(matchedSchemes.map(s => ({
  id: s.id,
  name: s.name,
  level: s.level,
  benefits: s.benefits,
  eligibility: s.eligibility
})), null, 2)}

Please analyze this citizen against these schemes. Return a JSON object with:
{
  "summary": "Overall compassionate summary of what the citizen is entitled to and next steps",
  "missingInformation": ["List of missing citizen data points needed to confirm eligibility"],
  "followUpQuestions": ["1-2 natural follow-up questions to ask the citizen"],
  "schemeEvaluations": [
    {
      "id": "scheme id",
      "status": "Likely eligible" | "Possibly eligible – verification required" | "Not eligible based on available information",
      "matchScore": 0-100,
      "whyItMatches": "Specific explanation of why this matches the citizen's criteria",
      "prerequisites": ["Documents or conditions needed"],
      "actionSteps": "Concise step to apply"
    }
  ]
}`;

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: config.claude.model,
          max_tokens: 2000,
          system: systemPrompt,
          messages: [
            { role: 'user', content: userContent }
          ]
        })
      });

      if (!response.ok) {
        console.warn(`Claude API call failed with status ${response.status}`);
        return null;
      }

      const data = await response.json();
      const text = data.content?.[0]?.text;
      if (!text) return null;

      // Extract JSON block
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return null;
    } catch (err) {
      console.warn('Claude API reasoning exception:', err.message);
      return null;
    }
  }
}

export const claudeService = new ClaudeService();
