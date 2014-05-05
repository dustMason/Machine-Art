Array.prototype.rotate = (function() {
  // save references to array functions to make lookup faster
  var push = Array.prototype.push,
  splice = Array.prototype.splice;
  return function(count) {
    var len = this.length; // >>> 0, // convert to uint
    // count = count >> 0; // convert to int
    // convert count to value in range [0, len[
    count = ((count % len) + len) % len;
    // use splice.call() instead of this.splice() to make function generic
    push.apply(this, splice.call(this, 0, count));
    return this;
  };
})();

var canvas = document.createElement('canvas');
document.getElementById("work-area").appendChild(canvas);
paper.setup(canvas);

var raster = new paper.Raster({
  source: '/art/portrait_bw.jpg',
  // position: paper.view.center
  position: new paper.Point(390,500) // why wont you just center?! ergh
});

var columns = 40;
var triangles = [];

raster.on('load', function() {
  raster.visible = false;
  var triangleRadius = raster.width / columns;
  for (var row = 0; row < columns * 2; row++) {
    for (var col = 0; col < columns; col++) {
      var path = new paper.Path.RegularPolygon({
        center: new paper.Point(0,0),
        radius: triangleRadius,
        sides: 3
      });
      path.rotation = 180 * (col % 2) - 90;
      // path.rotation = col;
      // path.rotation = 60;
      var triangleHeight = path.bounds.height;
      var triangleWidth = path.bounds.width;
      path.position = new paper.Point(
        (col * triangleWidth) + ((row % 2) * triangleWidth),
        // (col * triangleWidth) + ((row % 2) * triangleWidth/2),
        (row * triangleHeight/2)
      );
      var color = raster.getAverageColor(path);
      if (color) {
        path.fillColor = color.convert("gray");
      }
      triangles.push(path);
    }
  }
  paper.project.activeLayer.position = paper.view.center;
});

generateButton = document.getElementById("btn-generate");
generateButton.onclick = function(e) {
  e.preventDefault();

  canvas.style.display = "none";
  var NS = "http://www.w3.org/2000/svg";
  var svgElm = document.createElementNS(NS,"svg");
  svgElm.width = 600;
  svgElm.height = 800;
  document.getElementById("svg").appendChild(svgElm);

  for (i = 0; i < triangles.length; i++) {
    var color = triangles[i].fillColor;
    if (!color) { color = 1; } else { color = color.gray; }
    if (color < 0.70) {
      var points = [
        [triangles[i].segments[0].point.x, triangles[i].segments[0].point.y],
        [triangles[i].segments[1].point.x, triangles[i].segments[1].point.y],
        [triangles[i].segments[2].point.x, triangles[i].segments[2].point.y]
      ];
      var tri;
      // if (points[0][0] < 280) {
        tri = makeTriangle(points, valueToStepSize(color));
      // } else {
        // tri = makeTriangle(points.rotate(1), valueToStepSize(color));
      // }
      svgElm.appendChild(tri);
    }
    // if (i === 100) break;
  }

  var XMLS = new XMLSerializer();
  var svgfile = XMLS.serializeToString(svgElm);

  document.getElementById("gcode").innerHTML = svg2gcode(svgfile, {
    feedRate: 1500,
    seekRate: 10000,
    bitWidth: 1,
    scale: 0.75,
    verticalSlices: 10,
    horizontalSlices: 10
  });

};

function shuffle(array) {
  var counter = array.length, temp, index;
  while (counter > 0) {
    // Pick a random index
    index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

function valueToStepSize(val) {
  // 0 == black
  // 1 == white
  return (val * 4) + 0.8;
}

// 'pts' is a 3x2 array ([3][2]) for the three triangle points
// 'step' is the approximate step distance between lines
function makeTriangle(pts, step) {
  var ax = pts[0][0];
  var ay = pts[0][1];
  var bx = pts[1][0];
  var by = pts[1][1];
  var cx = pts[2][0];
  var cy = pts[2][1];

  // Get AC line length
  var a_dx = cx - ax,
  a_dy = cy - ay;
  var ac_len = Math.sqrt(a_dx * a_dx + a_dy * a_dy);
  // Get BC line length
  var b_dx = cx - bx,
  b_dy = cy - by;
  bc_len = Math.sqrt(b_dx * b_dx + b_dy * b_dy);

  // Whichever line is shortest will determine the number of steps
  var len = (ac_len < bc_len) ? ac_len : bc_len;

  // ac step amounts
  a_dx = step * a_dx / len;
  a_dy = step * a_dy / len;

  // bc step amounts
  b_dx = step * b_dx / len;
  b_dy = step * b_dy / len;

  var poly = [];
  // first two points
  poly.push(ax);
  poly.push(ay);
  poly.push(bx);
  poly.push(by);
  while (len > step) {
    // step along the ac and bc lines
    ax += a_dx;
    ay += a_dy;
    bx += b_dx;
    by += b_dy;
    // add the line going from the bc line to the ac line
    poly.push(bx);
    poly.push(by);
    poly.push(ax);
    poly.push(ay);
    len -= step;
    if (len < step) break;
    // step again
    ax += a_dx;
    ay += a_dy;
    bx += b_dx;
    by += b_dy;
    // add line going back again
    poly.push(ax);
    poly.push(ay);
    poly.push(bx);
    poly.push(by);
    len -= step;
  }
  poly.push(cx);
  poly.push(cy);

  var tri = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  tri.setAttribute("fill", "none");
  tri.setAttribute("stroke", "black");
  tri.setAttribute("stroke-width", 0.5);
  tri.setAttribute("points", poly.join(","));
  return tri;
}
