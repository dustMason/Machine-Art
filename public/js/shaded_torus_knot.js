// var width = 600,
//     height = 800,
//     scene = new THREE.Scene(),
//     camera = new THREE.PerspectiveCamera(33, width / height, 0.1, 10000),
//     renderer = new THREE.SVGRenderer(),
//     directionalLight = new THREE.DirectionalLight(0xffffff),
//     controls = new THREE.TrackballControls(directionalLight),
//     requestAnimationFrameId = null;

// directionalLight.position.set(1,1,1).normalize();
// scene.add(directionalLight);

// function render() {
//   // controls.update();
//   // requestAnimationFrameId = requestAnimationFrame(render);
//   renderer.render(scene, camera);
// }
//
// camera.position.set(0, 0, 350);
// renderer.setSize(width, height);
// renderer.setClearColor( 0xff0000, 1);
//
// var solid = new THREE.MeshPhongMaterial({
//   specular: '#ffffff',
//   color: '#eeeeee',
//   emissive: '#000000',
//   shininess: 100
// });
// var shape = new THREE.Mesh(new THREE.TorusKnotGeometry(30, 18, 100, 20, 2, 3), solid);
// scene.add(shape);
// render();

generateButton = document.getElementById("btn-generate");
generateButton.onclick = function(e) {
  e.preventDefault();

  $.get("/art/torus_shaded.svg", null, function(data) {
    var svgNode = $("svg", data);
    var docNode = document.adoptNode(svgNode[0]);

    // console.log(docNode.outerHTML);
    // $svgElm.html(docNode);

    var svg = document.getElementById("svg");
    // var svgElm = svg.querySelector("svg");
    var svgElm = $('<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="600" height="800" viewBox="-300 -400 600 800" xml:space="preserve"></svg>').appendTo(svg);
    //"

    var paths = SVGReader.parse(docNode.outerHTML, {}).allcolors;

    // clear out existing SVG
    // window.cancelAnimationFrame(requestAnimationFrameId);
    // $(svgElm).empty();

    for (i = 0; i < paths.length; i++) {
      var color = paths[i].node.fill;
      if (!color) { color = 0; } else { color = color[0]; }
      if (paths[i].length > 4) {
        var triangles = triangulatePath(paths[i]);
        triangles.forEach(function(tri) {
          svgElm.get(0).appendChild(tri);
        });
      } else {
        var tri = makeTriangle([
          [paths[i][0].x, paths[i][0].y],
          [paths[i][1].x, paths[i][1].y],
          [paths[i][2].x, paths[i][2].y]
        ], valueToStepSize(color));
        // ], 2);
        svgElm.get(0).appendChild(tri);
      }
      // if (i === 100) { break; }
    }

    var XMLS = new XMLSerializer();
    var svgfile = XMLS.serializeToString(svgElm.get(0));

    document.getElementById("gcode").innerHTML = svg2gcode(svgfile, {
      feedRate: 1500,
      seekRate: 10000,
      bitWidth: 1,
      scale: 0.75,
      verticalSlices: 10,
      horizontalSlices: 10
    });

  }, 'xml');


};

function valueToStepSize(val) {
  // 0 == black
  // 255 == "white"
  var perc = (val+1)/256.0;
  return (perc * 3) + 1;
}

function triangulatePath(path) {
  var cleanedPath = [];
  var color = path.node.fill;
  if (!color) { color = 0; } else { color = color[0]; }
  $.each(path, function(i, el) {
    var dupe = cleanedPath.find(function(cleanEl) {
      return (el.x === cleanEl.x && el.y === cleanEl.y);
    });
    if (!dupe) cleanedPath.push(el);
  });
  try {
    var swctx = new poly2tri.SweepContext(cleanedPath);
    swctx.triangulate();
    var triangles = swctx.getTriangles();
    return triangles.map(function(t) {
      return makeTriangle([
        [t.getPoint(0).x, t.getPoint(0).y],
        [t.getPoint(1).x, t.getPoint(1).y],
        [t.getPoint(2).x, t.getPoint(2).y]
      ], valueToStepSize(color));
      // ], 2);
    });
  } catch(e) {
    console.log(e);
    return [];
  }
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

// document.getElementById('svg').appendChild(renderer.domElement);
