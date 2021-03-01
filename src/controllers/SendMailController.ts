import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { resolve } from "path";

import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";

class SendMailController {

  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body;
    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

    const users = getCustomRepository(UsersRepository);
    const surveys = getCustomRepository(SurveysRepository);
    const surveysUsers = getCustomRepository(SurveysUsersRepository);

    const userExists = await users.findOne({ email });

    if (!userExists) {
      return res.status(400).json({
        error: "User doesn't exists!"
      });
    }

    const surveyExists = await surveys.findOne({ id: survey_id });

    if (!surveyExists) {
      return res.status(400).json({
        error: "Survey doesn't exists!"
      });
    }

    const variables = {
      name: userExists.name,
      title: surveyExists.title,
      description: surveyExists.description,
      user_id: userExists.id,
      link: process.env.URL_MAIL
    }

    const surveyUserExists = await surveysUsers.findOne({
      where: [{user_id: userExists.id}, {value: null}],
      relations: ["user", "survey"],
    });

    if (surveyUserExists) {
      await SendMailService.execute(email, surveyExists.title, variables, npsPath);
      return res.json(surveyUserExists);
    }

    const surveyUser = surveysUsers.create({
      user_id: userExists.id,
      survey_id
    })

    await surveysUsers.save(surveyUser);

    

    
    
    await SendMailService.execute(email, surveyExists.title, variables, npsPath);

    return res.json(surveyUser);

  }

}

export { SendMailController }