import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Member } from './member.entity';
import { CreateMember } from './dto/create-member.dto';

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

  async createMember(inputDto: CreateMember): Promise<Member> {
    try {
      const { code, name } = inputDto;

      const member = new Member();
      member.code = code;
      member.name = name;

      return await this.membersRepository.save(member);
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

  async penalizeMember(id: string): Promise<Member> {
    try {
      const member = await this.membersRepository.findOne({
        where: {
          id,
        },
      });

      member.penalizedAt = new Date();

      return await this.membersRepository.save(member);
    } catch (error) {
      throw error;
    }
  }
}
