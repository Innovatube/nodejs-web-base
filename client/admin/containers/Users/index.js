import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Col,
  Row,
  Table,
  Form,
  FormGroup,
  Input,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import Pagination from 'react-js-pagination';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import queryString from 'query-string';
import SortIcon from './SortIcon';
import UserRepository from '../../repositories/UserRepository';
import Errors from '../../components/Errors';
import UserRow from './UserRow';

const PER_PAGE = 10;

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null,
      total_count: 0,
      activePage: 1,
      userActionId: 0,
      titleAction: 'revoke',
      action: 'revoke',
      errors: null,
      selectedUsers: [],
      sortedBy: null,
      order: null,
    };
    this.setRepository = this.setRepository.bind(this);
    this.editUser = this.editUser.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.revokeUser = this.revokeUser.bind(this);
    this.toggleActionUser = this.toggleActionUser.bind(this);
    this.handleChangeUser = this.handleChangeUser.bind(this);
    this.handleSelectUserDelete = this.handleSelectUserDelete.bind(this);
    this.handleSelectAllChange = this.handleSelectAllChange.bind(this);
    this.toggleDeleteAllSelects = this.toggleDeleteAllSelects.bind(this);
    this.handleDeleteSelectedUsers = this.handleDeleteSelectedUsers.bind(this);
    this.deleteSelectUsers = this.deleteSelectUsers.bind(this);
    this.setRepository();
  }

  componentDidMount() {
    this.getUsers();
    window.document.title = `Users management - ${window.app.title}`;
  }

  setRepository() {
    this.userRepository = new UserRepository();
  }

  async getUsers() {
    const { location } = this.props;
    const params = queryString.parse(location.search);
    const page = Number(params.page) || 1;
    const limit = PER_PAGE;
    const direction = params.direction || 'id';
    const order = params.order || 'desc';
    const searchWord = params.q || '';
    const users = await this.userRepository.index((page - 1) * limit, limit, order, direction, searchWord, {});
    this.setState({
      ...this.state,
      users: users.data.users,
      total_count: users.data.total,
      activePage: page,
      seach: searchWord,
      selectedUsers: [],
      sortedBy: direction,
      order,
    });
  }

  handleSortColumn = async (name) => {
    const direction = name;
    let order = 'desc';
    if (this.state.sortedBy === name && this.state.order === 'desc') {
      order = 'asc';
    }
    const params = queryString.parse(location.search);
    params.page = 1;
    params.order = order;
    params.direction = name;
    this.props.history.push({
      pathname: '/admin/users',
      search: `?${queryString.stringify(params)}`,
    });
    const users = await this.userRepository.index(0, PER_PAGE, order, direction, params.q || '', {});
    this.setState({
      ...this.state,
      users: users.data.users,
      total_count: users.data.total,
      activePage: 1,
      sortedBy: name,
      order,
    });
  }

  editUser(id) {
    this.props.history.push(`/admin/users/${id}`);
  }

  async seach(data) {
    const params = queryString.parse(location.search);
    params.page = 1;
    params.q = data;
    this.props.history.push({
      pathname: '/admin/users',
      search: `?${queryString.stringify(params)}`,
    });
    this.setState({
      ...this.state,
      seach: data,
    });
    const direction = params.direction || 'id';
    const order = params.order || 'desc';
    const searchWord = params.q || '';
    const users = await this.userRepository.index(0, PER_PAGE, order, direction, searchWord, {});
    this.setState({
      ...this.state,
      users: users.data.users,
      total_count: users.data.total,
      activePage: 1,
    });
  }

  revokeUser(userId, action, title) {
    this.setState({
      ...this.state,
      userActionId: userId,
      titleAction: title,
      action,
      errors: null,
    });
  }

  toggleActionUser() {
    this.setState({
      ...this.state,
      userActionId: 0,
    });
  }

  async handleChangeUser() {
    const { action } = this.state;
    let response = {};
    if (action === 'delete') {
      response = await this.handleDeleteSelectedUsers([this.state.userActionId]);
    } else {
      response = await this.userRepository.post(`${this.userRepository.PATH}/${this.state.userActionId}/${this.state.action}`);
    }
    if (response.error) {
      this.setState({
        ...this.state,
        errors: response.message,
      });
    } else {
      this.getUsers();
      this.setState({
        ...this.state,
        userActionId: 0,
        openModalDelete: false,
      });
    }
  }

  handleDeleteSelectedUsers(selectedUsers) {
    return this.userRepository.delete(`${this.userRepository.PATH}`, { users: selectedUsers });
  }

  async deleteSelectUsers() {
    const { selectedUsers } = this.state;
    const response = await this.handleDeleteSelectedUsers(selectedUsers);
    if (response.error) {
      this.setState({
        ...this.state,
        errors: response.message,
      });
    } else {
      this.getUsers();
      this.setState({
        ...this.state,
        selectedUsers: [],
        openModalDelete: false,
      });
    }
  }

  async handlePageChange(e) {
    const params = queryString.parse(location.search);
    params.page = e;
    this.props.history.push({
      pathname: '/admin/users',
      search: `?${queryString.stringify(params)}`,
    });
    const direction = params.direction || 'id';
    const order = params.order || 'desc';
    const searchWord = params.q || '';
    const users = await this.userRepository.index((e - 1) * PER_PAGE, PER_PAGE, order, direction, searchWord, {});
    this.setState({
      ...this.state,
      users: users.data.users,
      total_count: users.data.total,
      activePage: e,
    });
  }

  handleSelectUserDelete(e) {
    const { target } = e;
    const { checked, value } = target;
    const userId = Number(value);
    const { selectedUsers } = this.state;
    if (checked) {
      selectedUsers.push(userId);
    } else if (!checked && selectedUsers.indexOf(userId) > -1) {
      selectedUsers.splice(selectedUsers.indexOf(userId), 1);
    }
    this.setState({
      ...this.state,
      selectedUsers,
    });
  }

  handleSelectAllChange(event) {
    const { target } = event;
    const { users } = this.state;
    const selectedUsers = [];
    if (target.checked) {
      users.forEach((el) => {
        selectedUsers.push(el.id);
      });
    } else {
      selectedUsers.slice(0, -1);
    }
    this.setState({
      ...this.state,
      selectedUsers,
    });
  }

  toggleDeleteAllSelects(status) {
    this.setState({
      ...this.state,
      openModalDelete: status,
      errors: null,
    });
  }

  render() {
    const {
      users,
      seach,
      errors,
      selectedUsers,
      openModalDelete,
    } = this.state;
    const { t } = this.props;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row className="pb-2">
                  <h5> <i className="fa fa-users" /> {t('user_management')}</h5>
                </Row>
                <Row>
                  <Col className="pl-0">
                    <Form inline>
                      <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                        <Button
                          type="button"
                          disabled={this.state.selectedUsers.length === 0}
                          onClick={() => this.toggleDeleteAllSelects(true)}
                        >
                          <i className="fa fa-trash-alt" />
                        </Button>
                      </FormGroup>
                      <FormGroup className="mb-2 mr-sm-2 mb-sm-0 w-85">
                        <Input
                          type="text"
                          placeholder={t('seach')}
                          id="seach"
                          name="seach"
                          onChange={e => this.seach(e.target.value)}
                          className="w-75"
                          value={seach || ''}
                        />
                      </FormGroup>
                    </Form>
                  </Col>
                  <Col>
                    <Button color="primary" onClick={() => this.props.history.push('/admin/users/create')} className="float-right b-white"><i className="fa fa-plus" /> {t('new_user')}</Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table responsive hover className="user-list">
                  <thead className="bg-black">
                    <tr>
                      <th scope="col">
                        <input id="selectall" checked={!!(selectedUsers && users && selectedUsers.length === users.length)} name="selectall" onChange={this.handleSelectAllChange} type="checkbox" value="true" />
                      </th>
                      <th scope="col">
                        <div onClick={() => {
                          this.handleSortColumn('id');
                        }}
                        >{t('ad_id')} <SortIcon order={this.state.order} isSort={this.state.sortedBy === 'id'} />
                        </div>
                      </th>
                      <th
                        scope="col"
                        onClick={() => {
                          this.handleSortColumn('name');
                        }}
                      >{t('full_name')} <SortIcon order={this.state.order} isSort={this.state.sortedBy === 'name'} />
                      </th>
                      <th
                        scope="col"
                        onClick={() => {
                          this.handleSortColumn('company');
                        }}
                      >{t('ad_company')} <SortIcon order={this.state.order} isSort={this.state.sortedBy === 'company'} />
                      </th>
                      <th
                        scope="col"
                        onClick={() => {
                          this.handleSortColumn('email');
                        }}
                      >{t('ad_email')} <SortIcon order={this.state.order} isSort={this.state.sortedBy === 'email'} />
                      </th>
                      <th
                        scope="col"
                        onClick={() => {
                          this.handleSortColumn('is_admin');
                        }}
                      > {t('access_right')}<SortIcon order={this.state.order} isSort={this.state.sortedBy === 'is_admin'} />
                      </th>
                      <th
                        scope="col"
                        onClick={() => {
                          this.handleSortColumn('change_password_enforcement');
                        }}
                      >{t('ad_cpe')} <SortIcon order={this.state.order} isSort={this.state.sortedBy === 'change_password_enforcement'} />
                      </th>
                      <th
                        scope="col"
                        onClick={() => {
                          this.handleSortColumn('password_expired_days');
                        }}
                      >{t('repeat_period')}<SortIcon order={this.state.order} isSort={this.state.sortedBy === 'password_expired_days'} />
                      </th>
                      <th
                        scope="col"
                        onClick={() => {
                          this.handleSortColumn('created_at');
                        }}
                      >{t('created')}<SortIcon order={this.state.order} isSort={this.state.sortedBy === 'created_at'} />
                      </th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {users && users.map((user, index) => (
                      <UserRow
                        key={index}
                        selectedUsers={selectedUsers}
                        revokeUser={this.revokeUser}
                        editUser={this.editUser}
                        onChangeSelectUserDelete={this.handleSelectUserDelete}
                        user={user}
                      />
                    ))}
                  </tbody>
                </Table>
              </CardBody>
              <CardFooter>
                <Row className="w-100">
                  <Col className="d-flex justify-content-center">
                    <nav aria-label="Page navigation example">
                      <Pagination
                        activePage={this.state.activePage}
                        itemsCountPerPage={PER_PAGE}
                        totalItemsCount={this.state.total_count}
                        onChange={this.handlePageChange}
                        itemClass="page-item"
                        linkClass="page-link"
                      />
                    </nav>
                  </Col>
                </Row>
              </CardFooter>
              <Modal isOpen={this.state.userActionId !== 0} toggle={this.toggleActionUser} backdrop="static">
                <ModalBody>
                  {t('sure_want_to')} {t(this.state.titleAction)} {t('this_user')}?
                  {errors && errors.message && (<div><Row><Col sm={{ size: 6, offset: 3 }}><Errors errors={errors} /></Col></Row><Row /></div>)}
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={this.handleChangeUser}>{t('ad_yes')}</Button>{' '}
                  <Button color="secondary" onClick={this.toggleActionUser}>{t('ad_cancel')}</Button>
                </ModalFooter>
              </Modal>
              <Modal isOpen={openModalDelete} toggle={() => { this.toggleDeleteAllSelects(false); }} backdrop="static">
                <ModalBody>
                  {t('sure_want_to_delete')} {selectedUsers && selectedUsers.length} {t('ad_users')}?
                  {errors && errors.message && (<div><Row><Col sm={{ size: 6, offset: 3 }}><Errors errors={errors} /></Col></Row><Row /></div>)}
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={this.deleteSelectUsers}>{t('ad_yes')}</Button>{' '}
                  <Button color="secondary" onClick={() => { this.toggleDeleteAllSelects(false); }}>{t('ad_cancel')}</Button>
                </ModalFooter>
              </Modal>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default translate('dashboardContent')(Users);
Users.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object,
  t: PropTypes.func,
};
