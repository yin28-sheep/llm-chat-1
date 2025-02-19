// openai-stream.ts
// 安装必要依赖
// npm install @types/node --save-dev  # 用于Node.js环境类型定义

// 接口 应该放到/modules这个文件夹
interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface ChatCompletionParams {
    model: string;
    messages: ChatMessage[];
    stream: boolean;
    temperature?: number;
    max_tokens?: number;
    extra_headers?: {
        lora_id: string;
        [key: string]: string;
    };
    stream_options?: {
        include_usage: boolean;
    };
}

interface StreamResponseChunk {
    id: string;
    choices: Array<{
        delta: {
            content?: string;
            reasoning_content?: string;
        };
        finish_reason?: string;
    }>;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

interface APIError extends Error {
    code?: number;
    status?: number;
}

// 正题
const MAX_RETRIES = 2;
const REQUEST_TIMEOUT = 15000; // 15秒超时

export async function* streamChatCompletion(
    apiKey: string,
    params: ChatCompletionParams
): AsyncGenerator<StreamResponseChunk, void> {
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
                                const data: StreamResponseChunk = JSON.parse(jsonString);
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
                        message: `Request failed after ${MAX_RETRIES + 1} attempts: ${apiError.message}`
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

// 使用示例
async function main() {
    const API_KEY = 'sk-4et9jiY6FXWulZNX94295c643b52446bA3A04370C9412c44';
    const SERVICE_ID = 'xdeepseekv3';

    try {
        let fullResponse = '';
        let usageData: StreamResponseChunk['usage'] | null = null;

        const stream = streamChatCompletion(API_KEY, {
            model: SERVICE_ID,
            messages: [{ role: 'user', content: '介绍一下TypeScript这门语言' }],
            stream: true,
            temperature: 0.7,
            max_tokens: 1024,
            extra_headers: { lora_id: '0' },
            stream_options: { include_usage: true }
        });

        process.stdout.write('\n[AI]: ');

        for await (const chunk of stream) {
            // 记录资源使用情况
            if (chunk.usage) usageData = chunk.usage;

            // 合并处理内容字段
            const contents = [
                chunk.choices[0]?.delta?.reasoning_content,
                chunk.choices[0]?.delta?.content
            ].filter(Boolean);

            if (contents.length > 0) {
                const output = contents.join('');
                process.stdout.write(output);
                fullResponse += output;
            }

            // 处理提前终止的情况
            if (chunk.choices[0]?.finish_reason) {
                process.stdout.write(`\n[停止原因: ${chunk.choices[0].finish_reason}]`);
            }
        }

        console.log('\n\n------ 完整响应 ------');
        console.log(fullResponse);

        if (usageData) {
            console.log('\n------ 资源使用 ------');
            console.log(`输入Token: ${usageData.prompt_tokens}`);
            console.log(`输出Token: ${usageData.completion_tokens}`);
            console.log(`总计Token: ${usageData.total_tokens}`);
        }
    } catch (error) {
        const apiError = error as APIError;
        console.error(`\n请求失败 (${apiError.status || '未知状态码'}): ${apiError.message}`);

        if (apiError.code) {
            console.error(`错误代码: ${apiError.code}`);
        }

        // 可根据状态码进行特定处理
        if (apiError.status === 429) {
            console.error('建议：降低请求频率或联系管理员调整配额');
        }
    }
}

// 执行示例
main().catch(console.error);
