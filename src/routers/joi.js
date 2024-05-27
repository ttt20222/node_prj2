import Joi from 'joi';

export const createUser = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    passwordConfirm: Joi.string().required().min(6),
    name: Joi.string().required(),
});

export const loginUser = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
});