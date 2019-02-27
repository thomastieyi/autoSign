var cheerio = require("cheerio");
var http = require("http");
var schedule = require("node-schedule");
const monk = require('monk');
const url1 = 'localhost:27017/books';
const db = monk(url1);
var url = "http://lib1.ustb.edu.cn:8080/opac/item.php?marc_no=000"
let begin = "";
const download = (url, callback) => {
    http.get(url, function (res) {
        var data = "";
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on("end", function () {
            callback(data);
        });
    }).on("error", function () {
        callback(null);
    });
}
const add = (i) => {
    let a = '';
    a = a + i;
    let buf = a
    for (let j = 7; j > a.length; j--) {
        buf = '0' + buf;
    }
    return buf
}
const scheduleCronstyle = () => {
    //     //每分钟的第30秒定时执行一次:
    let j = 0
    schedule.scheduleJob('30 * * * * *', () => {
        console.log('scheduleCronstyle:' + new Date());
        begin = add(2000 * j++)
        console.log(begin)
        for (let i = parseInt(begin); i < parseInt(begin) + 2000; i++) {
            console.log(url + add(i))
            download(url + add(i), function (data) {
                if (data) {
                    // console.log(data);
                    var $ = cheerio.load(data);
                    // console.log($("#item_detail").find('dl').text())
                    // console.log($('dl .booklist').text())
                    var infos = [];
                    let imgs = []
                    let buf_infos = {};
                    $("#item_detail").find('dl').each(function (i, elem) {
                        infos[i] = $(this).text();
                    });

                    //  console.log(infos);
                    for (let i = 0; i < infos.length - 1; i++) {
                        let buf = infos[i].split('\n\t\t\t\t\t\t\t\t\t')
                        //   console.log(buf)
                        buf_infos[buf[1]] = buf[2].split('\n')[0]
                    }
                    $("#sidebar_item").find('img').each(function (i, elem) {
                        imgs[i] = $(this).attr('src');
                    });
                    //console.log(imgs)
                    buf_infos["qr_code"] = imgs.pop();
                    if (buf_infos["题名/责任者:"] !== 'undefined' && buf_infos["qr_code"] !== 'undefined') {
                        console.log('tag', buf_infos)
                        db.get('infos').insert(buf_infos)
                    }
                }
            });
        }
    });
}

scheduleCronstyle();