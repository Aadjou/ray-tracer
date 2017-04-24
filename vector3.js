function Vector3(x, y, z) {
  this.x = x
  this.y = y
  this.z = z

  this.add = function(v) {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z )
  }

  this.subtract = function(v) {
    return new Vector3(this.x - v.x, this.y-v.y, this.z - v.z )
  }

  this.divide = function(scalar) {
    return new Vector3(this.x/scalar, this.y/scalar, this.z/scalar)
  }

  this.magnitude = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y + this.z * this.z)
  }

  this.normalized = function() {
    var scalar = this.magnitude()
    return this.divide(scalar)
  }

  // Return the angle of the vector in radians
  this.getDirection = function() {
    // Fixme
    return 0
  }

  this.zero = function() {return new Vector3(0, 0, 0)}
}