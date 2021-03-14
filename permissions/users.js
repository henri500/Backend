const AccessControl = require('role-acl')
const ac = new AccessControl()
//admin adding another admin
ac
  .grant('admin')
  .execute('add')
  .on('admin')

// READ permissions
ac
  .grant('public')
  .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
  .execute('read')
  .on('user', ['*', '!passwordHash'])
ac
  .grant('worker')
  .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
  .execute('read')
  .on('user', ['*', '!passwordHash'])
ac
  .grant('admin')
  .execute('read')
  .on('user',['*', '!passwordHash'])
ac
  .grant('admin')
  .execute('read')
  .on('users',['*', '!passwordHash'])

// UPDATE permissions 
ac
  .grant('worker')
  .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
  .execute('update')
  .on('user', ['firstName', 'lastName', 'about', 'passwordHash', 'email', 'avatarURL'])
ac
  .grant('public')
  .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
  .execute('update')
  .on('user', ['firstName', 'lastName', 'about', 'passwordHash', 'email', 'avatarURL'])
ac
  .grant('admin')
  .execute('update')
  .on('user')


/// DELETE permissions

ac
  .grant('admin')
  .condition({Fn:'NOT_EQUALS', args: {'requester':'$.owner'}})
  .execute('delete')
  .on('user')

exports.addAdmin= (requester) =>{
    return ac
    .can(requester.roleID)
    .execute('add')
    .sync()
    .on('admin')
}

exports.readAll = (requester) => {
return ac
    .can(requester.roleID)
    .execute('read')
    .sync()
    .on('users')
}

exports.read = (requester, data) => {
return ac
    .can(requester.roleID)
    .context({requester:requester.ID, owner:data.ID})
    .execute('read')
    .sync()
    .on('user');
}

exports.update = (requester, data) => {
return ac
    .can(requester.roleID)
    .context({requester:requester.ID, owner:data.ID})
    .execute('update')
    .sync()
    .on('user');
}

exports.delete = (requester, data) => {
return ac
    .can(requester.roleID)
    .context({requester:requester.ID, owner:data.ID})
    .execute('delete')
    .sync()
    .on('user');
}