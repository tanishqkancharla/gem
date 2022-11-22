import { intersection, isArray, isObject } from "remeda";

export function shallowEqual(a: any, b: any) {
	if (a == b) return true;
	if (isArray(a)) {
		if (!isArray(b)) return false;
		if (a.length !== b.length) return false;
		return a.every((x: any, i: any) => b[i] === x);
	}
	if (isObject(a)) {
		if (!isObject(b)) return false;
		const keys = Object.keys(a);
		const sameKeys = intersection(keys, Object.keys(b));
		if (keys.length !== sameKeys.length) return false;
		return keys.every((key) => a[key] == b[key]);
	}
	return false;
}
