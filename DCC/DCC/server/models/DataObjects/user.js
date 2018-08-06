var SequelizeDatatypes = require('sequelize');

module.exports =
    {
        username: {
            type: SequelizeDatatypes.TEXT,
            allowNull: false
        },
        status: {
            type: SequelizeDatatypes.TEXT,
            allowNull: true
        },
        dob: {
            type: SequelizeDatatypes.STRING,
            allowNull: true
        },
        phone: {
            type: SequelizeDatatypes.STRING,
            allowNull: true
        },
        location: {
            type: SequelizeDatatypes.STRING,
            allowNull: true
        },
        email: {
            type: SequelizeDatatypes.STRING,
            allowNull: false
        },
        password: {
            type: SequelizeDatatypes.TEXT,
            allowNull: true
        },
        avatar: {
            type: SequelizeDatatypes.STRING,
            allowNull: true
        },
        isAdmin: {
            type: SequelizeDatatypes.BOOLEAN,
            allowNull: true
        },
        isTrainee: {
            type: SequelizeDatatypes.BOOLEAN,
            allowNull: true
        },
        isTrainer: {
            type: SequelizeDatatypes.BOOLEAN,
            allowNull: true
        },
        belong2Team:
        {
            type: SequelizeDatatypes.STRING,
            allowNull: true
        },
        userType: {
            type: SequelizeDatatypes.STRING,
            allowNull: true
        },
        isExperienced: {
            type: SequelizeDatatypes.BOOLEAN,
            allowNull: true
        },
        isNotificationEmail: {
            type: SequelizeDatatypes.BOOLEAN,
            allowNull: true
        },
        isNotificationDesktop: {
            type: SequelizeDatatypes.BOOLEAN,
            allowNull: true
        },
        EmailPeriod: {
            type: SequelizeDatatypes.STRING,
            allowNull: true
        },
        TimeOption: {
            type: SequelizeDatatypes.DATE,
            allowNull: true
        }
    }
