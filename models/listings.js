const db = require('../helpers/database');


exports.getAll =async function getAll() {
    const query="SELECT * FROM listings"
    const response= await db.run_query(query)
    return response
}


exports.addListing =async function addListing(listing) {
    const query = "INSERT INTO listings SET ?;"
    const response= await db.run_query(query,listing)
    return response
}

exports.findListingByID =async function findListingByID(ID) {
    const query = " SELECT * FROM listings WHERE ID=?;"
    const response= await db.run_query(query,ID)
    return response
}
exports.deleteListing =async function deleteListing(ID) {
    const query = " DELETE  FROM listings WHERE ID=?;"
    const response= await db.run_query(query,ID)
    return response
}

exports.updateListing =async function deleteListing(listing) {
    const query = " UPDATE listings SET ? WHERE ID = ?;"
    const values =[listing,listing.id]
    const response= await db.run_query(query,values)
    return response
}



