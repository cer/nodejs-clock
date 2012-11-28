var express = require('express')
    , http = require('http')
    , app = express()
    , server = http.createServer(app)
    , io = require('socket.io').listen(server)
    , 	amqpHelper = require("./amqphelper")

    ;


app.configure(function(){
    app.use(express.static(__dirname + '/public'));
});

var amqpConnection = amqpHelper.initializeAmqp();

server.listen(8081);

io.sockets.on('connection', function (socket) {
   var queueForSocket;
   var ctag;
   function amqpMessageHandler(message, headers, deliveryInfo) { 
        var m = JSON.parse(message.data.toString());
   		console.log("message", m);
        socket.emit('tick', m.tick);
    };
    amqpConnection.queue('', {},
         function(queue) {
         	 queueForSocket = queue;
             queue.bind("tickTock", '');  
             queue.subscribe(amqpMessageHandler).addCallback(function(ok) { ctag = ok.consumerTag; });;
    });

    socket.on('disconnect', function () {
    	console.log("disconnect");
    	queueForSocket.unsubscribe(ctag);
    });
});

