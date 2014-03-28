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

short incomingByte = 0;

void loop() {
  // if (stepperLeft.distanceToGo() == 0) stepperLeft.moveTo(-stepperLeft.currentPosition());
  // if (stepperRight.distanceToGo() == 0) stepperRight.moveTo(-stepperRight.currentPosition());

  if (Serial.available() > 0) {
    incomingByte = Serial.parseInt();
    Serial.println(incomingByte, DEC);
    if (incomingByte > 0) {
      stepperLeft.move(0);
      stepperLeft.moveTo(10000);
    } else if (incomingByte < 0) {
      stepperLeft.move(0);
      stepperLeft.moveTo(-10000);
    } 
  }

  stepperLeft.run();
  stepperRight.run();
}
