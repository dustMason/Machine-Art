var NS = "http://www.w3.org/2000/svg";
var svgElm = document.createElementNS(NS,"svg");
svgElm.width = 600;
svgElm.height = 800;
document.getElementById("svg").appendChild(svgElm);

var canvas = document.createElement('canvas');
document.getElementById("work-area").appendChild(canvas);
paper.setup(canvas);

var video = document.createElement('video');
document.body.appendChild(video);
var hiddenCanvas = document.createElement('canvas');
hiddenCanvas.style.display = 'none';
document.body.appendChild(video);

var streaming = false, width = 600, height = 0;

navigator.getMedia = ( navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);

navigator.getMedia( { video: true, audio: false },
  function(stream) {
    if (navigator.mozGetUserMedia) {
      video.mozSrcObject = stream;
    } else {
      var vendorURL = window.URL || window.webkitURL;
      video.src = vendorURL.createObjectURL(stream);
    }
    video.play();
  },
  function(err) {
    console.log("An error occured! " + err);
  }
);

video.addEventListener('canplay', function(ev) {
  if (!streaming) {
    height = video.videoHeight / (video.videoWidth/width);
    video.setAttribute('width', width);
    video.setAttribute('height', height);
    hiddenCanvas.setAttribute('width', width);
    hiddenCanvas.setAttribute('height', height);
    streaming = true;
  }
}, false);

var getContoursFromWebcamImage = function() {
  // snap photo from webcam
  hiddenCanvas.width = width;
  hiddenCanvas.height = height;
  hiddenCanvas.getContext('2d').drawImage(video, 0, 0, width, height);
  var data = hiddenCanvas.toDataURL('image/png');

  // load contours from opencv endpoint
  $.post('/contours', { image: data }).done(function(jsonString) {
    paper.project.activeLayer.removeChildren();
    var json = JSON.parse(jsonString);
    for (var i = 0; i < json.length; i++) {
      var path = new paper.Path();
      path.strokeColor = 'black';
      // path.closed = true;
      json[i].forEach(function(pair) {
        path.add(new paper.Point(pair[0], pair[1]));
      });
      path.flatten(7);
      // path.simplify();

      // var pointData = json[i].map(function(pair) {
      //   return new poly2tri.Point(pair[0], pair[1]);
      // });
      // var swctx = new poly2tri.SweepContext(pointData);
      // swctx.triangulate();
      // var triangles = swctx.getTriangles();
      // triangles.forEach(function(t) {
      //   var path = new paper.Path();
      //   path.strokeColor = 'black';
      //   path.add(
      //     new paper.Point(t.getPoint(0).x, t.getPoint(0).y),
      //     new paper.Point(t.getPoint(1).x, t.getPoint(1).y),
      //     new paper.Point(t.getPoint(2).x, t.getPoint(2).y)
      //   );
      // });
    }
    paper.view.update();

    
    getContoursFromWebcamImage();
  });

  var XMLS = new XMLSerializer();
  var svgfile = XMLS.serializeToString(svgElm);
// canvas.style.display = "none";
  document.getElementById("gcode").innerHTML = svg2gcode(svgfile, {
    feedRate: 1500,
    seekRate: 10000,
    bitWidth: 1,
    scale: 0.75,
    verticalSlices: 10,
    horizontalSlices: 10
  });

};

generateButton = document.getElementById("btn-generate");
generateButton.onclick = function(e) {
  e.preventDefault();
  getContoursFromWebcamImage();
};

// function makePolyline(strokeWidth) {
//   var poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
//   poly.setAttribute("fill", "none");
//   poly.setAttribute("stroke", "black");
//   poly.setAttribute("stroke-width", strokeWidth);
//   return poly;
// }
