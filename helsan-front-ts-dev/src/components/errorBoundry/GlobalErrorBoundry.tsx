import { ErrorBoundary } from "react-error-boundary";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import CustomButton from "../button";

interface GlobalErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function GlobalErrorBoundary({
  children,
}: GlobalErrorBoundaryProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  );
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const { t } = useTranslation();
  return (
    <div role="alert" className="flex flex-col gap-2 items-start m-6">
      <div className="text-lg">{t("generalMessages.error")}:</div>
      <code className="text-red-500 p-4 border rounded-sm bg-gray-100 break-words">
        {error.message}
      </code>
      <CustomButton onClick={resetErrorBoundary}>{t("tryAgain")}</CustomButton>
    </div>
  );
}
