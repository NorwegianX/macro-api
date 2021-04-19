export function JsonResponse(data: any) {
  return {
    cors: true,
    json: data,
  };
}

export function UserErrorResponse(data: any) {
  return {
    body: data,
    statusCode: 400,
    cors: true,
  };
}
