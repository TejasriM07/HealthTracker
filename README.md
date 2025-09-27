# Health Tracker

A comprehensive full-stack web application for tracking health statistics, setting goals, and visualizing progress through interactive charts and modern UI components.

## Features

### 🔐 Authentication
- Secure user registration and login
- JWT-based session management
- Protected routes for authenticated users

### 📊 Health Tracking
- Log daily health metrics including:
  - Workout type and duration
  - Water consumption
  - Sleep schedule
  - Blood pressure (for goals)
  - Heart rate (for goals)
  - Calories burnt (for goals)

### 🎯 Goal Setting
- Set comprehensive health goals for any date
- Track multiple health metrics in one goal
- Edit and delete existing goals
- Visual goal management interface

### 📈 Data Visualization
- Interactive charts using Chart.js
- Today's goals vs actual progress comparison
- Weekly activity trends and statistics
- Progress indicators and achievement badges

### 🎨 Modern UI/UX
- Clean, responsive design with Tailwind CSS
- Heroicons for consistent iconography
- Mobile-friendly interface
- Intuitive navigation and user experience

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Chart.js** and **react-chartjs-2** for data visualization
- **React Router** for navigation
- **Axios** for API communication
- **Heroicons** for icons

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **CORS** enabled for cross-origin requests

## Project Structure

```
health-tracker/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── pages/          # Main application pages
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Helper functions and utilities
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── middleware/         # Express middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── .env               # Environment variables
│   └── server.js          # Express server setup
└── package.json           # Root package.json with scripts
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd HealthTracker
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Environment Configuration
Create a `.env` file in the `server` directory:
```env
MONGODB_URI=mongodb://localhost:27017/healthtracker
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
NODE_ENV=development
PORT=5000
```

### 4. Database Setup
- Start MongoDB service on your machine
- The application will automatically create the database and collections

### 5. Start the Application
```bash
# From the root directory, start both client and server
npm run dev

# Or start them separately:
# Terminal 1 - Start the server
npm run server

# Terminal 2 - Start the client
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Goals
- `GET /api/goals` - Get all user goals
- `GET /api/goals/:date` - Get goal for specific date
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Entries
- `GET /api/entries` - Get all user entries
- `GET /api/entries/:date` - Get entry for specific date
- `GET /api/entries/today/comparison` - Get today's entry vs goal comparison
- `GET /api/entries/stats/weekly` - Get weekly statistics
- `POST /api/entries` - Create new entry
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry

## Pages Overview

### 1. Homepage (Dashboard)
- Hero section with app introduction
- Today's goals vs actual progress (bar chart)
- Weekly activity trends (line chart)
- Quick statistics cards
- Navigation to other sections

### 2. Goals Page
- Comprehensive goal setting form
- List of all created goals
- Edit and delete functionality
- Goal management interface

### 3. Today's Entry Page
- Simplified daily activity logging
- Real-time goal comparison
- Progress indicators
- Quick action buttons

## Development Scripts

```bash
# Start both client and server in development mode
npm run dev

# Start only the server
npm run server

# Start only the client
npm run client

# Build client for production
npm run build

# Install all dependencies (root, client, server)
npm run install-deps

# Start production server
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Built with ❤️ by Your Name

---

*Start your health tracking journey today with HealthTracker!*