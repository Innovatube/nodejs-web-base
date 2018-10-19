import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from 'reactstrap';

import {
  closeMoveRoute,
  selectToPlan,
  updateNewRouteInfo,
} from '../../../../../actions/moveRoute';


import '../../../ImportFile/RouteSettingModal/Input/input.css';
import '../../../ImportFile/importfile.css';
import { Form, Errors } from '../../../../components';
import template from './template';
import Validation from '../../../../components/Form/validation';

class Step2 extends React.Component {
  isValidated() {
    const { t } = this.props;

    return Validation.isValidated(template({ vehicles: this.props.vehicles, t }).validators)(this.props.toPlan);
  }

  render() {
    const { t } = this.props;

    return (this.props.status === 'NEW_PLAN') && (
      <div>
        <ModalHeader
          toggle={() => {
            if (confirm('This action cannot be undo. Are you sure?')) {
              this.props.closeMoveRoute();
            }
          }}
          className="route-setting__modal--header"
          style={{ color: 'lightgray' }}
        >
          {t('add_new_route')}
        </ModalHeader>
        <ModalBody>
          <div className="container">
            <Form
              template={template({ vehicles: this.props.vehicles, t })}
              onChange={(key, value) => this.props.updateNewRouteInfo(key, value)}
              value={this.props.toPlan}
            />
            <Errors
              errors={Validation.validate(template({ vehicles: this.props.vehicles, t }).validators)(this.props.toPlan)}
            />
          </div>
        </ModalBody>
        <ModalFooter className="route-setting__modal--footer">
          <Button
            style={{
              background: '#022f37',
              color: 'white',
              border: '1px solid #5D6164',
            }}
            onClick={() => this.props.closeMoveRoute()}
          >
            {t('cancel')}
          </Button>{' '}
          <Button
            disabled={!this.isValidated()}
            style={{
              background: '#FFFFFF',
            }}
            onClick={() => this.props.selectToPlan({
              id: -2,
              legs: [],
            })}
          >{t('routing')}
          </Button>
        </ModalFooter>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  status: state.moveRoute.status,
  toPlan: state.moveRoute.toPlan,
  vehicles: state.vehicles.data,
});

const mapDispatchToProps = dispatch => ({
  selectToPlan: plan => dispatch(selectToPlan(plan)),
  closeMoveRoute: () => dispatch(closeMoveRoute()),
  updateNewRouteInfo: (key, value) => dispatch(updateNewRouteInfo(key, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate('moveModel')(Step2));
Step2.propTypes = {
  status: PropTypes.any,
  toPlan: PropTypes.any,
  vehicles: PropTypes.any,
  selectToPlan: PropTypes.func,
  closeMoveRoute: PropTypes.func,
  updateNewRouteInfo: PropTypes.func,
  t: PropTypes.func,
};
