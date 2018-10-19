import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';
import DoashBoardRepository from '../../../repositories/DoashBoardRepository';

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doashBoardCount: {},
    };
    this.getDashBoardInfo = this.getDashBoardInfo.bind(this);
    this.doashBoardRepository = new DoashBoardRepository();
  }

  componentDidMount() {
    this.getDashBoardInfo();
    window.document.title = `Dashboard - ${window.app.title}`;
  }

  async getDashBoardInfo() {
    const doashBoard = await this.doashBoardRepository.index();
    this.setState({
      ...this.state,
      doashBoardCount: doashBoard.data,
    });
  }

  render() {
    const { doashBoardCount } = this.state;
    const { t } = this.props;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="6" lg="4">
            <Card className="text-white bg-info">
              <CardBody className="p-4">
                <div className="text-value">{doashBoardCount && doashBoardCount.total_users}</div>
                <div>{t('ad_users')}</div>
              </CardBody>
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="4">
            <Card className="text-white bg-primary">
              <CardBody className="p-4">
                <div className="text-value">{doashBoardCount && doashBoardCount.total_files}</div>
                <div>{t('ad_files')}</div>
              </CardBody>
            </Card>
          </Col>

          <Col xs="12" sm="6" lg="4">
            <Card className="text-white bg-warning">
              <CardBody className="p-4">
                <div className="text-value">{doashBoardCount && doashBoardCount.total_jobs}</div>
                <div>{t('ad_jobs')}</div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default translate('dashboardContent')(Content);
Content.propTypes = {
  t: PropTypes.func,
};
