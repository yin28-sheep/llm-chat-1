import type { APIError,stStreamResponseChunk } from '../models/stChatModel.ts';
import { streamChatCompletion } from '../services/stStreamChat';

// 使用示例
async function main() {
    const API_KEY = 'sk-4et9jiY6FXWulZNX94295c643b52446bA3A04370C9412c44';
    const SERVICE_ID = 'xdeepseekv3';

    try {
        let fullResponse = '';
        let usageData: stStreamResponseChunk['usage'] | null = null;

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
