import { WorkspaceMember } from 'src/application/core/entities/workspace-member';

export class WorkspaceMemberPresenter {
  static toHTTP(workspaceMember: WorkspaceMember) {
    return {
      userId: workspaceMember.getUserId(),
      workspaceId: workspaceMember.getWorkspaceId(),
      role: workspaceMember.getRole(),
      createdAt: workspaceMember.getCreatedAt(),
      updatedAt: workspaceMember.getUpdatedAt(),
    };
  }
}
