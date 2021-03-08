const db = require('../helpers/database');
const bcrypt = require('bcrypt');

exports.getAll = async function getAll(page,limit,order) {
    let query = "SELECT ID,firstName,lastName,username,email,avatarURL, roleID,centerID  FROM users;";
    let data = await db.run_query(query);
    return data;
}