import { Controller } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { SharedService } from '@app/shared';

@Controller()
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({ cmd: 'get-presence' })
  async addSubscriber(@Ctx() context: RmqContext) {
    await this.sharedService.acknowledgeMsg(context);

    return this.presenceService.getHello();
  }
}
