import { createAuthClient } from "better-auth/react";
import { getAPIURL } from "@/components/const";

export const authClient = createAuthClient({
  baseURL: getAPIURL(),
});