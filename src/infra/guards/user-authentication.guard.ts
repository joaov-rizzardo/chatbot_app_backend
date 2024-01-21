import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenGenerator } from 'src/application/core/interfaces/tokens/token-generator';

export interface UserRequest extends Request {
  userId: string;
}

@Injectable()
export class UserAuthenticationGuard implements CanActivate {
  constructor(private readonly tokenGenerator: TokenGenerator) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<UserRequest>();
    const token = this.extractTokenFromRequest(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    if ((await this.tokenGenerator.checkAccessToken(token)) === false) {
      throw new UnauthorizedException();
    }
    const data = await this.tokenGenerator.decodeAccessToken(token);
    request.userId = data.userId;
    return true;
  }

  private extractTokenFromRequest(request: UserRequest) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}