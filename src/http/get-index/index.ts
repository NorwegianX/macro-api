import { HttpRequest } from "architect__functions";
import arc from "@architect/functions";

export async function handler(req: HttpRequest) {
  return {
    cors: true,
  };
}
