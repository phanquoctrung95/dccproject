
var fs=require('fs');
var settings;
var exist = fs.existsSync('settings.js');

if (fs.existsSync("settings.js") == true){
    settings = require('../../settings.js');
}
else{
    settings = require('../../settingsDefault.js');
}

var logConfigOptions = {
    logDirectory: settings.logDirectory,
    fileNamePattern: settings.fileNamePattern,
    dateFormat: settings.dateFormat
};
module.exports =
    {
        //database config
        "environment": {
            "dialect": settings.databaseDialect,
            "username": settings.databaseUserName,
            "password": settings.databasePassword,
            "database": settings.databaseName,
            "host": settings.databaseHost,
            "pool": settings.databasePool,
            port: settings.databasePort,
            "logging": settings.databaseLogStatus
            
        },
        "test": {
            "dialect": settings.databasetestDialect,
            "username": settings.databasetestUserName,
            "password": settings.databasetestPassword,
            "database": settings.databasetestName,
            "host": settings.databasetestHost,
            "pool": settings.databasetestPool,
            port: settings.databasetestPort,
            "logging": settings.databasetestLogStatus
            
        },
        "inMemoryDB": {
            dialect: settings.databaseIMdialect,
            storage: settings.databaseIMstorgare
        },
        // LDAP server config , port 636
        server: {
            url: settings.LDAPurl,
            //bindDn: settings.bindDN ,
            //bindCredentials: settings.bindCredential,
            searchBase: settings.searchBase,
            searchFilter: settings.searchFilter,
        },
        //Log config
        "log": require('simple-node-logger').createLogManager(logConfigOptions).createLogger()
    }
