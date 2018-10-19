import React from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter, Button,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import moment from 'moment';
import Form from './Form/form';
import { getDefaultDatePicker } from '../../../util/date';
import { importApi, jobApi } from '../../../../api/api-user';
import validateInput, { mapApiFieldsToState } from '../validator';

const TIME_INTERVAL_CHECK_STATUS = 5000;

const defaultRouteSetting = {
  fileName: '',
  type: '',
  fileId: '',
  password: '',
  date: getDefaultDatePicker(),
  tollway: false,
  calculateMode: 'time',
  coefficient: '0.8',
  routingMode: 0,
  useConstraints: false,
  zonebased: false,
  dropToDrop: '',
  vehicleLimit: '',
  jobID: 0,
  errors: null,
};

class RouteSettingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      routeSetting: defaultRouteSetting,
      uploading: false,
    };
    this.timeoutCheckStatus = null;
    this.percent = 0;
    this.mapStateToRoutingMode = this.mapStateToRoutingMode.bind(this);
    this.handleSubmitRouteSetting = this.handleSubmitRouteSetting.bind(this);
    this.handleSettingRoute = this.handleSettingRoute.bind(this);
    this.checkStatusProgress = this.checkStatusProgress.bind(this);
    this.renderProgressBar = this.renderProgressBar.bind(this);
    this.setCheckProcessCheckJob = this.setCheckProcessCheckJob.bind(this);
  }

  componentDidMount() {
    const { reRoute } = this.props;
    const { id } = this.props.match.params;
    if (!isNaN(id) && reRoute) {
      this.getFileInfoByJobId(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { fileInfo } = nextProps;
    if (fileInfo) {
      this.setState({
        routeSetting: {
          ...this.state.routeSetting,
          fileName: fileInfo.fileName,
          type: fileInfo.type,
          fileId: fileInfo.fileId,
          password: fileInfo.password,
        },
        uploading: false,
      });
    } else {
      this.setState({
        routeSetting: defaultRouteSetting,
        uploading: false,
      });
    }
  }

  getFileInfoByJobId = async (id) => {
    const jobInfo = await jobApi.show(id);
    if (!jobInfo.error && jobInfo.data && jobInfo.data.job && jobInfo.data.job.file) {
      const { job } = jobInfo.data;
      const fileInfo = job.file;
      this.setState({
        routeSetting: {
          ...this.state.routeSetting,
          date: moment(job.date_depart),
          tollway: !!job.use_toll,
          calculateMode: (!!job.use_time_routing_mode) ? 'time' : 'distance',
          coefficient: Number(job.load_factor),
          routingMode: job.use_balance_vehicle_mode || 0,
          useConstraints: !!job.use_constraints,
          dropToDrop: job.distance_leg_limit || '',
          vehicleLimit: job.leg_limit || '',
          jobID: job.id,
          zonebased: job.use_system_zone === 1,
        },
      }, () => {
        this.props.changeFileInfo({
          fileName: fileInfo.original_file_name,
          type: fileInfo.template_type,
          fileId: fileInfo.id,
          password: '',
        });
      });
    }
  }

  setCheckProcessCheckJob = async (taskId, jobId) => {
    this.setState({
      uploading: true,
      jobId,
    }, () => {
      this.props.toggle(true);
      this.props.setProcessing(true);
      this.checkStatusProgress(taskId, jobId);
      this.props.submitRouteSetting(taskId);
    });
  }

  mapStateToRoutingMode = (mode) => {
    const type = Number(mode);
    switch (type) {
      case 0:
        return {
          use_balance_vehicle_mode: 0,
        };
      case 1:
        return {
          use_balance_vehicle_mode: 1,
        };
      case 2:
        return {
          use_balance_vehicle_mode: 0,
          use_system_zone: 1,
        };
      case 3:
        return {
          use_balance_vehicle_mode: 0,
          use_system_zone: 2,
        };
      default:
        return {};
    }
  }

  handleSettingRoute = (data) => {
    this.setState(prevState => ({
      ...prevState,
      routeSetting: {
        ...prevState.routeSetting,
        [data.path]: data.value,
      },
    }));
  }

  handleSubmitRouteErrors = (data) => {
    const errors = {};
    if (data.data) {
      Object.keys(data.data).map((key) => {
        const state = mapApiFieldsToState(key);
        errors[state] = data.data[key]; //eslint-disable-line

        return key;
      });
      this.setState({
        routeSetting: {
          ...this.state.routeSetting,
          errors,
        },
        uploading: false,
      });
    } else if (data.message) {
      errors.apiErrors = data;
      this.setState({
        routeSetting: {
          ...this.state.routeSetting,
          errors,
        },
        uploading: false,
      });
    }
  }

  handleSubmitRouteSetting = async () => {
    const { t } = this.props;
    const { routeSetting } = this.state;
    const { jobID } = routeSetting;
    const validationResult = validateInput(routeSetting);
    if (validationResult.date.length > 0) {
      validationResult.date[0] = t('date_can_not_be_empty');
      this.setState({
        routeSetting: {
          ...this.state.routeSetting,
          errors: validationResult,
        },
      });
    } else {
      const config = {
        file_id: routeSetting.fileId, // optional
        password: routeSetting.password, // optional
        date_depart: routeSetting.date.format('YYYY-MM-DD'),
        use_toll: routeSetting.tollway ? 1 : 0,
        use_time_routing_mode: routeSetting.calculateMode === 'time' ? 1 : 0,
        load_factor: routeSetting.coefficient,
        ...this.mapStateToRoutingMode(routeSetting.routingMode),
      };

      if (routeSetting.type === 'general') {
        if (routeSetting.dropToDrop !== '') {
          config.distance_leg_limit = routeSetting.dropToDrop;
        }
        if (routeSetting.vehicleLimit !== '') {
          config.leg_limit = routeSetting.vehicleLimit;
        }
        config.use_system_zone = routeSetting.zonebased ? 1 : 0;
      } else if (routeSetting.type === 'master') {
        config.use_constraints = routeSetting.useConstraints ? 1 : 0;
      }
      this.setState({
        uploading: true,
      });
      const data = (!isNaN(Number(jobID)) && Number(jobID) !== 0) ? await jobApi.update(
        jobID,
        config.date_depart,
        config.use_toll,
        config.use_time_routing_mode,
        config.use_balance_vehicle_mode,
        config.load_factor,
        config.distance_leg_limit || '',
        config.leg_limit || '',
        config.use_constraints || '',
        config.use_system_zone || '',
        routeSetting.type,
      ) : await importApi.submitRoute(config);
      if (data.error) {
        this.handleSubmitRouteErrors(data);
      } else {
        this.setCheckProcessCheckJob(data.data.task_id, data.data.job_id);
      }
    }
  }

  checkStatusProgress = async (id, jobId) => {
    try {
      const data = await importApi.checkStatusProgress({
        taskId: id,
      });
      if (!data.error && (data.data.status === 'running' || data.data.status === 'partial-running')) {
        if (data.data.progress && this.percent !== data.data.progress) {
          this.percent = data.data.progress;
          this.renderProgressBar(id);
        }
        this.timeoutCheckStatus = setTimeout(() => {
          this.checkStatusProgress(id, jobId);
        }, TIME_INTERVAL_CHECK_STATUS);
      } else if (!data.error && data.data.status === 'success') {
        clearTimeout(this.timeoutCheckStatus);
        this.percent = (this.percent !== 100) && 100;
        this.renderProgressBar(jobId);
      } else if (data.error) {
        this.props.handleRouteSettingErrors(data);
      }
    } catch (e) {
      if (!window.navigator.onLine) {
        this.timeoutCheckStatus = setTimeout(() => {
          this.checkStatusProgress(id, jobId);
        }, TIME_INTERVAL_CHECK_STATUS);
      }
    }
  }

  handleCloseModal = (isUpdate) => {
    this.setState({
      routeSetting: defaultRouteSetting,
      uploading: false,
    }, () => {
      this.props.toggle(!!isUpdate);
    });
  }

  renderProgressBar = (id) => {
    const progressBar = document.querySelector('.import-file__inner-progress');
    if (progressBar) {
      const percent = document.querySelector('.percent');
      const text = document.querySelector('.percent-text');
      if (this.percent >= 100) {
        progressBar.style.width = `${this.percent}%`;
        percent.style.left = `calc(${this.percent}% - 13px)`;
        text.innerHTML = `${this.percent * 1}%`;
        setTimeout(() => {
          this.setState({
            uploading: false,
            jobID: 0,
          }, () => {
            this.props.history.push(`/display-route/${id}`);
          });
        }, 2000);
      } else {
        progressBar.style.width = `${this.percent}%`;
        percent.style.left = `calc(${this.percent}% - 13px)`;
        text.innerHTML = `${this.percent * 1}%`;
      }
    } else if (this.timeoutCheckStatus) {
      clearTimeout(this.timeoutCheckStatus);
    }
  }

  render() {
    const { uploading, routeSetting } = this.state;
    const { t } = this.props;

    return (
      <Modal isOpen={this.props.modal} contentClassName="route-setting__modal" centered>
        <ModalHeader toggle={() => { this.handleCloseModal(false); }} className="route-setting__modal--header">{t('route_setting')}</ModalHeader>
        <ModalBody>
          <Form
            handleSettingRoute={this.handleSettingRoute}
            routeSetting={routeSetting}
            uploading={uploading}
          />
        </ModalBody>
        <ModalFooter className="route-setting__modal--footer">
          <Button
            style={{
              background: '#022f37',
              color: 'white',
              border: '1px solid #5D6164',
            }}
            onClick={() => { this.handleCloseModal(false); }}
            disabled={uploading}
          >{t('cancel')}
          </Button>{' '}
          <Button
            style={{
              background: '#FFFFFF',
            }}
            onClick={this.handleSubmitRouteSetting}
            disabled={uploading}
          >{t('routing')}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
export default (translate('routersetting')(RouteSettingModal));
RouteSettingModal.propTypes = {
  toggle: PropTypes.func,
  modal: PropTypes.bool,
  fileInfo: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
  setProcessing: PropTypes.func,
  submitRouteSetting: PropTypes.func,
  changeFileInfo: PropTypes.func,
  reRoute: PropTypes.bool,
  t: PropTypes.func,
  handleRouteSettingErrors: PropTypes.func,
};
