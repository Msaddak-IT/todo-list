import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {User, UserRelations, Todo, Bet} from '../models';
import {TodoRepository} from './todo.repository';
import {BetRepository} from './bet.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {


  public readonly todos: HasManyRepositoryFactory<Todo, typeof User.prototype.id>;


  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('TodoRepository') protected todoRepositoryGetter: Getter<TodoRepository>, @repository.getter('BetRepository') protected betRepositoryGetter: Getter<BetRepository>,
  ) {
    super(User, dataSource);
    this.todos = this.createHasManyRepositoryFactoryFor('todos', todoRepositoryGetter,);
    this.registerInclusionResolver('todos', this.todos.inclusionResolver);
  }
  async findCredentials(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }
}
