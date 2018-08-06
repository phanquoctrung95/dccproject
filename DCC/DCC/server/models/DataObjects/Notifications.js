var SequelizeDatatypes = require('sequelize');


module.exports =
    {
        userId:
        {
            type: SequelizeDatatypes.INTEGER,
            allowNull: true
        },
        email:
        {
            type: SequelizeDatatypes.STRING,
            allowNull: false
        },
        title:
        {
            type: SequelizeDatatypes.STRING,
            allowNull: true
        },
        content:
        {
            type: SequelizeDatatypes.STRING,
            allowNull: true
        },
        time:
        {
            type: SequelizeDatatypes.DATE,
            allowNull: true
        },
        status:
        {
            type: SequelizeDatatypes.INTEGER,
            allowNull: true
        },
        reference:
        {
            type: SequelizeDatatypes.STRING,
            allowNull: true
        }
    }
