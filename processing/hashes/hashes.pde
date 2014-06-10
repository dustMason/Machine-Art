import java.util.*;
import processing.pdf.*;

// GcodeWriter gcode;

PShape lineAngle(int x, int y, float angle, float length) {
  return createShape(LINE, x, y, x+cos(angle)*length, y-sin(angle)*length);
}

void setup () {
  size(800, 800, P2D);
  smooth();
  noLoop();
}

void draw() {
  background(255);
  beginRecord(PDF, "hashes.pdf");
  noFill();

  strokeWeight(1);
  stroke(0); // black

  for (int i = 0; i < 100; i++) {
    PShape scratch;
    scratch = createShape(GROUP);
    int x = (int)random(width);
    int y = (int)random(height);
    /* (float)radians = angle * (3,14/180) */
    for (int j = 0; j < 5; j++) {
      PShape aLine;
      aLine = lineAngle(x + (j * 10), y, (float)1, (float)100);
      scratch.addChild(aLine);
    }
    shape(scratch);
  }

  endRecord();
  // gcode.saveFile("hashes");
}
