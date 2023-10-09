import {Entity, belongsTo, model, property} from '@loopback/repository';
import {TodoList} from './todo-list.model';

@model()
export class Todo extends Entity {
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

  @property({
    type: 'string',
  })
  desc?: string;

  @property({
    type: 'boolean',
  })
  isComplete?: boolean;


  @property({
    type: 'Date',
    default: () => new Date(new Date().getTime())
  })
  createdAt: Date

  @belongsTo(() => TodoList)
  todoListId: string;
  // @belongsTo(() => TodoList)
  // todoListId: number;

  @property({
    type: 'number',
  })
  userId?: string;

  constructor(data?: Partial<Todo>) {
    super(data);
  }
}

export interface TodoRelations {
  // describe navigational properties here
}

export type TodoWithRelations = Todo & TodoRelations;
