import { Request, response, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entities/User";

class UserController {

    async create(req: Request, res: Response) {
        const { name, email } = req.body;

        const users = getRepository(User);

        const emailAlreadyExists = await users.findOne({ email });

        if (emailAlreadyExists) {
            return res.status(400).json({
                error: "Email already in use!"
            });
        }

        const user = users.create({
            name, email
        })

        await users.save(user);

        return res.status(201).json(user);

    }

}

export { UserController }