import { GoogleGenerativeAI } from "@google/generative-ai";

const DEFAULT_SYSTEM_PROMPT = `あなたは専門用語の速記者です。
余計なボケやツッコミ、論評をかまさずに、その専門分野のターミノロジーを踏まえて、一字一句そのまま文字起こししてください。
コメントや解説、要約は一切不要です。音声の内容をそのまま正確に書き起こしてください。`;

export async function transcribeAudio(apiKey: string, audioBlob: Blob, systemPrompt?: string): Promise<string> {
    if (!apiKey) {
        throw new Error("API Key is missing.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" }, { apiVersion: 'v1beta' });

    // Convert Blob to Base64
    const base64Data = await blobToBase64(audioBlob);

    // Use provided systemPrompt or fall back to default
    const instruction = systemPrompt?.trim() || DEFAULT_SYSTEM_PROMPT;

    const result = await model.generateContent([
        instruction,
        {
            inlineData: {
                mimeType: audioBlob.type, // e.g., 'audio/webm'
                data: base64Data
            }
        }
    ]);

    return result.response.text();
}

export { DEFAULT_SYSTEM_PROMPT };

function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            // Remove data URL prefix (e.g., "data:audio/webm;base64,")
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
