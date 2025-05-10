// routes/trivia.js
import express from 'express';
import { generateQuestion } from '../controllers/triviaController.js';

export const router = express.Router();

router.post('/generate', generateQuestion);
