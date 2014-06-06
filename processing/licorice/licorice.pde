import processing.pdf.*;

int radius = 50,
    minDensity = 1,
    maxDensity = 25,
    iterations = 100;

void setup () {
  input = loadImage("portrait_bw.jpg");
  size(input.width, input.height);
  // smooth();
  noLoop();
  // frameRate(25);
}

void draw() {
  background(255);
  // beginRecord(PDF, filename + ".pdf");
  fill(255);
  strokeWeight(1);
  stroke(0); // black
  int[] colors = input.pixels;
  
  for (int i = 0; i < iterations; i++) {
    // pick a random pixel of the image
    int x = random(width);
    int y = random(height);
    int index = y*width+x;
    color c = colors[index];
    // determine its darkness
    float brightness = brightness(c);
    float currentRadius = (float) radius;
    // start drawing circles centered on that coord
    while (currentRadius > 1) {
      
    }
    
  }
  
  
  
  // keep shrinking circles by density determined by darkness until too small
  
  // endRecord();
}
