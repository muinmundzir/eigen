import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Member } from './member.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member) private membersRepository: Repository<Member>,
  ) {}

  async getAllMembers(): Promise<Member[]> {
    return await this.membersRepository.find();
  }
}
