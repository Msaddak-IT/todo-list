import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Bet,
  User,
} from '../models';
import {BetRepository} from '../repositories';

export class BetUserController {
  constructor(
    @repository(BetRepository)
    public betRepository: BetRepository,
  ) { }

  @get('/bets/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Bet',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User),
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Bet.prototype.id,
  ): Promise<User> {
    return this.betRepository.user(id);
  }
}
