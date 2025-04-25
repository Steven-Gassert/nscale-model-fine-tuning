import { Model, ServerSideResponse } from "@/lib/api";
import { use } from "react";
import { ReviewCard } from "./review-card";
import { useFormContext } from "react-hook-form";
import { WorkflowFormData } from "./schema";
import { FormControl, FormMessage } from "@/components/ui/form";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BaseModelPromise {
  modelsPromise: Promise<ServerSideResponse<Model[]>>;
}

export function BaseModelSelect({ modelsPromise }: BaseModelPromise) {
  const { control } = useFormContext<WorkflowFormData>();
  const modelsResponse = use(modelsPromise);
  const availableModels = modelsResponse.isSuccess ? modelsResponse.data : [];

  return (
    <FormField
      control={control}
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
  );
}

interface BaseModelReviewListenerProps {
  models: Model[];
}
function BaseModelReviewListener({ models }: BaseModelReviewListenerProps) {
  const { watch } = useFormContext<WorkflowFormData>();
  const baseModelId = watch("baseModel");
  const selectedModel = models.find((model) => model.id === baseModelId);
  const displayName = selectedModel?.displayName || "";

  return <>{displayName}</>;
}

export function BaseModelReview({ modelsPromise }: BaseModelPromise) {
  const modelsResponse = use(modelsPromise);
  const models = modelsResponse.isSuccess ? modelsResponse.data : [];

  return (
    <ReviewCard
      logo={
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          🤖
        </div>
      }
      title="Model"
      description={[
        <BaseModelReviewListener key="model-name" models={models} />,
      ]}
    />
  );
}
