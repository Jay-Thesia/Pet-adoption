# Pet Adoption Application

A full-stack pet adoption platform built with Node.js, Express, TypeScript, React, and MongoDB. Users can browse pets, apply for adoption, and admins can manage pets and adoption applications.

## Features

### Visitor
- View list of available pets
- Search pets by name or breed
- Filter pets by species, breed, and age
- View pet details
- Pagination on pet list

### User
- Register/Login with JWT authentication
- Apply to adopt available pets
- View own adoption applications and statuses

### Admin
- Add/Edit/Delete pets
- View all adoption applications
- Approve or reject applications
- Update pet status automatically or manually

## Tech Stack

### Backend
- **Node.js** with **Express**
- **TypeScript**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **Joi** for request validation
- **bcryptjs** for password hashing

### Frontend
- **React** with **TypeScript**
- **React Router** for navigation
- **Axios** for API calls
- **Yup** for form validation
- **React-hook-form** for form handling

## Project Structure

```
Pet-adopation-app/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth & validation middleware
│   │   ├── validations/    # Joi validation schemas
│   │   ├── types/          # TypeScript types
│   │   └── server.ts       # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── utils/          # Utility functions
│   │   ├── validations/    # Yup validation schemas
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pet-adoption
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

5. Build TypeScript:
```bash
npm run build
```

6. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

7. Create an admin user (optional):
```bash
# Using default credentials (admin@example.com / admin123)
npm run create-admin

# Using custom credentials
npm run create-admin <email> <password> <name>
# Example: npm run create-admin admin@mydomain.com mypassword123 "Admin Name"
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your API URL:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Pets
- `GET /api/pets` - Get all pets (with filters, search, pagination)
- `GET /api/pets/:id` - Get single pet by ID
- `POST /api/pets` - Create a new pet (Admin only)
- `PUT /api/pets/:id` - Update a pet (Admin only)
- `DELETE /api/pets/:id` - Delete a pet (Admin only)

### Adoptions
- `POST /api/adoptions` - Apply to adopt a pet (User only)
- `GET /api/adoptions/my-applications` - Get user's applications (User only)
- `GET /api/adoptions` - Get all applications (Admin only)
- `PUT /api/adoptions/:id/approve` - Approve application (Admin only)
- `PUT /api/adoptions/:id/reject` - Reject application (Admin only)

## Architecture

The project follows **separation of concerns** with a clean architecture:

- **Routes**: Define API endpoints and apply middleware
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Models**: Define database schemas
- **Validations**: Joi schemas for request validation
- **Middleware**: Authentication and authorization

## Validation

- **Backend**: Uses Joi for request validation
- **Frontend**: Uses Yup for form validation

## Authentication

JWT-based authentication with role-based access control:
- **User**: Can apply for pets and view own applications
- **Admin**: Can manage pets and all adoption applications

## Environment Variables

### Backend
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT expiration time
- `NODE_ENV` - Environment (development/production)

### Frontend
- `REACT_APP_API_URL` - Backend API URL

## Creating an Admin User

To create an admin user, use the seed script:

```bash
cd backend
npm run create-admin
```

This will create an admin user with default credentials:
- **Email**: admin@example.com
- **Password**: admin123
- **Name**: Admin User

You can also specify custom credentials:
```bash
npm run create-admin <email> <password> <name>
```

Example:
```bash
npm run create-admin admin@mydomain.com mypassword123 "Admin Name"
```

**Note**: If a user with the email already exists, the script will update their role to admin.

## Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run type-check` - Type check without building
- `npm run create-admin` - Create an admin user

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

