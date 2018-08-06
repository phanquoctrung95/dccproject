var SequelizeDatatypes = require('sequelize');

module.exports=
{
    starttime:
    {
        type: SequelizeDatatypes.DATE,
        allowNull: false
    },
    endtime:
    {
        type: SequelizeDatatypes.DATE,
        allowNull: false
    },
    idClass:
    {
        type: SequelizeDatatypes.INTEGER,
        allowNull: true
    }
}
