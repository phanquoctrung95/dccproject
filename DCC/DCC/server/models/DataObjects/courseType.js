var SequelizeDatatypes = require('sequelize');

module.exports =
    {
        name:
        {
            type: SequelizeDatatypes.STRING,
            allowNull: true
        },
        discription:
        {
            type: SequelizeDatatypes.TEXT,
            allowNull: true
        },
    }
