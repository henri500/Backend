const mysql = require('promise-mysql')
const info = require('../config')
// define an async utility function to get a connection 
// run an SQL query then end the connection

exports.run_query = async function run_query(query, values) {
    try {
        const connection = await mysql.createConnection(info.config);
        let data = await connection.query(query, values)
        await connection.end();
        return data;
    } catch (error) {
        console.log(error, query, values);
        throw 'Database query error'
    }
}