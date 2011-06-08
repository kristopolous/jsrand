var _rand = (function() {
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
      case 1: return Math.floor(min * lastrand / p2);
      case 2: return Math.floor((max - min) * lastrand / p2 + min);
    }

    throw new TypeError("_rand needs 0 to 2 arguments");
  }

  ret.set = function(size, min, max) {
    var set = [];
    do {
      set.push(ret(min, max));
    } while (-- size);
    return set;
  }

  ret.seed = function(which) {
    lastrand = which;
    round = 0;
  }

  return ret;
})();
