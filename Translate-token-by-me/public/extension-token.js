// Thu vien cung cap phuong thuc get
var got = require("got");

// thu vien giup ghi va lay du lieu trong cac file json config
var Congfigstore = require('configstore');

// them tep config de co the thao tac voi key ma hoa
var config = new Congfigstore('google-translate-token-custom');

// them du lieu la key ma hoa dau tien cho file config, doi tuong window la doi tuong luon duoc cap nhat gia tri chinh xac trong file config tai moi thoi diem chay
var window = {
    // lay gia tri cho thuo tinh TKK = gia tri cua thuoc tinh TKK da co truoc do trong file config hoac neu ko co thi cho = 0
    TKK: config.get('TKK') || '0'
}

// duong dan den file config duoc luu tru tren may tinh ca nhan
//console.log(config.path);

// phuong thuc update khoa TKK sau moi lan su dung
function updateTKK() {

    // su dung promise de co the thuc hien duoc cac hanh dong khog dong bo
    return new Promise(function (resolve, reject) {

        // Lay thoi gian hien, tinh bang h va duoc tinh bang tog so h da troi qua tu ngay 1 thang 1 nam 1970, 00:00:00 gio UTC, ham floor co tac dung lam tron so
        var now = Math.floor(Date.now() / 3600000);
        //console.log(now);

        // neu TKK trong file config co gia tri == now thi ta se resolve luon (tuc la tra ve luon)
        if (Number(window.TKK.split('.')[0]) === now) {
            resolve();
        } else {
            // nguoc lai neu chua co TKK thi ta phai tu tao TKK

            // thuc hien goi phuong thuc get len serve de nhan du lieu
            got("https://translate.google.com").then(function (res) {

                // lay gia tri cua res.body => day la file html
                var code = res.body;

                // loc cac chuoi thoa man cac bieu thuc chinh uy o trong ham match
                var code = res.body.match(/TKK=(.*?)\(\)\)'\);/g);
                // code = ["TKK=eval('((function(){var a\\x3d1538655366;var b\\x3d667353624;return 426177+\\x27.\\x27+(a+b)})())');"]
                // viec tinh gia tri tra ve trong ham nay khog phu thuoc vao gia tri cua bien now, bien now la bien chi kiem tra xem tai thoi diem hien tai thi ta co phai cap nhat gia tri cua TKK trong file config hay khong?

                // neu co code thi thuc hien doan code sau
                if (code) {

                    // thuc thi function trong code[0] vi phan tu tai vtri i = 0 nay la mot function
                    eval(code[0]);
                    // console.log(eval(code[0])) => 426177.226008990

                    // neu gia tri cua TKK trong file config da co thi ta bat dau cap nhat cho file config va doi tuong window phan anh trang thai cua file config tai thoi diem htai
                    if (typeof TKK !== 'undefined') {
                        // cap nhat window, TKK duoc khai bao sau eval nen TKK mang gia tri tra ve cua eval
                        window.TKK = TKK;

                        // cap nhat TKK vao file config
                        config.set('TKK', TKK);
                    }

                }

                // tra ve gia tri
                resolve();

            }).catch(function (err) {
                var e = new Error();
                e.code = 'BAD_NETWORK';
                e.message = err.message;
                reject(e);
            });
        }


    })

}

// phuong thuc co gia tri tra ve la mot ham: ham tra ve ham, ham con day lai tra ve tham so truyen vao cho ham cha
var wr = function (a) {
    return function () {
        return a;
    }
}

// bien yr luu tru gia tri cho bien b
var yr = null;

// phuong thuc tao ra gia tri cho token
function sM(a) {
    // a la tham so dau vao mang kieu string; day cung la gia tri du lieu ma ta can dich
    var b;

    // neu yr khong khac null thi gan b = yr: hay noi cach khac la yr luu tru gia tri tai thoi diem hien tai cho b
    if (yr !== null) {
        b = yr;
    } else {
        // neu yr rog thi ta thuc hien set gia tri cho no

        b = wr(String.fromCharCode(84));
        // console.log(b) // b luc nay la function vi function wr la function tra ve function. Neu viet b() thi se tra ve ky tu T
        //  console.log(b()); // T

        // tuong tu voi gia tri cua bien c, se mang gia tri k
        var c = wr(String.fromCharCode(75));

        b = [b(), b()]; // b = ['T', 'T'];
        b[1] = c(); // b = ['T', 'K'];

        // phuong thuc b.join(c()) tra ve chuoi ky tu 'TKK'

        // gan gia tri cua key 'TKK' trong file config cho bien b va dong thoi cung cho luon bien yr
        b = ((yr = window[b.join(c())]) || "") || ""; // b = window['TKK'];

        // => b mang key cua file config

    }

    var d = wr(String.fromCharCode(116)) // d() se tra ve ky tu t
    c = wr(String.fromCharCode(107)) // c() se tra ve ky tu k

    d = [d(), d()]; // d = [t, t];
    d[1] = c(); // d = [t, k];

    c = '&' + d.join("") + "="; // tao ra chuoi ky tu &tk= se duoc gan trong url gui den serve cua google translate

    d = b.split('.') // do b = 426177.2206008990 nen su dung ham split('.') se cho d = ['426177', '2206008990']

    // lay gia tri phan nguyen cua b
    b = Number(d[0]) || 0;

    // console.log(b); // 426177

    // cong viec thuc hien generate gia tri cua token duoc thuc hien theo code co san nhu sau
    for (var e = [], f = 0, g = 0; g < a.length; g++) {
        var l = a.charCodeAt(g);
        128 > l ? e[f++] = l : (2048 > l ? e[f++] = l >> 6 | 192 : (55296 == (l & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023),
            e[f++] = l >> 18 | 240,
            e[f++] = l >> 12 & 63 | 128) : e[f++] = l >> 12 | 224,
            e[f++] = l >> 6 & 63 | 128),
            e[f++] = l & 63 | 128)
    }

    a = b;

    for (f = 0; f < e.length; f++)
        a += e[f],
            a = xr(a, "+-a^+6");
    a = xr(a, "+-3^+b+-f");
    a ^= Number(d[1]) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1E6;
    return c + (a.toString() + "." + (a ^ b))

    // => phuong thuc thuc hien viec ma hoa de tao ra cac token web trong viec request den serve google translate, tra ve chuoi token dang nhu: &tk=760952.859321

}

// code thuc hien viec generate ra gia tri cua token duoc cho san
var xr = function (a, b) {
    for (var c = 0; c < b.length - 2; c += 3) {
        var d = b.charAt(c + 2)
            , d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d)
            , d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
        a = "+" == b.charAt(c) ? a + d & 4294967295 : a ^ d
    }
    return a
};

// phuong thuc cho phep thuc hien duoc dich vu cua viec tao ra gia tri cua token
function get(text) {
    return updateTKK().then(function () {
        // text la chuoi can dich duoc truyen vao => nhu vay viec tao token se duoc ma hoa dua tren du lieu dau vao
        var tk = sM(text);
        console.log(tk); // &tk=760952.859321

        // thuc hien viec tra ra doi tuong de co the de dang truy cap key va value o ben ngoai khi lap rap vao url
        tk = tk.replace('&tk=', '');

        return { name: 'tk', value: tk };
    }).catch(function (err) {
        throw err;
    });
}

// Chia phuong thuc get ra de ben ngoai co the su dung duoc
module.exports.get = get;