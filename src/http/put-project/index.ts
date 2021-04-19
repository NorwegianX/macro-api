import * as arc from '@architect/functions';
import { ProjectRepository } from '../../shared/repositories/project';
import { JsonResponse, UserErrorResponse } from '../../shared/responses';

async function http(req: any) {
  if (!req.query.user) return UserErrorResponse('No user specified');
  const [ok, data] = await ProjectRepository.create(req.query.user, req.body);
  if (!ok) {
    return UserErrorResponse(data);
  } else {
    return JsonResponse(data);
  }
}

exports.handler = arc.http.async(http);
