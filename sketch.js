
function preload() {
  img = loadImage("http://138.68.31.61:3838/imgs/test.jpg");
}

function setup() {
  createCanvas(img.width, img.height);
  img.loadPixels();
  color_rects = [];

  // Splitting params
  split_mode = "largest_area";
  // split_mode = "random";
  split_dir_mode = "longest_side";
  // split_dir_mode = "random";

  // Add a new single ColorRect covering the entire sketch
  var new_rect = new ColorRect();
  new_rect.assignPosition(0, 0);
  new_rect.assignSize(width, height);
  new_rect.assignColor(rectAvgColor(new_rect));
  color_rects.push(new_rect);
  displayColorRects();

  // frameRate(1);
}

//--- Main drawing function
function draw() {
  splitRect(split_mode, split_dir_mode);
  displayColorRects();
  print(color_rects.length);
}


function splitRect(split_mode, split_dir_mode) {
  var idx = 0;
  if (split_mode === "largest_area") {
    // figure out the biggest rect by area
    var max_area = 0;
    var tmp_area;
    for (var i = 0; i < color_rects.length; i++) {
      tmp_area = color_rects[i].width * color_rects[i].height;
      if (tmp_area > max_area) {
        idx = i;
        max_area = tmp_area;
      }
    }
  } else if (split_mode === "random") {
    idx = floor(random(color_rects.length));
  }
  var rect_sel = color_rects[idx];

  // If there is a 1x1 pixel, just return
  if (rect_sel.width == 1 && rect_sel.height == 1) {
    return;
  }

  // Choose a split direction
  // 0 = horizontal
  // 1 = vertical
  var split_dir = 0;
  if (split_dir_mode === "longest_side") {
    if (rect_sel.width > rect_sel.height) {
      split_dir = 1;
    }
  } else if (split_dir_mode === "random") {
    split_dir = round(random());
  }

  // Choose a random location to split at
  // and create 2 new rects in its place
  var split_loc;
  var split_ok = false;
  if (split_dir === 0) {
    if (rect_sel.height <= 2) {
      return;
    }

    while (!split_ok) {
      split_loc = floor(random(rect_sel.y, (rect_sel.y + rect_sel.height)));
      if (split_loc > rect_sel.y && split_loc < rect_sel.y + rect_sel.height - 1) {
        split_ok = true;
      }
    }
    
    var new_rect_1 = new ColorRect();
    new_rect_1.assignPosition(rect_sel.x, rect_sel.y);
    new_rect_1.assignSize(rect_sel.width, split_loc - rect_sel.y);
    new_rect_1.assignColor(rectAvgColor(new_rect_1));

    var new_rect_2 = new ColorRect();
    new_rect_2.assignPosition(rect_sel.x, split_loc);
    new_rect_2.assignSize(rect_sel.width, rect_sel.y + rect_sel.height - split_loc);
    new_rect_2.assignColor(rectAvgColor(new_rect_2));

    color_rects.splice(color_rects.indexOf(rect_sel), 1);
    color_rects.push(new_rect_1);
    color_rects.push(new_rect_2);

  } else {
    if (rect_sel.width <= 2) {
      return;
    }

    while (!split_ok) {
      split_loc = floor(random(rect_sel.x, (rect_sel.x + rect_sel.width)));
      if (split_loc > rect_sel.x && split_loc < rect_sel.x + rect_sel.width - 1) {
        split_ok = true;
      }
    }

    var new_rect_1 = new ColorRect();
    new_rect_1.assignPosition(rect_sel.x, rect_sel.y);
    new_rect_1.assignSize(split_loc - rect_sel.x, rect_sel.height);
    new_rect_1.assignColor(rectAvgColor(new_rect_1));

    var new_rect_2 = new ColorRect();
    new_rect_2.assignPosition(split_loc, rect_sel.y);
    new_rect_2.assignSize(rect_sel.x + rect_sel.width - split_loc, rect_sel.height);
    new_rect_2.assignColor(rectAvgColor(new_rect_2));

    color_rects.splice(color_rects.indexOf(rect_sel), 1);
    color_rects.push(new_rect_1);
    color_rects.push(new_rect_2);
  }
}

function assignRectColors() {
  for (var i = 0; i < color_rects.length; i++) {
    color_rects[i].assignColor(rectAvgColor(color_rects[i]));
  }
}

function displayColorRects() {
  background(255);
  for (var i = 0; i < color_rects.length; i++) {
    color_rects[i].display();
  }
}


function rectAvgColor(color_rect) {
  var x_start = color_rect.x;
  var x_end = x_start + color_rect.width;

  var y_start = color_rect.y;
  var y_end = y_start + color_rect.height;

  var tmp_color;
  var avg_color = [0, 0, 0, 0];
  var pixel_cnt = 0;

  for (var i = x_start; i < x_end; i++) {
    for (var j = y_start; j < y_end; j++) {
      tmp_color = imgPixelColor(i, j, img);

      for (var k = 0; k < avg_color.length; k++) {
        avg_color[k] += tmp_color[k];
      }

      pixel_cnt += 1;
    }
  }

  for (var k = 0; k < avg_color.length; k++) {
    avg_color[k] /= pixel_cnt;
  }

  return(color(avg_color));
}



function canvasPixelColor(x, y) {
  var d = pixelDensity();
  var off = 4 * ((y * d) * width * d + (x * d));
  return([pixels[off], pixels[off+1], pixels[off+2], pixels[off+3]]);
}

function imgPixelColor(x, y, inp_img) {
  var d = inp_img._pixelDensity;
  var off = 4 * ((y * d) * inp_img.width * d + (x * d));
  return([inp_img.pixels[off], inp_img.pixels[off+1], inp_img.pixels[off+2], inp_img.pixels[off+3]]);
}


  


// color point class
function ColorRect() {

  this.assignAttrs = function(rect_x, rect_y, rect_color, rect_width, rect_height) {
    this.x = rect_x;
    this.y = rect_y;
    this.color = rect_color;
    this.width = rect_width;
    this.height = rect_height;
  }

  this.assignColor = function(rect_color) {
    this.color = rect_color;
  }

  this.assignSize = function(rect_width, rect_height) {
    this.width = rect_width;
    this.height = rect_height;
  }

  this.assignPosition = function(rect_x, rect_y) {
    this.x = rect_x;
    this.y = rect_y;
  }

  this.display = function() {
    push();
    stroke(this.color);
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);
    pop();
  }
}









