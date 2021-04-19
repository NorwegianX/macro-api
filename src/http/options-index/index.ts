import * as arc from "@architect/functions";
import { HttpRequest, HttpResponse } from "@architect/functions";

export const handler = arc.http.async(async (req: HttpRequest) => {
  return {
    cors: true,
    headers: {
      "Access-Control-Allow-Headers": "authorization, content-type",
      "Access-Control-Allow-Methods": "*",
    },
  };
});
