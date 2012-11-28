var express = require('express')
    , http = require('http')
    , app = express()
    , server = http.createServer(app)
    , io = require('socket.io').listen(server)
    ;


app.configure(function(){
    app.use(express.static(__dirname + '/public'));
});


server.listen(8081);

io.sockets.on('connection', function (socket) {
	var counter = 0;

	function tick() {
		counter = counter + 1;
		socket.emit('tick', counter);
	};
	setInterval(tick, 1000);
});

