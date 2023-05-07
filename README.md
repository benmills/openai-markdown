# OpenAI Markdown

Chat with OpenAI models as a markdown file inside Obsidian desktop or mobile.

* Edit the entire conversation, not just your next message, making few-shot prompting easy.
* Store and organize your chats in your Obsidian vault
* Configure your OpenAI API key and use either GPT-3.5-turbo or GPT-4.

**Example: chat.md**
What is 1 + 2?

✨📜: The answer is 3 ••◦


## How it works

**Conversation syntax**
OpenAI Markdown prioritizes minimal syntax to ensure your files are as close to pure markdown as possible. Model responses are wrapped with `Icons` that can be set to any text string in the plugin settings. By default, a sequence of emojis are used.

**Send file to OpenAI**
Run the command `Send current file as conversation to OpenAI model` to extract the conversation from the current file and send it to the configured OpenAI model to get a response.

**Reruns**
By default, if you send a file to OpenAI without adding a new message it will delete the previous model response and regenerate it.

**Delete last model response**
Run the command `Delete last response from model`

## Risks

This is an early release and likely has bugs. Please be careful and consider the risks before uses:
* **Your OpenAI API key will be stored in your Obsidian vault. This may expose your API key to other plugins. Consider generating a specific API key to ensure you can easily rotate.**
* Conversation syntax is very basic and if the `Icon` sequence appears in the model's output or in a user message it will break the parser.
* API requests have minimal error handling. This may result in hanging requests or UI lag.
* OpenAI models are normally very good about outputting valid markdown, but there is little to no output sanitation.

## Installation
Clone this repo inside your VAULT/.obsidian/plugin folder. As the plugin stabilizes it will be published as a community plugin.

## Reach out
Find me @benemills on twitter and @benmills on Farcaster.
