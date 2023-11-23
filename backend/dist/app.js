import express from 'express';
import { config } from 'dotenv';
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
config();
const app = express();
// middlewares
app.use(cors({ origin: 'https://i-gpt.netlify.app', credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
// remove in prod
// app.use(morgan('dev'))
app.use('/api/v1', appRouter);
export default app;
//# sourceMappingURL=app.js.map