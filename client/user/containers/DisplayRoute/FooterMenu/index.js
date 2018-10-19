import React from 'react';
import PropTypes from 'prop-types';
import {
  Popover,
  PopoverBody,
  ButtonGroup,
  Button as ButtonBootstrap,
  UncontrolledTooltip,
} from 'reactstrap';
import { translate } from 'react-i18next';
import Button from './button';
import ApiExport from '../../../../api/api-user.export';
import './index.css';


const styles = {
  container: {
    backgroundColor: '#062A30',
    position: 'relative',
    height: 40,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderTopColor: 'gray',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    paddingLeft: 10,
    paddingRight: 10,
    flex: '0 0 40px',
  },
  sideContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
};

class FooterMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverExportOpen: false,
    };
    this.togglepopoverExport = this.togglepopoverExport.bind(this);
    this.handleExportReport = this.handleExportReport.bind(this);
    this.handleExportMasterPlan = this.handleExportMasterPlan.bind(this);
    this.gotoImportFile = this.gotoImportFile.bind(this);
    this.gotoReRoute = this.gotoReRoute.bind(this);
  }

  togglepopoverExport() {
    this.setState({
      popoverExportOpen: !this.state.popoverExportOpen,
    });
  }

  handleExportReport() {
    ApiExport.exportReport(this.props.jobId, `report-${this.props.jobId}.xlsx`);
    this.togglepopoverExport();
  }

  handleExportMasterPlan() {
    ApiExport.exportMasterPlan(this.props.jobId, `master-plan-${this.props.jobId}.xlsx`);
    this.togglepopoverExport();
  }

  gotoImportFile() {
    const { jobId } = this.props;
    this.props.history.push(`/import-file/${jobId}`);
  }

  gotoReRoute() {
    const { jobId } = this.props;
    this.props.history.push(`/re-route/${jobId}`);
  }

  render() {
    const {
      style,
      toggleShowTimeline,
      isShowTimeline,
    } = this.props;
    const { popoverExportOpen } = this.state;
    const { t } = this.props;

    return (
      <div style={{ ...styles.container, ...style }}>
        <div style={styles.sideContainer}>
          <div id="change-file"><Button icon="fa fa-folder" title={t('change_file_label')} onClick={this.gotoImportFile} /></div>
          <UncontrolledTooltip placement="top-start" target="change-file">
            {t('re_route_description')}
          </UncontrolledTooltip>
          <div id="re-route"><Button icon="fa fa-sync" title={t('re_route_label')} onClick={this.gotoReRoute} /></div>
          <UncontrolledTooltip placement="top-start" target="re-route">
            {t('re_route_description')}
          </UncontrolledTooltip>
        </div>
        <div style={styles.sideContainer}>
          {popoverExportOpen}
          <Button icon="fa fa-file-export" idButton="popover_export" title={t('export')} onClick={this.togglepopoverExport} />
          <Popover placement="bottom" isOpen={popoverExportOpen} target="popover_export" toggle={this.togglepopoverExport}>
            <PopoverBody className="popover-body-export">
              <ButtonGroup vertical>
                <ButtonBootstrap onClick={this.handleExportMasterPlan}>{t('master_plan')}(.xlsx)</ButtonBootstrap>
                <ButtonBootstrap onClick={this.handleExportReport}>{t('to_report')} (.xlsx)</ButtonBootstrap>
              </ButtonGroup>
            </PopoverBody>
          </Popover>
          <Button icon={isShowTimeline ? 'fa fa-chevron-down' : 'fa fa-chevron-up'} onClick={toggleShowTimeline} />
        </div>
      </div>
    );
  }
}

export default (translate('footer')(FooterMenu));
FooterMenu.propTypes = {
  history: PropTypes.object,
  style: PropTypes.object,
  toggleShowTimeline: PropTypes.func,
  isShowTimeline: PropTypes.bool,
  jobId: PropTypes.number,
  t: PropTypes.func,
};
