export const Config = {
	server: {
		port: process.env.PORT,
	},
	database: {
		mysql: {
			url: `mysql://ecp:faGnP.YBCfX)M3V0@10.10.10.12:3306/e-commerce-platform`,
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
			connectionLimit: 1,
		},
	},
};
