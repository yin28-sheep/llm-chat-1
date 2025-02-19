export interface stChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface stChatCompletionParams {
    model: string;
    messages: stChatMessage[];
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

export interface stStreamResponseChunk {
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

export interface APIError extends Error {
    code?: number;
    status?: number;
}