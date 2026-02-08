export type GuardMeta = {
    handler: string;
    uri?: string;
    tool?: string;
};

const MAX_CHARS_DEFAULT = 24_000;

export function truncateText(text: string, maxChars = MAX_CHARS_DEFAULT) {
    if (text.length <= maxChars) return { text, truncated: false, originalChars: text.length };

    const note =
        `\n\n[TRUNCATED]\n` +
        `Original size: ${text.length} chars\n` +
        `Returned: ${maxChars} chars\n` +
        `Tip: Re-run with narrower scope (grep_project with tighter glob/regex, or read fork://file/{path}).\n`;

    const head = text.slice(0, Math.max(0, maxChars - note.length));

    return { text: head + note, truncated: true, originalChars: text.length };
}

export function safeJsonStringify(value: unknown, space: number = 2): string {
    const seen = new WeakSet<object>();
    return JSON.stringify(
        value,
        (_k, v) => {
            if (typeof v === "object" && v !== null) {
                if (seen.has(v as object)) return "[Circular]";
                seen.add(v as object);
            }
            return v;
        },
        space
    );
}

export function guardOutgoingText(text: string, meta: GuardMeta, maxChars?: number) {
    const limit = maxChars ?? MAX_CHARS_DEFAULT;
    const r = truncateText(text, limit);

    if (r.truncated) {
        console.warn(
            `[response-guard] Truncated output from ${meta.handler}` +
            (meta.tool ? ` tool=${meta.tool}` : "") +
            (meta.uri ? ` uri=${meta.uri}` : "") +
            ` originalChars=${r.originalChars} limit=${limit}`
        );
    }

    return r.text;
}

/** Wrap any payload into a guarded MCP tool response. */
export function guardedToolResponse(payload: unknown, tool: string) {
    const raw = safeJsonStringify(payload, 2);
    const text = guardOutgoingText(raw, { handler: "CallTool", tool });
    return { content: [{ type: "text" as const, text }] };
}

/** Wrap a plain text string into a guarded MCP tool response. */
export function guardedTextResponse(text: string, tool: string) {
    const guarded = guardOutgoingText(text, { handler: "CallTool", tool });
    return { content: [{ type: "text" as const, text: guarded }] };
}

/** Wrap a resource read into a guarded response. */
export function guardedResourceText(text: string, uri: string) {
    return guardOutgoingText(text, { handler: "ReadResource", uri });
}
