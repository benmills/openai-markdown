import fs from 'fs';
import { describe, expect, it } from '@jest/globals';
import { extractMessagesFromMarkdown } from '../src/Parser';
import { DEFAULT_SETTINGS } from '../src/Settings';

describe("Parser", () => {
  it("Should parse a conversation from the contents of a markdown file", () => {
    const sample = fs.readFileSync('test/samples/Basic.md', 'utf-8');
    const messages = extractMessagesFromMarkdown(DEFAULT_SETTINGS.assistantIcon, DEFAULT_SETTINGS.assistantEndIcon, sample);

    expect(messages.length).toBe(5);

    expect(messages[0].role).toBe(`user`);
    expect(messages[0].content).toBe(`Tell me a joke`);

    expect(messages[1].role).toBe(`assistant`);
    expect(messages[1].content).toBe(`Why don't scientists trust atoms? Because they make up everything!`);

    expect(messages[2].role).toBe(`user`);
    expect(messages[2].content).toBe(`One more!`);

    expect(messages[3].role).toBe(`assistant`);
    expect(messages[3].content).toBe(`Why did the scarecrow win an award?\n\nBecause he was outstanding in his field!`);

    expect(messages[4].role).toBe(`user`);
    expect(messages[4].content).toBe(`So funny!!`);
  });

  it.only("Should parse a complex conversation", () => {
    const sample = fs.readFileSync('test/samples/Code.md', 'utf-8');
    const messages = extractMessagesFromMarkdown(DEFAULT_SETTINGS.assistantIcon, DEFAULT_SETTINGS.assistantEndIcon, sample);

    console.log(messages);

    // expect(messages.length).toBe(4);

    // expect(messages[0].role).toBe(`user`);
    // expect(messages[0].content).toBe(`Tell me a joke`);
    //
    // expect(messages[1].role).toBe(`assistant`);
    // expect(messages[1].content).toBe(`Why don't scientists trust atoms? Because they make up everything!`);
    //
    // expect(messages[2].role).toBe(`user`);
    // expect(messages[2].content).toBe(`One more!`);
    //
    // expect(messages[3].role).toBe(`assistant`);
    // expect(messages[3].content).toBe(`Why did the scarecrow win an award?\n\nBecause he was outstanding in his field!`);
    //
    // expect(messages[4].role).toBe(`user`);
    // expect(messages[4].content).toBe(`So funny!!`);
  });
});
