// A very basic raytracer example.
// Translated from C++ code (scratchapixel.com)

var MAX_RAY_DEPTH = 5

function test () {
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  var buffer = render([])
  var idata = ctx.createImageData(640, 480)
  idata.data.set(buffer)
  ctx.putImageData(idata, 0, 0)
}

function mix (a, b, mix) {
  return b * mix + a * (1-mix)
}

function trace(rayorig, raydir, geometries, depth) {
  var tnear = Infinity
  var geoNear = undefined

  for (var i = 0; i < geometries.length; i++) {
    var result = geometries[i].intersect(rayorig, raydir)
    if (result.intersect) {
      var dist = result.t0 < 0 ? result.t1 : result.t0
      if (dist < tnear) {
        tnear = dist
        geoNear = geometries[i]
      }
    }
  }


  if(geoNear === undefined) return Array(0, 0, 255, 0)
  else {
    var col = geoNear.surfaceColor
    return Array(Math.round(col.x * 256), Math.round(col.y * 256), Math.round(col.z * 256), 50)
  }

}

/*
 Main rendering function. We compute a camera ray for each pixel of the image trace it and return a color.
 If the ray hits a sphere, we return the color of the sphere at the intersection point,
 else we return the background color.
 */
function render(geometry, width, height) {
  var invWidth = 1/width,
      invHeight = 1/height
      fov = 30,
      aspectRatio = width/height,
      angle = Math.tan(Math.PI * 0.5 * fov / 180.0)

  var buffer = new Uint8ClampedArray(width * height * 4);

  // Trace rays
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var xx = (2 * ((x + 0.5) * invWidth) -1) * angle * aspectRatio
      var yy = (1 - 2 * ((y + 0.5) * invHeight) -1) * angle
      var raydir = new Vector3(xx, yy, -1)
      var rayorig = new Vector3()
      raydir.normalize()

      var color = trace(rayorig, raydir, geometry, 0)
      // fill in the color

      var pos = (y * width + x) * 4
      buffer[pos]     = color[0]
      buffer[pos + 1] = color[1]
      buffer[pos + 2] = color[2]
      buffer[pos + 3] = color[3]

    }

  }
  return buffer
}

/*
 In the main function, we will create the scene which is composed of 5 spheres and 1 light (which is also a sphere).
 Then, once the scene description is complete we render that scene, by calling the render() function.
 */
function main() {
  var width = 680,
      height = 480
  var spheres = [
    //new Sphere(new Vector3(0.0,   -10004, -20), 10000, new Vector3(0.20, 0.20, 0.20)),
    new Sphere(new Vector3(0.0,   0,      -20), 4,     new Vector3(1.00, 0.32, 0.36), 1, 0.5),
    new Sphere(new Vector3(5.0,   -1,     -15), 2,     new Vector3(0.90, 0.76, 0.46)),
    new Sphere(new Vector3(5.0,   0,      -25), 3,     new Vector3(0.65, 0.77, 0.97)),
    new Sphere(new Vector3(-5.5,  0,      -15), 3,     new Vector3(0.90, 0.90, 0.90)),
    // light:
    new Sphere(new Vector3(0.0,   20,     -30), 3,     new Vector3(0.00, 0.00, 0.00), 0, 0.0, new Vector3(3, 3, 3))
  ]

  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");

  var buffer = render(spheres, width, height)
  var idata = ctx.createImageData(width, height)
  idata.data.set(buffer)
  ctx.putImageData(idata, 0, 0)

}



//////// Utility

function Sphere(center, radius, surfaceColor, reflectivity, opacity, emissionColor)  {
  this.center = center || Vector3(0.0, 0.0, 0.0)
  this.radius = radius || 1
  this.radius2 = radius*radius
  this.surfaceColor = surfaceColor || Vector3(0.0, 0.0, 0.0)

  this.reflectivity = reflectivity || 0
  this.opacity = opacity || 0.0
  this.emissionColor =  emissionColor || Vector3(0.0, 0.0, 0.0)


  // Compute a ray-sphere intersection using the geometric solution
  this.intersect = function(rayorig, raydir) {

    // vector pointing from center to rayorigin
    var l = center.subtract(rayorig)
    var tca = l.dot(raydir)
    if (tca < 0) return { intersect: false }
    // d^2 + tca^2 = L^2
    var d2 = l.dot(l) - tca * tca
    if (d2 > this.radius2) return { intersect: false }
    var thc = Math.sqrt(this.radius2 - d2)
    var t0 = tca - thc,
      t1 = tca + thc
    return {
      intersect: true,
      t0: t0,
      t1: t1
    }
  }
}

var Vector3 = function (x, y, z) {

  this.x = x || 0
  this.y = y || 0
  this.z = z || 0
}

Vector3.prototype = {
  constructor: Vector3,

  set: function (x, y, z) {
    this.x = x
    this.y = y
    this.z = z
    return this;
  },

  add: function (v) {
    this.x += v.x
    this.y += v.y
    this.z += v.z

    return this
  },

  subtract: function (v) {
    this.x -= v.x
    this.y -= v.y
    this.z -= v.z

    return this
  },

  normalize: function () {
    return this.divideScalar(this.length())
  },

  copy: function ( v ) {
    this.x = v.x
    this.y = v.y
    this.z = v.z

    return this
  },

  multiply : function (v) {
    this.x *= v.x
    this.y *= v.y
    this.z *= v.z
    return this
  },

  multiplyScalar : function (scalar) {
    this.x *= scalar
    this.y *= scalar
    this.z *= scalar

    return this
  },

  divide: function (v) {
    this.x /= v.x
    this.y /= v.y
    this.z /= v.z

    return this
  },

  divideScalar: function (scalar) {
    if (scalar !== 0) {
      var invScalar =  1 / scalar
      this.x *= invScalar
      this.y *= invScalar
      this.z *= invScalar
    } else {
      this.x = 0;
      this.y = 0;
      this.z = 0;
    }

    return this
  },

  length : function () {
    return Math.sqrt(this.length2())
  },

  length2 : function () {
    return this.x*this.x + this.y*this.y + this.z * this.z
  },

  setLength: function (l) {
    var origLength = this.length()
    if ( origLength !== 0 && l !== origLength) {
      this.multiplyScalar(l/origLength)
    }
    return this
  },

  dot : function (v) {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }
}