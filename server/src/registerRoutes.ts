
import { Express } from "express";
import userRouter from "./modules/users/user.routes";
import courseRouter from "./modules/courses/course.routes";
import jobRouter from "./modules/jobs/job.routes";
import applicationRouter from "./modules/applications/application.routes";
// import scholarshipRouter from "./modules/scholarships/scholarship.routes";
// import partnerRouter from "./modules/partners/partner.routes";
// import testimonialRouter from "./modules/testimonials/testimonial.routes";

export const registerRoutes = async (app: Express) => {
  app.use("/api/users", userRouter);
  app.use("/api/courses", courseRouter);
  app.use("/api/jobs", jobRouter);
  app.use("/api/applications", applicationRouter);
  // app.use("/api/scholarships", scholarshipRouter);
  // app.use("/api/partners", partnerRouter);
  // app.use("/api/testimonials", testimonialRouter);

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });
};


