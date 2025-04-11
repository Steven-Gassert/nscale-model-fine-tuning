"use client";

import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wizard } from "@/components/ui/wizard";
import { createNewJob } from "./actions";
import { STEP_IDS, STEP_ORDER } from "./page";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReactNode } from "react";
import { FormIncrementInput } from "@/components/ui/form-increment-input";
import { FeatureCard } from "@/components/ui/card";
import { useModels } from "./models-context";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { WorkflowFormData, workFlowSchema } from "./schema";
import { Loader } from "lucide-react";
import { ErrorMessage } from "@/components/ui/errorMessage";

type WorkflowFields = keyof WorkflowFormData;

interface FormStep {
  id: string;
  title: string;
  description?: string;
  component: ReactNode;
  continueCTA: ReactNode;
}

export function CreateNewJobForm() {
  const form = useForm<WorkflowFormData>({
    resolver: zodResolver(workFlowSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      baseModel: "",
      epochs: 1,
      evaluationEpochs: 0,
      warmupEpochs: 0,
      learningRate: 0,
    },
  });

  const availableModels = useModels();
  const currentModelDisplayName =
    availableModels?.find((model) => model.id === form.watch("baseModel"))
      ?.displayName || "";

  const inputStyles = "max-w-full md:max-w-96"; // This is equivalent to 24rem in Tailwind

  const formSteps: FormStep[] = [
    {
      id: STEP_IDS.SET_UP,
      title: "Set up your run",
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 grid-rows-2 grid-flow-col gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    className={inputStyles}
                    placeholder="fine-tuning-job-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="baseModel"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Base model</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a base model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        {model.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ),
      continueCTA: (
        <NextStepButton fields={["name", "baseModel"]}>
          Next: Configure
        </NextStepButton>
      ),
    },
    {
      id: STEP_IDS.CONFIGURE,
      title: "Configure your run",
      description:
        "Adjust these parameters to control how your model learns, balances performance, and prevents overfitting during fine-tuning. See the docs for guidance on setting these parameters for optimal fine-tuning.",
      component: (
        <div className="grid grid-cols-2 grid-rows-2 gap-6">
          <FormIncrementInput
            name="epochs"
            label="Epochs"
            description="Number of times the model sees the full dataset during training"
            min={1}
            step={1}
          />
          <FormIncrementInput
            name="evaluationEpochs"
            label="Evaluation Epochs"
            description="How often the model is evaluated during training"
            min={0}
            step={1}
          />
          <FormIncrementInput
            name="warmupEpochs"
            label="Warmup Epochs"
            description="Gradually increases the learning rate at the start of training"
            min={0}
            step={1}
          />
          <FormField
            control={form.control}
            name="learningRate"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Learning Rate</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className={inputStyles}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    step="0.01"
                    min={0}
                    max={1}
                  />
                </FormControl>
                <FormDescription>
                  Controls how much the model updates during training
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ),
      continueCTA: (
        <NextStepButton
          fields={[
            "epochs",
            "evaluationEpochs",
            "warmupEpochs",
            "learningRate",
          ]}
        >
          Next: Review
        </NextStepButton>
      ),
    },
    {
      id: STEP_IDS.REVIEW,
      title: "Review your job",
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <ReviewCard
              logo={
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  📝
                </div>
              }
              title={form.watch("name")}
            />
            <ReviewCard
              logo={
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  🤖
                </div>
              }
              title="Model"
              description={[currentModelDisplayName]}
            />
            <ReviewCard
              logo={
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  ⚙️
                </div>
              }
              title="Training Configuration"
              description={[
                `${form.watch("epochs")} training epochs`,
                `${form.watch("evaluationEpochs")} evaluation epochs`,
                `${form.watch("warmupEpochs")} warmup epochs`,
                `${form.watch("learningRate")} learning rate`,
              ]}
            />
          </div>
        </div>
      ),
      continueCTA: (
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader className="animate-spin" />
              Starting fine-tuning...
            </>
          ) : (
            "Start fine-tuning"
          )}
        </Button>
      ),
    },
  ];

  const callAndHandleCreateFormErrors = async (data: WorkflowFormData) => {
    const result = await createNewJob(data);
    console.log("result", result);
    if (result?.fieldErrors) {
      // Set field-level errors
      Object.entries(result.fieldErrors).forEach(([field, message]) => {
        form.setError(field as keyof WorkflowFormData, { message });
      });
    } else if (result?.formError) {
      // Set form-level error using root error if there was a problem creating the job on the server
      form.setError("root", {
        type: "server",
        message: result.formError,
      });
    }
    // If no result, the redirect has happened
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(callAndHandleCreateFormErrors)}>
        {form.formState.errors.root?.message && (
          <ErrorMessage error={form.formState.errors.root.message} />
        )}
        <Wizard steps={formSteps} />
      </form>
    </Form>
  );
}

interface ReviewCardProps {
  logo: React.ReactNode;
  title: string;
  description?: string[];
  className?: string;
}

function ReviewCard({
  logo,
  title,
  description = [],
  className = "",
}: ReviewCardProps) {
  return (
    <FeatureCard leftContent={logo} className={className}>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium">{title}</h3>
        {description.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {description.map((desc, index) => (
              <span key={index}>
                {index > 0 && <span className="mx-1">•</span>}
                {desc}
              </span>
            ))}
          </div>
        )}
      </div>
    </FeatureCard>
  );
}

interface NextStepButtonProps {
  children: ReactNode;
  fields: WorkflowFields[];
}

function NextStepButton({ children, fields = [] }: NextStepButtonProps) {
  const form = useFormContext();
  const searchParams = useSearchParams();
  const currentStepId = searchParams.get("step") || STEP_ORDER[0];
  const currentStepIndex = STEP_ORDER.indexOf(
    currentStepId as (typeof STEP_ORDER)[number]
  );

  const router = useRouter();
  const handleNext = async () => {
    const isValid = await form.trigger(fields);
    if (isValid) {
      const nextStepId = STEP_ORDER[currentStepIndex + 1];
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", nextStepId);
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <Button type="button" onClick={handleNext}>
      {children}
    </Button>
  );
}
