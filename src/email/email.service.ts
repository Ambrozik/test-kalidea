import { ID } from '@nestjs/graphql';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { EmailEntity } from './email.entity';
import { Equal, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { EmailId, IAddEmail, IEmail } from './email.interfaces';
import { UserService } from '../user/user.service';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailEntity)
    private readonly emailRepository: Repository<EmailEntity>,
    private userService: UserService,
  ) {}

  get(id: EmailId): Promise<IEmail> {
    return this.emailRepository.findOneBy({ id: Equal(id) });
  }

  getWithOption(where: any) {
    return this.emailRepository.find({
      where,
      order: { address: 'asc' },
    });
  }

  async getUser(id: string) {
    const user = await this.userService.get(id);
    return user;
  }

  async add(email: IAddEmail) {
    const user = await this.userService.get(email.userId);
    if (!!user) {
      if (user.status === 'active') {
        const addedEmail = await this.emailRepository.insert({
          ...email,
        });
        const emailId = addedEmail.identifiers[0].id;
        return emailId;
      } else {
        throw new BadRequestException('ne peux etre ajouté');
      }
    }
  }
}
