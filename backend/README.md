# SmartNav Backend API

A robust Node.js/Express backend for the SmartNav AI-powered shopping assistant, featuring user authentication, product management, AI integration, and shopping list functionality.

## 🚀 Features

### 🔐 Authentication & User Management
- JWT-based authentication
- User registration and login
- Profile management
- User preferences (language, dietary restrictions, budget)

### 📦 Product Management
- Comprehensive product database with MongoDB
- Advanced search and filtering
- Category and aisle-based organization
- Nutrition information and allergen tracking
- Product alternatives and recommendations

### 🤖 AI Integration
- Image recognition for product identification
- Chat-based AI assistant
- Product recommendations
- Multi-language support

### 🛒 Shopping List Management
- Create and manage shopping lists
- Add/remove items with quantities
- Check off items
- Persistent storage

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcryptjs
- **File Upload**: Multer
- **AI Services**: Google Cloud Vision, OpenAI
- **Image Storage**: Cloudinary

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy the environment example file and configure your variables:
```bash
cp env.example .env
```

Update `.env` with your configuration:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/smartnav

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Google Cloud Vision API (optional)
GOOGLE_CLOUD_PROJECT_ID=your-google-cloud-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json

# OpenAI Configuration (optional)
OPENAI_API_KEY=your-openai-api-key

# Cloudinary Configuration (optional)
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup
Start MongoDB and seed the database with sample data:
```bash
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### POST `/api/auth/login`
Login user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/profile`
Get current user profile (requires authentication)

#### PUT `/api/auth/preferences`
Update user preferences (requires authentication)
```json
{
  "language": "en",
  "dietaryRestrictions": ["vegetarian"],
  "budget": 100,
  "organicPreference": true
}
```

### Product Endpoints

#### GET `/api/products`
Get all products with pagination and filters
```
/api/products?page=1&limit=20&category=Fruits&search=apple&minPrice=1&maxPrice=5
```

#### GET `/api/products/:id`
Get product by ID

#### GET `/api/products/category/:category`
Get products by category

#### GET `/api/products/aisle/:aisle`
Get products by aisle

#### GET `/api/products/barcode/:barcode`
Get product by barcode

### AI Endpoints

#### POST `/api/ai/recognize-image`
Upload image for product recognition
```
Content-Type: multipart/form-data
Body: image file
```

#### POST `/api/ai/chat`
Chat with AI assistant
```json
{
  "message": "Where can I find apples?",
  "userId": "user_id",
  "context": "shopping"
}
```

#### GET `/api/ai/recommendations/:userId`
Get personalized product recommendations

### Shopping List Endpoints

#### GET `/api/shopping-list`
Get user's shopping lists (requires authentication)

#### POST `/api/shopping-list`
Create new shopping list (requires authentication)
```json
{
  "name": "Weekly Groceries",
  "items": [
    {
      "productId": "product_id",
      "quantity": 2
    }
  ]
}
```

#### POST `/api/shopping-list/:listId/items`
Add item to shopping list (requires authentication)

#### PUT `/api/shopping-list/:listId/items/:itemId`
Update item in shopping list (requires authentication)

#### DELETE `/api/shopping-list/:listId/items/:itemId`
Remove item from shopping list (requires authentication)

### User Endpoints

#### GET `/api/users/profile`
Get user profile (requires authentication)

#### PUT `/api/users/profile`
Update user profile (requires authentication)

## 🔧 Development

### Project Structure
```
src/
├── models/          # MongoDB schemas
├── routes/          # API route handlers
├── middleware/      # Custom middleware
├── services/        # Business logic
├── utils/           # Utility functions
└── server.ts        # Main server file
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

### Environment Variables
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT token expiration time
- `FRONTEND_URL` - Frontend URL for CORS

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Setup
Make sure to set all required environment variables in your production environment.

## 🔒 Security

- JWT authentication for protected routes
- Password hashing with bcryptjs
- CORS configuration
- Input validation and sanitization
- Error handling middleware

## 📝 License

This project is part of the SmartNav AI-powered shopping assistant.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository. 