import express from 'express';
import postsRoutes from '@/http/posts/routes';

export const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(postsRoutes);