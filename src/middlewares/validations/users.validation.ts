import { body } from "express-validator";
import { inputValidationErrors } from "../input-validation-middleware";
import { emailRegExp, loginRegExp } from "../../utils/regular-expressions";


const numberRegExp = new RegExp("^[a-zA-Z0-9_-]*$")

const loginValidation = body('login')
                                            .isString()
                                            .isLength({min: 3, max: 30})
                                            .matches(loginRegExp)
                                            .not()
                                            .matches(numberRegExp)
                                            .withMessage('incorrect login')

const passwordValidation = body('password')
                                            .isString()
                                            .isLength({min: 6, max: 20})
                                            .withMessage('incorrect password')

const emailValidation = body('email')
                                            .isString()
                                            .matches(emailRegExp)
                                            .withMessage('incorrect email')



export const createUserValidation = [loginValidation, passwordValidation, emailValidation, inputValidationErrors]
export const updateUserValidation = [loginValidation, passwordValidation, emailValidation, inputValidationErrors]