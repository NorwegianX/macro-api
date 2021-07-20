import * as arc from '@architect/functions';
import { JsonResponse, UserErrorResponse } from '@/responses';
import { HttpRequest } from 'architect__functions';

export const handler = arc.http.async(async (req: HttpRequest) => {
  return {
    cors: true,
    headers: {
      'Access-Control-Allow-Headers': 'authorization, content-type',
      'Access-Control-Allow-Methods': '*',
    },
  };
});
