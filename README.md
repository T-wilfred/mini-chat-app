# MiniChat AI

A modern, clean chatbot interface built with Next.js, React, and TypeScript.

**You can view the live site here**
https://mini-chat-app-production.up.railway.app

## Features

- 🎨 Clean, modern UI with smooth animations
- 💬 Real-time chat interface with message history
- 🔄 Smooth scrolling to latest messages
- ⏳ Typing indicators for AI responses
- 📱 Fully responsive design
- 🧠 Easy integration with backend APIs

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
minichat/
├── components/
│   └── Chat.tsx          # Chat component with message rendering
├── pages/
│   ├── index.tsx         # Main chat page
│   └── _app.tsx          # Custom App component
├── styles/
│   └── globals.css       # Global styles and CSS variables
├── types/
│   └── index.ts          # TypeScript types
├── utils/
│   └── reducer.ts        # Message state reducer
├── package.json          # Project dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Deployment

Build the production version:

```bash
npm run build
```

Start the production server:

```bash
npm start
```