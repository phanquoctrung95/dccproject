var SequelizeDatatypes = require('sequelize');

module.exports=
{
    userID: 
    {
        type: SequelizeDatatypes.INTEGER,
        allowNull: false
    },
    groupID:
    {
        type: SequelizeDatatypes.INTEGER,
        allowNull: false
    },
}