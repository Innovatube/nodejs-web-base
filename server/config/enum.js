export const JOB_TYPE = {
  master: 'master',
  general: 'general'
};

export const FILE_TEMPLATE = {
  master: 'master',
  general: 'general',
  master_report: 'master_report',
  detail_report: 'detail_report'
};

export const RUNNING_TYPE = {
  default: 'default',
  long_running: 'long_running'
};

export const FLEET_STATUS = {
  success: 'success',
  uncompleted: 'uncompleted'
};
export const FILE_STORAGE_TYPE = {
  local: 'local',
  s3: 's3',
};

export const FILE_TYPE = {
  excel: 'excel'
};

export const FILE_ACLS = {
  public: 'public-read',
  private: 'private'
};

export const FOLDER_LOCAL = {
  'public-read': '/public',
  private: ''
};

export const DROPOFFS = {
  droppoffs: 1,
  pickup: 0
};

export const VEHICLE_TYPE = {
  motorcycle: 1,
  car: 2,
  small_car: 4,
  truck: 8
};

export const PRIORITY = {
  default: '',
  high: 'high'
};

export const TASK_STATUS = {
  init: 'init',
  running: 'running',
  partial_running: 'partial_running',
  failed: 'failed',
  success: 'success',
  cancelled: 'cancelled'
};

export const ACTION = {
  create_routes: 'create_routes',
  change_sequence: 'change_sequence',
  reset_sequence: 'reset_sequence',
  move_unserved_to_new_route: 'move_unserved_to_new_route',
  move_unserved_to_exist_route: 'move_unserved_to_exist_route',
  move_served_to_new_route: 'move_served_to_new_route',
  move_served_to_exist_route: 'move_served_to_exist_route',
  reset_routes: 'reset_routes'
};
export const ERROR_LOGICTIC_CLIENT_CODE = {
  0: 'no_error',
  10: 'Post stops parameters wrong!',
  11: 'Stop\'s location invalid',
  12: 'Require post vehicles parameters at least 3 items',
  13: 'Post vehicles parameters wrong!',
  14: 'Post commons parameters wrong!',
  15: 'Post user parameters wrong!',
  16: 'Post job id parameters wrong!',
  20: 'Queue is full, Please try again!',
  21: 'Can not optimize route!',
  22: 'No this job in queue!, Please check your job_id and user!',
  23: 'Sorry, Your previous task has been processing',
  90: 'Sorry - we couldn\'t find a route for you today. Can you check your vehicle/stop inputs?',
  50: 'You have no permission!',
  51: 'Your account was expired!',
  52: 'Amount of vehicle exceed your quota!',
  53: 'Amount of stop exceed your quota!',
}
