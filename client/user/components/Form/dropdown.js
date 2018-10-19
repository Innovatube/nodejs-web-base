import React, {Component} from 'react';
import {Dimensions} from 'react-native';
import {
  Text,
  Item,
  Picker,
  Icon,
} from 'native-base';

const {width} = Dimensions.get('window');

export default class Dropdown extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedValue: props.default,
    }
  }

  onChangeText(text) {
    const {onChange} = this.props;

    if (onChange) {
      onChange(text);
    }
    this.setState({
      selectedValue: text,
    });
  }

  render() {
    const {title, options} = this.props;

    return (
      <React.Fragment>
        <Text note style={{marginVertical: 8}}>{title}</Text>
        <Item regular success picker>
          <Picker
            mode="dropdown"
            iosIcon={<Icon name="ios-arrow-down-outline" />}
            style={{ width: width - 20 }}
            placeholderStyle={{ color: "#bfc6ea" }}
            placeholderIconColor="#007aff"
            selectedValue={this.state.selectedValue}
            onValueChange={(value) => this.onChangeText(value)}
          >
            {options.map(option => (
              <Picker.Item label={option.label} value={option.key} key={option.key} />
            ))}
          </Picker>
        </Item>
      </React.Fragment>
    );
  }
}