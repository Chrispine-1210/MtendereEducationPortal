import { emailQueue } from "../queues";

await emailQueue.add("sendWelcome", { email: newUser.email });
