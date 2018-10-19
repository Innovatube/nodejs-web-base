import React from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

class DialogMoveRoute extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Step1 />
        <Step2 />
        <Step3 />
      </React.Fragment>
    );
  }
}

export default DialogMoveRoute;
