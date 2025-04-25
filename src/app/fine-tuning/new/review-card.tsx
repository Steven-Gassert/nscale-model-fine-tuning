import { FeatureCard } from "@/components/ui/card";

interface ReviewCardProps {
  logo: React.ReactNode;
  title: string;
  description?: React.ReactNode[];
  className?: string;
}

export function ReviewCard({
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
