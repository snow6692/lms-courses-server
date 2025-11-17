import { NextFunction, Request, Response } from "express";

/**
 *
 * @param fn
 * @returns
 */
export const catchAsyncError = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
