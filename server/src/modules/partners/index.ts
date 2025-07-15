export * from "../partners/partners.routes";
export * from "../partners/partners.controller";
export * from "../partners/partners.service";
export * from "../partners/partners.schema";
export * from "../partners/partners.model";
export * from "../partners/partners.analytics";
export * from "../partners/partners.broadcaster";

import { users, jobs, analytics } from "../modules/modules";

users.controller.createUser(...)
jobs.service.findJobs(...)
analytics.log("user_registered", { ... })

