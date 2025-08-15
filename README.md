# MindCanvas 🧠✨

**AI-Powered Visual Knowledge Dashboard**

MindCanvas is a full-stack TypeScript application that transforms your notes, research, and project ideas into interactive visual knowledge maps. Think of it as Notion + Miro + AI summarization — but lighter and more personal.

## 🌟 Features

### 🤖 AI-Powered Intelligence
- **Smart Summarization**: Automatically generate concise summaries of your content
- **Keyword Extraction**: AI identifies key concepts and themes
- **Relationship Discovery**: Find hidden connections between different notes
- **Auto-Categorization**: Intelligent tagging and organization
- **AI Chat**: Ask questions about your knowledge base

### 🎨 Visual Knowledge Mapping
- **Interactive Mind Maps**: Drag-and-drop interface for creating knowledge networks
- **Multiple Layouts**: Hierarchical, force-directed, and circular layouts
- **Custom Styling**: Color-coded nodes and customizable themes
- **Real-time Collaboration**: Work together with team members
- **Export Options**: Share your maps as images or interactive links

### 📝 Smart Note Management
- **Multi-format Support**: Text, URLs, PDFs, images, and voice notes
- **Rich Content**: Markdown support with syntax highlighting
- **Smart Organization**: AI-powered categorization and tagging
- **Search & Filter**: Find information quickly with semantic search
- **Version History**: Track changes and revert when needed

### 🔐 User Management
- **Secure Authentication**: JWT-based authentication system
- **User Profiles**: Customizable profiles with avatars
- **Collaboration**: Share canvases and work together
- **Access Control**: Public and private knowledge maps

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **AI Integration**: OpenAI GPT & Google Gemini APIs
- **Vector Database**: Pinecone for semantic search
- **File Upload**: Multer for document processing

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development
- **Styling**: Tailwind CSS with custom components
- **State Management**: Zustand for lightweight state
- **Routing**: React Router v6
- **Visualization**: React Flow for mind maps
- **UI Components**: Custom component library
- **Forms**: React Hook Form with validation

### Development Tools
- **Linting**: ESLint with TypeScript support
- **Testing**: Jest for unit testing
- **Code Quality**: Prettier for formatting
- **Git Hooks**: Husky for pre-commit checks

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB 6.0+
- (Optional) OpenAI API key or Gemini API key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/mindcanvas.git
cd mindcanvas
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables:**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/mindcanvas

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# AI APIs (Optional - will use fallback if not provided)
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key

# Vector Database (Optional)
PINECONE_API_KEY=your-pinecone-api-key
PINECONE_ENVIRONMENT=your-environment
```

### 4. Start Development Servers
```bash
# Start both backend and frontend
npm run dev

# Or start them separately
npm run dev:backend    # Backend on port 5000
npm run dev:frontend   # Frontend on port 3000
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 📁 Project Structure

```
mindcanvas/
├── src/
│   ├── backend/           # Backend source code
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Express middleware
│   │   ├── utils/         # Utility functions
│   │   └── server.ts      # Main server file
│   └── frontend/          # Frontend source code
│       ├── src/
│       │   ├── components/    # React components
│       │   ├── pages/         # Page components
│       │   ├── store/         # State management
│       │   ├── api/           # API client
│       │   ├── hooks/         # Custom hooks
│       │   ├── utils/         # Utility functions
│       │   └── types/         # TypeScript types
│       ├── public/            # Static assets
│       └── package.json       # Frontend dependencies
├── package.json              # Backend dependencies
├── tsconfig.json             # TypeScript configuration
├── env.example               # Environment template
└── README.md                 # This file
```

## 🔧 Development

### Available Scripts

**Backend:**
```bash
npm run dev:backend      # Start development server
npm run build:backend    # Build for production
npm run start            # Start production server
npm run test             # Run tests
npm run lint             # Lint code
npm run lint:fix         # Fix linting issues
```

**Frontend:**
```bash
npm run dev:frontend     # Start development server
npm run build:frontend   # Build for production
npm run preview          # Preview production build
npm run lint             # Lint code
```

**Full Stack:**
```bash
npm run dev              # Start both servers
npm run build            # Build both for production
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and style enforcement
- **Prettier**: Consistent code formatting
- **Husky**: Git hooks for quality checks

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Production Build
```bash
# Build both backend and frontend
npm run build

# Start production server
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb://your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=https://yourdomain.com
```

### Docker Support (Coming Soon)
- Dockerfile for containerized deployment
- Docker Compose for local development
- Kubernetes manifests for scaling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Notes Endpoints
- `GET /api/notes` - List user notes
- `POST /api/notes` - Create new note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Canvas Endpoints
- `GET /api/canvas` - List user canvases
- `POST /api/canvas` - Create new canvas
- `PUT /api/canvas/:id/layout` - Update canvas layout

### AI Endpoints
- `POST /api/ai/summarize` - Generate AI summary
- `POST /api/ai/extract-keywords` - Extract keywords
- `POST /api/ai/find-relationships` - Find note relationships

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive input sanitization
- **Helmet Security**: Security headers and protection

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Flow**: For the excellent mind mapping library
- **Tailwind CSS**: For the utility-first CSS framework
- **OpenAI & Google**: For AI capabilities
- **MongoDB**: For the flexible document database

## 📞 Support

- **Documentation**: [docs.mindcanvas.com](https://docs.mindcanvas.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/mindcanvas/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/mindcanvas/discussions)
- **Email**: support@mindcanvas.com

---

**Built with ❤️ by the MindCanvas Team**

*Transform your knowledge into visual insights today!*
