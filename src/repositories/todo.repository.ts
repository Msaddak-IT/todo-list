import {inject, } from '@loopback/core';
//import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
//import {Todo, TodoRelations, TodoList} from '../models';
import {Todo, TodoRelations} from '../models';

// import {TodoListRepository} from './todo-list.repository';

export class TodoRepository extends DefaultCrudRepository<
  Todo,
  typeof Todo.prototype.id,
  TodoRelations
> {



  constructor(
    @inject('datasources.db') dataSource: DbDataSource,){
      super(Todo,dataSource)
    }
  //    @repository.getter('TodoListRepository') protected todoListRepositoryGetter: Getter<TodoListRepository>,
  // ) {
  //   super(Todo, dataSource);
  //   this.todoList = this.createBelongsToAccessorFor('todoList', todoListRepositoryGetter,);
  //   this.registerInclusionResolver('todoList', this.todoList.inclusionResolver);
  // }
}
