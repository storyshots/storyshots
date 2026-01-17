// How Predictability is controlled

// agent function is effect-full
function agent(prompt: UserPrompt): void {
  const llm = createGPT();
  const state = createInitialState(prompt);

  return work(state);

  function work(state: AgentState): void {
    const decision = createDecision(llm(state));

    if (isDoneDecision(decision)) {
      return;
    }

    const result = execute(decision);

    return work(createNextState(state, decision, result));
  }
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

// Creates state based upon current state, LLM decision and decision result
declare function createNextState(
  curr: AgentState,
  decision: LLMDecision,
  result: DecisionResult,
): AgentState;

// LLMDecision is derived from LLM Answer
declare function createDecision(answer: Answer): LLMDecision;

declare function execute(decision: LLMDecision): DecisionResult;

declare function isDoneDecision(decision: LLMDecision): boolean;

type DecisionResult = Brand<'DecisionResult'>;

// Structure of a state is based upon selected implementation: prompt accumulation, summaries, vector stores
// State dislocation is also an implementation details (for example usage of external state objects)
type AgentState = Brand<'AgentState'> & Prompt;

type LLMDecision = Brand<'LLMDecision'> & Answer;

type UserPrompt = Brand<'UserPrompt'> & Prompt;

// Concrete type is irrelevant for a model
type Brand<T extends string> = { [TKey in T]: T };
