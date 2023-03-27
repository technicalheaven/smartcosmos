'use strict'
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { logger } from "../../../libs/logger";
import constants from '../constants';


export class Validator {
    rules: any
    constructor(rules: any) {
        this.rules = rules
    }

    makeValidation(key: string): any {
        try {
            if (!key) {
                throw new Error(`Invalid validator key '${key}' supplied.`)
            }

            this.rules[key]

            return [
                ...this.rules[key],
                (req: Request, res: Response, next: NextFunction) => {
                    const errors = validationResult(req)
                    if (!errors.isEmpty()) {
                        return res.status(constants.RESPONSE_STATUS.BAD_REQUEST).send({
                            errors: errors.array()
                        })
                    }
                    next()
                }
            ]
        } catch (err) {
            logger.error(err)
        }
    }
}