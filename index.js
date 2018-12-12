let express = require('express');
let app = express();
let Iconv = require('iconv-lite');
let request = require('request')
const options = {
    method: 'get',
    url: 'http://202.204.48.66',
    encoding: null,
}
const  {exec}  = require('child_process');
// 输出当前目录（不一定是代码所在的目录）下的文件和文件夹
var schedule = require('node-schedule');

 scheduleCronstyle=()=>{
    schedule.scheduleJob('30 * * * * *', ()=>{
        request(options,  (error, response, body) =>{
            if (!error && response.statusCode == 200) {
              let data = Iconv.decode(body, 'gb2312').toString(); // 打印google首页
              if (data.indexOf('value="登录"')!=-1){
                  console.log('shangweodenglu1')
          
                  exec('curl http://202.204.48.66 -X POST -d "DDDDD=41624389&upass=10220332&v6ip=&0MKKey=123456789"|iconv -f gb2312 -t utf-8', (err, stdout, stderr) => {
                      if(err) {
                          console.log(err);
                          return;
                      }
                      console.log(`stdout: ${stdout}`);
                      console.log(`stderr: ${stderr}`);
                  })
                 
                
          
              }
              else if(data.indexOf('value="本机注销"')!=-1){
                  console.log('already login')
                
              }
            }
          })
    }); 
}

scheduleCronstyle();


app.get('/', function (req, res) {
   res.send('Hello World');
})
 
let server = app.listen(8082, function () {
 
  let host = server.address().address
  let port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})