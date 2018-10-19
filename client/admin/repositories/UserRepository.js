import BaseRepository from '../../repositories/BaseRepository';

class UserRepository extends BaseRepository {
  constructor() {
    super();
    this.PATH = '/users';
  }
}

export default UserRepository;
