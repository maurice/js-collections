var TrieMap = require('./triemap.js')
  , util = require('util');

exports["get for a non-existent key === undefined"] = function(test) {
	var m = new TrieMap();
  var v = m.get('foo');
  test.ok(v === undefined);
  m.add('fop', true);
  v = m.get('foo');
  test.ok(v === undefined);
  test.done();
};

exports["adding same key with different value updates value"] = function(test) {
	var m = new TrieMap();
	m.add('foo', 'FOO');
  var v = m.get('foo');
  test.equal('FOO', v);
	m.add('foo', 99);
  v = m.get('foo');
  test.equal(99, v);
	test.done();
};

exports["contains key"] = function(test) {
  var m = new TrieMap();
  m.add('bar');
  m.add('baz');
  test.ok(m.containsKey('bar'));
  test.ok(m.containsKey('baz'));
  test.ok(!m.containsKey('dog'));
  test.ok(!m.containsKey('b'));
  test.done();
};

exports["get is case sensitive!"] = function(test) {
  var m = new TrieMap();
  m.add('foo', 'foo');
  test.ok(undefined === m.get('Foo'));
  test.ok(!m.containsKey('Foo'));

  // add key+value in different case
  m.add('Foo', 'Foo');
  test.equal('Foo', m.get('Foo'));
  test.ok(m.containsKey('Foo'));
  test.done();
};

exports["remove from TrieMap"] = function(test) {
  var m = new TrieMap();
  m.add('dog', 1);
  m.remove('dog');
  test.ok(undefined === m.get('dog'));
  m.add('dog', 1);
  m.add('dogs', 2);
  m.remove('dog');
  test.ok(undefined === m.get('dog'));
  m.remove('dogs');
  test.ok(undefined === m.get('dogs'));
  test.ok(undefined === m.get('dog'));
  test.ok(m.children_ == undefined, "Should no longer be a children_ property for this node");
  test.done();
};

exports["getCompletions using partial string"] = function(test) {
  var m = new TrieMap();
  m.add('foo', 1);
  var c = m.getCompletions('f');
  test.equal('foo1', stringifyMap(c));
  c = m.getCompletions('fo');
  test.equal('foo1', stringifyMap(c));
  c = m.getCompletions('foo');
  test.equal('foo1', stringifyMap(c));
  c = m.getCompletions('fooo');
  test.equal('', stringifyMap(c));
  test.done();
};

exports["multiple completions for the same prefix"] = function(test) {
	var m = new TrieMap();
  m.add('bar', 0);
  m.add('baz', 'A');

  var c = m.getCompletions('bar');
  test.equal('bar0', stringifyMap(c));
  test.equal(1, c.length);
  c = m.getCompletions('baz');
  test.equal('bazA', stringifyMap(c));
  test.equal(1, c.length);
  c = m.getCompletions('b');
  test.equal('bar0bazA', stringifyMap(c));
  test.equal(2, c.length);
  
  m.add('bart', 99);
  c = m.getCompletions('b');
  test.equal('bar0bart99bazA', stringifyMap(c));
  test.equal(3, c.length);
  test.done();
};

// returns a stringified map with deterministic key+value ordering
function stringifyMap(o) {
  var keys = [];
  for (var k in o) keys.push(k);
  keys.sort();
  var s = '';
  for (var i = 0; i < keys.length; i++) { s += keys[i] + o[keys[i]]; }
  return s;
}
