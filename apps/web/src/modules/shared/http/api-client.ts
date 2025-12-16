import { deleteCookie, getCookie } from "cookies-next";
import ky from "ky";

import { storageKey } from "../config/storage-key";

type ApiErrorResponse = {
  code?: string;
  message?: string;
  [key: string]: unknown;
};

const isServer = typeof window === "undefined";
const clientPrefix = "/backend";
const serverPrefix = process.env.BACKEND_URL ?? "http://localhost:4000";

export const api = ky.create({
  prefixUrl: isServer ? serverPrefix : clientPrefix,
  credentials: "include",
  hooks: {
    beforeRequest: [
      async (request) => {
        if (isServer) return;
        const token = getCookie(`${storageKey}session`);
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (response.status === 400 || response.status === 401) {
          let body: ApiErrorResponse = {};
          try {
            body = await response.clone().json<ApiErrorResponse>();
          } catch {
            // ignore JSON parse errors
          }

          if (response.status === 400) {
            // eslint-disable-next-line no-console
            console.warn("API 400", body);
          }

          if (
            response.status === 401 &&
            (body.code === "UNAUTHORIZED" || body.code === "UNAUTHENTICATED")
          ) {
            deleteCookie(`${storageKey}session`);
            if (!isServer) {
              window.location.href = "/auth";
            }
          }
        }
      },
    ],
  },
});
