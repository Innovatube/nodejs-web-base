import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import moment from 'moment';
import { Button, Row, Col } from 'reactstrap';
import './users.css';

const style = {
  groupButton: {
    flexWrap: 'nowrap',
  },
  button: {
    padding: '5px 10px 5px 10px',
  },
};
class UserRow extends Component {
  constructor(props) {
    super(props);
    this.handleSelectUserDelete = this.handleSelectUserDelete.bind(this);
  }

  handleSelectUserDelete(event) {
    this.props.onChangeSelectUserDelete(event);
  }

  render() {
    const { user, selectedUsers, t } = this.props;

    return (
      <tr key={user.id.toString()} className={user.status === false ? t('revoke') : ''}>
        <th scope="row">
          <input
            id={`user_delete_${user.id}`}
            checked={selectedUsers.indexOf(user.id) > -1}
            name={`user_delete_${user.id}`}
            type="checkbox"
            value={user.id}
            onChange={this.handleSelectUserDelete}
          />
        </th>
        <th scope="row">{user.id}</th>
        <td>{user.name}</td>
        <td>{`${user.company || ''}`}</td>
        <td>{user.email}</td>
        <td>{user.is_admin ? t('admin') : t('ad_users')}</td>
        <td>{user.change_password_enforcement ? t('ad_yes') : t('no')}</td>
        <td>{user.password_expired_days}</td>
        <td>{moment(user.created_at).format('YYYY-MM-DD')}</td>
        <td>
          <Row style={style.groupButton}>
            <Col><Button style={style.button} onClick={() => this.props.editUser(user.id)} block color="primary" size="sm"><i className="fa fa-pen" /></Button></Col>
            <Col><Button style={style.button} block onClick={() => this.props.revokeUser(user.id, user.status ? 'revoke' : 'unrevoke', user.status ? 'revoke' : 'unrevoke')} color="primary" size="sm">{user.status ? t('revoke') : t('un_revoke')}</Button></Col>
            <Col><Button style={style.button} block onClick={() => this.props.revokeUser(user.id, 'delete', 'delete')} color="primary" size="sm">{t('delete')}</Button></Col>
          </Row>
        </td>
      </tr>
    );
  }
}
export default translate('dashboardContent')(UserRow);
UserRow.propTypes = {
  user: PropTypes.object,
  editUser: PropTypes.func,
  revokeUser: PropTypes.func,
  selectedUsers: PropTypes.array,
  onChangeSelectUserDelete: PropTypes.func,
  t: PropTypes.func,
};
