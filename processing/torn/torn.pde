import java.util.*;
import processing.pdf.*;
import org.processing.wiki.triangulate.*;

final String filename = "cannonball";
int particleNum = 60000;

PImage input;
ArrayList <PVector> pointCloud;
ArrayList triangles = new ArrayList();
HashMap <String,Line> lines;
GcodeWriter gcode;

void setup () {
  input = loadImage(filename + ".jpg");
  size(input.width, input.height);
  smooth();
  noLoop();
  pointCloud = new ArrayList();
  gcode = new GcodeWriter(3000, width, height, 0.8);
  pointCloud = findTargets(input, particleNum);

  /* ArrayList<Line> linesToDraw; */
  /* linesToDraw = new ArrayList<Line>(lines.values()); */
  Collections.sort(pointCloud, new Comparator<PVector>() {
    public int compare(PVector pv1, PVector pv2) {
      return (int)((pv1.y * width + pv1.x) - (pv2.y * width + pv2.x));
    }
  });

  triangles = Triangulate.triangulate(pointCloud);
}

void draw() {
  background(255);
  beginRecord(PDF, filename + ".pdf");
  noFill();

  strokeWeight(0.2);
  stroke(0); // black

  Triangle firstTri = (Triangle)triangles.get(0);
  gcode.up();
  gcode.go(firstTri.p1.x, firstTri.p1.y);

  lines = new HashMap(triangles.size());

  beginShape(TRIANGLES);
  for (int i = 0; i < triangles.size(); i++) {
    Triangle t = (Triangle)triangles.get(i);
    lines.put(
      String.format("%s;%s;%s;%s", t.p1.x, t.p1.y, t.p2.x, t.p2.y),
      new Line(new PVector(t.p1.x, t.p1.y), new PVector(t.p2.x, t.p2.y))
    );
    lines.put(
      String.format("%s;%s;%s;%s;", t.p2.x, t.p2.y, t.p3.x, t.p3.y),
      new Line(new PVector(t.p2.x, t.p2.y), new PVector(t.p3.x, t.p3.y))
    );
    lines.put(
      String.format("%s;%s;%s;%s;", t.p3.x, t.p3.y, t.p1.x, t.p1.y),
      new Line(new PVector(t.p3.x, t.p3.y), new PVector(t.p1.x, t.p1.y))
    );
    vertex(t.p1.x, t.p1.y);
    vertex(t.p2.x, t.p2.y);
    vertex(t.p3.x, t.p3.y);
  }
  endShape();

  gcode.up();

  ArrayList<Line> linesToDraw;
  linesToDraw = new ArrayList<Line>(lines.values());
  Collections.sort(linesToDraw, new Comparator<Line>() {
    public int compare(Line o1, Line o2) {
      return (int)((o1.start.y * width + o1.start.x) - (o2.start.y * width + o1.start.x));
    }
  });

  Line lastline;
  lastline = null;
  for (Line l : linesToDraw) {
    if (lastline != null && !(lastline.end.x == l.start.x && lastline.end.y == l.start.y)) {
      gcode.up();
    }
    lastline = l;
    gcode.go(l.start.x, l.start.y);
    gcode.down();
    gcode.go(l.end.x, l.end.y);
  }

  endRecord();
  gcode.saveFile(filename);
}

class Line {
  PVector start, end;
  Line(PVector start, PVector end) {
    this.start = start;
    this.end = end;
  }
}
