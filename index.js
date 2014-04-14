var SerialPort = require("serialport"),
    WebSocketServer = require('ws').Server,
    http = require('http'),
    express = require('express'),
    app = express();

// var serialport = new SerialPort.SerialPort("/dev/tty.usbserial-A603G6VO", {
//   baudrate: 9600,
//   parser: SerialPort.parsers.readline("\n")
//   // dataBits: 8,
//   // parity: 'none',
//   // stopBits: 1,
//   // flowControl: false
// });

app.use(express.static(__dirname + '/public'));

var server = http.createServer(app);
server.listen(8080);

var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws) {
  console.log('Opened WebSocketServer');
  ws.on("message", function(data, flags) {
    console.log("Got data over ws: ", data.split(","));
  });
  ws.on('close', function() {
    console.log('Closing WebSocketServer');
  });
});


