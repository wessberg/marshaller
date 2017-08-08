import test from "ava";
import {Marshaller} from "../src/marshaller/marshaller";
import {TypeDetector} from "@wessberg/typedetector";
import {globalObject, globalObjectIdentifier} from "@wessberg/globalobject";

/*tslint:disable*/
const typeDetector = new TypeDetector();
const marshaller = new Marshaller(typeDetector);

test(`'unmarshal()' -> object #1`, t => {
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

	t.deepEqual(marshaller.unmarshal(input), expected);
});

test(`'unmarshal()' -> object. #2`, t => {
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

	t.deepEqual(marshaller.unmarshal(input), expected);
});

test(`'unmarshal()' -> object. #3`, t => {
	const input = `{"foobar": \`baz\`}`;

	t.true(typeDetector.isObject(marshaller.unmarshal(input)));
});

test(`'unmarshal()' -> object #4`, t => {
	const input = `{"hmm": ((arg) => { return (arg === undefined ? undefined : arg)+10;})}`;

	const marshalled = marshaller.unmarshal(input);
	t.true(typeDetector.isObject(marshalled));
});

test(`'unmarshal()' -> object #5`, t => {
	const input = `{"global": ${globalObjectIdentifier}}`;

	const marshalled = marshaller.unmarshal(input);
	t.true(typeDetector.isObject(marshalled));
});

test(`'unmarshal()' -> object #6`, t => {
	const expected = {
		foo: false,
		type: {
			expression: "hello"
		}
	};

	const input = "{\"foo\": false, \"type\": {\"expression\": `hello`}}";

	t.deepEqual(marshaller.unmarshal(input), expected);
});

test(`'unmarshal()' -> Array #1`, t => {
	const expected = [1, "2", false, true, "hello", "goodbye", [1, 2, 3]];

	const input = `[1, "2", false, true, "hello", "goodbye", [1, 2, 3]]`;

	const unmarshalled = marshaller.unmarshal(input);
	t.deepEqual(unmarshalled, expected);
});

test(`'unmarshal()' -> Array #2`, t => {
	const date = new Date();

	const input = `[/foo/, "123", function foo () {}, "${date}"]`;
	const unmarshalled = marshaller.unmarshal(input);

	t.true(
		Array.isArray(unmarshalled) &&
		unmarshalled[0] instanceof RegExp &&
		typeof unmarshalled[1] === "string" &&
		typeDetector.isFunction(unmarshalled[2]) &&
		unmarshalled[3] instanceof Date
	);
});

test(`'unmarshal()' -> Array. #3`, t => {
	const original = [1, "1", true, "true", new Date(), Infinity, "Infinity", NaN, "NaN"];
	const marshalled = marshaller.marshal(original);

	const unmarshalled = marshaller.unmarshal(marshalled);

	t.true(
		Array.isArray(unmarshalled) &&
		typeof unmarshalled[0] === "number" &&
		typeof unmarshalled[1] === "string" &&
		typeof unmarshalled[2] === "boolean" &&
		typeof unmarshalled[3] === "string" &&
		unmarshalled[4] instanceof Date &&
		typeof unmarshalled[5] === "number" &&
		typeof unmarshalled[6] === "string" &&
		typeof unmarshalled[7] === "number" &&
		typeof unmarshalled[8] === "string"
	);
});

test(`'unmarshal()' -> Array #4`, t => {

	const input = `[
		{
			a: [1, "1", true, "${new Date()}"],
			b: "${new Date()}"
		}
	]`;
	const unmarshalled = <any> marshaller.unmarshal(input);

	t.true(
		Array.isArray(unmarshalled) &&
		typeDetector.isObject(unmarshalled[0])
	);
});

test(`'unmarshal()' -> boolean. #1`, t => {
	const expected = true;
	const input = `true`;

	t.deepEqual(marshaller.unmarshal(input), expected);
});

test(`'unmarshal()' -> boolean. #2`, t => {
	const expected = false;
	const input = `false`;

	t.deepEqual(marshaller.unmarshal(input), expected);
});

test(`'unmarshal()' -> number. #1`, t => {
	const expected = 0;
	const input = `0`;

	t.deepEqual(marshaller.unmarshal(input), expected);
});

test(`'unmarshal() -> number. #2`, t => {
	const expected = 1;
	const input = `1`;

	t.deepEqual(marshaller.unmarshal(input), expected);
});

test(`'unmarshal()' -> number. #3`, t => {
	const expected = Infinity;
	const input = `Infinity`;

	t.deepEqual(marshaller.unmarshal(input), expected);
});

test(`'unmarshal()' -> RegExp #1`, t => {
	const expected = /abc/;
	const input = `/abc/`;

	const unmarshalled = <RegExp>marshaller.unmarshal(input);
	t.true(unmarshalled instanceof RegExp && unmarshalled.toString() === expected.toString());
});

test(`'unmarshal()' -> function #1`, t => {
	const expected = function () {
	};
	const input = `function () {}`;

	const marshalled = <Function>marshaller.unmarshal(input);
	t.true(typeof marshalled === "function" && expected.toString() === marshalled.toString());
});

test(`'unmarshal()' -> function #2`, t => {
	const input = `() => {}`;
	const expected = () => {
	};

	const marshalled = marshaller.unmarshal(input);
	if (marshalled == null) t.fail();
	else t.deepEqual(marshalled.toString(), expected.toString());
});

test(`'unmarshal()' -> function #3`, t => {
	const input = `function () {}`;
	const expected = function () {
	};

	const marshalled = marshaller.unmarshal(input);
	if (marshalled == null) t.fail();
	else t.deepEqual(marshalled.toString(), expected.toString());
});

test(`'unmarshal()' -> string #1`, t => {
	const expected = "1";
	const input = `"1"`;

	t.deepEqual(marshaller.unmarshal(input), expected);
});

test(`'unmarshal()' -> string #2`, t => {
	const input = `hellofunction () {}`;
	const expected = input;

	const marshalled = marshaller.unmarshal(input);
	if (marshalled == null) t.fail();
	else t.deepEqual(marshalled.toString(), expected.toString());
});

test(`'unmarshal()' -> string #3`, t => {
	const input = `hello() => {}`;
	const expected = input;

	const marshalled = marshaller.unmarshal(input);
	if (marshalled == null) t.fail();
	else t.deepEqual(marshalled.toString(), expected.toString());
});

test(`'unmarshal()' -> string #4`, t => {
	const input = `2017-06-28T12:23:00.893Z-0`;
	const expected = input;

	const marshalled = marshaller.unmarshal(input);
	if (marshalled == null) t.fail();
	else t.deepEqual(marshalled.toString(), expected.toString());
});

test(`'unmarshal()' -> string #5`, t => {
	const input = `/foo/bar`;
	const expected = input;

	const marshalled = marshaller.unmarshal(input);
	if (marshalled == null || marshalled instanceof RegExp) t.fail();
	else t.deepEqual(marshalled.toString(), expected.toString());
});

test(`'unmarshal()' -> Date #1`, t => {
	const date = new Date();
	const input = date.toISOString();

	const marshalled = marshaller.unmarshal(input);
	t.true(marshalled != null && marshalled instanceof Date);
});

test(`'unmarshal()' -> Date #2`, t => {
	const date = new Date();
	const input = date.toUTCString();

	const marshalled = marshaller.unmarshal(input);
	t.true(marshalled != null && marshalled instanceof Date);
});

test(`'unmarshal()' -> Date #3`, t => {
	const expected = new Date();

	const marshalled = <Date>marshaller.unmarshal(expected.toISOString());
	t.deepEqual(marshalled.getTime(), expected.getTime());
});

test(`'unmarshal()' -> Date #4`, t => {
	const expected = new Date();

	const marshalled = marshaller.unmarshal(expected.toString());
	t.true(marshalled != null && marshalled instanceof Date);
});

test(`'unmarshal()' -> class #1`, t => {

	const input = `new (class A {
        constructor() {
            this.foo = 2;
            if (this.foo) {}
        }
    
static get __INSTANCE__VALUES_MAP () {return {"foo": 2}}
})()`;

	const result = <{foo: number}>marshaller.unmarshal(input);
	t.true(result != null && result.constructor != null && result.constructor.name === "A" && result.foo === 2);
});

test(`'unmarshal()' -> class #2`, t => {

	class Foo {
		public foo: number = 2;
	}

	// Create a new instance and mutate the instance value of 'foo'
	const instance = new Foo();
	instance.foo = 3;

	// Marshal it
	const stringified = marshaller.marshal(instance);

	// Unmarshal it
	const marshalled = <{foo: number}> marshaller.unmarshal(stringified);

	// Assert that 'foo' is still 3, even though it is initialized to another value as per the class definition.
	t.true(marshalled != null && marshalled.constructor != null && marshalled.constructor.name === "Foo" && marshalled.foo === 3);
});

test(`'marshal()' <- object #1`, t => {
	const expected = "{\"a\": 2}";
	const input = {
		a: 2
	};

	t.deepEqual(marshaller.marshal(input), expected);
});

test(`'marshal()' <- object #2`, t => {
	const expected = "{\"a\": 2, \"b\": () => {}}";
	const input = {
		a: 2,
		b: () => {
		}
	};

	t.deepEqual(marshaller.marshal(input), expected);
});

test(`'marshal()' <- object. #3`, t => {
	const expected = "{\"c\": {\"d\": `hello sir!`}}";
	const input = {
		c: {
			d: "hello sir!"
		}
	};

	t.deepEqual(marshaller.marshal(input), expected);
});

test(`'marshal()' <- object #4`, t => {
	const expected = "{\"foo\": false, \"type\": {\"expression\": `hello`}}";
	const foo = false;
	const exp = "hello";
	const input = {
		foo,
		type: {
			expression: exp
		}
	};

	t.deepEqual(marshaller.marshal(input), expected);
});

test(`'marshal()' <- object #5`, t => {
	const expected = "{\"foo\": false}";
	const input = {
		"foo": false
	};

	t.deepEqual(marshaller.marshal(input), expected);
});

test(`'marshal()' <- object #6`, t => {
	const expected = "{\"foo\": class Foo {}}";

	class Foo {
	}

	const input = {
		"foo": Foo
	};

	const marshalled = marshaller.marshal(input);
	t.deepEqual(marshalled, expected);
});

test(`'marshal()' <- object #7`, t => {
	const expected = `{"global": ${globalObjectIdentifier}}`;
	const input = {
		"global": globalObject
	};

	const marshalled = marshaller.marshal(input);
	t.deepEqual(marshalled, expected);
});

test(`'marshal()' <- class #1`, t => {
	class A {
		get foo () {
			return true;
		}
	}

	const input = new A();

	const expected = `new (class A {
            get foo() {
                return true;
            }
        
static get __INSTANCE__VALUES_MAP () {return {}}
})()`;

	const result = <string>marshaller.marshal(input);
	t.deepEqual(result, expected);
});

test(`'marshal()' <- class #2`, t => {
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

	const input = new A(1, 2);

	const expected = `new (class A {
            constructor(_1, _2) {}
            static get foo() {
                return true;
            }
            static bar() {
                return false;
            }
        
static get __INSTANCE__VALUES_MAP () {return {}}
})()`;

	const result = <string>marshaller.marshal(input);
	t.deepEqual(result, expected);
});

test(`'marshal()' <- class #3`, t => {
	class A {
		private foo: number = 2;
		constructor () {
			if (this.foo) {}
		}
	}

	const input = new A();

	const expected = `new (class A {
            constructor() {
                this.foo = 2;
                if (this.foo) {}
            }
        
static get __INSTANCE__VALUES_MAP () {return {"foo": 2}}
})()`;

	const result = <string>marshaller.marshal(input);
	t.deepEqual(result, expected);
});

test(`'marshal()' <- Date #1`, t => {
	const date = new Date();
	const expected = `new Date("${date.toISOString()}")`;

	t.deepEqual(marshaller.marshal(date), expected);
});

test(`'unmarshal() + marshal()' #1`, t => {
	const set = new Set<number>([]);
	set.add(1);
	set.add(2);
	set.add(3);

	const native = {
		a: new Date(),
		b: [1, "2", new Date()],
		c: {
			d: set
		}
	};

	const marshalled = marshaller.marshal(native);
	const unmarshalled = <any>marshaller.unmarshal(marshalled);
	t.true(
		typeDetector.isObject(unmarshalled) &&
		unmarshalled.a instanceof Date &&
		Array.isArray(unmarshalled.b) &&
		typeof (<any>unmarshalled).b[0] === "number" &&
		typeof (<any>unmarshalled).b[1] === "string" &&
		(<any>unmarshalled).b[2] instanceof Date &&
		typeDetector.isObject(unmarshalled.c)
	);
});

test(`'unmarshal() + marshal()' #2`, t => {
	class A {
		public foo: number = 2;
		constructor () {
			if (this.foo) {}
		}
	}

	const instance = new A();
	instance.foo = 3;

	const native = {
		a: instance
	};

	const marshalled = marshaller.marshal(native);
	const unmarshalled = <any>marshaller.unmarshal(marshalled);
	t.true(
		typeDetector.isObject(unmarshalled) &&
		(<A>unmarshalled.a).foo === 3
	);
});
/*tslint:enable*/