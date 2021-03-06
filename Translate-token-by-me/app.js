var express = require('express');
var bodyParser = require('body-parser');

// import file extension-translate.js de phuc vu cho viec dich chuoi ky tu
var translate = require('./public/extension-translate');


// khoi tao ung dung
var app = express();
var port = process.env.PORT || 3000;

// de co the doc duoc noi dung cua req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// de su dung duoc ejs
app.set('view engine', "ejs");

app.use("/assets", express.static(__dirname + "/public"));

// thiet lap duong dan
app.get('/', function (req, res) {
    res.render('index');
})

// thuc hien phuong thuc post voi /translate
app.post('/translate', function (req, res) {

    // Lay du lieu do client gui len
    var info_param = req.body;

    // Lay noidung cua chuoi ky tu can dich
    var content = info_param.content;

    translate(content, { from: 'en', to: 'vi' }).then(res => {
        noidungdadich = res.text;
        console.log(noidungdadich);

    }).catch(err => {
        console.error(err);
    });

})

// thiet lap cong lang nghe cho ung dung
app.listen(port, function () {
    console.log('Ứng dụng đang nghe trên cổng: ', port);
})