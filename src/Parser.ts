import { Message, Role, aiMsg, userMsg } from "./OpenAi";

export function extractMessagesFromMarkdown(assistantIcon: string, assistantEndIcon: string, input: string) {
  const lines = input.split(/\n/);

  const conversation: Message[] = [];
  let currentRole: Role | null = null;

  const roleLines: Message[] = [];
  for (const line of lines) {
    if (line.startsWith(assistantIcon)) {
      roleLines.push(aiMsg(line.replace(assistantIcon, '')));
      currentRole = 'assistant';
    } else if (line.endsWith(assistantEndIcon)) {
      const parsedLine = line.replace(assistantEndIcon, '');
      if (parsedLine.length > 0) {
        roleLines.push(aiMsg(parsedLine));
      }
      currentRole = null;
    } else if (currentRole == 'assistant') {
      roleLines.push(aiMsg(line));
    } else if (currentRole == null) {
      roleLines.push(userMsg(line));
    }
  }

  currentRole = null;
  let currentContent = "";

  for (const roleLine of roleLines) {
    if (currentRole && currentRole != roleLine.role) {
      conversation.push({ role: currentRole, content: currentContent.trim() });
      currentContent = "";
    }

    currentRole = roleLine.role;
    currentContent += roleLine.content + "\n";
  }

  if (currentRole && currentContent && currentContent.trim().length > 0) {
    conversation.push({ role: currentRole, content: currentContent.trim() });
  }


  return conversation;
}
