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

@Resolver(() => UserEmail)
export class EmailResolver {
  constructor(private _service: EmailService) {}
  @Query(() => UserEmail, { name: 'email' })
  getEmail(@Args({ name: 'emailId', type: () => ID }) emailId: string) {
    return this._service.get(emailId);
  }

  @Query(() => [UserEmail], { name: 'emailsList' })
  async getEmails(@Args() filters: EmailFiltersArgs): Promise<UserEmail[]> {
    throw new NotImplementedException();
  }

  @ResolveField(() => User, { name: 'user' })
  async getUser(@Parent() parent: UserEmail): Promise<User> {
    throw new NotImplementedException();
  }

  @Mutation(() => ID)
  addEmail(@Args() email: AddEmail): Promise<EmailId> {
    return this._service.add(email);
  }
}
