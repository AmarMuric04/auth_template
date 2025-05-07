import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { aiConfig } from "../../../../ai.config";

export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    configKey = "default",
    system: overrideSystem,
  } = await req.json();

  const config = aiConfig[configKey];

  if (!config && !overrideSystem) {
    return new Response("Invalid config key or missing system message", {
      status: 400,
    });
  }

  const result = streamText({
    model: google(config?.model ?? "models/gemini-2.0-flash-exp"),
    system: overrideSystem ?? config.system,
    messages,
  });

  return result.toDataStreamResponse();
}
