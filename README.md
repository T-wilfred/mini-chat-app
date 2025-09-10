# MiniChat AI

A modern, clean chatbot interface built with Next.js, React, and TypeScript.

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

## Integration with Backend

To connect with your backend API, you need to modify the `sendToBackend` function in [pages/index.tsx](file:///Users/macbookpro2018/Downloads/Minichat/pages/index.tsx).

**Locate this section in [pages/index.tsx](file:///Users/macbookpro2018/Downloads/Minichat/pages/index.tsx):**

```typescript
// Function to send message to backend
const sendToBackend = async (message: string) => {
  // TODO: Replace with your actual backend endpoint
  const response = await fetch('YOUR_BACKEND_ENDPOINT_HERE', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Add any required headers here (e.g., Authorization)
    },
    body: JSON.stringify({
      // Adjust this payload according to your backend requirements
      message: message,
      // You can include other data like conversation history if needed
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  
  // Adjust this according to your backend response format
  // For example, if your backend returns { response: "text" }, use data.response
  // If it returns just the text, use data directly
  return data.response || data.reply || data.text || data.message || JSON.stringify(data);
};
```

**Replace `'YOUR_BACKEND_ENDPOINT_HERE'` with your actual backend URL.**

For example:
```typescript
const response = await fetch('https://your-api.example.com/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_TOKEN', // If required
  },
  body: JSON.stringify({
    message: message,
    // Add any additional fields your backend expects
  }),
});
```

**Adjust the response handling according to your backend's response format:**
- If your backend returns `{ response: "Hello!" }`, use `data.response`
- If it returns `{ reply: "Hello!" }`, use `data.reply`
- If it returns just the string `"Hello!"`, use `data` directly

## Customization

### Styling

All styles are defined in [styles/globals.css](file:///Users/macbookpro2018/Downloads/Minichat/styles/globals.css) using CSS variables for easy customization:

- `--primary-color`: Main brand color
- `--secondary-color`: Accent color for user messages
- `--background-color`: Page background
- `--surface-color`: Chat container background

### UI Components

- **Chat Component**: Renders messages with distinct user/assistant styling
- **Typing Indicator**: Shows animated dots when AI is "thinking"
- **Welcome Message**: Friendly introduction for new users

## Deployment

Build the production version:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)