class GcodeWriter {
  
  ArrayList <String> gcode;
  int machineDrawingSpeed;
  float scalingFactor;
  int canvasWidth;
  int canvasHeight;
  
  GcodeWriter(int speed, int wid, int hei, float sf) {
    initDrawing();
    machineDrawingSpeed = speed;
    scalingFactor = sf;
    canvasWidth = wid;
    canvasHeight = hei;
  }

  void initDrawing() {
    gcode = new ArrayList();
    gcode.add("G90");
    gcode.add("G1 Z0");
    gcode.add("G82");
    gcode.add("M4");
  }
  
  void startDrawing() {
    gcode.add("G1 Z0 F200");
  }
  
  void stopDrawing() {
    gcode.add("G1 Z90 F200");
  }
  
  void moveTo(float x, float y) {
    float adjustedX = (x * scalingFactor) - ((canvasWidth * scalingFactor) / 2);
    float adjustedY = (y * scalingFactor) - ((canvasHeight * scalingFactor) / 2);
    gcode.add("G1 X" + adjustedX + " Y" + adjustedY + " F" + machineDrawingSpeed);
  }
  
  void saveFile(String filename) {
    stopDrawing();
    saveStrings(filename + ".ngc", gcode.toArray(new String[gcode.size()]));
  }
  
}
