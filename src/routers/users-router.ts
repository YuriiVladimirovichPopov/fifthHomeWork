import {Request, Response, Router } from "express";
import { sendStatus } from "./send-status";
import { authorizationValidation,
          inputValidationErrors } from "../middlewares/input-validation-middleware";
import { RequestWithParams } from '../types';
import { getByIdParam } from "../models/getById";
import { getPaginationFromQuery } from './helpers/pagination';
import { userService } from "../domain/user-service";
import { UserViewModel } from "../models/users/userViewModel";
import { PaginatedUser } from "../models/users/paginatedQueryUser";
import { createUserValidation } from "../middlewares/validations/users.validation";

export const usersRouter = Router({})

usersRouter.get('/', async (req: Request, res: Response) => {
    const pagination = getPaginationFromQuery(req.query)
    const allUsers: PaginatedUser<UserViewModel[]> = await userService.findAllUsers(pagination)
    
    return res.status(sendStatus.OK_200).send(allUsers);
  })

usersRouter.post('/',
  authorizationValidation,
  ...createUserValidation,
  async (req: Request, res: Response) => {
  const newUser = await userService.createUser(
    req.body.data, 
    req.body.password 
    ) 
  return res.status(sendStatus.CREATED_201).send(newUser)
})
  
usersRouter.delete('/:id', 
  authorizationValidation,
  inputValidationErrors, 
async (req: RequestWithParams<getByIdParam>, res: Response) => {
  const foundUser = await userService.deleteUserById(req.body.id);
  if (!foundUser) {
    return res.sendStatus(sendStatus.NOT_FOUND_404)
  }
  return res.sendStatus(sendStatus.NO_CONTENT_204)
})
