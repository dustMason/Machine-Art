var width = 600,
    height = 800,
    scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(33, width / height, 0.1, 119),
    renderer = new THREE.SVGRenderer(),
    // renderer = new THREE.WebGLRenderer(),
    canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    image = new Image(),
    requestAnimationFrameId = null;

var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1,1,1).normalize();
scene.add(directionalLight);

camera.position.set(0, 0, 120);
renderer.setSize(width, height);
renderer.setClearColor( 0xff0000, 1);

image.onload = function() {
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0, image.width, image.height);
  var data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  var geometry = new THREE.PlaneGeometry(60, 60, image.width-1, image.height-1);
  for (var i = 0, j = 0, l = geometry.vertices.length; j < l;) {
    geometry.vertices[j].z = data[i] / 10;
    j++;
    i += 4;
  }

  THREE.GeometryUtils.triangulateQuads(geometry);

  // var solid = new THREE.MeshLambertMaterial({ color: 0xffffff });
  var solid = new THREE.MeshPhongMaterial({
    specular: '#ffffff',
    color: '#eeeeee',
    emissive: '#000000',
    shininess: 100
  });
  // var lines = new THREE.MeshBasicMaterial({ color: 0x666666, wireframe: true, wireframeLinewidth: 1 });
  // solid.side = THREE.DoubleSide;
  var mesh = new THREE.Mesh(geometry, solid);
  mesh.overdraw = true;

  scene.add(mesh);
  render();

};

generateButton = document.getElementById("btn-generate");
generateButton.onclick = function(e) {
  e.preventDefault();
  var svg = document.getElementById("svg");
  var svgElm = svg.querySelector("svg");
  var paths = SVGReader.parse(svg.innerHTML, {}).allcolors;
  // var XMLS = new XMLSerializer();
  // var svgfile = XMLS.serializeToString(svg);

  // clear out existing SVG
  window.cancelAnimationFrame(requestAnimationFrameId);
  $(svgElm).empty();

  for (i = 0; i < paths.length; i++) {
    // console.log(paths[i]);
    // console.log(paths[i].node.fill);
    var tri = makeTriangle([
      [paths[i][1].x, paths[i][1].y],
      [paths[i][2].x, paths[i][2].y],
      [paths[i][3].x, paths[i][3].y]
    ], valueToStepSize(paths[i].node.fill[0]));
    svgElm.appendChild(tri);
    // if (i === 100) { break; }
  }

};

function valueToStepSize(val, longestSide) {
  // 0 == black
  // 255 == "white"
  // return (((val - 255) / 255) * 10) * -1;
  return val+10 / 4;
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
  tri.setAttribute("stroke-width", 1);
  tri.setAttribute("points", poly.join(","));
  return tri;
}

var controls = new THREE.TrackballControls(directionalLight);

document.getElementById('svg').appendChild(renderer.domElement);

function render() {
  controls.update();
  requestAnimationFrameId = requestAnimationFrame(render);
  renderer.render(scene, camera);
}

image.src = '/art/kinect_frame_half.png';
