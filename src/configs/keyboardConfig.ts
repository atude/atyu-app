import z from "zod";

export const zKeyboardsConfig = z.record(
  z.string(),
  z.object({
    key: z.string(),
    name: z.string(),
    qmkKb: z.string(),
    qmkKm: z.string(),
    dir: z.string(),
  })
);

export type KeyboardsConfig = z.infer<typeof zKeyboardsConfig>;
