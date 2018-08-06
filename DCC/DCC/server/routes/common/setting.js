var router = require('express').Router();
var models = require('../../models');
var log = require('../../config/config')["log"];

router.post('/getValueByName', function (req, res) {
    models.Setting.getSettingByName(req.body.name, function (resData) {
        res.send({
            success: true,
            data: resData.value
        });
    });
});
router.post('/updateSettingByName', function (req, res) {
    models.Setting.updateSettingByName(req.body.name, req.body.value, function (resData) {
        res.send({
            success: true,
            msg: "update successes"
        });
    });
});
module.exports = router;
