import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import config from './config';
import authRoutes from './routes/auth';
import petRoutes from './routes/pets';
import adoptionRoutes from './routes/adoptions';

const app = express();

const allowedOrigins = ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/adoptions', adoptionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

mongoose.connect(config.mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any)
.then(() => console.log('MongoDB connected'))
.catch((err: Error) => console.error('MongoDB connection error:', err));

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

