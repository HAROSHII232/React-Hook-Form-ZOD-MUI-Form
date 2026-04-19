import { z } from "zod";
import { PATTERNS } from "../../constants";

export const schema = z
  .intersection(
    z.object({
      name: z.string().min(1, { message: "Name is required" }),
      email: z
        .string()
        .min(1, { message: "Email is required" })
        .refine((email) => PATTERNS.email.test(email), {
          message: "Email is invalid",
        }),
      states: z.array(z.string()).min(1).max(2),
      languages: z.array(z.string()),
      gender: z.string().min(1, { message: "Gender is required" }),
      skills: z
        .array(z.string())
        .max(2, { message: "You can select up to 2 skills" }),
      registrationDateAndTime: z.date(),
      formerEmploymentPeriod: z.array(z.date()).min(2).max(2),
      salaryRange: z.array(z.number()).min(2).max(2),
    }),

    z.discriminatedUnion("variant", [
      z.object({
        variant: z.literal("create"),
      }),
      z.object({
        variant: z.literal("edit"),
        id: z.string().min(1),
      }),
    ]),
  )
  .and(
    z.union([
      z.object({
        isTeacher: z.literal(false),
      }),
      z.object({
        isTeacher: z.literal(true),
        students: z.array(
          z.object({
            name: z
              .string()
              .min(1, { message: "Name is required" })
              .min(4, { message: "Name must be at least 4 characters long" }),
          }),
        ),
      }),
    ]),
  );

export type Schema = z.infer<typeof schema>;

export const defaultValues: Schema = {
  variant: "create",
  name: "",
  email: "",
  states: [],
  languages: [],
  gender: "",
  skills: [],
  registrationDateAndTime: new Date(),
  formerEmploymentPeriod: [new Date(), new Date()],
  salaryRange: [0, 100],
  isTeacher: false,
};
