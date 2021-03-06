QUnit.test( "5000 rounds of PRNG, making sure 10 distribution buckets don't have an empty set", function( assert ) {
  var 
    r = new Random.PRNG(), 
    bucket = {},
    y;

  for(var ix = 0; ix < 10; ix++) {
    bucket[ix] = 0;
  }

  for(var ix = 0; ix < 5000; ix++) {
    y = r.generate(0, 10);
    bucket[Math.floor(y)] ++;
  }

  assert.equal(Object.keys(bucket).length, 10, "Only 10 keys!");

  for(var ix = 0; ix < 10; ix++) {
    assert.ok(bucket[ix] > 0, "bucket " + ix + " has contents");
  }
});

QUnit.test( "5000 rounds of PRNG, as inclusive integers", function( assert ) {
  var 
    r = new Random.PRNG(), 
    bucket = {},
    y;

  r.inclusive = true;

  for(var ix = 0; ix < 11; ix++) {
    bucket[ix] = 0;
  }

  for(var ix = 0; ix < 5000; ix++) {
    y = r.integer(0, 10);
    bucket[y] ++;
  }

  assert.ok(bucket[0] == 0, "bucket 0 is empty");
  assert.ok(bucket[10] == 0, "bucket 10 is empty");

  console.log(bucket);
  for(var ix = 1; ix < 10; ix++) {
    assert.ok(bucket[ix] > 0, "bucket " + ix + " has contents");
  }
});

QUnit.test( "5000 rounds of PRNG, as exclusive integers", function( assert ) {
  var 
    r = new Random.PRNG(), 
    bucket = {},
    y;

  r.inclusive = false;

  for(var ix = 0; ix < 11; ix++) {
    bucket[ix] = 0;
  }

  for(var ix = 0; ix < 5000; ix++) {
    y = r.integer(0, 10);
    bucket[y] ++;
  }

  for(var ix = 0; ix <= 10; ix++) {
    assert.ok(bucket[ix] > 0, "bucket " + ix + " has contents");
  }
});

QUnit.test( "50000 rounds of PRNG, as exclusive integers - testing for approximately equal distribution", function( assert ) {
  var 
    count = 50000,
    r = new Random.PRNG(), 
    min, max,
    tolerance = 4,
    bucket = {},
    y;

  r.inclusive = false;

  for(var ix = 0; ix < 11; ix++) {
    bucket[ix] = 0;
  }

  for(var ix = 0; ix < count; ix++) {
    y = r.integer(0, 10);
    bucket[y] ++;
  }

  // we'll give it a 4% tolerance.
  min = (count / 11) * (1 - tolerance / 100);
  max = (count / 11) * (1 + tolerance / 100);

  for(var ix = 0; ix <= 10; ix++) {
    assert.ok(bucket[ix] > min && bucket[ix] < max, "bucket " + ix + " has contents");
  }
});
QUnit.test( "50000 rounds of PRNG, as inclusive integers - testing for approximately equal distribution", function( assert ) {
  var 
    count = 50000,
    r = new Random.PRNG(), 
    min, max,
    tolerance = 4,
    bucket = {},
    y;

  r.inclusive = true;

  for(var ix = 0; ix < 11; ix++) {
    bucket[ix] = 0;
  }

  for(var ix = 0; ix < count; ix++) {
    y = r.integer(0, 10);
    bucket[y] ++;
  }

  // we'll give it a 4% tolerance.
  min = (count / 9) * (1 - tolerance / 100);
  max = (count / 9) * (1 + tolerance / 100);

  for(var ix = 1; ix < 10; ix++) {
    assert.ok(bucket[ix] > min && bucket[ix] < max, "bucket " + ix + " has contents");
  }
});
