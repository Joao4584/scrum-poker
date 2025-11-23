"use server";

import {
  postIntegrationService,
  type IntegrationInput,
} from "../services/post-integration";
import { cookies } from "next/headers";
import { storageKey } from "@/modules/shared/config/storage-key";

export async function integrationAction(params: IntegrationInput) {
  try {
    const response = await postIntegrationService(params);
    const cookieStore = await cookies();
    cookieStore.set(`${storageKey}session`, response.accessToken);
  } catch {
    return {
      success: false,
      message: "An unexpected error occurred.",
    };
  }
  return {
    success: true,
    message: "Login successful.",
  };
}
