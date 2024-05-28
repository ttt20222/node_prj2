import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import bcrypt from 'bcrypt';
import { createUser, loginUser } from './joi.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const router = express.Router();

dotenv.config();

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
                status : 400,
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
            status : 201,
            message : '회원가입에 성공했습니다.',
            data : responseUser,
        });
    } catch(error) {
        next(error);
    }
})

//로그인 /auth/sign-in
router.post('/sign-in', async(req,res,next) => {
    try {
        const { email, password } = req.body;

        await loginUser.validateAsync(req.body);

        const user = await prisma.user.findFirst({
            where : { email }
        });

        if(!user){
            return res.status(401).json({
                status : 401,
                message : '인증 정보와 일치하는 사용자가 없습니다.'
            });
        }
        else if (!(await bcrypt.compare(password, user.password))){
            return res.status(401).json({
                status : 401,
                message : '비밀번호가 일치하지 않습니다.'
            });
        }

        const accesstoken = jwt.sign(
            {userId : user.userId},
            process.env.ACCESS_TOKEN_SECRET_KEY,
            { expiresIn : '12h'},
        );

        const refreshtoken = jwt.sign(
            {userId : user.userId},
            process.env.REFRESH_TOKEN_SECRET_KEY,
            { expiresIn : '7d'},
        );

        res.setHeader('accesstoken', `Bearer ${accesstoken}`);
        res.setHeader('refreshtoken', `Bearer ${refreshtoken}`);

        const hashRefreshToken = await bcrypt.hash(refreshtoken, 10);

        const existingToken = await prisma.tokens.findFirst({
            where: {
                userId: user.userId,
            },
        });

        if (existingToken) {
            await prisma.tokens.update({
                where: {
                    userId: user.userId,
                },
                data: {
                    refreshToken: hashRefreshToken,
                },
            });
        };

        await prisma.tokens.create({
            data: {
                userId: user.userId,
                refreshToken: hashRefreshToken,
            }
        });

        return res.status(200).json({
            status : 200,
            message : '로그인에 성공했습니다.',
            accesstoken,
            refreshtoken,
        });

    } catch(error) {
        next(error);
    }
})

export default router;