import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";


class AnswerController {

  async execute(req: Request, res: Response) {
    const { value } = req.params;
    const { u } = req.query;

    const surveysUsers = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsers.findOne({id: String(u)});

    if (!surveyUser) {
      return res.status(400).json({
        error: "Resource doesn't exists!"
      });
    }

    surveyUser.value = Number(value);

    await surveysUsers.save(surveyUser);

    return res.json(surveyUser);
  }
}

export { AnswerController };