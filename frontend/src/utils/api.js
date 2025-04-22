// frontend/src/utils/api.js
import axios from "axios";

// 1) Create an Axios instance for regular API calls
const api = axios.create({
  baseURL: "/",        // Vite proxy (for /auth, /users, etc.)
  withCredentials: true,
});

// 2) Interceptor: on 401, if it’s NOT the refresh endpoint, try one refresh + retry
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // Only attempt refresh if:
    //  - 401 Unauthorized
    //  - we haven't already retried
    //  - and this request isn't itself the /auth/refresh call
    if (
      status === 401 &&
      !original._retry &&
      !original.url.includes("/auth/refresh")
    ) {
      original._retry = true;
      try {
        // Use bare axios to avoid recursion through this interceptor
        await axios.post("/auth/refresh", {}, { withCredentials: true });
        // Now retry the original API call
        return api(original);
      } catch (refreshError) {
        // Refresh failed: reject and let front‑end handle (e.g., log out)
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;