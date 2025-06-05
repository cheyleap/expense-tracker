import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { UserRepositoryImpl } from '../repository/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userRepository: UserRepositoryImpl,
    private readonly userService: UserService,
  ) {}

  @Query(() => [User])
  getUsers() {
    return this.userRepository.find();
  }

  @Query(() => User)
  getUserById(@Args('id') id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  @Mutation(() => User)
  createUser(@Args('createUserDto') createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Mutation(() => User)
  updateUser(
    @Args('id') id: number,
    @Args('updateUserDto') updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }
}
