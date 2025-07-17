import { InferModel } from "drizzle-orm";
// import { courses } from "../../../shared/schema";

export type Course = {
  id: number;
  title: string;
  description: string;
  instructorId: number;
  createdAt?: Date;
  updatedAt?: Date;
};

// export type Course = InferModel<typeof courses>;
