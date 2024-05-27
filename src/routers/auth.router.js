import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import bcrypt from 'bcrypt';
import { createUser } from './joi.js';

const router = express.Router();

//회원가입 /auth/sign-up
router.post('/sign-up', async (req,res,next) => {
    try {
        const {email, password, passwordConfirm, name} = req.body;

        await createUser.validateAsync(req.body);
    
        const isExistUser = await prisma.user.findFirst({
            where: {
                email,
            },
        });
    
        if(isExistUser) {
            return res.status(400).json({
                status : 400,
                message : '이미 가입된 사용자입니다.'
            });
        }
    
        if(password != passwordConfirm) {
            return res.status(400).json({
                status: 400,
                message : '입력 한 두 비밀번호가 일치하지 않습니다.'
            })
        };
    
        const hashPassword = await bcrypt.hash(password, 10);
    
        const user = await prisma.user.create({
            data: {
                email, 
                password : hashPassword, 
                name},
        });
    
        const responseUser = {
            userId : user.userId,
            email : user.email,
            name : user.name,
            role : user.role,
            createdAt : user.createdAt,
            updatedAt : user.updatedAt,
        };
    
        return res.status(201).json({
            status: 201,
            message : '회원가입에 성공했습니다.',
            data : responseUser,
        });
    } catch(error) {
        next(error);
    }
})

export default router;