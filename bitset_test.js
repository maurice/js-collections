module.exports = BitSet;

// TODO difference (a - b), maybe cartesion product, maybe power set
// todo construct with initial size, construct with initial bits set?

/** @const */
var PACK = 32;
/** @const */
var ALL = Math.pow(2, PACK) - 1;

/**
 * @class A set of bits
 * @constructor
 * @property {number} size The number of bits, in vector space, used to store the bits
 */
function BitSet() {
	this._size = typeof arguments[0] == "number" ? arguments[0] : 0;
	this._blocks = [];
  this._blocks.length = Math.ceil(this._size / PACK);
}

Object.defineProperty(BitSet.prototype, "size", {
  get: function(value) { return this._size; },
  enumerable: true
});

/**
 * Sets one or more bits on or off
 * @param {...args} At least one bit index, followed by zero or
 *                  more bit indexes, followed by a optional 
 *                  Boolean on/off flag, which if omitted defaults
 *                  to true.
 */
BitSet.prototype.set = function() {
  // todo splice storage to free empty (all-false) blocks
  var args = Array.prototype.slice.call(arguments);
  var on = typeof args[args.length -1] == "boolean" ? args.pop() : true;
  while (args.length) {
    var i = args.pop();
    this._size = Math.max(i + 1, this._size);
    var block = Math.floor(i / PACK);
    var bit = 1 << i % PACK;
    if (on)
      this._blocks[block] |= bit;
    else
      this._blocks[block] &= (ALL ^ bit);
  }
};

/**
 * True if the bit is set.
 * @param i the bit index
 * @return true if the bit is set
 */
BitSet.prototype.isSet = function(i) {
  if (i > this._size - 1)
    throw new Error("Index " + i + " out of bounds: " + this._size);
	var block = Math.floor(i / PACK);
  var bit = 1 << i % PACK;
	if (this._blocks[block] == undefined)
		return false;
	return Boolean(this._blocks[block] & bit);
};

/**
 * Returns a new BitSet with bits set on where they are set
 * in both this AND bs
 * @param bs the BitSet to AND with
 * @return a new bit set comprising the on bits from both sets
 */
BitSet.prototype.and = function(bs)
{
  var result = new BitSet(Math.min(this._size, bs._size));
  var n = Math.ceil(result._size / PACK);
  for (var block = 0; block < n; block++) {
    result._blocks[block] = this._blocks[block] & bs._blocks[block];
  }
  return result;
};
BitSet.prototype.intersection = BitSet.prototype.and;

/**
 * Returns a new BitSet with bits set on where they are set
 * in either this OR bs
 * @param bs the BitSet to OR with
 * @return a new bit set comprising the on bits from either set
 */
BitSet.prototype.or = function(bs)
{
  var result = new BitSet(Math.max(this._size, bs._size));
  var n = Math.ceil(result._size / PACK);
  for (var block = 0; block < n; block++) {
    result._blocks[block] = this._blocks[block] | bs._blocks[block];
  }
  return result;
};
BitSet.prototype.union = BitSet.prototype.or;

/**
 * Returns a new BitSet with bits set on where they are set in
 * only one of either this (X)OR bs
 * @param bs the BitSet to XOR with
 * @return a new bit set comprising the on bits from either set
 */
BitSet.prototype.xor = function(bs)
{
  var result = new BitSet(Math.max(this._size, bs._size));
  var n = Math.ceil(result._size / PACK);
  for (var block = 0; block < n; block++) {
    result._blocks[block] = this._blocks[block] ^ bs._blocks[block];
  }
  return result;
};
BitSet.prototype.symmetricDifference = BitSet.prototype.xor;
