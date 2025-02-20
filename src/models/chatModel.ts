export interface Message {
    role: 'user' | 'assistant'
    content: string
}

export interface ChatGPTResponse {
    choices: {
        message: {
            content: string
        }
    }[]
}
