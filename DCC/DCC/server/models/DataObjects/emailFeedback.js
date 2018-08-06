var SequelizeDatatypes = require('sequelize');

module.exports=
{
    email_user: 
    {
        type: SequelizeDatatypes.STRING,
        allowNull: false
    },
    userID:
    {
        type: SequelizeDatatypes.INTEGER,
        allowNull: false
    },
    class_id_not_feedback:
    {
        type: SequelizeDatatypes.INTEGER,
        allowNull: false
    },
    lastdate_sent_emailfeedback:
    {
        type: SequelizeDatatypes.DATE,
        allowNull: true
    }
}