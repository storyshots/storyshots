declare function llm(prompt: string): string;

// what is agent runtime
// prompts accumulation = memory
// summary = memory
// vector stores = memory

// memory = model & location

// LLM emits proposals for commands; the runtime decides whether to execute them

// How Predictability is controlled

declare function llm(prompt: string): string;

type UserPrompt = Brand<'UserPrompt'>;

// Main function is effect-full
function main(prompt: UserPrompt): void {
  while (0) {}
}

// Concrete type is irrelevant for a model
type Brand<T extends string> = { [TKey in T]: T };
