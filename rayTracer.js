// A very basic raytracer example.
// Translated from C++ code (scratchapixel.com)

var MAX_RAY_DEPTH = 5

main()

function mix (a, b, mix) {
  return b * mix + a * (1-mix)
}

function trace() {

}

/*
 Main rendering function. We compute a camera ray for each pixel of the image trace it and return a color.
 If the ray hits a sphere, we return the color of the sphere at the intersection point,
 else we return the background color.
 */
function render(geometry) {
  var width = 640,
      height = 480,
      fov = 30,
      aspectRatio = width/height,
      angle = tan(Math.PI * 0.5 * fov / 180.0)

  var buffer = new Uint8ClampedArray(width * height * 4);

  // Trace rays
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var pos = (y * width + x) * 4
      buffer[pos]     = 0
      buffer[pos + 1] = 0
      buffer[pos + 2] = 0
      buffer[pos + 3] = 255

    }

  }

  var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d')

  canvas.width = width
  canvas.height = height
  var idata = ctx.createImageData(width, height)
  idata.data.set(buffer)
  ctx.putImageData(idata, 0, 0)

  var dataUri = canvas.toDataURL()

  image.onload = imageLoaded
  image.src = dataUri
}

/*
 In the main function, we will create the scene which is composed of 5 spheres and 1 light (which is also a sphere).
 Then, once the scene description is complete we render that scene, by calling the render() function.
 */
function main() {
  var spheres = [
    new Sphere(Vector3(0.0,   -10004, -20), 10000, Vector3(0.20, 0.20, 0.20)),
    new Sphere(Vector3(0.0,   0,      -20), 4,     Vector3(1.00, 0.32, 0.36), 1, 0.5),
    new Sphere(Vector3(5.0,   -1,     -15), 2,     Vector3(0.90, 0.76, 0.46)),
    new Sphere(Vector3(5.0,   0,      -25), 3,     Vector3(0.65, 0.77, 0.97)),
    new Sphere(Vector3(-5.5,  0,      -15), 3,     Vector3(0.90, 0.90, 0.90)),
    // light:
    new Sphere(Vector3(0.0,   20,     -30), 3,     Vector3(0.00, 0.00, 0.00), 0, 0.0, Vector3(3, 3, 3))
  ]

  render(spheres)

}