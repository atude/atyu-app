import z from "zod";

// Selection of keys you can enable or disable
const zAtyuOptionMultiselectBoolean = z.object({
  type: z.literal("multiselect_boolean"),
  multiselectStruct: z.array(
    z.object({
      name: z.string(),
      key: z.string(),
      defaultValue: z.boolean(),
    })
  ),
  multiselectOptions: z
    .object({
      min: z.number().int().optional(),
      max: z.number().int().optional(),
    })
    .optional(),
});

// One key you can set a strict value on
const zAtyuOptionRadioNumber = z.object({
  type: z.literal("radio_number"),
  radioKey: z.string(),
  radioValues: z.array(
    z.object({
      name: z.string(),
      value: z.number().int(),
    })
  ),
  defaultValue: z.number().int(),
});

const zAtyuOptionSwitch = z.object({
  type: z.literal("switch"),
  key: z.string(),
  defaultValue: z.boolean(),
});

const zAtyuOptionUpdateGif = z.object({
  type: z.literal("update_gif"),
  defaultGifSpeed: z.number().int(),
});

const zAtyuChildOptionsStruct = z.union([
  zAtyuOptionMultiselectBoolean,
  zAtyuOptionRadioNumber,
  zAtyuOptionSwitch,
  zAtyuOptionUpdateGif,
]);

const zAtyuChildConfig = z.object({
  name: z.string(),
  desc: z.string().optional(),
  struct: zAtyuChildOptionsStruct,
});

const zAtyuConfigSection = z.object({
	name: z.string(),
	desc: z.string().optional(),
	key: z.string(),
	configurable: z.boolean(),
	enabledByDefault: z.boolean(),
	children: z.array(zAtyuChildConfig),
	notes: z.array(z.string()).optional(),
});

// Top level configs are all booleans
export const zAtyuConfig = z.array(zAtyuConfigSection);

export type AtyuOptionMultiselectBoolean = z.infer<typeof zAtyuOptionMultiselectBoolean>;
export type AtyuOptionRadioNumber = z.infer<typeof zAtyuOptionRadioNumber>;
export type AtyuOptionSwitch = z.infer<typeof zAtyuOptionSwitch>;
export type AtyuOptionUpdateGif = z.infer<typeof zAtyuOptionUpdateGif>;
type AtyuChildOptionsStruct = z.infer<typeof zAtyuChildOptionsStruct>;
export type AtyuChildConfig = z.infer<typeof zAtyuChildConfig>;
export type AtyuChildOptionsType = AtyuChildOptionsStruct["type"];
export type AtyuConfigSection = z.infer<typeof zAtyuConfigSection>;
export type AtyuConfig = z.infer<typeof zAtyuConfig>;
export type AtyuConfigMap = Record<string, AtyuConfig>;
