import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "../useAuth";
import apiServices from "@/services/apiServices";
import { createTestStore } from "@/test/test-utils";
import { Provider } from "react-redux";
import React from "react";

// Mock apiServices
vi.mock("@/services/apiServices", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("useAuth", () => {
  const mockStore = createTestStore({
    auth: {
      isLoggedIn: false,
      roles: [],
    },
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={mockStore}>{children}</Provider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with loading state", () => {
    (apiServices.get as any).mockResolvedValue({
      isSuccess: false,
      data: null,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Initially loading should be true
    expect(result.current.loading).toBe(true);
  });

  it("should set loading to false after authorization check", async () => {
    (apiServices.get as any).mockResolvedValue({
      isSuccess: true,
      data: {
        data: {
          isLogin: true,
          roles: { ourRoles: ["user"] },
        },
      },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it("should call checkAuthorize function", async () => {
    const mockResponse = {
      isSuccess: true,
      data: {
        data: {
          isLogin: true,
          roles: { ourRoles: ["user"] },
        },
      },
    };

    (apiServices.get as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(apiServices.get).toHaveBeenCalled();
  });

  it("should handle authorization check failure gracefully", async () => {
    (apiServices.get as any).mockResolvedValue({
      isSuccess: false,
      data: null,
      error: "Unauthorized",
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.checkAuthorize).toBeDefined();
  });
});

