import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Userhistory, UserhistoryRelations} from '../models';

export class UserhistoryRepository extends DefaultCrudRepository<
  Userhistory,
  typeof Userhistory.prototype.idHistory,
  UserhistoryRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Userhistory, dataSource);
  }
}
