const db = require('../helpers/database');
const bcrypt = require('bcrypt');

//list all the users in the database
exports.getAll = async function getAll(page,limit,order) {
    const query = "SELECT ID,firstName,lastName,username,email,avatarURL, roleID,centerID  FROM users;";
    const data = await db.run_query(query);
    return data;
}

//get a single user by the id
exports.getUserID =async function getUserID(id) {
    const query = "SELECT * FROM users WHERE ID =?;"
    const user =  await db.run_query(query,id)
    return user

}
// get user by username (unique)
exports.findByUsername= async function findByUsername(username) {
    const query ="SELECT * FROM users WHERE username=?"
    const response =db.run_query(query,username)
    return response
    
}
//create a new user in the database
exports.addUser =async function addUser(user) {
    //checking if user exist already:
    const rep1 = "SELECT * FROM users WHERE username=? or email=?"
    const exist =await db.run_query(rep1,[user.username,user.email])
    if (exist.length) {
        return 0
    }
    const query = "INSERT INTO users SET ?;"
    // hashing password:
    const password =user.passwordHash
    const hash = bcrypt.hashSync(password,11)
    user.passwordHash=hash
    const response = await db.run_query(query,user)
    return response
}

exports.deleteUser = async function deleteUser(ID){

    const query = "DELETE FROM users WHERE ID=?"
    const deleted = await db.run_query(query,ID)
    return deleted
}


exports.updateUser = async function updateUser(user) {
    const password =user.passwordHash
    const hash = bcrypt.hashSync(password,11)
    user.passwordHash=hash
    const query = "UPDATE users SET ? WHERE ID = ?;";
    const values = [user,user.ID]
    const data = await db.run_query(query, values);
    return data  
}