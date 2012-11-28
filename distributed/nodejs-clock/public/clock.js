var socket = io.connect(location.hostname);

function ClockModel() {
	self.ticker = ko.observable(1);

  socket.on('tick', function (data) {
    self.ticker(data);
  });

};

ko.applyBindings(new ClockModel());

