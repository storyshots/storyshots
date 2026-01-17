// sub agents
// Chain-of-Thought or ReAct
// Prompt engineering

// This is what these tools do
// ReAct - technique describing think → act → observe model

// AutoGPT - an old pattern (ReAct taken to the extreme)
// LLM (planner / reasoner)
//    ↓
// Command schema (JSON-like)
//    ↓
// Executor / Drivers
//    ↓
// Side-effects (web, files, APIs)
//    ↓
// Observation
//    ↓
// Back to LLM

// Modular agent builders - LangChain, LangGraph
// Production agent SDKs (ready to be used frameworks) - OpenAI Agents SDK, Semantic Kernel
// Multi-agent orchestration (orchestrator controls who speaks, when, and why) - AutoGen, CrewAI, LangGraph
// Autonomous task execution - AutoGPT/AgentGPT, BabyAGI
// Data/RAG-centric agents (agents used to reason over data correctly) - LlamaIndex Agents
  // Answers must be factually grounded
  // You have large or structured corpora
  // You need traceability
  // You’re building internal tools (docs, infra, policies)
  // Hallucinations are unacceptable

// n8n - automation workflow

// The trend is:
//
//   fewer “fully autonomous” agents,
//   more bounded, auditable, goal-limited ones.

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

// Planning is a phase when LLM generates sequence of steps it is going to execute
// Planning:
//   Makes future actions explicit
//   Limits surprise side effects
//   Enables static validation - validates against forbidden actions and checks budget
//   Enables step limits and budgets
//   Allows human or programmatic review
// You can:
//   Reject a plan
//   Modify a plan
//   Truncate a plan
//   Insert guards
// You cannot do that with opaque step-by-step reactions.

// Context window
// The key shift is:
//   The prompt is a lossy view of state, not the state itself.
// Therefore:
// State lives outside the LLM
// Prompt is a rendered snapshot
// Rendering is a policy decision

// Strategy 1 — Summarization (lossy compression)
// Strategy 2 — Salience filtering (attention outside the model)
// Strategy 3 — External memory + retrieval (RAG)
// Strategy 4 — State stratification (this is the big one)

// Prompt as a program, not a log
// Bad prompt design:
//   Here is everything that ever happened...
// Good prompt design:
//   Here is:
//   - What you are trying to do
//   - What matters now
//   - What you can do next

// Practical rule of thumb
// If a piece of state must be remembered exactly, it must not rely on the prompt.
// Examples:
//   File paths
//   API keys
//   Numerical totals
//   Invariants
//
// Those live in:
//   AgentState
//   Databases
//   Deterministic code
//
// The LLM only refers to them.

// Summary drift (facts slowly mutate)
// Retrieval hallucination
// Forgotten constraints - Reassert invariants every turn.
// Overloading prompt with irrelevant junk - Re-inject goals explicitly.
// Treat the LLM as forgetful

// MCP (Model Context Protocol) is:
//
// A standardized protocol for exposing tool capabilities and exchanging structured
// messages between an agent runtime (client) and external tools (servers).

// MCP does not solve context-window limits.

// User
//  ↓
// Agent Runtime (control loop, state, invariants)
// ↓
// LLM (policy / proposal generator)
// ↓
// Decision Parser & Validator
//  ↓
// MCP Client
//  ↓
// MCP Server
//  ↓
// Real Tool / API / System

// What MCP gives you (and what it doesn’t)
// ✅ Gives you
// Tool interoperability
// Capability discovery
// Typed I/O
// Transport abstraction
// Multi-modal support
//
// ❌ Does NOT give you
// Safety
// Planning
// Validation
// Memory
// Determinism
// Reasoning
// Those remain agent-runtime responsibilities.

// Search example
async function search(prompt) {
  // Use structured prompts: { "query": "...", "filters": ["site:example.com"] }
  const goal = llm(
    `Given prompt ${prompt} build a short, concise query for search engine like google to find relevant information`,
  );

  // Use a separate tool to do a search (for example communicate with a tool via MCP protocol)
  const pages = await searchInGoogle(goal.question);

  // Take top 4 pages, for example
  // For larger state, consider embedding the top pages in a vector store, and retrieve only the most relevant snippets to fold into the LLM.
  const topK = pages.slice(0, 4);

  // Extract results from pages, prev answer might be folded using techniques like summarization and etc.
  const answer = topK.reduce(
    (prevAnswer, page) =>
      // Schema validation must be in place
      // Track token usage across multiple LLM calls to avoid truncation or context overflow.
      llm(
        `Given previous investigation ${prevAnswer} and current ${page.content} answer ${goal.question}`,
      ),
    'no investigation was made yet',
  );

  return {
    answer,
    sources: topK,
  };
}

// Recursive Refinement
// Multi-Modal Extraction
// Streaming Structured Output

// User Request
//      ↓
// [Structured Output Specification]
//      ↓
//    LLM Call
//      ↓
// [Response + Schema Parser]
//      ↓
// ├── Success → Return Structured Data
//      ↓
// └── Failure → [Error Analysis]
//                          ↓
//                    [Generate Correction Prompt]
//                          ↓
//                     Retry Loop (max 3x)

// Schema Design Matters: Simple, well-documented schemas work better
// Error Messages Should Be LLM-Friendly: "Invalid date format" → "Use YYYY-MM-DD format"
// Temperature Setting: Use lower temperatures (0.1-0.3) for consistent structured output
// Fallback Strategies: When retries fail, provide partial results or human escalation


// Hallucinated fields	    ->  Schema validation rejects them
// Inconsistent formats	    ->  Provide examples in prompt
// Missing required fields  ->  Make fields optional initially
// Nested structures	      ->  Break into multiple LLM calls
// Rate limiting            ->	Implement exponential backoff

// You've identified the fundamental shift:
// LLMs are becoming universal adapters between unstructured human communication and structured computer systems.

// TypeScript
// ├─ LangChain / LangGraph (design & prototyping)
// ├─ Deterministic workflows (Temporal / n8n)
// ├─ LLM calls (OpenAI / Anthropic)
// └─ Observability & guardrails

// guardrails - exit outside LLM
  // LLMs are:
    // probabilistic
    // eager to comply
    // bad at saying “no”
    // creative under pressure
  // Production systems need
    // determinism
    // safety
    // auditability
    // stop buttons
// Tool guardrails - Limit what tools an agent can call and how.
// Behavior guardrails - Constrain reasoning and decisions.
// Input guardrails - Protect against bad or malicious inputs.
// Output guardrails - Ensure responses are usable and safe.
// Data guardrails - Control what data the agent can see or use.
// Human-in-the-loop - The strongest guardrail.

// Node.js + TypeScript
// @langchain/openai
// Tool-calling agent
// 1–2 tools
// Hard iteration limit
// No autonomy
