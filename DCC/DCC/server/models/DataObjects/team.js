var SequelizeDatatypes = require('sequelize');

module.exports=
{
    teamID: 
    {
        type: SequelizeDatatypes.INTEGER,
        allowNull: false
    },
    teamName:
    {
        type: SequelizeDatatypes.STRING,
        allowNull: false
    },
}