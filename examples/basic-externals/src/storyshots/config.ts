declare function llm(prompt: string): string;

// what is agent runtime
// prompts accumulation = memory
// summary = memory
// vector stores = memory

// memory = model & location

// LLM emits proposals for commands; the runtime decides whether to execute them

// How Predictability is controlled

// Main function is effect-full
function main(prompt: UserPrompt): void {
  const llm = createGPT();
  const agent = createAgent(prompt);

  llm(agent.state);
}

type LLM = (prompt: string) => string;

declare function createGPT(): LLM;

type Agent = {
  state: AgentState;
};

function createAgent(prompt: UserPrompt): Agent {
  return {
    state: createInitialState(prompt),
  };
}

// AgentState is derived initially from UserPrompt
declare function createInitialState(prompt: UserPrompt): AgentState;

type AgentState = Brand<'AgentState'>;

type UserPrompt = Brand<'UserPrompt'>;

// Concrete type is irrelevant for a model
type Brand<T extends string> = { [TKey in T]: T };
