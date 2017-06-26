import test from "ava";
import {Marshaller} from "../src/Marshaller";
import {TypeDetector} from "@wessberg/typedetector";
import {GlobalObject, GlobalObjectIdentifier} from "@wessberg/globalobject";

const typeDetector = new TypeDetector();
const marshaller = new Marshaller(typeDetector);

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

	t.deepEqual(marshaller.marshal(input, Object), expected);
});

test(`'marshal()' string -> object. #2`, t => {
	const expected = {
		a: {
			b: {
				c: "hello world!"
			}
		},
		d: ["foo", "bar", true, false]
	};

	const input = `
		{a: {b: {c: "hello world!"}}, d: ["foo", "bar", true, false]}
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
	const expected = function () {
	};
	const input = `function () {}`;

	const marshalled = marshaller.marshal(input, expected);
	t.true(typeof marshalled === "function" && expected.toString() === marshalled.toString());
});

test(`'marshal()' string -> best guess. #1`, t => {
	const expected = "1";
	const input = `"1"`;

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input), expected);
});

test(`'marshal()' string -> best guess. #2`, t => {
	const input = `{"foobar": \`baz\`}`;

	t.true(typeDetector.isObject(marshaller.marshal(input)));
});

test(`'marshal()' string -> best guess. #3`, t => {
	const input = `() => {}`;
	const expected = () => {
	};

	const marshalled = marshaller.marshal(input);
	if (marshalled == null) t.fail();
	else t.deepEqual(marshalled.toString(), expected.toString());
});

test(`'marshal()' string -> best guess. #4`, t => {
	const input = `function () {}`;
	const expected = function () {
	};

	const marshalled = marshaller.marshal(input);
	if (marshalled == null) t.fail();
	else t.deepEqual(marshalled.toString(), expected.toString());
});

test(`'marshal()' string -> best guess. #5`, t => {
	const input = `hellofunction () {}`;
	const expected = input;

	const marshalled = marshaller.marshal(input);
	if (marshalled == null) t.fail();
	else t.deepEqual(marshalled.toString(), expected.toString());
});

test(`'marshal()' string -> best guess. #6`, t => {
	const input = `hello() => {}`;
	const expected = input;

	const marshalled = marshaller.marshal(input);
	if (marshalled == null) t.fail();
	else t.deepEqual(marshalled.toString(), expected.toString());
});

test(`'marshal()' string -> best guess. #7`, t => {
	const input = `{"hmm": ((arg) => { return (arg === undefined ? undefined : arg)+10;})}`;

	const marshalled = marshaller.marshal(input);
	t.true(typeDetector.isObject(marshalled));
});

test(`'marshal()' string -> best guess. #8`, t => {
	const input = `{"global": ${GlobalObjectIdentifier}}`;

	const marshalled = marshaller.marshal(input);
	t.true(typeDetector.isObject(marshalled));
});

test(`'marshal()' string -> best guess. #9`, t => {
	const date = new Date();
	const input = date.toISOString();

	const marshalled = marshaller.marshal(input);
	t.true(marshalled instanceof Date);
});

test(`'marshal()' string -> best guess. #10`, t => {
	const date = new Date();
	const input = date.toUTCString();

	const marshalled = marshaller.marshal(input);
	t.true(marshalled instanceof Date);
});

test(`'marshal()' object -> string. #1`, t => {
	const expected = "{\"a\": 2}";
	const input = {
		a: 2
	};

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, expected), expected);
});

test(`'marshal()' object -> string. #2`, t => {
	const expected = "{\"a\": 2, \"b\": () => {}}";
	const input = {
		a: 2,
		b: () => {
		}
	};

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, expected), expected);
});

test(`'marshal()' object -> string. #3`, t => {
	const expected = "{\"c\": {\"d\": `hello sir!`}}";
	const input = {
		c: {
			d: "hello sir!"
		}
	};

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, expected), expected);
});

test(`'marshal()' object -> string. #4`, t => {
	const expected = "{\"foo\": false, \"type\": {\"expression\": `hello`}}";
	const foo = false;
	const exp = "hello";
	const input = {
		foo,
		type: {
			expression: exp
		}
	};

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, expected), expected);
});

test(`'marshal()' object -> string. #5`, t => {
	const expected = "{\"foo\": false}";
	const input = {
		"foo": false
	};

	t.deepEqual<Object|null|undefined>(marshaller.marshal(input, expected), expected);
});

test(`'marshal()' object -> string. #6`, t => {
	const expected = "{\"foo\": class Foo {}}";

	class Foo {
	}

	const input = {
		"foo": Foo
	};

	const marshalled = marshaller.marshal(input, expected);
	t.deepEqual(marshalled, expected);
});

test(`'marshal()' object -> string. #7`, t => {
	const expected = `{"global": ${GlobalObjectIdentifier}}`;
	const input = {
		"global": GlobalObject
	};

	const marshalled = marshaller.marshal(input, expected);
	t.deepEqual(marshalled, expected);
});

test(`'marshal()' string -> object. #1`, t => {
	const expected = {
		foo: false,
		type: {
			expression: "hello"
		}
	};

	const input = "{\"foo\": false, \"type\": {\"expression\": `hello`}}";

	t.deepEqual(marshaller.marshal(input, expected), expected);
});

test(`'marshal()' class -> string. #1`, t => {
	class A {
		get foo () {
			return true;
		}
	}

	const expected = `new (class A {
        get foo() {
            return true;
        }
    })()`;
	const input = new A();

	const result = <string>marshaller.marshal(input, expected);
	t.deepEqual(result, expected);
});

test(`'marshal()' class -> string. #2`, t => {
	class A {
		constructor (_1: any, _2: any) {
		}

		static get foo () {
			return true;
		}

		static bar () {
			return false;
		}
	}

	const expected = `new (class A {
        constructor(_1, _2) {}
        static get foo() {
            return true;
        }
        static bar() {
            return false;
        }
    })()`;
	const input = new A(1, 2);
	const result = <string>marshaller.marshal(input, expected);
	t.deepEqual(result, expected);
});

test(`'marshal()' Date -> string. #1`, t => {
	const date = new Date();
	const expected = date.toISOString();

	t.deepEqual(marshaller.marshal(date, expected), expected);
});

test(`'marshal()' string -> Date. #1`, t => {
	const expected = new Date();

	const marshalled = <Date>marshaller.marshal(expected.toISOString(), Date);
	t.deepEqual(marshalled.getTime(), expected.getTime());
});