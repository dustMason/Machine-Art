#include <AccelStepper.h>
#include <Wire.h>
#include <Adafruit_MotorShield.h>
#include "utility/Adafruit_PWMServoDriver.h"
#include <SerialCommand.h>

SerialCommand SCmd;
Adafruit_MotorShield AFMS(0x60);

// Connect two steppers with 200 steps per revolution (1.8 degree)
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


const int MOTORS_READY = 6;
boolean notifiedReady = false;
/* int currentCoordinates[2]; */
/* int serialDelimeter = 0x0A; */

void processDrawCommand() {
  int aNumber;  
  char *arg; 
  arg = SCmd.next(); 
  if (arg != NULL) {
    aNumber = atoi(arg);
    stepperLeft.moveTo(aNumber);
    notifiedReady = false;
  } 
  arg = SCmd.next(); 
  if (arg != NULL) {
    aNumber = atoi(arg); 
    stepperRight.moveTo(aNumber);
    notifiedReady = false;
  }
}

void setup() {
  AFMS.begin();
  Serial.begin(9600);
  SCmd.addCommand("D", processDrawCommand);
  stepperLeft.setMaxSpeed(400.0);
  stepperLeft.setAcceleration(180.0);
  // stepperLeft.moveTo(100);
  stepperRight.setMaxSpeed(400.0);
  stepperRight.setAcceleration(180.0);
  // stepperRight.moveTo(100);
}

void loop() {
  // if (stepperLeft.distanceToGo() == 0) stepperLeft.moveTo(-stepperLeft.currentPosition());
  // if (stepperRight.distanceToGo() == 0) stepperRight.moveTo(-stepperRight.currentPosition());
  stepperLeft.run();
  stepperRight.run();
  if (stepperLeft.distanceToGo() == 0 && stepperRight.distanceToGo() == 0 && !notifiedReady) {
    Serial.println(MOTORS_READY);
    notifiedReady = true;
  }
  SCmd.readSerial();
}
