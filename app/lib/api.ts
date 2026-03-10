import type {
  ChatMessage,
  ApiResponse,
  ChatCompletionData,
  TextCompletionData,
  TranscriptionData,
} from '@/app/types';

/**
 * Send chat completion request to the API.
 */
export async function getChatCompletion(
  messages: ChatMessage[]
): Promise<ApiResponse<ChatCompletionData>> {
  try {
    const res = await fetch('/api/chat-completion', {
      method: 'POST',
      body: JSON.stringify({ messages }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    return { data, status: res.status };
  } catch (error) {
    console.error('Chat completion error:', error);
    return {
      data: { role: 'assistant', content: '' },
      status: 500,
    };
  }
}

/**
 * Send audio blob for transcription (speech-to-text).
 */
export async function getTranscription(
  mediaBlobUrl: string
): Promise<ApiResponse<TranscriptionData>> {
  try {
    const blob = await fetch(mediaBlobUrl).then((r) => r.blob());
    const ext = blob.type.includes('mp4') ? 'mp4' : blob.type.includes('ogg') ? 'ogg' : 'webm';
    const file = new File([blob], `recording.${ext}`, { type: blob.type });
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/speech-to-text', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    console.error('Transcription error:', error);
    return {
      data: { text: '' },
      status: 500,
    };
  }
}

/**
 * Send text completion request to the API.
 */
export async function getTextCompletion(prompt: string): Promise<ApiResponse<TextCompletionData>> {
  try {
    const response = await fetch('/api/text-completion', {
      method: 'POST',
      body: JSON.stringify({ message: prompt }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error('Text completion error:', error);
    return {
      data: { text: '' },
      status: 500,
    };
  }
}
