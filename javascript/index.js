var SerialPort = require("serialport"),
    cv = require('opencv'),
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
app.use(express.json());
app.use(express.urlencoded());

app.post('/contours', function(req, res){

  // console.log("req from " + req.connection.remoteAddress);

  var response = [];
  var imageData = new Buffer(req.body.image.replace(/^data:image\/png;base64,/,""), 'base64');
  var imageDataStream = new cv.ImageDataStream();

  imageDataStream.on('load', function(image) {

    var lowThreshold = 1;
    var highThreshhold = 100;
    var nIters = 3;
    var maxArea = 15;
    var blurAmount = 7;

    cv.readImage(image.toBuffer(), function(err, image) {
      image.convertGrayscale();
      var im_canny = image.copy();
      im_canny.gaussianBlur([blurAmount,blurAmount]);
      im_canny.canny(lowThreshold, highThreshhold);
      // im_canny.dilate(nIters);
      // im_canny.erode(nIters);
      contours = im_canny.findContours();
      for (i = 0; i < contours.size(); i++) {
        if (contours.area(i) > maxArea) {
          if (contours.cornerCount(i) < 10) continue;
          var points = [];
          for (var j = 0; j < contours.cornerCount(i); j++) {
            var point = contours.point(i, j);
            points.push([point.x, point.y]);
          }
          response.push(points);
        }
      }
      res.send(JSON.stringify(response));
    });
  });

  imageDataStream.write(imageData);
  imageDataStream.end();

});

var server = http.createServer(app);
server.listen(8080);

// var wss = new WebSocketServer({server: server});
// wss.on('connection', function(ws) {
//   console.log('Opened WebSocketServer');
//   ws.on("message", function(data, flags) {
//     console.log("Got data over ws: ", data.split(","));
//   });
//   ws.on('close', function() {
//     console.log('Closing WebSocketServer');
//   });
// });
