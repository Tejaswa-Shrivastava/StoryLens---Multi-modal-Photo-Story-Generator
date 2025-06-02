# StoryLens - AI Photo Story Generator

Transform your photos into magical stories with AI-powered creativity. Upload any image and watch as artificial intelligence creates captivating narratives with optional voice narration.

![StoryLens Demo](./generated-icon.png)

## 🌟 Features

### Core Functionality
- **Photo Upload**: Drag & drop or click to upload images (JPG, PNG up to 10MB)
- **AI Story Generation**: Advanced AI analyzes your photos and creates unique, engaging stories
- **Voice Narration**: Text-to-speech conversion brings your stories to life with natural-sounding audio
- **Real-time Processing**: Watch the AI work through visual processing indicators
- **Download & Share**: Export stories as text files or share directly

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Beautiful Interface**: Modern, clean design with smooth animations
- **Processing Feedback**: Visual indicators show AI progress through story generation steps
- **Audio Controls**: Full-featured audio player with playback speed control
- **Error Handling**: Graceful fallbacks ensure the app always works

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ installed
- A Hugging Face API key (for AI features)

### Installation

1. **Clone or download the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file or set the following environment variable:
   ```
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   ```

4. **Start the application**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5000`

### Getting a Hugging Face API Key

1. Visit [https://huggingface.co](https://huggingface.co)
2. Create a free account or sign in
3. Go to your profile settings → Access Tokens
4. Create a new token with read permissions
5. Copy the token and add it to your environment variables

## 💻 How to Use

### Basic Workflow

1. **Upload a Photo**
   - Drag and drop an image onto the upload area
   - Or click to browse and select a file
   - Supported formats: JPG, PNG (max 10MB)

2. **Watch the AI Work**
   - The app displays processing steps in real-time
   - Step 1: Analyzing your photo
   - Step 2: Generating creative story
   - Step 3: Creating audio narration (when API is available)

3. **Enjoy Your Story**
   - Read the generated story with custom title
   - Listen to AI-generated voice narration (when available)
   - Download the story as a text file
   - Share your story with others

### Interface Elements

- **Upload Area**: Central area for photo upload with visual feedback
- **Processing Display**: Shows current AI processing step with progress indicators
- **Story Display**: Beautiful presentation of generated story with metadata
- **Audio Player**: Full-featured player with speed controls and download options
- **Action Buttons**: Download, share, and create new story options

## 🛠 Technical Architecture

### Frontend (React + TypeScript)
- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **TailwindCSS** for responsive, modern styling
- **shadcn/ui** components for consistent design
- **TanStack Query** for efficient data fetching and caching
- **Wouter** for lightweight routing

### Backend (Node.js + Express)
- **Express.js** server with TypeScript
- **Multer** for secure file upload handling
- **Drizzle ORM** with PostgreSQL schema (using in-memory storage for demo)
- **Hugging Face API** integration for AI services

### AI Services
- **Image Analysis**: Uses advanced computer vision models to understand photo content
- **Story Generation**: Leverages language models to create unique narratives
- **Text-to-Speech**: Converts generated stories into natural-sounding audio

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # Utilities and API clients
│   │   └── hooks/         # Custom React hooks
│   └── index.html         # HTML entry point
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes and AI integration
│   ├── storage.ts        # Data storage interface
│   └── vite.ts           # Vite integration
├── shared/               # Shared TypeScript types and schemas
└── components.json       # shadcn/ui configuration
```

## 🎨 Key Components

### PhotoUpload
- Drag & drop file upload interface
- File validation (type, size)
- Preview functionality
- Upload progress indication

### ProcessingState
- Visual processing steps
- Loading animations
- Progress tracking

### StoryDisplay
- Formatted story presentation
- Metadata display (reading time, tags)
- Action buttons for download/share

### AudioPlayer
- Play/pause controls
- Progress scrubbing
- Playback speed adjustment
- Download functionality

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Database operations (if using PostgreSQL)
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `HUGGINGFACE_API_KEY` | API key for AI services | Yes |
| `NODE_ENV` | Environment (development/production) | No |
| `PORT` | Server port (default: 5000) | No |

## 🌐 Deployment

The application is designed to work seamlessly with Replit's deployment system:

1. Ensure all environment variables are set
2. The app will automatically build and deploy
3. Both frontend and backend run on the same port (5000)

For other platforms:
1. Build the frontend: `npm run build`
2. Set production environment variables
3. Start the server: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Upload fails with "No image file provided"**
- Ensure file is a valid image (JPG/PNG)
- Check file size is under 10MB
- Try refreshing the page

**AI story generation not working**
- Verify Hugging Face API key is set correctly
- Check your API key has proper permissions
- Ensure stable internet connection

**Audio not generating**
- Audio features require API access
- Check console for specific error messages
- Audio will be skipped if API is unavailable

### Getting Help

1. Check the browser console for error messages
2. Verify all environment variables are set
3. Ensure API keys have proper permissions
4. Check network connectivity

## 🎯 Future Enhancements

- Multiple AI model options for different story styles
- Custom voice selection for narration
- Story editing and customization
- Social sharing integration
- Story collections and history
- Multi-language support

---

Built with ❤️ using modern web technologies and AI