const AccessControl = require('role-acl')
const ac = new AccessControl()

// controls for specific CRUD operations on article records
// don't let users update an article ID or the authorID