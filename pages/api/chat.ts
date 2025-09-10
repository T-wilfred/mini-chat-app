// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { ChatMessage } from "../../types";
import { callOpenRouter } from "../../lib/openrouter";

type SuccessResponse = { reply: string };
type ErrorResponse = { error: string };

/**
 * POST /api/chat
 * Body: { messages: ChatMessage[] }
 *
 * Server-only: reads OPENROUTER_API_KEY from environment.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<SuccessResponse | ErrorResponse>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // Basic body validation
  const body = req.body as { messages?: unknown } | undefined;
  if (!body || !Array.isArray(body.messages)) {
    return res.status(400).json({ error: "Invalid request: expected JSON body with `messages` array." });
  }

  // Validate minimal shape of messages
  const messagesCandidate = body.messages;
  const valid = messagesCandidate.every(
    (m) =>
      m &&
      typeof m === "object" &&
      typeof (m as any).role === "string" &&
      typeof (m as any).content === "string"
  );

  if (!valid) {
    return res.status(400).json({ error: "Invalid request: each message must be { role: string, content: string }." });
  }

  // Cast to ChatMessage[] for the OpenRouter call
  const messages = messagesCandidate as ChatMessage[];

  try {
    const reply = await callOpenRouter(messages, {
      // optional overrides:
      // model: process.env.OPENROUTER_MODEL,
      max_tokens: 512,
      timeoutMs: 30_000,
    });

    return res.status(200).json({ reply });
  } catch (err: any) {
    console.error("Error in /api/chat:", err);
    // Do not leak secret values; surface safe message
    const message = err?.message ?? "Unknown server error";
    return res.status(500).json({ error: `Server error: ${message}` });
  }
}
