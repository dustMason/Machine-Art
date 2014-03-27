// PLANS
//
//
// light node server communicates between browser and arduino via serial
// UI actions are almost directly sent along to the arduino
// ino code reads serial commands and 

var five = require("johnny-five"),
    board = five.Board();

board.on("ready", function() {

  // console.log(board);
  // console.log(board.pins);
  // motorshield PWM pins are 18 and 19 (A4 and A5)

//   var stepper, k = 0;
//
//   stepper = new five.Stepper({
//     type: five.Stepper.TYPE.DRIVER,
//     stepsPerRev: 200,
//     pins: [11, 12]
//   });


    // if (num == 0) {
    //   pwma = 8; ain2 = 9; ain1 = 10;
    //   pwmb = 13; bin2 = 12; bin1 = 11;
    // } else if (num == 1) {
    //   pwma = 2; ain2 = 3; ain1 = 4;
    //   pwmb = 7; bin2 = 6; bin1 = 5;
    // }


  stepper = new five.Stepper({
    type: five.Stepper.TYPE.DRIVER,
    stepsPerRev: 200,
    pins: [13,8]
  });

  // function sweep() {
  //   // 200 stepsPerRev / 2 = 100 (180degree sweeps)
  //   stepper[++k % 2 === 0 ? "ccw" : "cw"]().step(100, function() {
  //     sweep();
  //   });
  // }

  stepper.rpm(180).ccw().step(2000, function() {
    console.log("done");
  });

  this.repl.inject({
    stepper: stepper
  });

  // sweep();
});
