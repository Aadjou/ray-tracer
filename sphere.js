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