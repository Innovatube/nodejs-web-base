import React from 'react';

import {
  Progress,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { withRouter } from 'react-router';
import importApi from '../../../../api/api-user.import';

class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.cancelSubmitRouteSetting = this.cancelSubmitRouteSetting.bind(this);
  }

  cancelSubmitRouteSetting() {
    importApi.cancelSubmitRoute({
      task_id: this.props.jobId,
    });
    this.props.setProcessing(false);
    this.props.handleSetJobId(0);
    this.props.handleCancelRouteSetting();
    this.props.history.replace('/import-file');
  }

  render() {
    const { t } = this.props;

    return (
      <React.Fragment>
        <div className="import-file__menu" />
        <div
          className="import-file__content"
        >
          {!this.props.processing ? (
            <div className="import-file__upload-content">
              <p className="import-file__paragraph">{t('please_import_file')}<a href="/template/template.zip" className="import-file__download">{' '}{t('download_file_template')}</a></p>
              <div className="import-file__button" onClick={this.props.toggleConfigUpdateModal}>
                <div className="import-file__symbol"><i className="fas fa-file-upload" />{t('import')}</div>
              </div>
            </div>
          ) : (
            <div className="import-file__progress-content">
              <div className="clone">
                <div className="percent"><p className="percent-text">0</p><span className="import-file__shape" /></div>
                <Progress barClassName="import-file__inner-progress" value="0" className="import-file__progress" color="white" />
              </div>
              <p className="import-file__progress-paragraph">{t('calculating_the_best')}</p>
              <button onClick={this.cancelSubmitRouteSetting} type="button" className="import-file__progress--cancel">{t('cancel')}</button>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(translate('upload')(Upload));
Upload.propTypes = {
  processing: PropTypes.bool,
  toggleConfigUpdateModal: PropTypes.func,
  setProcessing: PropTypes.func,
  jobId: PropTypes.number,
  handleSetJobId: PropTypes.func,
  t: PropTypes.func,
  history: PropTypes.object,
  handleCancelRouteSetting: PropTypes.func,
  // testName: PropTypes.string,
};
