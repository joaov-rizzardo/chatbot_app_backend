import { Workspace } from '../../entities/workspace';

export interface CreateWorkspaceProps {
  name: string;
  ownerId: string;
}
export abstract class WorkspaceRepository {
  abstract create({}: CreateWorkspaceProps): Promise<Workspace>;
  abstract findById(workspaceId: string): Promise<Workspace> | null;
}