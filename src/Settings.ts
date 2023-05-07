export type OpenAiSettings = {
  openaiApiKey: string,
  openaiModel: string,
  systemPrompt: string,
  assistantIcon: string,
  assistantEndIcon: string
  deleteOnRerun: boolean
};

export const DEFAULT_SETTINGS: OpenAiSettings = {
  openaiApiKey: '',
  openaiModel: 'gpt-3.5-turbo',
  systemPrompt: 'You are my helpful and efficient assistant.',
  assistantIcon: '✨📜: ',
  assistantEndIcon: '••◦',
  deleteOnRerun: true
};
