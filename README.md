# HouseBuilding AI Design System

An AI-integrated house design system that allows users to create and modify home designs from 2D floor plans to 3D models with real-time AI assistance.

## Features

- **Interactive 2D Floor Plan Editor**: Drag-and-drop walls, doors, windows, and rooms with real-time validation
- **AI-Powered Recommendations**: Get intelligent suggestions for layout optimization, space utilization, and design improvements
- **3D Model Generation**: Automatic conversion from 2D floor plans to interactive 3D models
- **Real-time Collaboration**: Work together with team members on designs
- **Measurement & Dimensioning**: Precise measurements with multiple unit support
- **Material Selection**: Choose and visualize different materials with AI suggestions
- **Export & Import**: Save and load designs in various formats

## Technology Stack

### Frontend
- React 18 with TypeScript
- Konva.js for 2D canvas interactions
- Three.js for 3D rendering
- Ant Design for UI components
- Zustand for state management
- Vite for build tooling

### Backend
- Node.js with NestJS framework
- PostgreSQL with TypeORM
- GraphQL API
- Redis for caching
- JWT authentication

### AI Services
- Python-based recommendation engine
- TensorFlow/PyTorch for design analysis
- RESTful API integration

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional)
- Python 3.9+ (for AI services)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/housebulding.git
   cd housebulding
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

5. **Set up the database**
   ```bash
   # Create PostgreSQL database
   createdb housebuilding

   # Run migrations (will be implemented)
   npm run migration:run
   ```

6. **Start the development servers**
   ```bash
   # Terminal 1 - Start backend
   cd backend
   npm run dev

   # Terminal 2 - Start frontend
   cd frontend
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api/docs

## Project Structure

```
housebulding/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   └── DesignCanvas/ # 2D canvas components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS/styling files
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # NestJS backend application
│   ├── src/
│   │   ├── entities/       # TypeORM database entities
│   │   ├── modules/        # Feature modules
│   │   ├── config/         # Configuration files
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── tsconfig.json
├── documentation/            # Project documentation
├── .env.example
└── README.md
```

## Usage

### Creating a Design

1. **Create a new project** from the dashboard
2. **Select the Wall Tool** to draw exterior and interior walls
3. **Add Doors and Windows** by selecting the appropriate tools
4. **Define Rooms** by clicking on enclosed spaces
5. **Add Measurements** to verify dimensions
6. **Get AI Recommendations** for layout optimization
7. **View in 3D** to see your design come to life

### Keyboard Shortcuts

- `Delete` - Remove selected elements
- `Ctrl+Z` - Undo last action
- `Ctrl+Y` - Redo last action
- `Escape` - Cancel current operation
- `G` - Toggle grid display
- `S` - Switch to select tool

## API Documentation

Once the backend is running, visit http://localhost:3001/api/docs for interactive API documentation.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

## Roadmap

- [x] Interactive 2D floor plan editor
- [x] Basic backend API structure
- [ ] 3D model generation and rendering
- [ ] AI recommendation service
- [ ] User authentication and authorization
- [ ] Real-time collaboration features
- [ ] Material library and rendering
- [ ] Advanced measurement tools
- [ ] Export to CAD formats
- [ ] Mobile-responsive design