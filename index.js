var SerialPort = require("serialport");

var serialport = new SerialPort.SerialPort("/dev/tty.usbserial-A603G6VO", {
  baudrate: 9600,
  parser: SerialPort.parsers.readline("\n"),
  dataBits: 8,
  parity: 'none',
  stopBits: 1,
  flowControl: false
});

var instructions = [
  [0,0],
  [300,100],
  [300,200],
  [0,300],
  [15,5],
  [0,0],
  [0,0]
];

function sendCoordinates(x, y) {
  [x,y].forEach(function(coord) {
    var buf = new Buffer(2);
    buf.writeUInt16LE(coord, 0);
    console.log("Sending "+coord+" over serial...");
    serialport.drain(function(){
      serialport.write(buf);
    });
  });
}

serialport.on("open", function() {
  console.log("Serial port open.");
  serialport.on("data", function(data) {
    console.log(data);
    if (parseInt(data) === 6 && instructions.length > 0) {
      console.log("Motors are ready.");
      var coords = instructions.pop();
      sendCoordinates(coords[0], coords[1]);
    }
  });
});

