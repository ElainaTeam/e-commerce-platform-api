export const Config = {
    server: {
        port: 8000
    },
    database: {
        mysql: {
            type: "mariadb",
            host: "localhost",
            port: 3306,
            user: "elainateam",
            password: "n-P(J56ZaXX[!mV7",
            database: "elainateam",
            supportBigNumbers: true,
            bigNumberStrings: true,
            multipleStatements: true,
            charset: "utf8mb4_general_ci",
            connectionLimit: 1
        }
    }
}