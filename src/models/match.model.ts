import {Entity, hasMany, model, property} from '@loopback/repository';
import {Bet} from './bet.model';

@model({settings: {strict: false}})
export class Match extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  matchId?: string;
  @property({
    type: 'number'
  })
  idSelected: number

  @property({
    type: 'date',
    required: true,
  })
  matchDateTime: Date;

  @property({
    type: 'string',
    required: true,
  })
  team1: string;

  @property({
    type: 'string',
    require: true,
  })
  team2: string;

  @property({
    type: 'number',
    default: '0',
  })
  scoreTeam1: number;

  @property({
    type: 'number',
    default: '0',
  })
  scoreTeam2: number;

  @property({
    type: 'string',
  })
  location?: string;

  @property({
    type: 'boolean',
    default: 'false'
  })
  selected?: boolean;

  @property({
    type: 'String'
  })
  startsAt: String

  @property({
    type: 'boolean',
    default: false
  })
  hasEnded: boolean


  @hasMany(() => Bet)
  bets: Bet[];
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Match>) {
    super(data);
  }
}

export interface MatchRelations {
  // describe navigational properties here
}

export type MatchWithRelations = Match & MatchRelations;
