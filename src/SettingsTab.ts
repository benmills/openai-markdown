import { App, PluginSettingTab, Setting } from 'obsidian';
import OpenAiMarkdown from '../main';

export class OpenAiMarkdownSettingsTab extends PluginSettingTab {
  plugin: OpenAiMarkdown;

  constructor(app: App, plugin: OpenAiMarkdown) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    let { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("OpenAI API Key")
      .setDesc("Create a new key just for Obsidian. Stored inside your vault, be careful.")
      .addText((text) =>
        text
          .setPlaceholder("sk-...")
          .setValue(this.plugin.settings.openaiApiKey)
          .onChange(async (value) => {
            this.plugin.settings.openaiApiKey = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("OpenAI Model")
      .setDesc("Check OpenAI docs to see valid options for your account")
      .addDropdown((dd) =>
        dd
          .addOption("gpt-3.5-turbo", "gpt-3.5-turbo")
          .addOption("gpt-4", "gpt-4")
          .setValue(this.plugin.settings.openaiModel)
          .onChange(async (value) => {
            this.plugin.settings.openaiModel = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("AI Icon")
      .setDesc("How the model starts it's response.")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.assistantIcon)
          .onChange(async (value) => {
            this.plugin.settings.assistantIcon = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("AI End Icon")
      .setDesc("How the model ends it's response.")
      .addText((text) =>
        text
          .setValue(this.plugin.settings.assistantEndIcon)
          .onChange(async (value) => {
            this.plugin.settings.assistantEndIcon = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("System Prompt")
      .setDesc("Added as the first message for all chats")
      .addTextArea((text) =>
        text
          .setValue(this.plugin.settings.systemPrompt)
          .onChange(async (value) => {
            this.plugin.settings.systemPrompt = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Delete on Rerun")
      .setDesc("If you run the chat command without adding a new message, the previous model response will be deleted and replaced with a new response")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.deleteOnRerun)
          .onChange(async (value) => {
            this.plugin.settings.deleteOnRerun = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
