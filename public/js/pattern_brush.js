// Get a reference to the canvas object
var canvas = document.createElement('canvas');
document.getElementById("work-area").appendChild(canvas);
// Create an empty project and a view for the canvas:
paper.setup(canvas);

// load an image
var raster = new paper.Raster('/art/cyrelle.jpg');
// raster.position = paper.view.center;

var gridSize = 8;
var spacing = 1;

raster.on('load', function() {
  raster.size = new paper.Size(800/gridSize, 600/gridSize);
  raster.rotate(90);
  raster.visible = false;

  var layers = [ [], [], [], [] ];

  for (var y = 0; y < raster.height; y++) {
    for(var x = 0; x < raster.width; x++) {
      // Get the color of the pixel:
      var color = raster.getPixel(x, y).gray;

      var i = Math.floor(color*layers.length);
      layers[i].push(new paper.Point(x, y).multiply(gridSize).rotate(90, new paper.Point(0,0)));

    }
  }

  for (var layerIndex = 0; layerIndex < layers.length; layerIndex++) {
    var layer = layers[layerIndex];
    for (var pointIndex = 0; pointIndex < layer.length; pointIndex++) {
      // var path = new paper.Path.Circle({
      var path = new paper.Path.RegularPolygon({
        center: layer[pointIndex],
        radius: gridSize / 2 / spacing,
        sides: 3,
        strokeColor: 'black'
      });
      path.scale(1 - layerIndex / layers.length);
      path.rotation = Math.random() * 360;
    }
  }

  paper.project.activeLayer.position = paper.view.center;
});

// Create a Paper.js Path to draw a line into it:
// var path = new paper.Path();
// Give the stroke a color
// path.strokeColor = 'black';
// var start = new paper.Point(100, 100);
// Move to start and draw a line from there
// path.moveTo(start);
// Note that the plus operator on Point objects does not work
// in JavaScript. Instead, we need to call the add() function:
// path.lineTo(start.add([ 200, -50 ]));
// Draw the view now:
// paper.view.draw();
