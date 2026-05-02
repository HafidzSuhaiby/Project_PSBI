import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import profileRoutes from './routes/profileRoutes.js'; // Diubah dari require ke import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware CORS
app.use(cors({
    origin: 'http://localhost:5173', // Sesuaikan dengan port Vite kamu
    credentials: true
}));

// 2. TINGKATKAN LIMIT PAYLOAD
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// 3. Routes
app.use('/api/auth', authRoutes);    // Endpoint: /api/auth/login, /api/auth/me, dll
app.use('/api/ai', aiRoutes);        // Endpoint: /api/ai/analyze, /api/ai/modules_ai
app.use('/api/profiles', profileRoutes); // Sekarang sudah aman menggunakan import

// Root Route
app.get('/', (req, res) => {
    res.send('Server Pynara Running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});