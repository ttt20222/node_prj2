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

//이력서 목록 조회 /resume
router.get('/created_at', authMiddleware, async (req, res, next) => {
    try {
        const { sort } = req.query;
        const { userId } = req.user;
        
        const sortOrder = sort ? sort.toLowerCase() : 'desc';
        const orderBy = sortOrder === 'asc' ? 'asc' : 'desc';

        const resume = await prisma.resumes.findMany({
            select : {
                resumeId: true,
                user: {
                    select: {
                        name: true,
                    },
                },
                title: true,
                content: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
            where : {
                userId: +userId,
            },
            orderBy:{
                createdAt: orderBy
            },
        });

        if(!resume) {
            return res.status(200).json({
                status: 200,
                message: '일치하는 값이 없습니다.',
                data: [],
            })
        };

        return res.status(201).json({
            status: 201,
            message: '이력서 목록 조회에 성공했습니다.',
            data: resume
        });
    } catch (error){
        next(error);
    }
})

export default router;