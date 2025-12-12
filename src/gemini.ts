import { GoogleGenerativeAI } from "@google/generative-ai";

export async function transcribeAudio(apiKey: string, audioBlob: Blob): Promise<string> {
    if (!apiKey) {
        throw new Error("API Key is missing.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" }, { apiVersion: 'v1beta' });

    // Convert Blob to Base64
    const base64Data = await blobToBase64(audioBlob);

    const result = await model.generateContent([
        "Please provide a highly accurate transcription of the following audio file. Do not include any other text/commentary, just the transcription.",
        {
            inlineData: {
                mimeType: audioBlob.type, // e.g., 'audio/webm'
                data: base64Data
            }
        }
    ]);

    return result.response.text();
}

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
