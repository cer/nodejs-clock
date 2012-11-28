var amqp = require('amqp')
, cloudfoundry = require('cloudfoundry')
;
           
exports.initializeAmqp = function () {
  var connectionParams = { host: 'localhost' }
  if (cloudfoundry.port) {
      var rabbitmqService = cloudfoundry.rabbitmq['tick-rabbitmq']
      console.log(rabbitmqService)
      connectionParams = {url: rabbitmqService.credentials.url}
  }

  var con = amqp.createConnection(connectionParams, {}, 
      function () { 
        console.log("Ready callback invoked");
      });
  
  var timerId = undefined;

  con.on('error', function() { 
      console.log("AMQP connection error")
  });

  con.on('connected', function() { 
      console.log("AMQP connection connected")
  });

  con.on('ready', function() { 
      if (timerId) {
        console.log("AMQP connection ready - cancelling reconnect");
        clearInterval(timerId);
        timerId = undefined;
      }
  });

  con.on('close', function() { 
    console.log("AMQP connection closed.");

    function tryReconnect() {
      console.log("Trying reconnect");
      con.reconnect();
    };

    if (!timerId) {
      console.log("Scheduling reconnect.");
      timerId = setInterval(tryReconnect, 5 * 1000);
    }

  });
  return con;
}
