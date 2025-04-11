export function ErrorMessage({ error }: { error: string }) {
  return (
    <div className="mb-6 p-4 border border-destructive/50 bg-destructive/10 text-destructive rounded-lg">
      {error}
    </div>
  );
}
