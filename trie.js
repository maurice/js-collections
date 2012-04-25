module.exports = Trie;

function Trie() {
	
}

Trie.prototype.add = function(str, pos) {
	pos = pos || 0;
	if (pos == str.length) {
		this.value_ = str;
		return;
	}
	if (!this.children_) {
		this.children_ = {};
	}
	var c = str.charAt(pos);
	var child = (this.children_[c] || (this.children_[c] = new Trie()));
	child.add(str, pos + 1);
};

Trie.prototype.getCompletions = function(str, pos) {
	var node = this;
	for (pos = pos || 0; pos < str.length; pos++) {
		node = node.children_ && node.children_[str.charAt(pos)];
		if (!node)
			return [];
	}
	return node.collectValues_([]);
};

/**
 * @private
 */
Trie.prototype.collectValues_ = function(values) {
	if (this.value_ != undefined) {
		values.push(this.value_);
	}
	for (var ch in this.children_) {
		this.children_[ch].collectValues_(values);
	}
	return values;
};

Trie.prototype.remove = function(str, pos) {
	var node = this;
	var nodes = [node];
	for (pos = pos || 0; pos < str.length; pos++) {
		node = node.children_ && node.children_[str.charAt(pos)];
		if (!node)
			return;
		nodes.push(node);
	}
	if (pos == str.length && node.value_) {
		delete node.value_;
	}
	Trie.deleteNodesIfEmpty_(nodes, str, nodes.length - 1);
};

/**
 * @private
 */
Trie.deleteNodesIfEmpty_ = function(nodes, str, pos) {
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
		delete parent.children_[str.charAt(pos - 1)];
		Trie.deleteNodesIfEmpty_(nodes, str, pos - 1);
	}
};

Trie.prototype.contains = function(str, pos) {
	var node = this;
	for (pos = pos || 0; pos < str.length; pos++) {
		node = node.children_ && node.children_[str.charAt(pos)];
		if (!node)
			return false;
	}
	return pos == str.length && node.value_;
};