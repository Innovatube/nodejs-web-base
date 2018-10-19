import React from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Auth from '../../../../middlewares/Auth';
import './header.css';
import AboutUsModal from '../AboutUsModal';
import en from '../../../../user/components/Header/en.png';
import th from '../../../../user/components/Header/th.png';

const backgroundDropDown = '#2A3338';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      dropDownHelper: false,
      modalHelperOpen: false,
    };
  }

  toggleHelper = () => {
    this.setState({
      ...this.state,
      dropDownHelper: !this.state.dropDownHelper,
    });
  }

  toggleHelperModal = () => {
    this.setState({
      ...this.state,
      dropDownHelper: false,
      modalHelperOpen: !this.state.modalHelperOpen,
    });
  }

  changeLanguage = (lng) => {
    const { i18n } = this.props;
    i18n.changeLanguage(lng);
  }


  toggle() {
    this.setState({
      ...this.state,
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  render() {
    const { modalHelperOpen } = this.state;
    const { t } = this.props;

    return (
      <div>
        <Navbar
          color="white"
          expand="md"
          style={{
            height: 38,
            borderBottom: '8px solid #022f37',
          }}
        >
          <NavbarBrand href="/">{t('app_name')}</NavbarBrand>
          <NavbarToggler onClick={this.props.toggle} />
          <NavbarToggler />
          <Collapse isOpen={this.props.isOpen} navbar>
            <Nav
              className="ml-auto"
              navbar
              style={{
                alignItems: 'center',
                fontSize: 20,
              }}
            >
              <div onClick={() => this.changeLanguage('th')}><img alt="th" src={th} style={{ width: '25px', margin: '5px' }} /></div>
              <div onClick={() => this.changeLanguage('en')}><img alt="en" src={en} style={{ width: '25px', margin: '5px' }} /></div>
              <ButtonDropdown
                isOpen={this.state.dropDownHelper}
                toggle={() => {}}
                style={{
                  height: 30,
                }}
              >
                <DropdownToggle
                  caret
                  onClick={this.toggleHelper}
                  style={{
                    height: '30px',
                    width: '120px',
                  }}
                >
                  <i
                    style={{
                      color: 'white',
                      marginRight: '12px',
                    }}
                    className="fas fa-question-circle"
                  />
                  {t('help')}
                </DropdownToggle>
                <DropdownMenu style={{ width: '120px', height: '43px', minWidth: '120px' }}>
                  <DropdownItem
                    style={{
                      background: backgroundDropDown,
                      color: 'white',
                    }}
                    onClick={this.toggleHelperModal}
                  >
                    <div onClick={this.toggleHelperModal}>{t('about_us')}</div>
                  </DropdownItem>
                </DropdownMenu>
              </ButtonDropdown>
              <NavItem>
                <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                  <DropdownToggle nav>
                    <i
                      className="fas fa-user-circle"
                    />
                  </DropdownToggle>
                  <DropdownMenu right>
                    { Auth.isAdmin() && (
                    <DropdownItem
                      style={{
                        background: backgroundDropDown,
                        color: 'white',
                      }}
                      onClick={() => {
                        window.location.href = `${window.app.baseUrl}admin`;
                      }}
                    >
                      {t('admin_control')}
                    </DropdownItem>
                    )}
                    <DropdownItem
                      style={{
                        background: backgroundDropDown,
                        color: 'white',
                      }}
                      onClick={() => {
                        window.location.href = `${window.app.baseUrl}user-setting`;
                      }}
                    >
                      {t('my_profile')}
                    </DropdownItem>
                    <DropdownItem
                      style={{
                        background: backgroundDropDown,
                        color: 'white',
                      }}
                      onClick={Auth.logout}
                    >
                      {t('log_out')}
                    </DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <AboutUsModal
          modal={modalHelperOpen}
          toggle={this.toggleHelperModal}
        />
      </div>
    );
  }
}

export default (translate('head')(Header));
Header.propTypes = {
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
  t: PropTypes.func,
  i18n: PropTypes.any,
};
