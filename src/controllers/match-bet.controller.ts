import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Match,
  Bet,
} from '../models';
import {MatchRepository} from '../repositories';

export class MatchBetController {
  constructor(
    @repository(MatchRepository) protected matchRepository: MatchRepository,
  ) { }

  @get('/matches/{id}/bets', {
    responses: {
      '200': {
        description: 'Array of Match has many Bet',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Bet)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Bet>,
  ): Promise<Bet[]> {
    return this.matchRepository.bets(id).find(filter);
  }

  @post('/matches/{id}/bets', {
    responses: {
      '200': {
        description: 'Match model instance',
        content: {'application/json': {schema: getModelSchemaRef(Bet)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Match.prototype.matchId,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bet, {
            title: 'NewBetInMatch',
            exclude: ['id'],
            optional: ['matchId']
          }),
        },
      },
    }) bet: Omit<Bet, 'id'>,
  ): Promise<Bet> {
    return this.matchRepository.bets(id).create(bet);
  }

  @patch('/matches/{id}/bets', {
    responses: {
      '200': {
        description: 'Match.Bet PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bet, {partial: true}),
        },
      },
    })
    bet: Partial<Bet>,
    @param.query.object('where', getWhereSchemaFor(Bet)) where?: Where<Bet>,
  ): Promise<Count> {
    return this.matchRepository.bets(id).patch(bet, where);
  }

  @del('/matches/{id}/bets', {
    responses: {
      '200': {
        description: 'Match.Bet DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Bet)) where?: Where<Bet>,
  ): Promise<Count> {
    return this.matchRepository.bets(id).delete(where);
  }
}
