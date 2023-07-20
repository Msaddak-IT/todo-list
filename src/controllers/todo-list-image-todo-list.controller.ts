import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  TodoListImage,
  TodoList,
} from '../models';
import {TodoListImageRepository} from '../repositories';

export class TodoListImageTodoListController {
  constructor(
    @repository(TodoListImageRepository)
    public todoListImageRepository: TodoListImageRepository,
  ) { }

  @get('/todo-list-images/{id}/todo-list', {
    responses: {
      '200': {
        description: 'TodoList belonging to TodoListImage',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TodoList),
          },
        },
      },
    },
  })
  async getTodoList(
    @param.path.number('id') id: typeof TodoListImage.prototype.id,
  ): Promise<TodoList> {
    return this.todoListImageRepository.todoList(id);
  }
}
