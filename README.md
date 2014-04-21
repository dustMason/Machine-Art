# The Polygon Elvis

- Two pages: Create and Command
- *Create* allows creation of SVG graphics using various libs
- *Command* converts SVG data into machine-appropriate GCODE

## Create

- ThreeJS
  - Import 3d models
  - Move camera
  - Adjust geometry
  - Reads stream from Kinect
- PaperJS
  - Draw
  - Create geometric patterns
- etc...

## Command

- Converts SVG into GCODE
  - User can load SVG file
  - Browser shows in-page preview of SVG
  - User sets svg2gcode options and machine canvas options
  - Prepends drawing GCODE commands with machine-specific commands then saves out to a file
- Load GCODE file
  - Tells the node.js server to initiate a session with the machine
  - Server will send streaming updates to the browser via websockets
  - Browser can send pause / halt signals via UI
  - Browser displays a live preview showing progress of the machine

# GCode Commands Implemented

- M114: calls `where`
- M18: disables motors
- T, B, R, L, G, H, I
- J: sets motor direction (as in config?)
- G00, G01, G0, G1:
  line drawing commands?
- X, Y, Z
- F: set feed rate (drawing speed?)
- G02, G2, G03, G3: `arc`
- G04, G4: `dwell` (pause?)
- D00: move one motor
- D01: adjust spool diameters (config)
- D02: return spool diameters
- D03, D04: SD card commands
