import type { 
    stChatMessage, 
    stChatCompletionParams, 
    stStreamResponseChunk, 
    APIError 
} from '../models/stChatModel.ts';

const MAX_RETRIES = 2;
const REQUEST_TIMEOUT = 15000; // 15秒超时


export async function* streamChatCompletion(
    apiKey: string,
    params: stChatCompletionParams
): AsyncGenerator<stStreamResponseChunk, void> {
    const endpoint = 'https://maas-api.cn-huabei-1.xf-yun.com/v1/chat/completions';

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        ...(params.extra_headers || {})
    };

    const body = JSON.stringify({
        ...params,
        stream: true
    });

    let retries = 0;

    while (retries <= MAX_RETRIES) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const error = new Error(`HTTP error! status: ${response.status}`) as APIError;
                error.status = response.status;
                error.code = errorData?.error?.code;
                throw error;
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('Failed to read response stream');
            }

            const decoder = new TextDecoder();
            let buffer = '';

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });

                    const chunks = buffer.split('\n');
                    buffer = chunks.pop() || '';

                    for (const chunk of chunks) {
                        const trimmedChunk = chunk.trim();
                        if (!trimmedChunk) continue;

                        if (trimmedChunk.startsWith('data: ')) {
                            const jsonString = trimmedChunk.slice(6);
                            if (jsonString === '[DONE]') return;

                            try {
                                const data: stStreamResponseChunk = JSON.parse(jsonString);
                                yield data;
                            } catch (e) {
                                console.error('Error parsing JSON chunk:', e);
                            }
                        }
                    }
                }
            } finally {
                reader.releaseLock();
            }

            return; // 成功完成
        } catch (error) {
            clearTimeout(timeoutId);

            if (retries === MAX_RETRIES) {
                if (error instanceof Error) {
                    const apiError = error as APIError;
                    throw Object.assign(apiError, {
                        message: `Request failed after ${MAX_RETRIES + 1} attempts: ${apiError.
                        message}`
                    });
                }
                throw error;
            }

            // 指数退避重试
            await new Promise(res => setTimeout(res, 1000 * 2 ** retries));
            retries++;
        }
    }
}