import { ReactNode } from "react";

interface PageLayoutProps {
  header?: ReactNode;
  children: ReactNode;
}

export function PageLayout({ header, children }: PageLayoutProps) {
  return (
    <div
      className={`min-h-screen mx-5 mt-5 md:mx-10 md:mt-10 lg:mx-20 lg:mt-20 flex justify-center`}
    >
      <div className="w-full max-w-7xl">
        {/* Header section */}
        {header && <header className="mb-4 md:mb-6 lg:mb-8">{header}</header>}

        {/* Body section */}
        <main>{children}</main>
      </div>
    </div>
  );
}
