# Overview
Oftentimes while doing performance tests in javascript, I need to create test data with the following properties:

 * extremely large
 * sufficiently random
 * reproducable

Javascript's Math.random can do the first 2 constraints, but the third one is left in the open 
and that's the problem; if you can't reliably reproduce the same set of psuedo random numbers every
time, then that is yet another factor that made lead to a higher variance during test runs than
necessary.

Seeing as the performance of this library could vary too and become a factor, there is a routine
designed to generate a set of random numbers of a given length.

# Usage
By default, the function seeds on the system time, like `Math.random()`.  This can be changed through

    _rand.seed( number )

To generate a random number, call `_rand` like so:

    _rand()

As a convenience, you can generate numbers from [0, max] like so:

    _rand(max)

Also, you can generate numbers from [min, max] like so:

    _rand(min, max)

To generate a set of numbers of length count, do the following:

    _rand.set(count)

The set command also takes the same arguments as rand, after the count.  For instance,
to generate `count` random numbers from `min` to `max`, do the following:

    _rand.set(count, min, max)

# Algorithm
The current "PRNG" algorithm is the common iterative of the form (variables explained below)

    new iteration = ( (constant 1) * old iteration + (constant 2) ) modulus (constant 3)

The mathematicians like to display this as

    X[n + 1] = (a * X[n] + b) mod m

This performs best under the following conditions:

  * both a and m are mutually prime
  * a and m are sufficiently large

When the values used are small then you will get cycles. If the numbers change significantly
to avoid cycles, then that leads to a pattern to.  To avoid these pitfalls, the following is done:

  * a and m consist of a sets of 16 primes that are fairly close to each other
  * b is a constantly iterating number
  * after b hits a fallover point, currently 2^16, m gets shifted to the next prime in its set of 16
  * when m exhausts its set, then a is shifted to it's next prime in the set of 16 and m returns.

The last two, if that confuse you, are relatively easy to explain: Counting from 1 to 256 in 
hexidecimal requires 2 digits, expressed like so:  0xf3.  This number is 15 * 16 + 3 = 243.

For our purposes, if our fallover had happened 243 times then, we would be computing numbers based on
the 15th prime in a's list and the 3rd prime in m's list.  This means that this cycle would repeat in
2^16 * 2^8 = 2^24 times; however, it will still initialize with different X[n] and b values.

## New Seeds
When you set a new seed, this entire proces is reset.  That means that setting a seed of say 24, and
asking for the first prime will always yield the same result regardless of the number of previous
generations.

## If you are a mathematician who specializes in this
And you have a better method, please drop me a line; this is the best I could think of while keeping
things relatively fast and easy to read.

# Tests
The file test.html tests two things:

### Running out a number of seeds a few hundred thousand times
The purpose of this test is to verify that the nth random number at seed x is identical on all
platforms.  Currently this is verified by visual inspection.  Each seed 0 through (currently) 28
is run out 300,000 times and then printed to the screen.  If there is floating point arithematic 
differences between platforms or browsers that would lead to eventually different generation, this
would be viewable here.

### Tile generation of random distributions
The purpose of this test is to verify by visual inspection the rough general quality of the output.
Each tile is 

 * Generated with a different starting seed. 
 * Represents a distribution of 250,000 generations from 0 to 6400
 * Has a grey value 
   * Corresponding to a normalized frequency of how often that number was generated 
   * Is light when the number was generated with a high frequency
 * Is drawn as an 800x800 square and represents the frequency distribution over all 6400 values

Currently 100 tiles are generated. Since the color is normalized, a darker square represents a poorer
distribution and more bias towards certain numbers then a lighter square.  It's important to realize
that these effects are intentionally exaggerated.  

This is because the normalization happens as a result of the highest value so a single value of 6400 having
a slightly biased frequency will make the entire tile go visibly darker.  This is why the test was constructed
in this exact way.

Given that, even in an ideal distribution, there should still slight noticable brightness difference between tiles.
That's the sweet spot between very deterministic (eg, 1, 2, 3, 4 etc), psuedo-random and evenly distributed.

