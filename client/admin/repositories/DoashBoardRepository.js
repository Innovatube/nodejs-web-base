import BaseRepository from '../../repositories/BaseRepository';

class DoashBoardRepository extends BaseRepository {
  constructor() {
    super();
    this.PATH = '/doash-board';
  }
}

export default DoashBoardRepository;
