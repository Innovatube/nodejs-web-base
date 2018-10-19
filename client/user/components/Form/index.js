import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import Input from './input';

export default class Form extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      ...props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(prev => ({
      ...prev,
      ...nextProps.value,
    }));
  }

  onChange(key, value) {
    if (key) {
      this.setState({
        [key]: value,
      });

      const { onChange } = this.props;
      if (onChange) {
        onChange(key, value);
      }
    }
  }

  render() {
    const { elements } = this.props.template;

    return (
      <Row>
        {elements.map((element, index) => {
          switch (element.type) {
            default:
              return (
                <Col xs={element.col || 12}>
                  <Input
                    {...element}
                    key={index}
                    value={this.state[element.input_key]}
                    onChange={text => this.onChange(element.input_key, text)}
                  />
                </Col>
              );
          }
        })}
      </Row>
    );
  }
}

Form.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
  template: PropTypes.object,
};
