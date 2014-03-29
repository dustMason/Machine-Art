#include <AccelStepper.h>
#include <Wire.h>
#include <Adafruit_MotorShield.h>
#include "utility/Adafruit_PWMServoDriver.h"

Adafruit_MotorShield AFMS(0x60);

// Connect two steppers with 200 steps per revolution (1.8 degree)
// to the top shield
Adafruit_StepperMotor *lMotor = AFMS.getStepper(200, 1);
Adafruit_StepperMotor *rMotor = AFMS.getStepper(200, 2);

// you can change these to DOUBLE or INTERLEAVE or MICROSTEP!
// wrappers for the first motor!
void forwardStepLeft() {
  lMotor->onestep(FORWARD, DOUBLE);
}
void backwardStepLeft() {
  lMotor->onestep(BACKWARD, DOUBLE);
}
void forwardStepRight() {
  rMotor->onestep(FORWARD, DOUBLE);
}
void backwardStepRight() {
  rMotor->onestep(BACKWARD, DOUBLE);
}

AccelStepper stepperLeft(forwardStepLeft, backwardStepLeft);
AccelStepper stepperRight(forwardStepRight, backwardStepRight);

void setup() {
  AFMS.begin();
  Serial.begin(9600);
  stepperLeft.setMaxSpeed(400.0);
  stepperLeft.setAcceleration(180.0);
  // stepperLeft.moveTo(100);
  stepperRight.setMaxSpeed(400.0);
  stepperRight.setAcceleration(180.0);
  // stepperRight.moveTo(100);
}

const int MOTORS_READY = 6;
volatile boolean notifiedReady = false;
int currentCoordinates[2];

unsigned int readInt16() {
  return Serial.read() + (Serial.read() << 8);
}

void readCoordinates() {
  Serial.println("Reading coordinates...");
  currentCoordinates[0] = readInt16();
  currentCoordinates[1] = readInt16();
  Serial.print("Read 2 16 bit ints from Serial: ");
  Serial.print(currentCoordinates[0], BIN);
  Serial.print(", ");
  Serial.println(currentCoordinates[1], BIN);
}

void loop() {
  // if (stepperLeft.distanceToGo() == 0) stepperLeft.moveTo(-stepperLeft.currentPosition());
  // if (stepperRight.distanceToGo() == 0) stepperRight.moveTo(-stepperRight.currentPosition());
  if (stepperLeft.distanceToGo() == 0 && stepperRight.distanceToGo() == 0 && !notifiedReady) {
    Serial.println(MOTORS_READY);
    notifiedReady = true;
  } else {
    if (Serial.available() > 0 && notifiedReady) {
      readCoordinates();
      Serial.print("Moving motors to ");
      Serial.print(currentCoordinates[0]);
      Serial.print(", ");
      Serial.println(currentCoordinates[1]);
      // TODO adjust speed of command to ensure both motors arrive at the same time
      stepperLeft.moveTo(currentCoordinates[0]);
      stepperRight.moveTo(currentCoordinates[1]);
      notifiedReady = false;
    }
  }
  stepperLeft.run();
  stepperRight.run();
}
