import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import axios from 'axios';
import {DbDataSource} from '../datasources';
import {Match, MatchRelations, Bet} from '../models';
import {BetRepository} from './bet.repository';

export class MatchRepository extends DefaultCrudRepository<
  Match,
  typeof Match.prototype.id,
  MatchRelations
> {

  public readonly bets: HasManyRepositoryFactory<Bet, typeof Match.prototype.matchId>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('BetRepository') protected betRepositoryGetter: Getter<BetRepository>,
    ) {
    super(Match, dataSource);
    this.bets = this.createHasManyRepositoryFactoryFor('bets', betRepositoryGetter,);
    this.registerInclusionResolver('bets', this.bets.inclusionResolver);

  }
  async getMatchesByLeagueIdOrderedByDate(leagueId: number): Promise<Match[]> {
    const currentDate = new Date()
    const response = await axios.get(
      'https://www.openligadb.de/api/getmatchdata/${leagueId}/${currentDate}'
    );
    const matches: Match[] = response.data;
    matches.sort((a: Match, b: Match) => new Date(a.MatchDateTime).getTime() - (new Date(b.MatchDateTime).getTime()));
    return matches
  }

}
