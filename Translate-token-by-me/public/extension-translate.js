// module querystring nay giup cho ta co the dinh dang duoc chuoi thanh URL dung
var querystring = require('querystring');

// module got giup ta don gian hoa cac phuong thuc gui len serve nhu get, post, .... . Get la phuong thuc duoc su dung mac dinh
var got = require('got');

// module safe-eval co tac dung cho ta xem ket qua cua cac lenh javascript khi no thuc thi, no tuong tu nhu consle.log vay, nhung hon console.log la cac the loai nhu dinh nghia mang no cung in mang do co gia tri nhu the nao, giong nhu goi ten mang trong python, thi gia tri cac phan tu trong mang cung duoc hien thi ra ngoai
var safeEval = require('safe-eval');

// module google-translate-token co tac dung generate cho ta mot name va value (gan nhu tai khoan) de co the su dung dich vu translate cua google, neu khong co ma nay (tuc la name va value) nay thi moi lan su dung dich vu cua google se mat phi $20 cho mot trieu ky tu van ban duoc dich. Va moi lan thuc thi, hay sau moi khoang thoi gian co dinh thi ham generate nay se tao ra mot ma khac nhau de co the su dung duoc dich vu translate cua google
var token = require('./extension-token');

// lay cac dich vu duoc cung cap tu file language.js
var languages = require('./language.js');

// viet ham translate de dich cac chuoi ky tu
function translate(text, opts) {

    // opts la tham so dau vao kieu doi tuong
    opts = opts || {};

    // khai bao bien chua loi
    var e;

    // duyet mang tu ngon ngu cua chuoi van ban va ngon ngu can dich co duoc ho tro boi mang langs
    [opts.from, opts.to].forEach(function (lang) {

        // neu mot ngon ngu khong duoc ho tro thi tao doi tuong loi e
        if (lang && !languages.isSupported(lang)) {
            e = new Error();
            e.code = 400;
            e.message = 'The language \'' + lang + '\' is not supported';
        }

    });

    // neu co e thi reject ve loi
    if (e) {
        return new Promise(function (resolve, reject) {
            reject(e);
        });
    }

    // con neu khong co loi e thi thuc hien cac cau lenh sau

    // lay ve ngon ngu cua chuoi ky tu
    opts.from = opts.from || 'auto';

    // lay ve ngon ngu dich can dich
    opts.to = opts.to || 'en';

    // lay key cua cac ngon ngu (cho du from, to duoc truyen vao la key hay ten ngon ngu) thi ket qua tra ve luon la key trong mang langs
    opts.from = languages.getCode(opts.from);
    opts.to = languages.getCode(opts.to);

    // su dung token de co the su dung duoc dich vu translate cua google mot cach mien phi
    // ham token.get() co tac dung gui den google translate va no se tao mot name value theo hash nao do
    // gia tri cua chuoi phuong thuc nay se tra ve van ban da duoc dich
    return token.get(text).then(function (token) {

        // link den dich vu cua google translate
        var url = 'https://translate.google.com/translate_a/single';

        // du lieu can gui len sever
        var data = {
            client: 't',
            sl: opts.from,
            tl: opts.to,
            hl: opts.to,
            dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
            ie: 'UTF-8',
            oe: 'UTF-8',
            otf: 1,
            ssel: 0,
            tsel: 0,
            kc: 7,
            q: text
        };

        data[token.name] = token.value;

        console.log(url + '?' + querystring.stringify(data));

        // tra ve mot url day du
        return url + '?' + querystring.stringify(data);
    }).then(function (url) {
        // thu hien phuong thuc get den serve bang phuon thuc got cua module got, get nay se den api la url
        return got(url).then(function (res) {
            // khai bao ban dau cho ket qua tra ve
            var result = {
                text: '',
                from: {
                    language: {
                        didYouMean: false,
                        iso: ''
                    },
                    text: {
                        autoCorrected: false,
                        value: '',
                        didYouMean: false
                    }
                },
                raw: ''
            };


            if (opts.raw) {
                result.raw = res.body;
            }

            // truyen gia tri tra ve vao bien body
            var body = safeEval(res.body);

            // duyet mang cua phan tu body[0]
            body[0].forEach(function (obj) {
                if (obj[0]) {
                    result.text += obj[0];
                }
            });
            // cac doan code duoi dung de xu ly cac truong hop sua loi chuoi vao tu dong, phat hien ngon ngu cho chuoi vao, ...
            if (body[2] === body[8][0][0]) {
                result.from.language.iso = body[2];
            } else {
                result.from.language.didYouMean = true;
                result.from.language.iso = body[8][0][0];
            }

            if (body[7] && body[7][0]) {
                var str = body[7][0];

                str = str.replace(/<b><i>/g, '[');
                str = str.replace(/<\/i><\/b>/g, ']');

                result.from.text.value = str;

                if (body[7][5] === true) {
                    result.from.text.autoCorrected = true;
                } else {
                    result.from.text.didYouMean = true;
                }
            }

            return result;
        }).catch(function (err) {
            var e;
            e = new Error();
            if (err.statusCode !== undefined && err.statusCode !== 200) {
                e.code = 'BAD_REQUEST';
            } else {
                e.code = 'BAD_NETWORK';
            }
            throw e;
        });
    });

}

// exports ra ngoai de cac file ben ngoai co the su dung duoc
module.exports = translate;
module.exports.languages = languages;
