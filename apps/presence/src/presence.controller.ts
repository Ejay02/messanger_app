import { Controller } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { SharedService, AuthGuard } from '@app/shared';

@Controller()
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly sharedService: SharedService,

    // TODO: remove
    private readonly authGuard: AuthGuard,
  ) {}

  @MessagePattern({ cmd: 'get-presence' })
  async addSubscriber(@Ctx() context: RmqContext) {
    await this.sharedService.acknowledgeMsg(context);

    // TODO: remove
    console.log('jwt log', this.authGuard.hasJwt);
    return this.presenceService.getHello();
  }
}
