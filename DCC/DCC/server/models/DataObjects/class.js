var SequelizeDatatypes = require('sequelize');

module.exports=
{
    location:
    {
        type: SequelizeDatatypes.STRING,
        allowNull: true
    },
    courseId:
    {
        type: SequelizeDatatypes.INTEGER,
        allowNull: false
    },
    trainerId:
    {
        type: SequelizeDatatypes.INTEGER,
        allowNull: true
    },
    startTime:
    {
        type: SequelizeDatatypes.DATE,
        allowNull: true
    },
    endTime:
    {
        type: SequelizeDatatypes.DATE,
        allowNull: true
    },
    duration:
    {
        type: SequelizeDatatypes.TIME,
        allowNull: true
    },
    maxAttendant:
    {
        type: SequelizeDatatypes.INTEGER,
        allowNull: true
    },
    note:
    {
        type: SequelizeDatatypes.STRING,
        allowNull: true
    }
}
