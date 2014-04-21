var width = 600,
    height = 800,
    leftRightMargin = 20,
    topBottomMargin = 20,
    scene = new THREE.Scene(),
    camera = new THREE.OrthographicCamera(
      (width/2 * -1) - leftRightMargin,
      (width/2) + leftRightMargin,
      (height/2) * -1 - topBottomMargin,
      (height/2) + topBottomMargin,
      -1000,
      1000
    ),
    renderer = new THREE.SVGRenderer(),
    generateButton = document.getElementById("btn-generate"),
    gcodeText = document.getElementById("gcode");

camera.position.set(0, 0, 300);
renderer.setSize(width, height);
renderer.setClearColor( 0xffffff, 1);

generateButton.onclick = function(e) {
  e.preventDefault();
  var XMLS = new XMLSerializer();
  var svgfile = XMLS.serializeToString(renderer.domElement);

//   var distance = function(fromPathArray, toPathArray) {
//     if (fromPathArray.value[0][0] === "M" && toPathArray.value[0][0] === "M") {
//       var xs = (toPathArray.value[0][1] - fromPathArray.value[0][1])^2;
//       var ys = (toPathArray.value[0][2] - fromPathArray.value[0][2])^2;
//       return Math.sqrt(xs + ys);
//     } else {
//       return 0;
//     }
//   };
//
//   var rawSvg = svgfile;
//   var newSvgElm = document.createElement('svg');
//   var outputSvgElm = document.createElement('svg');
//   var draw = SVG(newSvgElm);
//   var output = SVG(outputSvgElm).size(600, 800);
//   var store = draw.svg(rawSvg);
//   var roots = store.roots();
//   for (var rootIndex in roots) {
//     // sort all the paths so that each one starts as close as possible to the next
//     var children = roots[rootIndex].children(); // .slice(0);
//     var sortedChildren = [children[0]];
//     children = children.slice(1);
//
//     while (children.length > 0) {
//       var winner = sortedChildren.slice(-1)[0],
//           newWinnerIndex,
//           bestDistance = 10000000;
//
//       for (var i = 0; i < children.length; i++) {
//         var dist = distance(winner.array, children[i].array);
//         if (dist < bestDistance) {
//           bestDistance = dist;
//           newWinnerIndex = i;
//         }
//         if (dist === 0) break;
//       }
//       console.log(newWinnerIndex);
//       sortedChildren.push(children[newWinnerIndex]);
//       children = children.splice(newWinnerIndex, 1);
//
//       // children = children.sort(function(a, b) {
//       //   return distance(winner.array, a.array) - distance(winner.array, b.array);
//       // });
//     }
//
//     for (var i = 0; i < sortedChildren.length; i++) {
//       output.path(sortedChildren[i].array.toString());
//     }
//   }
//
//   var XMLS2 = new XMLSerializer();
//   var sortedSvgFile = XMLS2.serializeToString(outputSvgElm);

  gcodeText.innerHTML = svg2gcode(svgfile, {
    feedRate: 1500,
    seekRate: 10000,
    bitWidth: 1,
    scale: 0.75
  });
};

var lines = new THREE.MeshBasicMaterial({ color: 0x666666, wireframe: true, wireframeLinewidth: 1 });
var multiMaterial = [ lines ];

var columns = 18;
var rows = 24;
var shapeDiameter = 16;
var topMargin = 17;
var leftMargin = topMargin;

var columnSpacing = width/columns;
var rowSpacing = height/rows;

for (i = 0; i < columns; i++) {
  for (j = 0; j < rows; j++) {
    var shape = THREE.SceneUtils.createMultiMaterialObject(
      new THREE.OctahedronGeometry(shapeDiameter, 0),
      multiMaterial );
    shape.position.set(
      i * columnSpacing - (width/2) + shapeDiameter,
      j * rowSpacing - (height/2) + shapeDiameter,
      0
    );
    shape.rotation.x = i/10;
    shape.rotation.z = j/9;
    shape.rotation.y = j/8;
    scene.add(shape);
  }
}

document.getElementById('svg').appendChild(renderer.domElement);

renderer.render(scene, camera);
