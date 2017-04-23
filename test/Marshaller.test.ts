import test from "ava";
import {TypeDetector} from "typedetector";
import {Marshaller} from "../src/Marshaller";

const marshaller = new Marshaller(new TypeDetector());
let MARSHALLER_STRING_TEST_COUNT = 0;

test(`'marshal()' string -> object. #${++MARSHALLER_STRING_TEST_COUNT}.`, t => {
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

test(`'marshal()' string -> object. #${++MARSHALLER_STRING_TEST_COUNT}.`, t => {
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

test(`'marshal()' string -> Set. #${++MARSHALLER_STRING_TEST_COUNT}.`, t => {
	const expected = new Set(["hello"]);

	const input = `hello`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Set), expected);
});

test(`'marshal()' string -> Array. #${++MARSHALLER_STRING_TEST_COUNT}.`, t => {
	const expected = [1, 2, false, true, "hello", "goodbye", [1, 2, 3]];

	const input = `[1, 2, false, true, "hello", "goodbye", [1, 2, 3]]`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Array), expected);
});

test(`'marshal()' string -> boolean. #${++MARSHALLER_STRING_TEST_COUNT}.`, t => {
	const expected = true;
	const input = `true`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Boolean), expected);
});

test(`'marshal()' string -> boolean. #${++MARSHALLER_STRING_TEST_COUNT}.`, t => {
	const expected = true;
	const input = `true`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Boolean), expected);
});

test(`'marshal()' string -> boolean. #${++MARSHALLER_STRING_TEST_COUNT}.`, t => {
	const expected = false;
	const input = `false`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Boolean), expected);
});

test(`'marshal()' string -> boolean. #${++MARSHALLER_STRING_TEST_COUNT}.`, t => {
	const expected = true;
	const input = `1`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Boolean), expected);
});

test(`'marshal()' string -> boolean. #${++MARSHALLER_STRING_TEST_COUNT}.`, t => {
	const expected = false;
	const input = `0`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Boolean), expected);
});

test(`'marshal()' string -> number. #${++MARSHALLER_STRING_TEST_COUNT}.`, t => {
	const expected = 0;
	const input = `0`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Number), expected);
});

test(`'marshal()' string -> number. #${++MARSHALLER_STRING_TEST_COUNT}.`, t => {
	const expected = 1;
	const input = `1`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Number), expected);
});

test(`'marshal()' string -> number. #${++MARSHALLER_STRING_TEST_COUNT}.`, t => {
	const expected = Infinity;
	const input = `Infinity`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, Number), expected);
});