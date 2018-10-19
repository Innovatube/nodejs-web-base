import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

const noImage = '/img/no-avatar.jpg';

class ImageInput extends Component {
  constructor() {
    super();
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleChooseFile = this.handleChooseFile.bind(this);
    this.state = {
      currentImageUrl: noImage,
    };
  }

  componentWillMount() {
    this.setState({
      currentImageUrl: this.props.currentImageUrl || noImage,
    });
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.uploading) {
      this.setState({
        currentImageUrl: newProps.currentImageUrl || noImage,
      });
    }
  }

  handleOnChange(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      this.setState({
        currentImageUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
    this.props.onChange(e);
  }

  handleChooseFile() {
    const { name, uploading } = this.props;
    if (uploading) {
      return;
    }
    const elementFile = document.getElementById(`file_${name}`);
    elementFile.click();
  }

  render() {
    const {
      thumbnailSize,
      textPlaceholder,
      name,
    } = this.props;

    return (
      <div className="content__avatar">
        <div onClick={this.handleChooseFile}>
          <img
            src={this.state.currentImageUrl}
            width={thumbnailSize}
            height={thumbnailSize}
            accept=".jpg, .png, .jpgs"
            className=""
            alt="Upload this"
          />
          <Input
            type="file"
            id={`file_${name}`}
            name={name}
            className="d-none"
            accept=".jpg, .png, .jpeg"
            onChange={e => this.handleOnChange(e)}
          />
          <div className="text-center text-white">{textPlaceholder}</div>
        </div>
      </div>
    );
  }
}

ImageInput.propTypes = {
  name: PropTypes.string,
  textPlaceholder: PropTypes.string,
  currentImageUrl: PropTypes.string,
  onChange: PropTypes.func,
  thumbnailSize: PropTypes.number,
  uploading: PropTypes.bool,
};

ImageInput.defaultProps = {
  name: '',
  textPlaceholder: 'Choose',
  currentImageUrl: '',
  thumbnailSize: 200,
  onChange: () => {},
};

export default ImageInput;
