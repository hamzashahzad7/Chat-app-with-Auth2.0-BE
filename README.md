# 🧠 Chat App Backend (Node.js + Socket.IO + Prisma + Hugging Face)

This is the backend for a real-time chat app. It handles messages, user sessions, sentiment analysis, and socket events.

## 🔧 Tech Stack
- Express.js
- Socket.IO Server
- Prisma ORM (PostgreSQL)
- Hugging Face Inference API for sentiment
- dotenv for config

## 📦 Setup

```bash
cd backend
npm install
```

### 🔑 .env
```env
DATABASE_URL=postgresql://...
HUGGINGFACE_API_KEY=your_huggingface_token
```

## 🛠 How to Run

```bash
node server.js
```

## 🔌 Socket.IO Events

| Event         | From       | Description                          |
|---------------|------------|--------------------------------------|
| `join`        | client     | Join a chat room                     |
| `userJoined`  | client     | Notify others a user joined          |
| `sendMessage` | client     | Send new message to server           |
| `newMessage`  | server     | Broadcast new message to room        |
| `userNotification` | server | Broadcast system message             |

## 🧠 Sentiment Analysis

Messages are analyzed using Hugging Face (`distilbert-base-uncased-finetuned-sst-2-english`) and saved with sentiment tags.

## 📂 API Routes

| Method | Route                | Purpose                  |
|--------|----------------------|--------------------------|
| GET    | `/messages/:room`    | Get all messages by room |

---

### 💾 Prisma Schema

Model includes `sentiment` field:

```prisma
model Message {
  id        Int      @id @default(autoincrement())
  content   String
  sender    String
  room      String
  sentiment String?  // positive, neutral, negative
  createdAt DateTime @default(now())
}
```

---

### ✅ Future Ideas
- Rate limiting per socket
- Command-based actions (e.g. `/clear`)
- User presence indicators