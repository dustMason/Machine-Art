var artworks = [
  '/js/canny_tesselated_portrait.js',
  '/js/tesselated_portrait.js',
  '/js/shaded_sphere.js',
  '/js/shaded_torus_knot.js',
  '/js/kinect_mesh_experiment.js',
  '/js/pattern_brush.js',
  '/art/dot.svg',
  '/art/spiral.svg',
  '/js/tetrahedron_field.js'
];

var $svgElm = $("#svg"),
    $menu = $("#menu-art"),
    generateButton = document.getElementById("btn-generate"),
    copyButton = document.getElementById("btn-copy"),
    gcodeText = document.getElementById("gcode");

artworks.forEach(function(artwork) {
  $menu.append($("<option value=\""+artwork+"\">"+artwork+"</option>"));
});

$menu.change(function(e) {
  e.preventDefault();
  var artwork = $(this).val();
  $svgElm.html("");
  $("#work-area").find("canvas").remove();

  generateButton.onclick = function(e) {
    e.preventDefault();
    var XMLS = new XMLSerializer();
    var svgfile = XMLS.serializeToString($svgElm.get(0));

    gcodeText.innerHTML = svg2gcode(svgfile, {
      feedRate: 1500,
      seekRate: 10000,
      bitWidth: 1,
      scale: 0.75
    });
  };

  if (artwork.indexOf("js") > 0) {
    $.getScript(artwork);
  } else if (artwork.indexOf("svg") > 0) {
    $.get(artwork, null, function(data) {
      var svgNode = $("svg", data);
      var docNode = document.adoptNode(svgNode[0]);
      $svgElm.html(docNode);
    }, 'xml');
  }
}).change();

