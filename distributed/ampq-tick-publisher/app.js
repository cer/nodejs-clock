var 
	amqpHelper = require("./amqphelper")
    ;

var amqpConnection = amqpHelper.initializeAmqp();

var tickTockExchange = undefined;

amqpConnection.on('ready',
    function() {      
        amqpConnection.exchange("tickTock", options = {passive: false, type: 'fanout'},
            function(exchange) {
                tickTockExchange = exchange;
        }); 
    });

	function tick() {
		var message = { tick: Date.now() };
		console.log("message", message);
tickTockExchange.publish("tickTock", message, {
        mandatory: true,
        contentType: "text/plain"  // application/json ends up as binary in SI     
    });
	};


	setInterval(tick, 1000);