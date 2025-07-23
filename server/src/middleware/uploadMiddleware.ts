//server / src / middleware / uploadMiddleware.ts
import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3";
import { Request } from "express";
import path from "path";
import crypto from "crypto";

const storage = multer.memoryStorage(); // store in memory before upload to S3

export const upload = multer({ storage });

export const uploadToS3 = async (file: Express.Multer.File) => {
    const fileExt = path.extname(file.originalname);
    const fileName = `${crypto.randomUUID()}${fileExt}`;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};