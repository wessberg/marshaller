import test from "ava";
import {demarshall, marshall} from "../src/marshaller/marshaller";

// tslint:disable:no-any

test("#1", t => {
	const original = undefined;
	const marshalled = marshall(original);
	const demarshalled = demarshall(marshalled);
	t.deepEqual(original, demarshalled);
});

test("#2", t => {
	const original = null;
	const marshalled = marshall(original);
	const demarshalled = demarshall(marshalled);
	t.deepEqual(original, demarshalled);
});

test("#3", t => {
	const original = new Date();
	const marshalled = marshall(original);
	const demarshalled = demarshall(marshalled);
	t.deepEqual(original, demarshalled);
});

test("#4", t => {
	const original = new Set([1, 2, 3]);
	const marshalled = marshall(original);
	const demarshalled = demarshall(marshalled);
	t.deepEqual(original, demarshalled);
});

test("#5", t => {
	const original = new Map([[1, 1], [2, 2], [3,3]]);
	const marshalled = marshall(original);
	const demarshalled = demarshall(marshalled);
	t.deepEqual(original, demarshalled);
});

test("#5", t => {
	const original = new Map([[new Uint16Array([1, 2, 3]), /foo/], [new Uint16Array([1, 2, 3]), /bar/], [new Uint16Array([1, 2, 3]),/baz/]]);
	const marshalled = marshall(original);
	const demarshalled = demarshall(marshalled);
	t.deepEqual(original, demarshalled);
});

test("#6", t => {
	const original = Symbol("123");
	const marshalled = marshall(original);
	const demarshalled = demarshall(marshalled);
	t.deepEqual(original.toString(), demarshalled.toString());
});

test("#7", t => {
	const original = {
		a: {
			b: {
				foo: [/foo/],
				bar: new Date()
			}
		}
	};
	const marshalled = marshall(original);
	const demarshalled = demarshall(marshalled);
	t.deepEqual(original, demarshalled);
});

test("#8", t => {
	const parent: any = {prop1: "value"};
	parent.child = {prop2: "value", parent};
	const marshalled = marshall(parent);
	const demarshalled = demarshall(marshalled);
	t.deepEqual(parent, demarshalled);
});

test.only("#9", t => {
	const arr: any[] = [1, 2, 3];
	// Push the arr itself to the array (circular dependency)
	arr.push(arr);
	const marshalled = marshall(arr);
	const demarshalled = demarshall(marshalled);
	t.deepEqual(arr, demarshalled);
});