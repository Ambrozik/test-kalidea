import { ID } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { EmailEntity } from './email.entity';
import { Equal, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { EmailId, IAddEmail, IEmail } from './email.interfaces';
import { IUser } from 'src/user/user.interfaces';
import { UserService } from 'src/user/user.service';
import { resolve } from 'path';
import { UserIdArgs } from 'src/user/user.types';

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
        return Error('ne peux etre ajouté');
      }
    }

    //   return this.userService.get(email.userId).then((user) => {
    //     if (user.status == 'active') {
    //       this.emailRepository
    //         .insert({
    //           ...email,
    //         })
    //         .then((r) => r.identifiers[0].ID);
    //     } else {
    //       return resolve("le user n'est pas active");
    //     }
    //   });
    // }
  }
}
