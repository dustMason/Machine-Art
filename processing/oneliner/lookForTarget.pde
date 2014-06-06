PVector[] findTargets(int n, PImage img) {
  img.loadPixels();
  PVector[] target = new PVector[n];
  PVector pos;
  for (int i = 0; i < target.length; i++) {
    pos = target(img.pixels, (int) random(img.width), (int) random(img.height), img.width, img.height, 0);
    target[i] = pos;
  }
  return target;
}

PVector target(int[] colors, int x, int y, int W, int H, int depth) {
  PVector pos = new PVector(0, 0);
  int index = y*W+x;
  color c = colors[index];
  if (depth == 15 || isValidTarget(brightness(c))) {
    pos.x = x;
    pos.y = y;
  } else {
    pos = target(colors, (int) random(W), (int) random(H), W, H, depth++);
  }
  return pos;
}

boolean isValidTarget(float fbrightness) {
  if (fbrightness > 220) return false;
  float value = map(fbrightness, 0, 255, 1, 200);
  float iRandom = random(0, value);
  if (iRandom <= 1) return true;
  else return false;
}

