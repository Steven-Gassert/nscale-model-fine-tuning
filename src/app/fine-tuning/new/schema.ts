import { z } from "zod";

export const workFlowSchema = z
  .object({
    name: z
      .string()
      .min(3, "Job name must be at least 3 characters long")
      .max(50, "Maximum 50 characters")
      .regex(
        /^[a-z0-9-]+$/,
        "Can only contain lowercase alphanumeric characters and dashes."
      ),
    baseModel: z.string().min(1, "Please select a base model"),
    epochs: z.number().min(1, "Training epochs must be at least 1"),
    evaluationEpochs: z.number().min(0, "Evaluation epochs must be at least 0"),
    warmupEpochs: z.number().min(0, "Warmup epochs must be at least 0"),
    learningRate: z
      .number()
      .min(0, "Learning rate must be at least 0")
      .max(1, "Learning rate can be at maximum 1"),
  })
  .refine(
    (data) => {
      return data.evaluationEpochs <= data.epochs;
    },
    {
      message: "Evaluation epochs cannot exceed training epochs",
      path: ["evaluationEpochs"],
    }
  )
  .refine(
    (data) => {
      return data.warmupEpochs <= data.epochs;
    },
    {
      message: "Warmup epochs cannot exceed training epochs",
      path: ["warmupEpochs"],
    }
  );

export type WorkflowFormData = z.infer<typeof workFlowSchema>;
