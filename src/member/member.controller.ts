import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { MemberService } from './member.service';

@Controller('/members')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Get('/')
  @ApiOkResponse({
    description: 'Return list members.',
  })
  getMembers() {
    return this.memberService.getAllMembers();
  }
}
