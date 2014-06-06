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
    renderer = new THREE.SVGRenderer();

camera.position.set(0, 0, 300);
renderer.setSize(width, height);
renderer.setClearColor( 0xffffff, 1);

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
