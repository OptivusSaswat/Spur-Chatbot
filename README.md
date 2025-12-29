# Spur Chat Agent

A customer support chatbot for an e-commerce platform built with React and Express.

## Table of Contents

- [Local Development Setup](#local-development-setup)
- [Architecture Overview](#architecture-overview)
- [LLM Integration](#llm-integration)
- [Trade-offs and Future Improvements](#trade-offs-and-future-improvements)

---

## Local Development Setup

### Prerequisites

- Node.js v18+
- PostgreSQL database (or NeonDB account)
- Gemini API key

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd spur
npm run install:all
```

### 2. Configure Environment Variables

**Backend** (`backend/.env`):

```env
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

**Frontend** (`frontend/.env`):

```env
VITE_API_URL=http://localhost:3000
```

### 3. Set Up Database

Run Prisma migrations to create the database schema:

```bash
npm run prisma:migrate
```

This creates two tables:
- `Session` - stores chat sessions
- `Message` - stores conversation messages with role (user/assistant)

### 4. Run the Application

Start both frontend and backend:

```bash
npm run dev
```

Or run them separately:

```bash
npm run dev:backend   # Express server on port 3000
npm run dev:frontend  # Vite dev server on port 5173
```

### 5. Access the Application

Open http://localhost:5173 in your browser.

---

## Architecture Overview

### Project Structure

```
spur/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   └── chat/        # Chat UI components
│   │   ├── services/        # API client
│   │   └── store/           # Zustand state management
│   └── package.json
├── backend/                  # Express + TypeScript API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic (chat, LLM)
│   │   └── lib/             # Database client
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
└── package.json              # Root scripts
```

### Backend Layers

1. **Routes** (`routes/chat.routes.ts`) - Define API endpoints
2. **Controllers** (`controllers/chat.controller.ts`) - Handle HTTP requests, input validation
3. **Services** (`services/`) - Business logic separated by concern:
   - `chat.service.ts` - Session management, message persistence
   - `llm.service.ts` - AI integration, prompt engineering
4. **Lib** (`lib/prisma.ts`) - Database client with Prisma + PostgreSQL adapter

### Design Decisions

- **Prisma 7 with Driver Adapters**: Using `@prisma/adapter-pg` for direct PostgreSQL connection, required for Prisma 7's new architecture
- **Session-based Conversations**: Each chat has a unique session ID stored in localStorage, allowing conversation persistence across page reloads
- **Zustand for State**: Lightweight state management without Redux boilerplate
- **Express 5**: Latest Express with native async/await support and updated path matching

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat/message` | Send a message and get AI response |
| GET | `/chat/history/:sessionId` | Retrieve conversation history |
| GET | `/health` | Health check endpoint |

---

## LLM Integration

### Provider

**Google Gemini** (`gemini-2.0-flash` model) via `@google/genai` SDK.

Chosen for:
- Fast response times
- Generous free tier
- Simple SDK integration

### Prompting Strategy

The system prompt defines a customer support persona for "Spur" e-commerce store with:

1. **Role Definition**: Friendly, professional support agent named "Spur Assistant"

2. **Knowledge Base**: Store policies including:
   - Shipping options and timeframes
   - Return/refund policies (30-day window)
   - Payment methods accepted
   - Order tracking process

3. **Behavioral Guidelines**:
   - Keep responses concise (2-3 sentences when possible)
   - Ask clarifying questions for vague requests
   - Escalate to human support when needed

4. **Scope Boundaries**: The agent is instructed to only answer e-commerce related questions and politely decline off-topic requests (politics, general knowledge, coding, etc.)

### Cost Control Measures

- `MAX_TOKENS = 1024` - Limits response length
- `MAX_HISTORY_MESSAGES = 20` - Truncates old messages to control context size
- Input validation limits messages to 500 characters

---

## Trade-offs and Future Improvements

### Current Trade-offs

1. **No Authentication**: Sessions are tied to localStorage only. Anyone with the session ID could access the conversation history.

2. **Single LLM Provider**: Tightly coupled to Gemini. No fallback if the API is down.

3. **No Rate Limiting**: The backend doesn't implement rate limiting, relying only on Gemini's built-in limits.

4. **Basic Error Handling**: Errors are caught and returned as friendly messages, but there's no retry logic or circuit breaker pattern.

5. **No Caching**: Every request hits the database and LLM API. Frequently asked questions could be cached.

### If I Had More Time

1. **Add Authentication**: Implement user accounts with JWT tokens, tie sessions to authenticated users.

2. **Implement RAG**: Add a vector database (Pinecone/Chroma) to store actual product catalog and order data, enabling the bot to answer specific questions about real products.

3. **Add Streaming Responses**: Use Server-Sent Events to stream LLM responses token-by-token for better UX.

4. **Multi-provider Fallback**: Add OpenAI or Anthropic as backup providers with automatic failover.

5. **Admin Dashboard**: Create an interface to view conversations, common questions, and bot performance metrics.

6. **Conversation Analytics**: Track metrics like resolution rate, average response time, and common topics.

7. **Testing**: Add unit tests for services, integration tests for API endpoints, and E2E tests with Playwright.

8. **Rate Limiting and Caching**: Implement Redis for both rate limiting and caching frequent responses.

---

## Deployment

The application is configured for Render deployment:

**Build Command**: `npm run build`
**Start Command**: `npm run start`

**Environment Variables**:
- `NODE_ENV=production`
- `DATABASE_URL`
- `GEMINI_API_KEY`

In production, the Express server serves the built React frontend as static files.
