//JS document
//Created 23.01.2017
//Author Azanov A.A.

var server = require('./app.js');
var http = require('http');
var io = require('socket.io').listen(888);
var fs = require('fs');

//параметры приложения
var par = {
    httpPort: 3500
}

//создаем сервер для контента. Частично задействуем Jade
http.createServer(server).listen(par.httpPort);
console.log('Server started at port ' + par.httpPort);

//глобальный объект локальных функций
var app = {
    totalRecieved: 0
    ,changeMessage(msg){
        if (typeof(msg) === 'object'){
            var obj = {};
            var date = new Date();
            obj[msg.id] = {
                description: msg.description
                ,date: date.toDateString() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
            }
            return obj;
        }
    }
}

var stream = fs.createWriteStream('out.txt');

//запускаем прослушку сокетов
io.sockets.on('connection', function (socket) {
    
    console.log('Client connected');
    socket.on('message', function(msg){
        app.totalRecieved ++;
        if (app.totalRecieved%1000 === 0){
            console.log(app.totalRecieved + ':' + JSON.stringify(app.changeMessage(msg)));
        }
        stream.write(JSON.stringify(app.changeMessage(msg)) + '\n');
    });
});