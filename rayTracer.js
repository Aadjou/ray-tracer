// A very basic raytracer example.
// Translated from C++ code (scratchapixel.com)

var MAX_RAY_DEPTH = 5
var BACKGROUND_COLOR = Array(0, 0, 0, 255)
function mix (a, b, mix) {
  return b * mix + a * (1-mix)
}

function trace(rayorig, raydir, geometries, depth, bgColor) {
  var bgColor = bgColor || new Vector3(0.9, 0.9, 1.0)//BACKGROUND_COLOR
  var tNear = Infinity
  var geoNear = undefined

  for (var i = 0; i < geometries.length; i++) {
    var result = geometries[i].intersect(rayorig, raydir)
    if (result.intersect) {
      var dist = result.t0 < 0 ? result.t1 : result.t0
      if (dist < tNear) {
        tNear = dist
        geoNear = geometries[i]
      }
    }
  }

  // if there is no intersection, return black or background color
  if(geoNear === undefined) return bgColor

  // Color of the ray/surface of the object intersected with the ray
  var surfaceColor = new Vector3()
  // Point of intersection
  var pHit = rayorig.add(raydir.multiplyScalar(tNear))
  // Normalized Normal at the intersection point
  var nHit = pHit.subtract(geoNear.center).normalize()

  // If the normal and the view direction are not opposite to each other
  // reverse the normal direction. That also means we are inside the sphere so set
  // the inside bool to true. Finally reverse the sign of IdotN which we want positive

  // add some bias to the point from which we will be tracing
  var bias = 1e-4,
      inside = false

  if (raydir.dot(nHit) > 0) {
    nHit = nHit.multiplyScalar(-1)
    inside = true
  }

  if ((geoNear.transparency > 0.0 || geoNear.reflectivity > 0) && depth < MAX_RAY_DEPTH) {
      var facingRatio = -raydir.dot(nHit)
      // Change the mix value to tweak the effect
      var fresnelEffect = mix(Math.pow(1 - facingRatio, 3), 1, 0.1)
      // compute reflection direction (no need to normalize because all vectors are already normalized)
      var refldir = raydir.subtract(nHit.multiplyScalar(2).multiply(raydir.dot(nHit))).normalize()
      var reflection = trace(pHit.add(nHit.multiplyScalar(bias)), refldir, geometries, depth + 1)
      var refraction = new Vector3()

      // if the sphere is also transparent, compute refraction ray (transmission)
      if (geoNear.transparency > 0.0) {
        var ior = 1.1,
            eta = inside ? ior : 1/ior,
            cosi = -nHit.dot(raydir),
            k = 1 - eta * eta * (1 - cosi * cosi)
        var refrdir = raydir.multiplyScalar(eta).add(nHit.multiplyScalar(eta * cosi - Math.sqrt(k))).normalize()
        refraction = trace(pHit.subtract(nHit.multiplyScalar(bias)), refrdir, geometries, depth + 1)
      }
      // the result is a mix of reflection and refraction (if the sphere is transparent)
      surfaceColor = reflection.copy()/*(
        reflection.multiplyScalar(fresnelEffect).add(
        refraction.multiplyScalar(1-fresnelEffect)).multiplyScalar(geoNear.transparency).multiply(geoNear.surfaceColor)
      )*/

  } else {
      // It's a diffuse object, no need to ray trace any further
     for (var i = 0; i < geometries.length; i++) {
       if (geometries[i].emissionColor.length() > 0.0) {
         // this is a light
         var transmission = new Vector3(1.0, 1.0, 1.0)
         var lightDirection = geometries[i].center.subtract(pHit).normalize()

         for (var j = 0; j < geometries.length; j++) {
           if (i !== j) {
             var rayOrig = pHit.add(nHit.multiplyScalar(bias))
             var result = geometries[j].intersect(rayOrig, lightDirection)
             if (result.intersect) {
               transmission = new Vector3(0.0, 0.0, 0.0)
               break
             }
           }
         }
       var scalar = Math.max(0.0, nHit.dot(lightDirection))
       var colorAddition = geoNear.surfaceColor.multiply(transmission).multiplyScalar(scalar).multiply(geometries[i].emissionColor)
       surfaceColor.add(colorAddition)
     }
   }
  }
  return surfaceColor.add(geoNear.emissionColor)
  //return geoNear.surfaceColor
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
      buffer[pos]     = color.x * 255
      buffer[pos + 1] = color.y * 255
      buffer[pos + 2] = color.z * 255
      buffer[pos + 3] = 255

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
    //new Sphere(new Vector3(0.0,   -10008,  -20), 10000, new Vector3(0.20, 0.20, 0.20)),
    new Sphere(new Vector3(0.0,   -5,      -20), 1,    new Vector3(1.0, 0.5, 0.8), 0, 0.0),
    new Sphere(new Vector3(5.0,   -6,      -15), 2,    new Vector3(0.40, 0.76, 0.46), 1, 0.5),
    new Sphere(new Vector3(5.0,   -5,      -25), 3,    new Vector3(0.65, 0.77, 0.97), 1, 0.0),
    new Sphere(new Vector3(-5.5,  -5,      -15), 3,    new Vector3(0.90, 0.90, 0.90), 1, 0.0),
    // light:
    new Sphere(new Vector3(0.0,   20,     -30), 3,     new Vector3(1.0, 1.0, 1.0), 0, 0.0, new Vector3(3.0, 3.0, 3.0))
  ]

  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");

  var buffer = render(spheres, width, height)
  var idata = ctx.createImageData(width, height)
  idata.data.set(buffer)
  ctx.putImageData(idata, 0, 0)

}



//////// Utility

function Sphere(center, radius, surfaceColor, reflectivity, transparency, emissionColor)  {
  this.center = center || Vector3(0.0, 0.0, 0.0)
  this.radius = radius || 1
  this.radius2 = radius*radius
  this.surfaceColor = surfaceColor !== undefined ? surfaceColor :  new Vector3(0.0, 0.0, 0.0)

  this.reflectivity = reflectivity || 0
  this.transparency = transparency || 0.0
  this.emissionColor =  (emissionColor !== undefined) ? emissionColor : new Vector3(0.0, 0.0, 0.0)

  // Compute a ray-sphere intersection using the geometric solution
  this.intersect = function(rayorig, raydir) {
    var l = center.subtract(rayorig)
    // closest approach along the ray
    var tca = l.dot(raydir)
    // if tca is smaller then 0, the ray points away from the sphere
    if (tca < 0) return { intersect: false }
    // d^2 + tca^2 = L^2
    var d2 = l.dot(l) - tca * tca
    if (d2 > this.radius2) return { intersect: false }
    var thc = Math.sqrt(this.radius2 - d2)

    return {
      intersect: true,
      t0: tca - thc,
      t1: tca + thc
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
    return this
  },

  setLength: function (l) {
    var origLength = this.length()
    if ( origLength !== 0 && l !== origLength) {
      var newVec = this.multiplyScalar(l/origLength)
      this.set(newVec.x, newVec.y, newVec.z)
    }
    return this
  },

  normalize: function () {
    var newVec = this.divideScalar(this.length())
    this.set(newVec.x, newVec.y, newVec.z)
    return this
  },

  add: function (v) {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z)
  },

  subtract: function (v) {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z)
  },

  normalize: function () {
    var newVec = this.divideScalar(this.length())
    this.set(newVec.x, newVec.y, newVec.z)
    return this
  },

  copy: function () {
    return new Vector3(this.x, this.y, this.z)
  },

  multiply : function (v) {
    return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z)
  },

  multiplyScalar : function (scalar) {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar)
  },

  divide: function (v) {
    return new Vector3(this.x / v.x, this.y / v.y, this.z / v.z)
  },

  divideScalar: function (scalar) {
    if (scalar !== 0) {
      var invScalar =  1 / scalar
      return new Vector3(this.x * invScalar, this.y * invScalar, this.z * invScalar)
    } else {
      return new Vector3(0, 0, 0)
    }
  },

  length : function () {
    return Math.sqrt(this.length2())
  },

  length2 : function () {
    return this.x * this.x + this.y * this.y + this.z * this.z
  },

  dot : function (v) {
    return this.x * v.x + this.y * v.y + this.z * v.z
  }
}