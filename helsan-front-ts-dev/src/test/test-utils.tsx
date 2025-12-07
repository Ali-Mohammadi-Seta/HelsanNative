import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router";
import { ConfigProvider } from "antd";
import faIR from "antd/lib/locale/fa_IR";
import i18n from "@/i18n";
import authReducer from "@/redux/reducers/authReducer";
import themeReducer from "@/redux/reducers/theme";
import userReducer from "@/redux/reducers/userReducer/userReducer";
import directionReducer from "@/redux/reducers/layoutDirection/layoutDirectionReducer";
import currentLocationReducer from "@/redux/reducers/currentLocationReducer";
import directionReducer2 from "@/redux/reducers/direction/directionReducer";

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Create a test store with default state
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      theme: themeReducer,
      user: userReducer,
      direction: directionReducer,
      currentLocation: currentLocationReducer,
      directionReducer: directionReducer2,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
};

interface AllTheProvidersProps {
  children: React.ReactNode;
  store?: ReturnType<typeof createTestStore>;
  queryClient?: QueryClient;
}

const AllTheProviders = ({
  children,
  store = createTestStore(),
  queryClient = createTestQueryClient(),
}: AllTheProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <ConfigProvider
            direction="rtl"
            locale={faIR}
            theme={{
              token: {
                fontFamily: "IRANSans",
                colorPrimary: "#16a34a",
              },
            }}
          >
            <BrowserRouter>{children}</BrowserRouter>
          </ConfigProvider>
        </I18nextProvider>
      </Provider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    store?: ReturnType<typeof createTestStore>;
    queryClient?: QueryClient;
  }
) => {
  const { store, queryClient, ...renderOptions } = options || {};
  return render(ui, {
    wrapper: ({ children }) => (
      <AllTheProviders store={store} queryClient={queryClient}>
        {children}
      </AllTheProviders>
    ),
    ...renderOptions,
  });
};

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };
export { createTestStore, createTestQueryClient };
