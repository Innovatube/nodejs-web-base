import BaseRepository from './BaseRepository';

class UserRepository extends BaseRepository {
  constructor() {
    super();
    this.PATH = '/admin';
  }
}

export default UserRepository;
