import AdminUserModel from '../models/admin_user.model';

exports.getUserById = async function (id){
  return await AdminUserModel.findOne({
    where: {id: id}
  });
}
