import { http, HttpResponse } from "msw";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const handlers = [
  // Auth endpoints
  http.post(`${API_URL}/user/login`, () => {
    return HttpResponse.json({
      token: "mock-jwt-token",
      user: {
        id: 1,
        email: "test@example.com",
        name: "Test User",
      },
    });
  }),

  http.get(`${API_URL}/user/usersStatus`, () => {
    return HttpResponse.json({
      isLoggedIn: true,
      user: {
        id: 1,
        email: "test@example.com",
      },
    });
  }),

  http.get(`${API_URL}/user/userInfo`, () => {
    return HttpResponse.json({
      id: 1,
      email: "test@example.com",
      name: "Test User",
      roles: ["user"],
    });
  }),

  // EMR endpoints
  http.get(`${API_URL}/emr/temp/self`, () => {
    return HttpResponse.json({
      status: "active",
      data: [],
    });
  }),

  http.get(`${API_URL}/emrServer/userHealthInfo`, () => {
    return HttpResponse.json({
      healthData: [],
    });
  }),

  // Default catch-all for unhandled requests
  http.get(`${API_URL}/*`, () => {
    return HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),

  http.post(`${API_URL}/*`, () => {
    return HttpResponse.json({ message: "Not found" }, { status: 404 });
  }),
];

