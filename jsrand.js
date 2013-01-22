/*
 * JsRand - predictable random number generation for javascript
 *
 * For the latest copy try here: https://github.com/kristopolous/jsrand
 */

function _rand() {
  return _rand.MT.apply(this, Array.prototype.slice.call(arguments));
};

_rand.set = function() {
  var generator = "PRNG",
      args = Array.prototype.slice.call(arguments);

  if (args[0] instanceof String) {
    generator = args.shift();
  }
  
  var size = args.shift(),
      min = args.shift(),
      max = args.shift(),
      set = [];

  do {
    set.push(_rand[generator](min, max));
  } while (-- size);

  return set;
}

// This is Fisher-Yates 
// see here: http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
_rand.shuffle = function() {
  var 
    generator = "PRNG",
    args = Array.prototype.slice.call(arguments),
    array,
    remaining,
    slosh, 
    ptr;

  if (args[0] instanceof String) {
    generator = args.shift();
  }

  array = args[0];
  remaining = array.length;

  while (remaining) {

    ptr = Math.floor(_rand[generator](0, remaining--));

    // And swap it with the current element.
    slosh = array[remaining];
    array[remaining] = array[ptr];
    array[ptr] = slosh;
  }

  return array;
}

_rand.BaseGen = function (len, base) {
  return Math.floor( _rand( 0, base )).toString(base) + (
    (len > 1) ?
      arguments.callee(len - 1, base) : ''
    );
}

_rand.UUID = function(){
  return [
    _rand.BaseGen(8, 16),
    _rand.BaseGen(4, 16),
    _rand.BaseGen(4, 16),
    _rand.BaseGen(4, 16),
    _rand.BaseGen(12, 16)
  ].join('-');
}
_rand.PRNG = (function() {
  var primes = [ [
      15485933, 15486347, 15486953, 15487177,
      15486173, 15485993, 15487253, 15488107,
      15488197, 15488321, 15487403, 15487429,
      15487583, 15487609, 15489559, 15489587
    ], [ 
      15829799, 15830189, 15830873, 15829423,
      15846617, 15846707, 15846221, 15846269,
      15879271, 15879371, 15878839, 15879239,
      15905347, 15905629, 15905059, 15904909
    ] ],

    round = 0,
    fallover = Math.pow(2, 16),
    lastrand = (new Date()).getTime(),
    p1,
    p2,
    ret;

  ret = function(min, max){
    if(round++ % fallover == 0) {
      p1 = primes[0][Math.floor(round / fallover / 16) & 15]; 
      p2 = primes[1][Math.floor(round / fallover) & 15]; 
    }

    lastrand = (lastrand * p1 + round) % p2;

    switch(arguments.length) {
      case 0: return lastrand / p2;
      case 1: return min * lastrand / p2;
      case 2: return (max - min) * lastrand / p2 + min;
    }

    throw new TypeError("_rand needs 0 to 2 arguments");
  }

  ret.set = function() {
    return _rand.set.apply(this, ["PRNG"].concat(arguments));
  }
  ret.shuffle = function() {
    return _rand.shuffle.apply(this, ["PRNG"].concat(arguments));
  }

  ret.seed = function(which) {
    lastrand = which;
    round = 0;
  }

  return ret;
})();

// From http://en.wikipedia.org/wiki/Mersenne_twister
_rand.MT = (function() {
  var MT = []; 
  var index = 0;

  function initialize_generator(seed) {
    MT[0] = seed;
    for(var i = 1; i < 624; i++) {
      MT[i] = (0x6c078965 * (MT[ i - 1 ] ^ (MT[ i - 1 ] >> 30)) + i) & 0xFFFFFFFF;
    }
  }

  function extract_number() {
    if(index == 0) {
      generate_numbers();
    }

    var y = MT[index];
    y ^= (y >> 11);
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= (y >> 18);

    index = (index + 1) % 624;

    return y;
  }

  function generate_numbers() {
    for(var i = 0; i < 624; i++) {
      var y = (MT[i] & 0x80000000) + (MT[ (i + 1) % 624 ] & 0x7FFFFFFF);
      MT[i] = MT[(i + 397) % 624] ^ (y >> 1);
      if ((y % 2) != 0) {
        MT[i] ^= 0x9908b0df;
      }
    }
  }
   
  ret = function(min, max){
    var num = extract_number();
    if(arguments.length) {
      num *= ((max - min) / Math.pow(2,31));
      num += min;
    }
    return num;
  }

  ret.seed = function(which) {
    initialize_generator(which);
  }

  ret.set = function() {
    return _rand.set.apply(this, ["MT"].concat(arguments));
  }
  ret.shuffle = function() {
    return _rand.shuffle.apply(this, ["MT"].concat(arguments));
  }

  initialize_generator( +new Date() );
  return ret;
})();

_rand.seed = function(seed) {
  _rand.MT.seed(seed);
  _rand.PRNG.seed(seed);
}
