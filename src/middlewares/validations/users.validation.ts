import { body } from "express-validator";
import { inputValidationErrors } from "../input-validation-middleware";


const loginValidation = body('login')
                                            .isString()
                                            .isLength({min: 3, max: 30})
                                            .trim()
                                            .withMessage('incorrect login')

const passwordValidation = body('password')
                                            .isString()
                                            .isLength({min: 6, max: 20})
                                            .trim()
                                            .withMessage('incorrect password')

const emailValidation = body('email')
                                            .isString()
                                            .trim()
                                            .withMessage('incorrect email')



export const createUserValidation = [loginValidation, passwordValidation, emailValidation, inputValidationErrors]
export const updateUserValidation = [loginValidation, passwordValidation, emailValidation, inputValidationErrors]