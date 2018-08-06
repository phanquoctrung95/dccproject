var SequelizeDatatypes = require('sequelize');

module.exports=
{
    name:
    {
        type: SequelizeDatatypes.TEXT,
        allowNull: true
    },
    value:
    {
        type: SequelizeDatatypes.INTEGER,
        allowNull: true
    }
}
