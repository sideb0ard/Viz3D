function DrunkenAntWalk(start_point, number_drinks, length) {
  let cur_point = start_point;
  let cur_length = 0;
  let vel = new createVector(random(-5, 5), random(-5, 5));
  vel.setMag(1);

  let accl = 0;
  let angular_accl = random(-1, 1);
  beginShape();

  while (cur_length < length) {
    curveVertex(cur_point.x, cur_point.y);
    let next_point = cur_point.add(vel);
    cur_length += vel.mag();
    cur_point = next_point;
    vel.rotate(angular_accl);
    vel.setMag(vel.mag() + accl);
    accl = accl + random(-0.1, 0.1) * number_drinks;
    angular_accl = angular_accl + random(-1, 1);
  }
  endShape();
}

function drawWobblyLine(start_x, start_y, end_x, end_y) {
  let x_diff = end_x - start_x;
  let x_incr = x_diff / 100;

  let y_diff = end_y - start_y;
  let y_incr = y_diff / 100;

  let cur_x = start_x + x_diff;
  let cur_y = start_y + y_incr;
  for (let i = 0; i < 100; i++) {
    let next_x = randomGaussian(cur_x + x_incr);
    let next_y = randomGaussian(cur_y + y_incr);
    strokeWeight(randomGaussian(2) + 1);
    line(cur_x, cur_y, next_x, next_y);
    cur_x = next_x;
    cur_y = next_y;
  }
}

function drawHatchedLine(start_x, start_y, end_x, end_y) {
  let x_diff = end_x - start_x;
  let x_incr = x_diff / 100;

  let y_diff = end_y - start_y;
  let y_incr = y_diff / 50;

  let cur_x = start_x;
  let cur_y = start_y;
  for (let i = 0; i < 50; i++) {
    let next_x = cur_x + x_incr;
    let next_y = cur_y + y_incr;
    strokeWeight(1);
    let cur_x_tip = cur_x;
    let cur_y_tip = cur_y;
    for (let j = 0; j < 5; j++) {
      let next_x_tip = randomGaussian(cur_x_tip + j);
      let next_y_tip = randomGaussian();
      line(cur_x_tip, cur_y + next_y_tip, next_x_tip, cur_y + next_y_tip);
      cur_x_tip = next_x_tip;
      cur_y_tip = next_y_tip;
    }

    cur_x = next_x;
    cur_y = next_y;
  }
}

function LenThroughArray(points) {
  if (points.length < 2) {
    return 0;
  }
  let len = 0;
  let vec1 = points[0];
  for (let i = 1; i < points.length; i++) {
    let vec2 = points[i];
    len += vec1.dist(vec2);
    vec1 = vec2;
  }
  return len;
}

function DrawSquiggle(start_x, start_y, radiuus, length) {
  let current_length = 0;
  let current_angle = 0;
  let points = [];
  while (current_length <= length) {
    let new_x = start_x + radiuus * cos(current_angle);
    let new_y = start_y + radiuus * sin(current_angle);
    append(points, createVector(new_x, new_y));
    current_length = LenThroughArray(points);
    current_angle += random(1, 5);
    radiuus += random(-3, 3);
  }
  beginShape();
  curveVertex(points[0].x, points[0].y);
  for (let i = 0; i < points.length; i++) {
    curveVertex(points[i].x, points[i].y);
  }
  curveVertex(points[points.length - 1].x, points[points.length - 1].y);
  endShape();
}

let divs = 256;

function VariablyThickLine(start_point, end_point, points) {
  let x_diff = end_point.x - start_point.x;
  let y_diff = end_point.y - start_point.y;

  let diff = Math.sqrt(x_diff + y_diff);

  let thevpoints = [start_point];

  for (let i = 0; i < points.length; i++) {
    let d = (diff / 100) * points[i];
    let t = d / diff;
    append(
      thevpoints,
      createVector(
        (1 - t) * start_point.x + t * end_point.x,
        (1 - t) * start_point.y + t * end_point.y
      )
    );
  }
  append(thevpoints, end_point);

  let rotr = 180 / divs;

  for (let i = 0; i < thevpoints.length - 1; i++) {
    let thexdiff = thevpoints[i + 1].x - thevpoints[i].x;
    let theydiff = thevpoints[i + 1].y - thevpoints[i].y;

    let x_div = thexdiff / divs;
    let y_div = theydiff / divs;
    for (let j = 0; j <= divs; j++) {
      push();
      translate(thevpoints[i].x + j * x_div, thevpoints[i].y + j * y_div);
      rotate(j * rotr);
      line(-50, 0, 50, 0);
      // line(0, -10, 0, 140);
      pop();
    }
  }
}


function drawCircle(position, diameter) {
  //circle(position.x, position.y, diameter);
  //arc(position.x, position.y, diameter/2, diameter/2, 0, 180);
  let rnom = random(10) + 10;
  let tenth = diameter / 10;
  let divvy = 360 / rnom;
  let cur_angle = 0;
  for (let i = 0; i < rnom; i++) {
    let next_angle = cur_angle + random(divvy) + 10;
    let rdiam = diameter + (random(-tenth, tenth));
    strokeWeight ( random(3));
    arc(position.x, position.y, rdiam, rdiam, cur_angle, next_angle);
    cur_angle = next_angle + random(20);
  }
}
