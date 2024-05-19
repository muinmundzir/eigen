import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';

import { MemberService } from './member.service';
import { CreateMember } from './dto/create-member.dto';

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

  @Post('/')
  @ApiOkResponse({
    description: 'Create new member.',
  })
  @ApiBadRequestResponse({
    description: 'Fail to create member.',
  })
  createMember(@Body() memberData: CreateMember) {
    return this.memberService.createMember(memberData);
  }
}
