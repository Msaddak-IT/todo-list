import {Entity, model, property} from '@loopback/repository';
import {User} from './user.model';
@model()
export class Bet extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string

  @property({
    type: 'string',
    require: true,
  })
  user: User;

  @property({
    type: 'number',
    require: true,
  })
  coins: number

  @property({
    type: 'string',

  })
  betType: 'Team1' | 'Draw' | 'Team2';

  @property({
    type: 'string'
  })
  matchId: string

  @property({
    type: 'number',
  })
  odds: number

  @property({
    type: 'boolean'
  })
  oddOpen: boolean



  constructor(data?: Partial<Bet>) {
    super(data);
  }
}

export interface BetRelations {
  // describe navigational properties here
}

export type BetWithRelations = Bet & BetRelations;
