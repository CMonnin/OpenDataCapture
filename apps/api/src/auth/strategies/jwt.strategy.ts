import { LoggingService } from '@douglasneuroinformatics/libnest/logging';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { JwtPayload } from '@opendatacapture/schemas/auth';
import type { GroupModel, UserModel } from '@prisma/generated-client';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AbilityFactory } from '@/ability/ability.factory';
import { ConfigurationService } from '@/configuration/configuration.service';
import { UsersService } from '@/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigurationService,
    private readonly abilityFactory: AbilityFactory,
    private readonly loggingService: LoggingService,
    private readonly usersService: UsersService
  ) {
    super({
      ignoreExpiration: config.get('NODE_ENV') === 'development',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('SECRET_KEY')
    });
  }

  /** This method is called after the token is validated by passport  */
  async validate({ username }: JwtPayload): Promise<Request['user']> {
    const user = await this.getUser(username);
    const ability = this.abilityFactory.createForUser(user);
    this.loggingService.verbose(`Validated Token for User: ${username}`);
    return { ...user, ability };
  }

  /** Returns the user associated with the JWT if they exist, otherwise throws UnauthorizedException */
  private async getUser(username: string) {
    let user: UserModel & { groups: GroupModel[] };
    try {
      user = await this.usersService.findByUsername(username);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException(`Token is valid, but user does not exist: ${username}`);
      }
      throw error;
    }
    return user;
  }
}
