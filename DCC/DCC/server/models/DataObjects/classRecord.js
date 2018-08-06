var SequelizeDatatypes = require('sequelize');

module.exports=
{
    // 1: enrolled,
    // 2: passed
    status:
    {
        type: SequelizeDatatypes.STRING,
        allowNull: true
    },
    classId:
    {
        type: SequelizeDatatypes.INTEGER,
        allowNull: true
    },
    traineeId:{
        type: SequelizeDatatypes.INTEGER,
        allowNull: false
    },
    bestThing_comments: {
        type: SequelizeDatatypes.TEXT,
        allowNull: true
    },
    trainer_rating: {
        type: SequelizeDatatypes.INTEGER,
        allowNull: true
    },
    improve_comments: {
        type: SequelizeDatatypes.TEXT,
        allowNull: true
    },
    content_rating: {
        type: SequelizeDatatypes.INTEGER,
        allowNull: true
    },
    happy_rating: {
        type: SequelizeDatatypes.INTEGER,
        allowNull: true
    },
    exercises:
    {
        type: SequelizeDatatypes.STRING,
        allowNull: true
    },
    confirmJoin:
    {
        type: SequelizeDatatypes.STRING,
        allowNull: true
    }
}
