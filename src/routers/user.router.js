import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import authMiddleware from '../middlewares/require-access-token.middleware.js';

const router = express.Router();

//내 정보 조회 /users
router.post('/', authMiddleware, async (req, res, next) => {
    const { userId } = req.user;

    const user = await prisma.user.findFirst({
        where : { userId: +userId },
        select : {
            userId: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return res.status(201).json({
        status: 201,
        message: '내 정보 조회에 성공했습니다.',
        data : user,
    });
})

export default router;