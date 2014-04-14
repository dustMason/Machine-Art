// var host = window.document.location.host.replace(/:.*/, '');
// var ws = new WebSocket('ws://' + host + ':8080');

var width = window.innerWidth,
    height = window.innerHeight,
    scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(33, width / height, 0.1, 119),
    renderer = new THREE.WebGLRenderer({alpha: true}),
    canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    image = new Image();

camera.position.set(0, 0, 120);
renderer.setSize(width, height);
renderer.setClearColor( 0xffffff, 1);

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
  var solid = new THREE.MeshBasicMaterial({ color: 0xdddddd, transparent: true });
  var lines = new THREE.MeshBasicMaterial({ color: 0x666666, wireframe: true, wireframeLinewidth: 3 });
  var mesh = THREE.SceneUtils.createMultiMaterialObject(geometry, [solid, lines]);
	scene.add(mesh);
  render();
};

var controls = new THREE.TrackballControls(camera);

document.getElementById('webgl').appendChild(renderer.domElement);

function render() {
  controls.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

image.src = 'kinect_frame_half.png';
