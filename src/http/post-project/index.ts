import * as arc from '@architect/functions';
import ProjectRepository from '@/repositories/project';
import { JsonResponse, UserErrorResponse } from '@/responses';
async function http(req: any) {
  //FIXME, seperate filter for better error handling
  if (!req.body) {
    return UserErrorResponse('Missing body update');
  }

  const { pk, sk, ...attr } = req.body;
  const updatedItem = await ProjectRepository.updateItemByID(pk, sk, attr);
  if (!updatedItem) {
    return UserErrorResponse("We couldn't update your item");
  } else {
    return JsonResponse(null);
  }
}

exports.handler = arc.http.async(http);
