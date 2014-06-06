import java.util.Collections;
import java.util.Random;

ArrayList findTargets(PImage img, int limit) {
  ArrayList target;
  int[] pixelIndexesToVisit;

  int lastPixelIndex = (img.height * img.width) - 1;
  int pixelsAdded = 0;

  pixelIndexesToVisit = range(0, lastPixelIndex);
  shuffleArray(pixelIndexesToVisit);

  img.loadPixels();
  target = new ArrayList();
  int[] pixels = img.pixels;
  int W = img.width;

  // work over the first #limit values in the pixel array
  // which have been randomly shuffled already
  for (int l = 0; l < lastPixelIndex; l++) {
    if (pixelsAdded == limit) break;
    int index = pixelIndexesToVisit[l];
    int x = index % W;
    int y = (index - x) / W;
    color c = pixels[index];
    if (isValidTarget(brightness(c))) {
      PVector pos = new PVector(x, y);
      target.add(pos);
      pixelsAdded++;
    }
  }

  return target;
}

boolean isValidTarget(float fbrightness) {
  if (fbrightness > 240) return false;
  float value = map(fbrightness, 0, 255, 1, 100);
  float iRandom = random(0, value);
  if (iRandom <= 5) return true;
  else return false;
}

int[] range(int start, int length) {
  int[] range = new int[length - start + 1];
  for (int i = start; i <= length; i++) {
    range[i - start] = i;
  }
  return range;
}

void shuffleArray(int[] ar) {
  Random rnd = new Random();
  for (int i = ar.length - 1; i > 0; i--) {
    int index = rnd.nextInt(i + 1);
    int a = ar[index];
    ar[index] = ar[i];
    ar[i] = a;
  }
}
