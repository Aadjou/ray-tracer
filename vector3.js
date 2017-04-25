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
    return Math.sqrt(this.length2)
  },

  length2 : function () {
    return (this.x*this.x + this.y*this.y + this.z * this.z)
  },

  setLength: function (l) {
    var origLength = this.length()
    if ( origLength !== 0 && l !== origLength) {
      this.multiplyScalar(l/origLength)
    }
    return this
  },

  dot : function (v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }


}