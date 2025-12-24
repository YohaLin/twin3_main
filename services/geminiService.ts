import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const SYSTEM_PROMPT = `
Role: Twin3 AI Assistant - Your Digital Twin Guide
Tone: Professional, friendly, and knowledgeable about Web3/AI identity

CONTEXT:
Twin3 is a platform for creating secure digital identities in the AI era.
Key concepts:
- Twin Matrix: 256-dimensional soulbound representation of authentic self
- Soul Injection: Inject traits into personal AI agents
- Agentic Human: AI agents work as human partners in AI economy
- SBT (Soulbound Token): Non-transferable identity tokens
- $twin3: Platform token for rewards

RULES:
1. Be concise - max 2-3 sentences per response
2. Stay on topic about twin3, Web3 identity, and AI agents
3. Use friendly but professional language
4. If user asks unrelated questions, gently guide back to twin3
5. Encourage users to complete verification and explore tasks
`;

export interface GeminiResponse {
    text: string;
    success: boolean;
}

export const generateAgentResponse = async (
    userMessage: string,
    conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<GeminiResponse> => {
    // Guard clause - no API key
    if (!apiKey || apiKey.length === 0) {
        console.warn("Gemini API Key not configured. Using fallback response.");
        return {
            text: "I'm currently in demo mode. To enable AI responses, please configure your Gemini API key.",
            success: false
        };
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const modelId = 'gemini-2.0-flash';

        // Build conversation contents
        const contents = [
            ...conversationHistory.map(msg => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            })),
            { role: 'user', parts: [{ text: userMessage }] }
        ];

        const response = await ai.models.generateContent({
            model: modelId,
            contents: contents,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                maxOutputTokens: 256,
                temperature: 0.7
            }
        });

        const text = response.text || "I'm processing your request...";

        return {
            text: text.trim(),
            success: true
        };

    } catch (error) {
        console.error("Gemini API Error:", error);
        return {
            text: "I encountered an issue processing your request. Please try again or use the suggestions below.",
            success: false
        };
    }
};

export const isAIEnabled = (): boolean => {
    return !!apiKey && apiKey.length > 0;
};

/**
 * Generate dynamic suggestions based on conversation context
 */
export const generateSuggestions = async (
    lastMessage: string,
    context: string
): Promise<string[]> => {
    if (!apiKey || apiKey.length === 0) {
        // Fallback suggestions when AI is not available
        return ['View Tasks', 'Twin Matrix', 'Dashboard'];
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const modelId = 'gemini-2.0-flash';

        const prompt = `Based on the user's last action and context, generate 3 short suggestion buttons for a twin3 digital identity platform.

Context: ${context}
Last message: ${lastMessage}

Rules:
- Each suggestion should be 2-4 words max
- Make them action-oriented
- Relevant to twin3 features: Twin Matrix, SBT, verification, tasks
- Return ONLY a JSON array of 3 strings, nothing else

Example output: ["View Twin Matrix", "Browse Tasks", "Verify Account"]`;

        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                maxOutputTokens: 100,
                temperature: 0.7
            }
        });

        const text = response.text || '[]';
        // Extract JSON array from response
        const match = text.match(/\[[\s\S]*?\]/);
        if (match) {
            const parsed = JSON.parse(match[0]);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed.slice(0, 4).map((s: string) => String(s));
            }
        }
        return ['View Tasks', 'Twin Matrix', 'Dashboard'];
    } catch (error) {
        console.error("Suggestion generation error:", error);
        return ['View Tasks', 'Twin Matrix', 'Dashboard'];
    }
};
