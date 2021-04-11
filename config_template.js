exports.config = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "your-user",
    password: "password",
    database: "db-name",
    connection_limit: 100
}