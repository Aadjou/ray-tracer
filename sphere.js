function Sphere(center, radius, surfaceColor)  {
  this.center = center
  this.radius = radius
  this.surfaceColor = surfaceColor

  this.reflectivity = 0
  this.opacity = 1.0
  this.emissionColor =  Array(1.0, 1.0, 1.0)


  // Compute a ray-sphere intersection using the geometric solution
  this.intersect = function(rayorig, raydir, t0, t1) {
    var l = center - rayorig

    return false
  }
}