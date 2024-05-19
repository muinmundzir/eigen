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
    try {
      return await this.membersRepository.find({
        relations: ['borrowedBooks'],
      });
    } catch (error) {
      throw error;
    }
  }

  async findMember(id: string): Promise<Member> {
    try {
      return await this.membersRepository.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
