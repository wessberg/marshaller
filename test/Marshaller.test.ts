import test from "ava";
import {Marshaller} from "../src/Marshaller";
import {TypeDetector} from "@wessberg/typedetector";

const marshaller = new Marshaller(new TypeDetector());

test(`'marshal()' string -> object. #1`, t => {
	const expected = {
		a: 1,
		b: 2
	};

	const input = `
		{
			a: 1,
			b: 2
		}
	`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Object), expected);
});

test(`'marshal()' string -> object. #2`, t => {
	const expected = {
		a: {
			b: {
				c: "hello world!"
			}
		},
		b: ["foo", "bar", true, false]
	};

	const input = `
		{
		a: {
			b: {
				c: "hello world!"
			}
		},
		b: ["foo", "bar", true, false]
	};
	`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Object), expected);
});

test(`'marshal()' string -> Set. #1`, t => {
	const expected = new Set(["hello"]);

	const input = `hello`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Set), expected);
});

test(`'marshal()' string -> Array. #1`, t => {
	const expected = [1, 2, false, true, "hello", "goodbye", [1, 2, 3]];

	const input = `[1, 2, false, true, "hello", "goodbye", [1, 2, 3]]`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Array), expected);
});

test(`'marshal()' string -> boolean. #1`, t => {
	const expected = true;
	const input = `true`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Boolean), expected);
});

test(`'marshal()' string -> boolean. #2`, t => {
	const expected = true;
	const input = `true`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Boolean), expected);
});

test(`'marshal()' string -> boolean. #3`, t => {
	const expected = false;
	const input = `false`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Boolean), expected);
});

test(`'marshal()' string -> boolean. #4`, t => {
	const expected = true;
	const input = `1`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Boolean), expected);
});

test(`'marshal()' string -> boolean. #5`, t => {
	const expected = false;
	const input = `0`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Boolean), expected);
});

test(`'marshal()' string -> number. #1`, t => {
	const expected = 0;
	const input = `0`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Number), expected);
});

test(`'marshal()' string -> number. #2`, t => {
	const expected = 1;
	const input = `1`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Number), expected);
});

test(`'marshal()' string -> number. #3`, t => {
	const expected = Infinity;
	const input = `Infinity`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Number), expected);
});

test(`'marshal()' string -> function. #1`, t => {
	const expected = function () {};
	const input = `function () {}`;

	const marshalled = marshaller.marshal(input, expected);
	t.true(typeof marshalled === "function" && expected.toString() === marshalled.toString());
});

test(`'marshal()' string -> best guess. #1`, t => {
	const expected = "1";
	const input = `"1"`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input), expected);
});