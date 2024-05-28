import { prisma } from '../utils/prisma.util.js';

export const requireRoles = (roles) => async (req, res, next) => {
    try {
        const { userId } = req.user;

        const user = await prisma.user.findFirst({
            where: {userId: +userId},
            select: {role:true}
        });

        if(!user || !roles.includes(user.role)){
            return res.status(403).json({
                status: 403,
                message: '접근 권한이 없습니다.',
            });
        }
        
        next();
        
    } catch(error){
        next(error);
    }
}