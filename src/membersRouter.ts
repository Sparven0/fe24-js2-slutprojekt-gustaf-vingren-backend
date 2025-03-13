import { Router, NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { readMembers, writeMember } from "./memberFunctions";
import { validationResult } from "express-validator";

export const membersRouter = Router();

const memberValidation = [
  body('username').isString(),
  body('email').isEmail(),
  body('role').isString()
];

const handleValidationErrors = (req: Request, res: Response): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }
  return false;
};

membersRouter.post('/new-member', memberValidation, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (handleValidationErrors(req, res)) return;

  const newMember = req.body;
  try {
    await writeMember(newMember);
    res.json(newMember);
  } catch (error) {
    next(error);
  }
});

membersRouter.get('/members', async (req: Request, res: Response) => {
  const members = await readMembers();
  res.json(members);
});
