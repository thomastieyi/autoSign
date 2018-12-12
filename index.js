let Iconv = require('iconv-lite');
let request = require('request')
let config = require('./config')
const chalk = require('chalk');
const options = {
    method: 'get',
    url: config.URL,
    encoding: null,
}
const {
    exec
} = require('child_process');
exec('curl http://202.204.48.66 -X POST -d "DDDDD=' + config.userName + '&upass=' + config.password + '&v6ip=&0MKKey=123456789"|iconv -f gb2312 -t utf-8', (err, stdout, stderr) => {
    if (err) {
        console.log(err);
        return;
    }
    if (stdout.indexOf('您已经成功登录') != -1) {
        console.log(chalk.green('successful login'))

    } else {
        console.error(chalk.red('you have no fee or worng argments'))
    }
})
let schedule = require('node-schedule');
scheduleCronstyle = () => {
    schedule.scheduleJob('30 * * * * *', () => {
        request(options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                let data = Iconv.decode(body, 'gb2312').toString(); // 打印google首页
                if (data.indexOf('value="登录"') != -1) {
                    console.log(chalk.red('you are off-line due to unknow reason, trying to reconnect'))

                    exec('curl http://202.204.48.66 -X POST -d "DDDDD=' + config.userName + '&upass=' + config.password + '&v6ip=&0MKKey=123456789"|iconv -f gb2312 -t utf-8', (err, stdout, stderr) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        console.log(chalk.green('success!'))
                    })



                } else if (data.indexOf('value="本机注销"') != -1) {
                    console.log(chalk.yellow('already login'))

                }
            }
        })
    });
}

scheduleCronstyle();