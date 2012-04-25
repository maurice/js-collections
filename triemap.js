module.exports = TrieMap;

function TrieMap() {
	
}

TrieMap.prototype.add = function(key, value, pos) {
	for (pos = pos || 0; pos < len; pos++) {
		if (!node.children)
			node.children = {};
		var c = key.charAt(pos);
		node = (node.children[c] || (node.children[c] = new TrieMap()));
	}
	node.key = key;
	node.value = value;
};

TrieMap.prototype.get = function(key, pos) {
	var node = this;
	for (pos = pos || 0; pos < key.length; pos++) {
		node = node.children_ && node.children_[key.charAt(pos)];
		if (!node)
			return undefined;
	}
	return (pos == key.length && node.key_ == key) ? node.value_ : undefined;
};

TrieMap.prototype.getCompletions = function(key, pos) {
	var node = this;
	for (pos = pos || 0; pos < key.length; pos++) {
		node = node.children_ && node.children_[key.charAt(pos)];
		if (!node)
			return {};
	}
	var map = []; // use Array for it's built-in non-enumerable length property
	return node.collectKeyValues_(map);
};

/**
 * @private
 */
TrieMap.prototype.collectKeyValues_ = function(map) {
	if (this.value_ != undefined) {
		map[this.key_] = this.value_;
		map.length += 1;
	}
	for (var ch in this.children_) {
		this.children_[ch].collectKeyValues_(map);
	}
	return map;
};

TrieMap.prototype.remove = function(key, pos) {
	var node = this;
	var nodes = [node];
	for (pos = pos || 0; pos < key.length; pos++) {
		node = node.children_ && node.children_[key.charAt(pos)];
		if (!node)
			return;
		nodes.push(node);
	}
	if (pos == key.length && node.key_ == key) {
		delete node.key_;
		delete node.value_;
	}
	TrieMap.deleteNodesIfEmpty_(nodes, key, nodes.length - 1);
};

/**
 * @private
 */
TrieMap.deleteNodesIfEmpty_ = function(nodes, key, pos) {
	var node = nodes[pos];
	var hasChildren = false;
	for (var ch in node.children_) {
		hasChildren = true;
		break;
	}
	if (!hasChildren) {
		delete node.children_;
		if (pos == 0) {
			return;
		}
		var parent = nodes[pos - 1];
		delete parent.children_[key.charAt(pos - 1)];
		TrieMap.deleteNodesIfEmpty_(nodes, key, pos - 1);
	}
};

TrieMap.prototype.containsKey = function(key, pos) {
	var node = this;
	for (pos = pos || 0; pos < key.length; pos++) {
		node = node.children_ && node.children_[key.charAt(pos)];
		if (!node)
			return false;
	}
	return pos == key.length && node.key_ == key;
};
