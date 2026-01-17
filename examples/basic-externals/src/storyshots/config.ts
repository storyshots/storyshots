// planning phase
// sub agents
// Chain-of-Thought or ReAct
// Prompt engineering

// This is what these tools do
// ReAct
// AutoGPT
// LangGraph
// OpenAI tool calling
// Claude tool use

// Vector database = enhance prompt with additional info.
  // P(token | [retrieved_docs] + previous_tokens)
  // Example:
  // Model context window: 4K tokens
  //
  // Your knowledge base: 1 million tokens (way too large)
  //
  // Vector DB retrieves top 3 most relevant chunks (~1K tokens total)
  //
  // Prompt becomes: "[Retrieved chunks] + User question"
  //
  // Total ≤ 4K tokens ✅

// # Simplified RAG flow
// query = "What did the CEO say about Q4 earnings?"
//
// # 1. Retrieve from vector DB (separate system)
// retrieved_chunks = vector_db.search(query, top_k=3)  # Returns text chunks
//
// # 2. Augment prompt
// augmented_prompt = f"""
// Based on these documents:
// {retrieved_chunks}
//
// Answer: {query}
// """
//
// # 3. Call LLM with augmented prompt
// # The LLM's P function now sees retrieved docs as context
// response = llm.generate(augmented_prompt)

// agent function is effect-full
function agent(prompt: UserPrompt): void {
  const llm = createGPT();
  const state = createInitialState(prompt);

  return work(state);

  function work(state: AgentState): void {
    const decision = createDecision(llm(createPromptFromState(state)));

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

declare function createPromptFromState(state: AgentState): Prompt;

// LLMDecision is derived from LLM Answer
declare function createDecision(answer: Answer): LLMDecision;

declare function execute(decision: LLMDecision): DecisionResult;

declare function isDoneDecision(decision: LLMDecision): boolean;

type DecisionResult = Brand<'DecisionResult'>;

// Structure of a state is based upon selected implementation: prompt accumulation, summaries, vector stores
// State dislocation is also an implementation details (for example usage of external state objects)
type AgentState = Brand<'AgentState'>;

type LLMDecision = Brand<'LLMDecision'> & Answer;

type UserPrompt = Brand<'UserPrompt'> & Prompt;

// Concrete type is irrelevant for a model
type Brand<T extends string> = { [TKey in T]: T };
