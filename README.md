**Demo and test [Right Over Here](http://qaa.ath.cx/jsrand/test.html)**

# Overview
Oftentimes while doing performance tests in javascript, I need to create test data with the following properties:

 * extremely large
 * sufficiently random
 * reproducable

Javascript's `Math.random` can do the first 2 constraints, but the third one is left in the open and that's the problem; if you can't reliably reproduce the same set of psuedo random numbers every time, then that is yet another factor that may lead to a higher variance during test runs than necessary.

Seeing as the performance of this library could vary too and become a factor, there is a routine designed to generate a set of random numbers of a given length.

# About

This library is modularized. It has a set a generic functions and two different generators.

## Functions

 * seed (x) : seeds the generator to `x`.
 * generate () : generates a floating point between 0 and 1.
 * generate (min, max) : generates a floating point between `min` and `max`. 
 * integer () : generates an integer between 0 and 1.
 * integer (min, max) : generates an integer between `min` and `max`. `[min, max)`
 * set (count, min, max) : generates an array of floating point numbers between `min` and `max`.
 * shuffle (array) : re-orders `array` using Fisher-Yates.
 * base (len, radix) : generates `len` characters in base `radix`.
 * UUID () : generates a UUID formatted string.

## Parameters

In order to use a parameter, set it after instantiatio like so:

    var r = new Random.PRNG();
    
    r.inclusive = false;


 * inclusive (*default: true*) - specifies whether integer randomization is inclusive or exclusive.

## Usage

To use, create a new object of the type of generator you want to use.  currently supported generators are:

  * MT: MT19937 over 32-bit space
  * PRNG: X[n + 1] = (a * X[n] + b) mod m

To start a new MT generator:

    var generator = new Random.MT();

To start a new PRNG generator:

    var generator = new Random.PRNG();

Then you can use it as follows:

    generator.UUID();
    generator.shuffle([1,2,3,4]);

And so on.  Every generator is seeded at 0.

### Drop in replacement / Apply on existing code-bases

You can override `Math.random` by using the `_unitgenerator` of an instance.

    Math.random = generator._unitgenerator;

### Extending

The functions above are written generically and can be used with a generator you author yourself. 

To create a generator you run this:

    var NewType = Random.Generator(gen);
    var instance = new NewType();

Where `gen` is a function that returns an object with the following two keys defined:

 * `seed: function(number)` - seeds the generator
 * `_unitgenerate: function()` - returns an iteration of the generator scaled between 0 and 1.

The MT and the PRNG generators are written this way. You can look at the end of the source file to see how it was done.

