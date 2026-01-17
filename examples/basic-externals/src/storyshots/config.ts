declare function llm(prompt: string): string;

// what is agent runtime
// prompts accumulation = memory
// summary = memory
// vector stores = memory

// memory = model & location

// LLM emits proposals for commands; the runtime decides whether to execute them

// How Predictability is controlled

// agent function is effect-full
function agent(prompt: UserPrompt): void {
  const llm = createGPT();
  const state = createInitialState(prompt);

  const answer = llm(state);
  const decision = createDecision(answer);
}

/// --- LLM ---

type LLM = (prompt: Prompt) => Answer;

// Example LLM
declare function createGPT(): LLM;

// Any prompt suitable for LLM
type Prompt = Brand<'Prompt'>;

// Any answer given by LLM
type Answer = Brand<'Answer'>;

/// --- AGENT ---

// AgentState is derived initially from UserPrompt
declare function createInitialState(prompt: UserPrompt): AgentState;

// LLMDecision is derived from LLM Answer
declare function createDecision(answer: Answer): LLMDecision;

type AgentState = Brand<'AgentState'> & Prompt;

type LLMDecision = Brand<'LLMDecision'> & Answer;

type UserPrompt = Brand<'UserPrompt'> & Prompt;

// Concrete type is irrelevant for a model
type Brand<T extends string> = { [TKey in T]: T };
