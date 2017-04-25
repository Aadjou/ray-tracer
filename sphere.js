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
    var l = subtract(center, rayorig)
    var tca = dot(l, raydir)
    if (tca < 0) return false;
    // d^2 + tca^2 = L^2
    var d2 = dot(l, l) - tca * tca
    if (d2 > this.radius2) return false
    var thc = Math.sqrt(this.radius2 - d2)
    var t0 = tca - thc,
        t1 = tca + thc

    return true
  }

  // Fixme vector3 prototype
  function subtract (v1, v2) {
    return Array(v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2])
  }

  function dot(v1, v2) {
    return (v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2])
  }
}