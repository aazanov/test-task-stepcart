//Объект для кеширования DOM
var cacheElem = {
    status: document.querySelector("#status")
    ,description: document.querySelector("#description")
    ,send: document.querySelector("#send")
    ,count: document.querySelector("#count")
}

//глобальный объект конфигурации
var conf = {
    portion: 500                //размер порции сообщений
    ,period: 1000               //период отправки порции, мс
    ,totalMessages: 1000000     //общее количество сообщений
}

//Глобальная переменная для локальных функций
var app = {
//Общее количество сообщений    
    totalSended: 0
//контроль элемента статуса
    ,setStatus(text){
        cacheElem.status.innerHTML = "Статус: " + text;
    }
//создаем случайный хеш
    ,getHash(){
        return Date.now().toString(16) + Math.round(Math.random()*100).toString(16); 
    }
//создаем сообщение
    ,getMessage(){
        return {
            id: app.getHash()
            ,description: cacheElem.description.value
        }
    }
//команда отправки
    ,send(msg){
        if (!app.socket){
            return;
        }
        app.socket.emit('message', msg);
    }
/*генерируем сообщения, 
total - сколько всего сообщений
*/
    ,generateMessages(total){
        var helper = function(){
            for (var i=0 ; i<conf.portion ; i++){
                app.send(app.getMessage());
                app.totalSended ++;
                if (app.totalSended >= total){
                    clearInterval(app.timer);
                    cacheElem.send.removeAttribute('disabled');
                    break;
                }
            } 
        }
        helper();
        app.timer = setInterval(helper, conf.period);
    }
}

window.onload = function(){
    socket = io.connect('http://192.168.1.216:888');
    socket.on('connect', function () {
        app.setStatus("Соединение установлено");
        app.socket = socket;
    });
    socket.on('disconnect', function(){
        app.setStatus("Разрыв соединения");
        app.socket = null;
    });
    socket.on('message', function(msg){
        console.log(msg);
    });
}

//Обработчик нажатия кнопки
cacheElem.send.onclick = function(){
    console.log(parseInt(cacheElem.count.value, 10));
    app.totalSended = 0;
    app.generateMessages(parseInt(cacheElem.count.value, 10) || conf.totalMessages);
    cacheElem.send.setAttribute('disabled','disabled');
    
}