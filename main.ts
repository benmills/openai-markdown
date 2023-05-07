import { Editor, Plugin } from 'obsidian';

import { extractMessagesFromMarkdown } from './src/Parser';
import { OpenAiSettings, DEFAULT_SETTINGS } from './src/Settings';
import { OpenAiMarkdownSettingsTab } from './src/SettingsTab';
import { OpenAiChat } from './src/OpenAi';

export default class OpenAiMarkdown extends Plugin {
  settings: OpenAiSettings;
  loading: boolean = false;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new OpenAiMarkdownSettingsTab(this.app, this));

    this.addCommand({
      id: 'openai-md-send',
      name: 'Send current file as conversation to OpenAI model',
      editorCallback: (editor: Editor) => this.chat(editor)
    });

    this.addCommand({
      id: "openai-md-delete",
      name: "Delete last response from model",
      editorCallback: (editor: Editor) => this.delete(editor)
    });
  }


  async chat(editor: Editor) {
    let messages = extractMessagesFromMarkdown(
      this.settings.assistantIcon,
      this.settings.assistantEndIcon,
      editor.getValue()
    );

    if (messages.slice(-1)[0].role == "assistant") {
      this.delete(editor);
      messages = messages.slice(0, -1);
    }

    const openAiOptions = {
      systemPrompt: this.settings.systemPrompt,
      openaiApiKey: this.settings.openaiApiKey,
      openaiModel: this.settings.openaiModel
    };

    const initalLineNum = this.getInsertLine(editor);
    let insertLineNum = initalLineNum;

    OpenAiChat(messages, openAiOptions, (part: string, done: boolean) => {
      let newContents = editor.getLine(insertLineNum);

      if (!done && insertLineNum == initalLineNum && newContents.trim().length == 0) {
        if (part.trim().length > 0 && /[^a-z]/i.test(part.slice(0, 1))) {
          part = "\n" + part;
        }

        newContents = this.settings.assistantIcon + part;
      } else if (!done) {
        newContents += part;
      } else {
        if (/[^a-z]/i.test(newContents.slice(-1))) {
          newContents += '\n';
        } else {
          newContents += ' ';
        }

        newContents += this.settings.assistantEndIcon;
      }

      editor.setLine(insertLineNum, newContents);
      insertLineNum = editor.lastLine();
      editor.setCursor(editor.lastLine());
    });
  }

  delete(editor: Editor) {
    let currentLine = editor.lastLine();
    let endLine, startLine;

    while (currentLine >= 0) {
      const contents = editor.getLine(currentLine);
      if (contents.includes(this.settings.assistantEndIcon)) {
        endLine = currentLine;
      } else if (endLine && contents.includes(this.settings.assistantIcon)) {
        startLine = currentLine;
        break;
      }

      currentLine--;
    }

    if (startLine && endLine) {
      editor.replaceRange('',
        { line: startLine - 1, ch: 0 },
        { line: endLine + 1, ch: 0 }
      );
    } else {
      throw ("No msg to delete");
    }
  }

  getInsertLine(editor: Editor): number {
    let insertLine = editor.lastLine();
    const isEmpty = (ln: number) => editor.getLine(ln).trim().length == 0;

    if (isEmpty(insertLine) && isEmpty(insertLine - 1)) {
      return insertLine;
    } else {
      editor.setLine(insertLine, editor.getLine(insertLine) + "\n");
      return this.getInsertLine(editor);
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
