import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import config from './config';
import authRoutes from './routes/auth';
import petRoutes from './routes/pets';
import adoptionRoutes from './routes/adoptions';

const app = express();

// Middleware
// CORS configuration to allow frontend requests
const allowedOrigins = ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in the allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true, // Allow cookies/auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allowed headers
  exposedHeaders: ['Authorization'], // Headers that can be accessed by the frontend
  preflightContinue: false, // Pass the CORS preflight response to the next handler
  optionsSuccessStatus: 204 // Provide a status code to use for successful OPTIONS requests
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/adoptions', adoptionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Connect to MongoDB
mongoose.connect(config.mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any)
.then(() => console.log('MongoDB connected'))
.catch((err: Error) => console.error('MongoDB connection error:', err));

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

