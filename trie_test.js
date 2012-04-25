var Trie = require('./trie.js')
  , util = require('util');

exports["adding duplicates has no effect"] = function(test) {
	var t = new Trie();
	t.add('foo');
	var s = util.inspect(t, false, null);
	t.add('foo');
	test.equal(util.inspect(t, false, null), s, "Duplicates ignored");
	test.done();
};

exports["getCompletions using partial string"] = function(test) {
	var t = new Trie();
  t.add('foo');
	var c = t.getCompletions('f');
  test.equal(1, c.length);
  test.equal('foo', c[0]);
  c = t.getCompletions('fo');
  test.equal(1, c.length);
  test.equal('foo', c[0]);
  c = t.getCompletions('foo');
  test.equal(1, c.length);
  test.equal('foo', c[0]);
  c = t.getCompletions('fooo');
  test.equal(0, c.length);
	test.done();
};

exports["it's case sensitive!"] = function(test) {
	var t = new Trie();
  t.add('foo');
	var c = t.getCompletions('Foo');
  test.equal(0, c.length);

  // add token in different case
  t.add('Foo');
  c = t.getCompletions('Foo');
  test.equal(1, c.length);
  test.ok('Foo', c[0]);
  test.done();
};

exports["multiple completions for the same prefix"] = function(test) {
	var t = new Trie();
  t.add('bar');
  t.add('baz');

  var c = t.getCompletions('bar');
  test.equal(1, c.length);
  test.equal('bar', c[0]);
  c = t.getCompletions('baz');
  test.equal(1, c.length);
  test.equal('baz', c[0]);
  c = t.getCompletions('b');
  test.equal(2, c.length);
  test.ok(c.indexOf('bar') != -1);
  test.ok(c.indexOf('baz') != -1);
  
  t.add('bart');
  c = t.getCompletions('b');
  test.equal(3, c.length);
  test.ok(c.indexOf('bar') != -1);
  test.ok(c.indexOf('baz') != -1);
  test.ok(c.indexOf('bart') != -1);
  test.done();
};

exports["contains key"] = function(test) {
	var t = new Trie();
  t.add('bar');
  t.add('baz');
  test.ok(t.contains('bar'));
  test.ok(t.contains('baz'));
  test.ok(!t.contains('dog'));
  test.ok(!t.contains('b'));
  test.done();
};

exports["remove from Trie"] = function(test) {
  var t = new Trie();
  t.add('dog');
  t.remove('dog');
  test.equal(t.getCompletions('dog').length, 0);
  t.add('dog');
  t.add('dogs');
  t.remove('dog');
  test.equal(t.getCompletions('dog')[0], 'dogs');
  t.remove('dogs');
  test.equal(t.getCompletions('dog').length, 0);
  test.ok(t.children_ == undefined, "Should no longer be a children_ property for this node");
  test.done();
};
