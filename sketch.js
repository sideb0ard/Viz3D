// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:9002');

// Connection opened
socket.addEventListener('open', function (event) {
  socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', function (event) {
  console.log('Message from server ', event.data);
});

function setup() {
  createCanvas(1200, 400);
  //createCanvas(displayWidth*pixelDensity(), displayHeight*pixelDensity() );
  frameRate(5);
}

function draw() {
  background(255);
  angleMode(DEGREES);

  stroke(0);
  fill(255);
  strokeWeight(2);
  VariablyThickLine(createVector(50, height/2), createVector(width-50, height/2), [50]);
  drawCircle(createVector(350, height/2), 100);
  drawCircle(createVector(850, height/2), 100);
  fill(0, 255, 0);
  drawCircle(createVector(350, height/2), 50);
  drawCircle(createVector(850, height/2), 50);
  //noLoop();

}

function SendMouse() {
  socket.send("mouse");
}

function say(sentence) {
  socket.send(sentence);
  return 0;
}

function keyPressed() {
  if (key == "s") {
    print("YO!");
    SendMouse();
  }
}
