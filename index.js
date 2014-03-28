var HID = require("node-hid"),
    _ = require("underscore"),
    N64Controller = require("n64controller"),
    SerialPort = require("serialport");

HID.devices().forEach(function(device) {
  if (device.vendorId === 121 && device.productId === 6)
    controller = new N64Controller(device.path);
});

var serialport = new SerialPort.SerialPort("/dev/tty.usbserial-A603G6VO", {
  baudrate: 9600,
  parser: SerialPort.parsers.readline("\n")
});

var dpadData = "";

serialport.on("open", function() {
  console.log("serial port open");
  var sendAnalogStickDataOverSerial = function() {
    var delta = [1,1];
    if (dpadData) {
      if (dpadData.match(/N/)) delta[1] = 0;
      else if (dpadData.match(/S/)) delta[1] = 2;
      if (dpadData.match(/W/)) delta[0] = 0;
      else if (dpadData.match(/E/)) delta[0] = 2;
      // moveIt(delta);
      console.log(delta[0]);
      serialport.write(delta[0]);
    }
  };

  controller.on("dpad", function(direction) {
    dpadData = direction;
    sendAnalogStickDataOverSerial();
  });
});

