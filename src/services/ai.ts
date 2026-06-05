import type { Customer } from '@/types';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

export const AIService = {
  async generateMatchExplanation(customer: Customer, match: Customer) {
    if (!OPENROUTER_API_KEY) {
      console.warn("No OpenRouter API Key provided. Returning mock AI response.");
      return {
        summary: "High Potential Match. Both profiles demonstrate strong compatibility through aligned values and goals.",
        strengths: ["Similar education background", "Shared family values"],
        concerns: ["Different cities"]
      };
    }

    const prompt = `
    Analyze the compatibility between Customer A and Customer B for a premium matchmaking service.
    
    Customer A:
    Gender: ${customer.gender}, Age: ${customer.age}, City: ${customer.city}, Religion: ${customer.religion}, Education: ${customer.degree}, Income: ${customer.income}, Values: ${customer.familyValues}, Want Kids: ${customer.wantKids}
    
    Customer B:
    Gender: ${match.gender}, Age: ${match.age}, City: ${match.city}, Religion: ${match.religion}, Education: ${match.degree}, Income: ${match.income}, Values: ${match.familyValues}, Want Kids: ${match.wantKids}
    
    Provide a JSON response containing:
    - summary: A compatibility summary (max 120 words).
    - strengths: Array of 2-3 key strengths.
    - concerns: Array of 1-2 potential risks.
    `;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.href,
          "X-Title": "TDC Matchmaker Dashboard"
        },
        body: JSON.stringify({
          model: "gpt-oss-120b:free",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: "You are an expert matchmaking AI assistant. Output valid JSON only." },
            { role: "user", content: prompt }
          ]
        })
      });

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      return result;
    } catch (error) {
      console.error("AI Generation Error", error);
      throw new Error("Failed to generate AI match explanation.");
    }
  },

  async generatePersonalizedIntroduction(customer: Customer, match: Customer) {
    if (!OPENROUTER_API_KEY) {
      return "I would like to introduce you to a profile that aligns beautifully with your values and long-term goals. Please review and let me know your thoughts.";
    }

    const prompt = `
    Write a warm, personalized introduction (50-80 words) that a matchmaker can send to Customer A introducing Customer B.
    Tone: Professional, Elegant, Relationship-focused.
    
    Customer A Name: ${customer.firstName}
    Customer B Name: ${match.firstName}, Profession: ${match.designation}, City: ${match.city}
    `;

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.href,
          "X-Title": "TDC Matchmaker Dashboard"
        },
        body: JSON.stringify({
          model: "gpt-oss-120b:free",
          messages: [
            { role: "system", content: "You are an expert matchmaker writing an elegant introduction." },
            { role: "user", content: prompt }
          ]
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("AI Generation Error", error);
      throw new Error("Failed to generate AI introduction.");
    }
  }
};
