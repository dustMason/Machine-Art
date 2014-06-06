/* OpenProcessing Tweak of *@*http://www.openprocessing.org/sketch/31151*@* */
/* !do not delete the line above, required for linking your tweak if you upload again */

import processing.pdf.*;

// 1px == 1mm in gcode

void setup() {
  size(1200, 900);
  smooth();
  noLoop();
}

void draw() {
  background(255);
  noFill();
  stroke(0,12);
  strokeWeight(0.5);
  
  GcodeWriter gcode = new GcodeWriter(2000, width, height, 0.5);

  int dia = 240;
  PVector vector = makeChord(dia);
  gcode.moveTo(vector.x, vector.y);
  gcode.startDrawing();

  for (int i = 0; i < 10000; i++) {
    PVector newVector = makeChord(dia);
    line(vector.x, vector.y, newVector.x, newVector.y);
    gcode.moveTo(newVector.x, newVector.y);
    vector = newVector;
  }
  
  gcode.saveFile("sphere");
}

PVector makeChord(int diameter) {
  float angle = randomAngle();
  return new PVector(width/2 + cos(angle) * diameter, height/2 + sin(angle) * diameter);
}

float randomAngle() {
  return random(TWO_PI);
}

void mousePressed() {
  redraw();
}                               

