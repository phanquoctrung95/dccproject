var SequelizeDatatypes = require('sequelize');

module.exports =
    {
        name:
        {
            type: SequelizeDatatypes.STRING,
            allowNull: true
        },
        description:
        {
            type: SequelizeDatatypes.TEXT,
            allowNull: true
        },
        duration:
        {
            type: SequelizeDatatypes.TIME,
            allowNull: true
        },
        imgLink:
        {
            type: SequelizeDatatypes.TEXT,
            allowNull: true
        },
        documents:
        {
            type: SequelizeDatatypes.TEXT,
            allowNull: true
        },
        test:
        {
            type: SequelizeDatatypes.TEXT,
            allowNull: true
        },
        trainingProgramId:
        {
            type: SequelizeDatatypes.INTEGER,
            allowNull: false
        },
    }
