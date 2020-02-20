Array.move = function (arr, old_index, new_index) {
	if (new_index >= arr.length) {
		var k = new_index - arr.length;
		while ((k--) + 1) {
			arr.push(undefined);
		}
	}
	arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	return arr;
};

Array.removeIndexed = function (arr, from, to) {
	var rest = arr.slice((to || from) + 1 || arr.length);
	arr.length = from < 0 ? arr.length + from : from;
	arr.push.apply(arr, rest);
	return arr;
};

Array.remove = function (arr, el) {
	let index = arr.findIndex((e) => e === el);
	if (index >= 0) {
		arr.removeIndexed(index, index);
	}
	return arr;
}

Array.unique = function (arr) {
	return arr.filter((elem, pos, arr) => arr.indexOf(elem) === pos);
};

Array.clone = function(arr){
	return Array.from(arr);
};

Number.random = function (min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

Function.noop = function () {

};

Element.byId = function (id) {
	return document.getElementById(id);
};

Element.byTag = function (tag) {
	return document.body.getElementsByTagName(tag);
};

Element.addClass = function (obj, cls) {
	cls = cls.trim();
	if (!obj.className.split(" ").includes(cls)) {
		obj.className += " " + cls;
	}
};

Element.removeClass = function (obj, cls) {
	cls = cls.trim();
	obj.className = obj.className.split(" ").filter(e => e != cls).join(" ");
};

Object.clone = function (obj) {
	if(Array.isArray(obj)) return Array.clone(obj);

	let clone = new Object();

	for (var key in obj) {
		var member = obj[key];
		clone[key] = (typeof member === 'object') ? Object.clone(member) : member;
	}

	return clone;
};

Object.extend = function (subclass, superclass) {
	let superClassClone = Object.clone(superclass);
	for (var key in subclass) {
		superClassClone[key] = subclass[key];
	}
	return superClassClone;
};
