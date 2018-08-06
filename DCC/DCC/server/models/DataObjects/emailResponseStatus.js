var SequelizeDatatypes = require('sequelize');

module.exports= {
    email:
    {
        type: SequelizeDatatypes.STRING,
        allowNull: false
    },
    hash:
    {
        type: SequelizeDatatypes.STRING,
        allowNull: false
    },
    status:
    {
        type: SequelizeDatatypes.INTEGER,
        allowNull: false
    }
}