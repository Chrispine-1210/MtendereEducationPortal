// src/utils/response.ts
import { Response } from "express";

export const handleResponse = (
    res: Response,
    statusCode: number,
    message: string,
    data: any = {}
) => {
    return res.status(statusCode).json({ success: true, message, data });
};
