import { Injectable } from '@nestjs/common';
import { EmailEntity } from './email.entity';
import { Equal, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { EmailId, IEmail } from './email.interfaces';
import { IUser } from 'src/user/user.interfaces';

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(EmailEntity)
    private readonly emailRepository: Repository<EmailEntity>,
  ) {}

  get(id: EmailId): Promise<IEmail> {
    return this.emailRepository.findOneBy({ id: Equal(id) });
  }
}
