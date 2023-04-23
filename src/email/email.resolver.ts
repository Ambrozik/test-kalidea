import { NotImplementedException } from '@nestjs/common';
import { Mutation } from '@nestjs/graphql';
import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AddEmail, EmailFiltersArgs, UserEmail } from './email.types';
import { User } from '../user/user.types';
import { EmailService } from './email.service';
import { EmailId } from './email.interfaces';
import { Equal, FindOptionsWhere } from 'typeorm';
import { EmailEntity } from './email.entity';

@Resolver(() => UserEmail)
export class EmailResolver {
  constructor(private _service: EmailService) {}
  @Query(() => UserEmail, { name: 'email' })
  getEmail(@Args({ name: 'emailId', type: () => ID }) emailId: string) {
    return this._service.get(emailId);
  }

  @Query(() => [UserEmail], { name: 'emailsList' })
  async getEmails(@Args() filters: EmailFiltersArgs): Promise<UserEmail[]> {
    const where: FindOptionsWhere<EmailEntity> = {};

    if (filters.address) {
      if (filters.address.equal) {
        where.address = Equal(filters.address.equal);
      }
    }
    return this._service.getWithOption(where);
  }

  @ResolveField(() => User, { name: 'user' })
  async getUser(@Parent() parent: UserEmail): Promise<User> {
    return this._service.getUser(parent.userId);
  }

  @Mutation(() => ID)
  addEmail(@Args() email: AddEmail): Promise<EmailId> {
    return this._service.add(email);
  }
}
