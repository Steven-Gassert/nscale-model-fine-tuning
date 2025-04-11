import { fetchModels } from "@/lib/api";
import { ModelsProvider } from "./models-context";
import { PageLayout } from "@/components/ui/page-layout";

export default async function NewFineTuningJobProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const response = await fetchModels();
  if (response.isError) {
    return (
      <PageLayout header={<></>}>
        Error fetching models, please try again later.
      </PageLayout>
    );
  }

  return <ModelsProvider models={response.data}>{children}</ModelsProvider>;
}
