var SequelizeDatatypes = require('sequelize');

module.exports=
{
    groupID: 
    {
        type: SequelizeDatatypes.INTEGER,
        allowNull: false
    },
    groupName:
    {
        type: SequelizeDatatypes.STRING,
        allowNull: false
    },
}