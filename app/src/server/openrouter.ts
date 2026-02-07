type ORMessage = { role: "system" | "user" | "assistant"; content: string };

const ALLOWED_MODELS = [
    "openai/gpt-oss-120b",
    "qwen/qwen3-coder-next",
] as const;

type AllowedModel = (typeof ALLOWED_MODELS)[number];

function isAllowedModel(model: string): model is AllowedModel {
    return (ALLOWED_MODELS as readonly string[]).includes(model);
}

export async function runOpenRouter(opts: {
    model: string;
    messages: ORMessage[];
    temperature?: number;
    max_tokens?: number;
}): Promise<{ text: string; usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number }; model: string; raw: unknown }> {
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) throw new Error("Missing OPENROUTER_API_KEY env var");

    if (!isAllowedModel(opts.model)) {
        throw new Error(
            `Model "${opts.model}" not allowed. Use one of: ${ALLOWED_MODELS.join(", ")}`
        );
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.OPENROUTER_SITE_URL ?? "http://localhost",
            "X-Title": process.env.OPENROUTER_APP_NAME ?? "FORK MCP Server",
        },
        body: JSON.stringify({
            model: opts.model,
            messages: opts.messages,
            temperature: opts.temperature ?? 0.2,
            max_tokens: opts.max_tokens ?? 4096,
        }),
    });

    if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`OpenRouter ${res.status}: ${txt}`);
    }

    const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
        usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
        model?: string;
    };

    const text = json?.choices?.[0]?.message?.content ?? "";

    return {
        text,
        usage: json.usage,
        model: json.model ?? opts.model,
        raw: json,
    };
}

export { ALLOWED_MODELS };
export type { ORMessage };
