// lib/openrouter.ts
import { ChatMessage } from "../types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Minimal OpenRouter client adapter.
 *
 * Expects process.env.OPENROUTER_API_KEY to be set (server-side only).
 * Optionally you cans set process.env.OPENROUTER_MODEL to choose a model.
 */
export async function callOpenRouter(messages: ChatMessage[], opts?: { model?: string; max_tokens?: number; timeoutMs?: number }): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new Error("OPENROUTER_API_KEY is not configured on the server");
  }

  const model = opts?.model ?? process.env.OPENROUTER_MODEL ?? "openai/gpt-oss-20b:free";
  const max_tokens = opts?.max_tokens ?? 512;
  const timeoutMs = opts?.timeoutMs ?? 30_000; // 30s default

  // Build payload for OpenRouter - ChatCompletion-like
  const payload = {
    model,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    max_tokens,
    // add other provider-specific options here if desired
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const resp = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        // OpenRouter recommends sending origin/title info for analytics in some docs:
        // (these headers are optional but harmless)
        "X-Title": "Minimal-Nextjs-Chat",
        // 'Referer' header can't be set in Node's fetch in some environments; don't rely on it.
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!resp.ok) {
      const txt = await resp.text().catch(() => "<no body>");
      throw new Error(`OpenRouter request failed: ${resp.status} ${resp.statusText} — ${txt}`);
    }

    const data = await resp.json().catch(() => null);

    // Typical shape (OpenAI-style / OpenRouter may differ): first choice -> message.content or text
    const content =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.text ??
      data?.output?.[0]?.content ??
      null;

    if (!content) {
      // If the provider returned something unexpected, include a helpful debug fragment.
      throw new Error("OpenRouter returned an unexpected response shape");
    }

    return String(content);
  } catch (err: any) {
    // Normalize abort error
    if (err?.name === "AbortError") {
      throw new Error("OpenRouter request timed out");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

