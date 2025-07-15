export * from "../auth/auth.routes";
export * from "../auth/auth.controller";
export * from "../auth/auth.service";
export * from "../auth/auth.schema";
export * from "../auth/auth.model";
export * from "../auth/auth.analytics";
export * from "../auth/auth.broadcaster";

import { users, jobs, analytics } from "../modules/modules";

users.controller.createUser(...)
jobs.service.findJobs(...)
analytics.log("user_registered", { ... })

