import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Header from '../../components/Header/index';
import { StaticMap } from '../../components/Map';
import Upload from './Upload';
import RouteSettingModal from './RouteSettingModal';
import AlertModal from './EnforceChangePW/AlertModel';
import ChangePWModal from './EnforceChangePW/ChangePWModal';
import FilePasswordModal from './FilePasswordModal';
import ImportFileErrorModal from './ImportFileErrorModal';
import './importfile.css';

const DAY_LEFT_TO_ALERT = 15;

class ImportFile extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      openSettingModal: false,
      openPasswordModal: false,
      openAlertModal: false,
      openChangePWModal: false,
      processing: false,
      fileInfo: null,
      routeSettingErrors: null,
    };
    this.percent = 0;
    this.handleImportFile = this.handleImportFile.bind(this);
    this.handleSetProcessing = this.handleSetProcessing.bind(this);
    this.toggleRouteSettingModal = this.toggleRouteSettingModal.bind(this);
  }

  componentDidMount() {
    if (this.isAlertChangePW()) {
      this.setState({ openAlertModal: true });
    }
    const id = Number(this.props.match.params.id);
    const { reRoute } = this.props;
    if (!isNaN(id) && !reRoute) {
      setTimeout(() => {
        this.toggleConfigUpdateModal();
      }, 500);
    }
  }

  onAgreeChangePW = () => {
    this.setState({
      openAlertModal: false,
      openChangePWModal: true,
    });
  }

  /**
   * Get day left to force change password
   */
  getDayLeftToForceChangePW = () => moment
    .unix(localStorage.getItem('time_need_change_password'))
    .diff(moment.now(), 'days');

  /**
   * Show alert to remind change password
   *
   * @return {boolean}
   */
  isAlertChangePW = () => {
    const diff = this.getDayLeftToForceChangePW();

    return diff < DAY_LEFT_TO_ALERT
      && localStorage.getItem('change_password_enforcement') === 'true';
  };

  logout = (e) => {
    e.preventDefault();
    if (localStorage.getItem('email') && localStorage.getItem('token')) {
      localStorage.removeItem('email');
      localStorage.removeItem('token');
      this.props.history.push('/login');
    }
  }


  toggleConfigUpdateModal = (isUpdate) => {
    const id = Number(this.props.match.params.id);
    if (!isNaN(id) && this.state.openPasswordModal === true && !isUpdate) {
      this.props.history.push(`/display-route/${id}`);
    }
    this.setState({
      openPasswordModal: !this.state.openPasswordModal,
    });
  }

  toggleRouteSettingModal = (isUpdate) => {
    const id = Number(this.props.match.params.id);
    if (!isNaN(id) && this.state.openSettingModal === true && !isUpdate) {
      this.props.history.push(`/display-route/${id}`);
    }
    this.setState({
      openSettingModal: !this.state.openSettingModal,
    });
  }

  toggleAlertModal = () => {
    this.setState({
      openAlertModal: !this.state.openAlertModal,
    });
  }

  toggleChangePWModal = () => {
    this.setState({
      openChangePWModal: !this.state.openChangePWModal,
    });
  }

  handleSetJobId = (jobId) => {
    this.setState({
      jobId,
    });
  }


  handleCancelRouteSetting = () => {
    this.setState({
      fileInfo: null,
    });
  }

  handleRouteSettingErrors = (data) => {
    this.setState({
      routeSettingErrors: data,
    });
  }

  handleImportFile(data) {
    const newState = {
      openSettingModal: true,
      fileInfo: data,
    };
    this.setState(newState);
  }

  handleSetProcessing(stateProcess) {
    this.setState({
      processing: stateProcess,
    });
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }


  render() {
    const {
      fileInfo,
      jobId,
    } = this.state;
    const { reRoute, match } = this.props;

    return (
      <div className="import-file">
        <Header
          toggle={this.toggle}
          isOpen={this.state.isOpen}
          logout={this.logout}
          {...this.props}
        />
        <StaticMap />
        <Upload
          jobId={jobId}
          processing={this.state.processing}
          upload={this.importFile}
          setProcessing={this.handleSetProcessing}
          toggleConfigUpdateModal={this.toggleConfigUpdateModal}
          handleSetJobId={this.handleSetJobId}
          handleCancelRouteSetting={this.handleCancelRouteSetting}
        />
        <RouteSettingModal
          modal={this.state.openSettingModal}
          toggle={this.toggleRouteSettingModal}
          reRoute={reRoute}
          match={match}
          history={this.props.history}
          submitRouteSetting={this.handleSetJobId}
          setProcessing={this.handleSetProcessing}
          fileInfo={fileInfo}
          changeFileInfo={this.handleImportFile}
          handleRouteSettingErrors={this.handleRouteSettingErrors}
        />
        <FilePasswordModal
          modal={this.state.openPasswordModal}
          toggle={this.toggleConfigUpdateModal}
          upload={this.handleImportFile}
        />

        <AlertModal
          modal={this.state.openAlertModal}
          toggle={this.toggleAlertModal}
          onAgreeChangePW={this.onAgreeChangePW}
          dayLeftToForceChangePW={this.getDayLeftToForceChangePW()}
        />

        <ChangePWModal
          modal={this.state.openChangePWModal}
          toggle={this.toggleChangePWModal}
        />

        <ImportFileErrorModal
          errors={this.state.routeSettingErrors}
          handleRouteSettingErrors={this.handleRouteSettingErrors}
          setProcessing={this.handleSetProcessing}
          handleCancelRouteSetting={this.handleCancelRouteSetting}
          jobId={jobId}
        />

      </div>
    );
  }
}

export default ImportFile;
ImportFile.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  reRoute: PropTypes.bool,
};
