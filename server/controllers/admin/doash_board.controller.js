import HttpStatus from 'http-status-codes';
import * as UserService from '../../services/user.service';
import * as JobService from '../../services/job.service';
import * as FileService from '../../services/file.service';

/**
 * Get information system
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
export async function index(req, res) {
  const totalUsers = await UserService.countByFitter({query: {}});
  const totalFiles = await FileService.countByFitter({query: {}});
  const totalJobs = await JobService.countByFitter({query: {}});
  return res
    .status(HttpStatus.OK)
    .json({
      error: false,
      data: {
        total_users: totalUsers,
        total_files: totalFiles,
        total_jobs: totalJobs,
      }
    });
}