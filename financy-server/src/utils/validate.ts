import { z } from "zod";

export const validate = <T extends z.ZodType>(
  schema: T,
  data: unknown,
): z.infer<T> => {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }

  return result.data;
};
