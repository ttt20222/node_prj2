import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import authMiddleware from '../middlewares/require-access-token.middleware.js';
import { createResume } from './joi.js';

const router = express.Router();

//이력서 생성 /resume
router.post('/', authMiddleware, async (req, res, next) => {
    try{
        const { userId } = req.user;
        const { title, content } = req.body;

        await createResume.validateAsync(req.body);

        

    } catch (error){

    }
})

export default router;