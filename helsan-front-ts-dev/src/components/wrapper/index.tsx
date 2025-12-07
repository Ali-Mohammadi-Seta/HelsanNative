import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import store from "../../redux/store";
import GlobalErrorBoundary from "../errorBoundry/GlobalErrorBoundry";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { ToastProvider } from "../toast/ToastManager";

const Wrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ToastProvider
            defaults={{
              position: "topLeft",
              duration: 4000,
              closable: true,
            }}
            maxToastsPerCorner={4}
          >
            <GlobalErrorBoundary>{children}</GlobalErrorBoundary>
          </ToastProvider>
        </I18nextProvider>
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Wrapper;
