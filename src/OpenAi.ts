import { Notice } from "obsidian";

const API_URL = 'https://api.openai.com/v1';

export type Role = "user" | "assistant" | "system";

export type Message = {
  "role": Role;
  "content": string;
};

type OpenAiOptions = {
  'systemPrompt': string | undefined,
  'openaiApiKey': string,
  'openaiModel': string
};

export function userMsg(content: string): Message {
  return { role: "user", content };
};

export function assistantMsg(content: string): Message {
  return { role: "assistant", content };
};
export const aiMsg = assistantMsg;

export async function OpenAiChat(messages: Message[], options: OpenAiOptions, onData: (part: string, done: boolean) => void) {
  const systemPrompt = userMsg(options.systemPrompt || "");

  try {
    const response = await fetch(API_URL + "/chat/completions", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${options.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "model": options.openaiModel,
        "messages": [systemPrompt, ...messages],
        "temperature": 1,
        "top_p": 1,
        stream: true
      })
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true && reader) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      try {
        chunk
          .split('data: ')
          .map((l) => l.trim())
          .filter((l) => l.length > 0)
          .map((l) => {
            if (l == "[DONE]") {
              onData('', true);
            } else {
              try {
                onData(JSON.parse(l).choices[0].delta.content || "", false);
              } catch (e) {
                console.error(e);
                console.log(l);
              }
            }
          });
      } catch (e) {
        console.error("OpenAi Markdown Error: Unable to parse API response chunk:");
        console.error(chunk);
      }
    }
  } catch (e) {
    new Notice("OpenAI request failed. Check you have your API key set in settings.")
    throw (e);
  }
}
