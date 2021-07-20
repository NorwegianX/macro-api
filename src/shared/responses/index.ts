export function JsonResponse(data: any = null) {
  return {
    cors: true,
    json: data,
  };
}

export function UserErrorResponse(data: any = 'Error message not implemented') {
  return {
    body: data,
    statusCode: 400,
    cors: true,
  };
}
