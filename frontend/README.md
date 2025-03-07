# NewsAIo

A modern RSS reader with AI-powered article summaries.

## Features

- Modern, responsive UI built with React and Material-UI
- RSS feed management
- AI-powered article summaries using OpenAI or DeepSeek APIs
- Dark mode and font size customization
- Electron-based desktop application for Windows, macOS, and Linux

## Development

### Prerequisites

- Node.js 16+
- npm 7+

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

3. Run in development mode:
   ```
   npm run dev        # Run Vite dev server
   npm run electron:dev  # Run Electron with Vite dev server
   ```

### Building

```
npm run electron:build
```

This will create distributable packages in the `release` directory.

## API Integration

NewsAIo allows you to use your own API keys for AI summaries:

- OpenAI API: https://platform.openai.com/
- DeepSeek API: https://platform.deepseek.com/

Configure your API keys in the Settings page of the application.

## License

Apache License 2.0
