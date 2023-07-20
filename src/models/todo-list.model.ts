import {Entity, model, property, hasMany, hasOne} from '@loopback/repository';
import {Todo} from './todo.model';
import {TodoListImage} from './todo-list-image.model';

@model()
export class TodoList extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;


  constructor(data?: Partial<TodoList>) {
    super(data);
  }


  @hasMany(() => Todo)
  todos: Todo[];

  @hasOne(() => TodoListImage)
  image: TodoListImage;

  @hasOne(() => TodoListImage)
  todoListImage: TodoListImage;
  @property({
    type:'string',
    required:false,
  })
  color:string
}

export interface TodoListRelations {
  // describe navigational properties here
}

export type TodoListWithRelations = TodoList & TodoListRelations;
