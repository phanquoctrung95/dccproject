var SequelizeDatatypes = require('sequelize');

module.exports=
{
    userID: 
    {
        type: SequelizeDatatypes.INTEGER,
        allowNull: false
    },
    teamID:
    {
        type: SequelizeDatatypes.INTEGER,
        allowNull: false
    },
}