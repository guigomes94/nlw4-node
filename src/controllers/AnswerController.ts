import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";


class AnswerController {

  async execute(req: Request, res: Response) {
    const { value } = req.params;
    const { u } = req.query;

    const surveysUsers = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsers.findOne({id: String(u)});

    if (!surveyUser) {
      throw new AppError("Resource doesn't exists!");
    }

    surveyUser.value = Number(value);

    await surveysUsers.save(surveyUser);

    return res.json(surveyUser);
  }

  async listAll(req: Request, res: Response) {

    const surveysUsers = getCustomRepository(SurveysUsersRepository);

    const all = await surveysUsers.find();

    return res.json(all);

  }
}

export { AnswerController };