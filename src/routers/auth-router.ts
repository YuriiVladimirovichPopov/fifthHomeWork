import { Request, Response, Router } from "express";
import { userService } from "../domain/user-service";
import { sendStatus } from './send-status';

export const authRouter = Router ({})

authRouter.post('/login', async(req: Request, res: Response) => {
    const checkResult = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)
    return res.sendStatus(sendStatus.OK_200).send(checkResult)

})