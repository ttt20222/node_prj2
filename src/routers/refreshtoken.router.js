import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma.util.js';
import refreshMiddleware from '../middlewares/require-refresh-token.middleware.js';

const router = express.Router();

//refresh토큰 재발급 /tokens/refresh
router.post('/refresh', refreshMiddleware, async (req, res, next) => {
  const { userId } = req.user;

  const accesstoken = jwt.sign(
    { userId: userId },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: '12h' }
  );

  const refreshtoken = jwt.sign(
    { userId: userId },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: '7d' }
  );

  res.setHeader('accesstoken', `Bearer ${accesstoken}`);
  res.setHeader('refreshtoken', `Bearer ${refreshtoken}`);

  const hashRefreshToken = await bcrypt.hash(refreshtoken, 10);

  await prisma.tokens.update({
    where: {
      userId: +userId,
    },
    data: {
      refreshToken: hashRefreshToken,
    },
  });

  return res.status(200).json({
    status: 200,
    message: '토큰 재발급에 성공했습니다.',
    accesstoken,
    refreshtoken,
  });
});

//로그아웃 /tokens/sign-out
router.delete('/sign-out', refreshMiddleware, async (req, res, next) => {
  const { userId } = req.user;

  await prisma.tokens.delete({
    where: { userId: +userId },
  });

  return res.status(200).json({
    status: 200,
    message: '로그아웃에 성공했습니다.',
    data: {
      id: userId,
    },
  });
});

export default router;
