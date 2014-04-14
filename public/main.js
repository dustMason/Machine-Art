// var host = window.document.location.host.replace(/:.*/, '');
// var ws = new WebSocket('ws://' + host + ':8080');

var width = window.innerWidth - 350,
    height = window.innerHeight,
    scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(33, width / height, 0.1, 10000),
    // controls = new THREE.TrackballControls(camera),
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

  // settings = settings || {};
  // settings.passes = settings.passes || 1;
  // settings.materialWidth = settings.materialWidth || 6;
  // settings.passWidth = settings.materialWidth/settings.passes;
  // settings.scale = settings.scale || -1;

  gcodeText.innerHTML = svg2gcode(svgfile, {
    cutZ: 32,
    safeZ: 90,
    feedRate: 1400,
    seekRate: 1100,
    bitWidth: 1
  });
};

// var solid = new THREE.MeshBasicMaterial({ color: 0xdddddd, transparent: true });
var lines = new THREE.MeshBasicMaterial({ color: 0x666666, wireframe: true, wireframeLinewidth: 1 });
// var multiMaterial = [ solid, lines ]; 
var multiMaterial = [ lines ]; 

	var shape = THREE.SceneUtils.createMultiMaterialObject( 
		new THREE.TorusKnotGeometry( 30, 18, 200, 30, 2, 3 ), 
		multiMaterial );

scene.add(shape);
render();

document.getElementById('svg').appendChild(renderer.domElement);

function render() {
  // controls.update();
  // requestAnimationFrame(render);
  renderer.render(scene, camera);
}

