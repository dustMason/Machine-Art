/* OpenProcessing Tweak of *@*http://www.openprocessing.org/sketch/84552*@* */
/* !do not delete the line above, required for linking your tweak if you upload again */

import processing.pdf.*;

final String filename = "dave";
int particleNum = 30000,
    stretchiness = 20,
    machineDrawingSpeed = 1000,
    mode = 0,
    connectionMode = 0;

PImage input;
ArrayList <PVector> pointCloud;
ArrayList <Line> lines;
GcodeWriter gcode;

void setup () {
  input = loadImage(filename + ".jpg");
  size(input.width, input.height);
  smooth();
  noLoop();
  frameRate(25);
  pointCloud = new ArrayList();
  lines = new ArrayList();
  gcode = new GcodeWriter(2000, width, height, 0.9);
  PVector[] targets = findTargets(particleNum, input);
  for (int i = 0; i < targets.length; i++) pointCloud.add(targets[i]);
}

void draw() {
  background(255);
  beginRecord(PDF, filename + ".pdf");
  noFill();

  strokeWeight(5);
  stroke(0); // black
  int lineCount = pointCloud.size();
  for (int i = 0; i < lineCount; i++) {
    createConnection(connectionMode);
  }

  gcode.up();
  gcode.go(lines.get(0).start.x, lines.get(0).start.y);
  gcode.down();

  for (int i = 0; i < lines.size(); i++) {
    gcode.go(lines.get(i).end.x, lines.get(i).end.y);
    lines.get(i).strokeSytle();
    if (mode == 1) lines.get(i).draw();
    if (mode == 0) lines.get(i).drawSmooth();
  }
  endRecord();

  gcode.saveFile(filename);
}

void createConnection(int cMode) {
  if (lines.size() == 0 && pointCloud.size() > 2) {
    // the first line starts in a random spot
    PVector start, end;
    int startindex = (int) random(pointCloud.size());
    start = pointCloud.get(startindex);
    pointCloud.remove(startindex);
    int endindex = getClosestIndex(start, pointCloud);
    end = pointCloud.get(endindex);
    pointCloud.remove(endindex);
    lines.add(new Line(start, end));
  } else {
    if (pointCloud.size() > 0) {
      PVector start = lines.get(lines.size()-1).end, end;
      int index = cMode == 0 ? getClosestIndex(start, stretchiness, pointCloud) : getClosestIndex(start, pointCloud);
      end = pointCloud.get(index);
      pointCloud.remove(index);
      lines.add(new Line(start, end));
    }
  }
}

int getClosestIndex(PVector start, ArrayList <PVector> lookup) {
  float closestDist = width*height;
  int closestIndex = 0;
  float dis = 0;
  for (int i = 0; i < lookup.size(); i++) {
    dis = PVector.dist(start, lookup.get(i));
    if (dis < closestDist) {
      closestDist = dis;
      closestIndex = i;
    }
  }
  return closestIndex;
}

int getClosestIndex(PVector start, int n, ArrayList <PVector> lookup) {
  float[] closestDist = new float[n];
  int[] closestIndex = new int[n];

  for (int i = 0; i < n; i++) {
    closestDist[i] = width*height;
    closestIndex[i] = 0;
  }

  float dis = 0;
  float disMin = width*height, disMax = disMin*2;

  for (int i = 0; i < lookup.size(); i++) {
    dis = PVector.dist(start, lookup.get(i));
    if (dis < disMin ) {
      disMin = dis;
      closestDist[0] = dis;
      closestIndex[0] = i;
    } else if (dis > disMin && dis < disMax) {
      int index = i;
      for (int j = 0; j < n-1; j++) {
        if (closestDist[j] < dis && closestDist[j+1] > dis) {
          index=j+1;
          break;
        }
      }
      for (int j = n-1; j > 0; j--) {
        if (j == index) {
          closestDist[j] = dis;
          closestIndex[j] = i;
          break;
        } else {
          if (j > 1) {
            closestIndex[j] = closestIndex[j-1];
            closestDist[j] = closestDist[j-1];
          }
        }
      }
      disMax = closestDist[n-1];
    }
  }

  /* int index = closestIndex[(int) random(n)]; */
  int index = closestIndex[(int) n-1];
  return index;
}
