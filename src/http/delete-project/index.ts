import * as arc from '@architect/functions';
import { ProjectRepository } from '../../shared/repositories/project';
import { JsonResponse, UserErrorResponse } from '../../shared/responses';

async function http(req: any) {
  if (!req.query.id) return UserErrorResponse('No id specified');

  try {
    await ProjectRepository.deleteItemsByID(`Project#${req.query.id}`);
    return JsonResponse(null);
  } catch (e) {
    return UserErrorResponse(
      'We couldnt delete all items for this Partition Key'
    );
  }
}

exports.handler = arc.http.async(http);
