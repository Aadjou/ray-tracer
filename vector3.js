function Vector3(x, y, z) {

  this.x = x
  this.y = y
  this.z = z

  this.add = function(v) {
    this.x += v.x
    this.y += v.y
    this.z += v.z
  }

  this.addScalar = function(scalar) {
    this.x += scalar
    this.y += scalar
    this.z += scalar
  }

  this.subtract = function(v) {
    this.x -= v.x
    this.y -= v.y
    this.z -= v.z
  }

  this.divide = function(scalar) {
    this.x /= v.x
    this.y /= v.y
    this.z /= v.z
  }

  this.magnitude = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y + this.z * this.z)
  }

  this.normalized = function() {
    var scalar = this.magnitude()
    this.divide(scalar)
  }

  // Return the angle of the vector in radians
  this.getDirection = function() {
    // Fixme
    return 0
  }

}