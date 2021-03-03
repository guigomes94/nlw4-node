import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NpsController {
  async execute(req: Request, res: Response) {
    const { survey_id } = req.params;

    const surveysUsers = getCustomRepository(SurveysUsersRepository);

    const result = await surveysUsers.find({ survey_id });

    const detractors = result.filter( r => r.value != null && r.value <= 6).length;

    const promoters = result.filter(r => r.value != null && r.value >= 9).length;

    const passives = result.filter(r => r.value > 6 && r.value < 9).length;

    const totalAnswers = result.length;

    const calculate = (((promoters - detractors) / totalAnswers) * 100).toFixed(2);

    return res.json({
      detractors,
      promoters,
      passives,
      totalAnswers,
      nps: calculate
    })

  }
}

export { NpsController };