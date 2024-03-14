import {
  BadRequestException,
  Controller,
  NotFoundException,
  Param,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserNotificationRepository } from 'src/application/core/interfaces/repositories/user-notification-repository';
import { NotificationIsNotWorkspaceInviteError } from 'src/application/use-cases/workspaces/errors/notification-is-not-workspace-invite-error';
import { WorkspaceInviteIsAlreadyAcceptedError } from 'src/application/use-cases/workspaces/errors/workspace-invite-is-already-accepted-error';
import { WorkspaceInviteIsNotValidError } from 'src/application/use-cases/workspaces/errors/workspace-invite-is-not-valid-error';
import { RespondWorkspaceInviteUseCase } from 'src/application/use-cases/workspaces/respond-workspace-invite-use-case';
import {
  UserAuthenticationGuard,
  UserRequest,
} from 'src/infra/guards/user-authentication.guard';

@Controller('workspaces')
export class RejectWorkspaceInviteController {
  constructor(
    private readonly responseWorkspaceInviteUseCase: RespondWorkspaceInviteUseCase,
    private readonly userNotificationRepository: UserNotificationRepository,
  ) {}

  @UseGuards(UserAuthenticationGuard)
  @Patch(':notificationId/reject')
  async handle(
    @Param('notificationId') notificationId: string,
    @Req() req: UserRequest,
  ) {
    const notification =
      await this.userNotificationRepository.findById(notificationId);
    if (!notification) {
      throw new NotFoundException({
        message: `Notification ${notificationId} not exists`,
        code: 'NOTIFICATION_NOT_EXISTS',
      });
    }
    if (notification.getUserId() !== req.userId) {
      throw new UnauthorizedException({
        message: 'User not authorized to access this resource',
        code: 'UNAUTHORIZED_USER',
      });
    }
    const result = await this.responseWorkspaceInviteUseCase.execute(
      notification,
      'reject',
    );
    if (result.isLeft()) {
      const error = result.value;
      if (error instanceof NotificationIsNotWorkspaceInviteError) {
        throw new BadRequestException({
          message: `Notification ${notificationId} is not a workspace invite`,
          code: 'NOTIFICATION_IS_NOT_WORKSPACE_INVITE',
        });
      }
      if (error instanceof WorkspaceInviteIsNotValidError) {
        throw new BadRequestException({
          message: `Workspace invite ${notificationId} is not valid`,
          code: 'WORKSPACE_INVITE_IS_NOT_VALID',
        });
      }
      if (error instanceof WorkspaceInviteIsAlreadyAcceptedError) {
        throw new BadRequestException({
          message: `Workspace invite ${notificationId} is already accepted`,
          code: 'WORKSPACE_INVITE_IS_ALREADY_ACCEPTED',
        });
      }
    }
    if (result.isRight()) {
      const updatedNotification = result.value;
      return updatedNotification;
    }
  }
}