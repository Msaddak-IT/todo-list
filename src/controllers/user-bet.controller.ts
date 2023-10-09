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
  User,
  Bet,
} from '../models';
import {UserRepository} from '../repositories';

export class UserBetController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/bets', {
    responses: {
      '200': {
        description: 'Array of User has many Bet',
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
    return this.userRepository.bets(id).find(filter);
  }

  @post('/users/{id}/bets', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Bet)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bet, {
            title: 'NewBetInUser',
            exclude: ['id'],
            optional: ['user']
          }),
        },
      },
    }) bet: Omit<Bet, 'id'>,
  ): Promise<Bet> {
    return this.userRepository.bets(id).create(bet);
  }

  @patch('/users/{id}/bets', {
    responses: {
      '200': {
        description: 'User.Bet PATCH success count',
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
    return this.userRepository.bets(id).patch(bet, where);
  }

  @del('/users/{id}/bets', {
    responses: {
      '200': {
        description: 'User.Bet DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Bet)) where?: Where<Bet>,
  ): Promise<Count> {
    return this.userRepository.bets(id).delete(where);
  }
}
