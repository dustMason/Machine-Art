var SerialPort = require("serialport"),
    WebSocketServer = require('ws').Server,
    http = require('http'),
    express = require('express'),
    app = express();

var serialport = new SerialPort.SerialPort("/dev/tty.usbserial-A603G6VO", {
  baudrate: 9600,
  parser: SerialPort.parsers.readline("\n")
  // dataBits: 8,
  // parity: 'none',
  // stopBits: 1,
  // flowControl: false
});

var MOTORS_READY = 6;

var instructions = [
  [0,0]
];
var motorsAreBusy = true;

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(8080);

var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws) {
  console.log('Opened WebSocketServer');
  ws.on("message", function(data, flags) {
    console.log("Got data over ws: ", data.split(","));
    var coordStrings = data.split(",");
    instructions.unshift([parseInt(coordStrings[0]), parseInt(coordStrings[1])]);
    sendNextCoordinates();
  });
  ws.on('close', function() {
    console.log('Closing WebSocketServer');
  });
});

function sendNextCoordinates(x, y) {
  if (!motorsAreBusy && instructions.length > 0) {
    serialport.drain(function(){
      var command = "D" + instructions.pop().join(" ");
      console.log("Sending:", command);
      serialport.write(command + "\n");
    });
    motorsAreBusy = true;
  }
}

serialport.on("open", function() {
  console.log("Serial port open.");
  serialport.write("\nHELLO YOU\n");
  serialport.on("data", function(data) {
    console.log(data);
    if (parseInt(data) === MOTORS_READY) {
      motorsAreBusy = false;
      console.log("Motors are ready.");
    }
    sendNextCoordinates();
  });
});

