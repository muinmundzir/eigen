import { Controller, Get } from '@nestjs/common';

import { MemberService } from './member.service';

@Controller('/members')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Get('/')
  getMembers() {
    return this.memberService.getAllMembers();
  }
}
