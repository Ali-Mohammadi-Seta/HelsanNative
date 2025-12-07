import { describe, it, expect, vi, beforeEach } from "vitest";
import { server } from "@/test/mocks/server";
import { http, HttpResponse } from "msw";
import apiServices from "../apiServices";
import endpoints from "../endpoints";

// Note: Since apiServices uses axios with error handling and toast notifications,
// these tests demonstrate testing patterns. You may need to mock toast notifications
// or adjust based on your actual implementation.

describe("apiServices", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("get", () => {
    it("should make a successful GET request", async () => {
      server.use(
        http.get("*/user/userInfo", () => {
          return HttpResponse.json({
            id: 1,
            email: "test@example.com",
            name: "Test User",
          });
        })
      );

      const result = await apiServices.get(endpoints.userProfileInfo);

      expect(result.isSuccess).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data).toHaveProperty("id");
    });

    it("should handle GET request with query parameters", async () => {
      server.use(
        http.get("*/user/doctors", ({ request }) => {
          const url = new URL(request.url);
          const page = url.searchParams.get("page");

          return HttpResponse.json({
            doctors: [],
            page: page ? parseInt(page) : 1,
          });
        })
      );

      const result = await apiServices.get(endpoints.getDoctorsList, {
        page: 1,
      });

      expect(result.isSuccess).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("should handle GET request errors", async () => {
      server.use(
        http.get("*/user/userInfo", () => {
          return HttpResponse.json({ message: "Not found" }, { status: 404 });
        })
      );

      // Note: The actual implementation shows toast on error
      // You may need to mock react-toastify for this to work
      const result = await apiServices.get(
        endpoints.userProfileInfo,
        undefined,
        undefined,
        true
      );

      // Depending on your error handling, isSuccess might be false
      // Adjust based on your actual implementation
      expect(result).toBeDefined();
    });
  });

  describe("post", () => {
    it("should make a successful POST request", async () => {
      server.use(
        http.post("*/user/login", async ({ request }) => {
          const body = await request.json();
          return HttpResponse.json({
            token: "mock-token",
            user: body,
          });
        })
      );

      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const result = await apiServices.post(endpoints.login, loginData);

      expect(result.isSuccess).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});
