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

        const resume = await prisma.resumes.create({
            data: {
                userId: +userId,
                title,
                content,
            }
        });

        const responseResume = {
            resumeId: resume.resumeId,
            userId : resume.userId,
            title : resume.title,
            content : resume.content,
            status : resume.status,
            createdAt : resume.createdAt,
            updatedAt : resume.updatedAt,
        };

        return res.status(201).json({
            staus: 201,
            message: '이력서 생성에 성공했습니다.',
            data: responseResume
        });

    } catch (error){
        next(error);
    }
})

export default router;