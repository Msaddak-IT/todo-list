import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Bet, BetRelations, User} from '../models';
import {MatchRepository} from './match.repository';
import {UserRepository} from './user.repository';

export class BetRepository extends DefaultCrudRepository<
  Bet,
  typeof Bet.prototype.id,
  BetRelations
> {

  public readonly user: BelongsToAccessor<User, typeof Bet.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('MatchRepository') protected matchRepositoryGetter: Getter<MatchRepository>,
  ) {
    super(Bet, dataSource)

    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
  async findTotalcoinsByMatchId(matchId: string): Promise<number> {
    //calculating all the bets put on a match
    const matchById = await this.find({
      where: {
        matchId: matchId
      },
    })
    const totalCoins = matchById.reduce((sum, bet) => sum + bet.coins, 0)
    return totalCoins

  }
  async findTotalCoinsByMatchIdAndBetType(matchId: string, betType: any): Promise<number> {
    const matchBets = await this.find({
      where: {
        matchId: matchId,
        betType: betType,
      },
    })
    const totalCoinsOnMatchAndBetType = matchBets.reduce((sum, bet) => sum + bet.coins, 0)
    return totalCoinsOnMatchAndBetType
  }
}
