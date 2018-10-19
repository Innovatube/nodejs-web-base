import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import _ from 'lodash';
import {
  Col,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';

class Form extends Component {
  onChangeText(text) {
    const { onChange, type } = this.props;

    if (onChange) {
      if (text.trim().length === 0) {
        onChange(null);
      } else if (type === 'input-number' && !_.isNaN(+text)) {
        onChange(+text);
      } else if (type === 'input-id') {
        onChange(text.replace(' ', ''));
      } else {
        onChange(text);
      }
    }
  }

  render() {
    const { title, t, ...other } = this.props;

    return (
      <FormGroup row>
        <Col md={this.props.left_col || 4} style={{ display: 'flex', alignItems: 'center' }}>
          <Label htmlFor="name" style={{ marginBottom: 0, color: 'lightgray' }}>{t(title)}</Label>
        </Col>
        <Col md={this.props.right_col || 8}>
          <Input
            className="form-control"
            {...other}
            onChange={event => this.onChangeText(event.nativeEvent.target.value)}
            style={{ backgroundColor: 'gray', color: 'white', borderWidth: 0 }}
          />
        </Col>
      </FormGroup>
    );
  }
}

export default translate('upload')(Form);
Form.propTypes = {
  t: PropTypes.func,
  onChange: PropTypes.func,
  type: PropTypes.string,
  title: PropTypes.string,
  left_col: PropTypes.number,
  right_col: PropTypes.number,
};
