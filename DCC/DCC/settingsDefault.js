var settings = {
	// This is Comment
    /**
    / ---------- DATABASE CONFIG ------------
    */
    databaseHost: "192.168.122.20", //127.0.0.1
    databasePort: 3306, //3306
    databaseUserName: "root", // root
    databasePassword: "dekvn@123321", // dekvn@123321 or root
    databaseName: "DCC", // dcc_development, DCC2, DCC_test
    databaseDialect: "mysql",
    databasePool:{
        "max": 5,
        "min": 0,
        "idle": 10000
    } ,
    databaseLogStatus: false,
    /**
    / ---------- DATABASE TEST CONFIG ------------
    */
    databasetestHost: "192.168.122.20", //127.0.0.1
    databasetestPort: 3306, //3306
    databasetestUserName: "root", // root
    databasetestPassword: "dekvn@123321", // dekvn@123321 or root
    databasetestName: "dcc_test", // dcc_development, DCC2, DCC_test
    databasetestDialect: "mysql",
    databasetestPool: {
        "max": 5,
        "min": 0,
        "idle": 10000
    },
    databasetestLogStatus: false,

    /**
    / ---------- IN MEMORY DATABASE CONFIG ------------
    */
    databaseIMdialect: "sqlite",
    databaseIMstorgare:"test/IMDB/database.sqlite",
    /**
    *---------- LDAP SERVER CONFIG ------------
    */
    LDAPurl: 'ldap://192.168.122.20:389', //192.168.122.23:389
    bindDN: 'cn=admin,dc=dcc,dc=com',
    bindCredential: 'root',
    searchBase: 'dc=dcc,dc=com',
    searchFilter:'(uid={{username}})',
    /**
    *---------- LOG CONFIG ------------
    */
    //choose date format
    dateFormat: 'YYYY.MM.DD',
    logDirectory: './client/log', //log file folder
    fileNamePattern: 'roll-<DATE>.log',
    /**
    *---------- UNIT TESTING CONFIG ------------
    */
    testDatabase: 'inMemoryDB', // In-memory Database
    /**
    *---------- EMAIL CONFIG ------------
    */
    // copy from consonle.developer.google
    host: '192.168.122.20',
    auth: 'smtp', // OAuth2, smtp
    email: {
        "USER_EMAIL": "dektech.dcc@gmail.com",
        "USER_CLIENT_ID": "985840088773-5s0rmeo36dd1v2h15h658c8flikvu63j.apps.googleusercontent.com",
        "USER_CLIENT_SECRET": "Zk2q9G6IDYLATjkLCB0-R9P3",
        "USER_ACCESS_TOKEN": "ya29.GlsrBHekNjK-vsiQN7ZtuyXa8QVdds_hs4sSJJzHWYAgST1JMSsjrxpoN2ZBfWSDVhZLCyXQwIZOmYpUc3F-p99_dG4eegVy1QbDP8GsqVkVm9UU32iys3GP1Klb",
        "USER_REFRESH_TOKEN": "1/zjzjkdiE1ympZLRQ0qhi3vybO4u3mm_o4gbcZLq5PYg"
    },
    smtp: {
        host: 'smtp.gmail.com', // SMTP server
        port:  465, // SMTP port number
        secure: true, // true for 465, false for other ports
        user: 'dektech.dcc@gmail.com',
        pass: 'dektechvn2018',
    },
    /**
    *---------- NOTIFICATION EMAIL TIME ------------
    */
    NotificationEmailTime: '10:45',   // hour:minute,  24h format
    /**
    *---------- SECRET KEY ------------
    */
    secret_key: 'dekdcc',
};
module.exports = settings;
