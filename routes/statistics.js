var router = require('express').Router();
var _ = require('underscore');
var AV = require('leanengine');
var Log = AV.Object.extend('Log');

router.get('/', function (req, res, next) {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var dt = d.getDate();
    var today = year + "-" + month + "-" + dt + " 00:00:00";
    var date0 = new Date(today);
    var query1 = new AV.Query(Log);
    query1.limit(1000);
    query1.find({
        success: function(results) {
            var macs = [];
            var emptyMacs = [];
            var todayMac = [];
            for (var i = 0; i < results.length; i++) {
                var date = results[i].createdAt;
                if (date > date0) {
                    todayMac.push(results[i].attributes.mac);
                }
                macs.push(results[i].attributes.mac);
                if (results[i].attributes.mac == undefined || results[i].attributes.mac == "") {
                    emptyMacs.push(1);
                }
            }
            emptyMacs = emptyMacs.length;
            var macunique = _.uniq(macs);
            var todayMacUnique = _.uniq(todayMac);
            macs = macunique.length;
            today = todayMacUnique.length;
            res.render('s', {
                allcount: results.length,
                emptyMacs: emptyMacs,
                macs:macs,
                today:today
            });
        },
        error: function(err) {
            if (err.code === 101) {
                // �ô������ϢΪ��{ code: 101, message: 'Class or object doesn\'t exists.' }��˵�� Todo ���ݱ�δ���������Է��ؿյ� Todo �б�
                // ����Ĵ�����������https://leancloud.cn/docs/error_code.html
                res.render('s', {
                    title: 'TODO �б�',
                    todos: []
                });
            } else {
                next(err);
            }
        }
    });
});

module.exports = router;
