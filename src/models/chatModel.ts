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