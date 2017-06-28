import {ITypeDetector, TypeDetector} from "@wessberg/typedetector";
import {IMarshaller} from "./interface/IMarshaller";
import {GlobalObject, GlobalObjectIdentifier} from "@wessberg/globalobject";

/**
 * A class that can map various data types back and forth between a string representation that can be transferred over the wire
 * or evaluated using eval() or new Function() expressions and back to the native environment.
 * @author Frederik Wessberg
 */
export class Marshaller implements IMarshaller {
	public static readonly CLASS_INSTANCE_INSTANCE_VALUES_MAP_NAME: string = "__INSTANCE__VALUES_MAP";
	private static readonly SYMBOL_REGEX: RegExp = /Symbol\(([^)]*)\)/;
	private static readonly CLASS_INSTANCE_REGEX: RegExp = /\w+\s*{}/;
	private static readonly MARSHALLED_CLASS_INSTANCE_REGEX: RegExp = /new\s*\((\s*class\s+\w+)/;
	private static readonly MARSHALLED_MAP_REGEX: RegExp = /new\s+Map\(\[/;
	private static readonly MARSHALLED_SET_REGEX: RegExp = /new\s+Set\(\[/;
	private static readonly MARSHALLED_WEAK_MAP_REGEX: RegExp = /new\s+WeakMap\(\[/;
	private static readonly MARSHALLED_WEAK_SET_REGEX: RegExp = /new\s+WeakSet\(\[/;
	private static readonly MARSHALLED_DATE_REGEX: RegExp = /new\s+Date\(/;
	private static readonly FUNCTION_REGEX_1: RegExp = /^\(*function\s*\w*\s*\([^)]*\)\s*{/;
	private static readonly FUNCTION_REGEX_2: RegExp = /^\(+[^)]*\)\s*=>/;
	private static readonly FUNCTION_REGEX_3: RegExp = /^\w+\s*=>/;
	private static readonly ISO_STRING_REGEX: RegExp = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))$|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/;
	private static readonly UTC_STRING_REGEX: RegExp = /(\w{3}), (\d{2}) (\w{3}) (\d{4}) ((\d{2}):(\d{2}):(\d{2})) GMT$/;
	private static readonly DEFAULT_DATE_STRING_REGEX: RegExp = /\w{3} \w{3} \d{2} \d{4} \d{2}:\d{2}:\d{2} GMT(\+\d+)? \(\w{1,9}\)$/;
	private static readonly REGEX_REGEX: RegExp = /^\/(.*)\/(\w*)$/;

	constructor (private typeDetector: ITypeDetector = new TypeDetector()) {
	}

	/**
	 * Takes some data and marshals it into a string representation that can be transferred over the network.
	 * @param {T} data
	 * @returns {string}
	 */
	public marshal<T> (data: T): string {
		if (<{}>data === GlobalObject) return GlobalObjectIdentifier;
		if (data === undefined) return this.marshalUndefined(data);
		if (data === null) return this.marshalNull(data);
		if (this.typeDetector.isString(data)) return (<String>data instanceof String ? `"${<string>data.valueOf()}"` : `"${data}"`);
		if (this.typeDetector.isClassConstructor(data)) return this.marshalConstructor(<Function>data);
		if (this.typeDetector.isClassInstance(data)) return this.marshalClass(data);
		if (this.typeDetector.isFunction(data)) return this.marshalFunction(data);
		if (typeof data === "symbol") return this.marshalSymbol(data);
		if (data instanceof RegExp) return this.marshalRegExp(data);
		if (data instanceof Map) return this.marshalMap(data);
		if (data instanceof WeakMap) return this.marshalWeakMap(data);
		if (data instanceof Set) return this.marshalSet(data);
		if (data instanceof WeakSet) return this.marshalWeakSet(data);
		if (data instanceof Date) return this.marshalDate(data);
		if (Array.isArray(data)) return this.marshalArray(data);
		if (this.typeDetector.isObject(data)) return this.marshalObject(data);
		if (this.typeDetector.isBoolean(data)) return this.marshalBoolean(data);
		if (this.typeDetector.isNumber(data)) return this.marshalNumber(data);
		return data;
	}

	/**
	 * Unmarshals marshalled data back into a type that is native to the environment.
	 * @param {string|String} data
	 * @returns {T|{}|null|?}
	 */
	public unmarshal<T> (data: string|String): T|{}|null|undefined {
		if (data === undefined) return undefined;
		if (data === null) return null;

		const primitive = data instanceof String ? data.valueOf() : data;

		if (this.stringIsBoolean(primitive)) return this.unmarshalBoolean(primitive);
		if (this.stringIsNull(primitive)) return this.unmarshalNull(primitive);
		if (this.stringIsUndefined(primitive)) return this.unmarshalUndefined(primitive);
		if (this.stringIsNumber(primitive)) return this.unmarshalNumber(primitive);
		if (this.stringIsArray(primitive)) return this.unmarshalArray(primitive);
		if (this.stringIsObject(primitive)) return this.unmarshalObject(primitive);
		if (this.stringIsRegExp(primitive)) return this.unmarshalRegExp(primitive);
		if (this.stringIsSymbol(primitive)) return this.unmarshalSymbol(primitive);
		if (this.stringIsClass(primitive)) return this.unmarshalClass(primitive);
		if (this.stringIsDate(primitive)) return this.unmarshalDate(primitive);
		if (this.stringIsMap(primitive)) return this.unmarshalMap(primitive);
		if (this.stringIsWeakMap(primitive)) return this.unmarshalWeakMap(primitive);
		if (this.stringIsSet(primitive)) return this.unmarshalSet(primitive);
		if (this.stringIsWeakSet(primitive)) return this.unmarshalWeakSet(primitive);
		if (this.stringIsConstructor(primitive)) return this.unmarshalConstructor(data);
		if (this.stringIsFunction(primitive)) return this.unmarshalFunction(primitive);

		// Fall back to the primitive value itself.
		return this.unquoteIfNecessary(primitive);
	}

	private stringIsDate (str: string): boolean {
		return Marshaller.ISO_STRING_REGEX.test(str) ||
			Marshaller.UTC_STRING_REGEX.test(str) ||
			Marshaller.DEFAULT_DATE_STRING_REGEX.test(str) ||
			Marshaller.MARSHALLED_DATE_REGEX.test(str);
	}

	private stringIsFunction (str: string): boolean {
		const trimmed = str.trim();
		return Marshaller.FUNCTION_REGEX_1.test(trimmed) ||
			Marshaller.FUNCTION_REGEX_2.test(trimmed) ||
			Marshaller.FUNCTION_REGEX_3.test(trimmed);
	}

	private stringIsNumber (str: string): boolean {
		if (str === "Infinity") return true;
		if (str === "NaN") return true;

		const toNum = Number.parseFloat(str);
		return !isNaN(toNum) && !this.startsWithNumberButShouldEnforceString(str);
	}

	private stringIsRegExp (str: string): boolean {
		return Marshaller.REGEX_REGEX.test(str);
	}

	private stringIsBoolean (str: string): boolean {
		return str === "true" || str === "false";
	}

	private stringIsUndefined (str: string): boolean {
		return str === "undefined";
	}

	private stringIsNull (str: string): boolean {
		return str === "null";
	}

	private stringIsMap (str: string): boolean {
		return Marshaller.MARSHALLED_MAP_REGEX.test(str.trim());
	}

	private stringIsSet (str: string): boolean {
		return Marshaller.MARSHALLED_SET_REGEX.test(str.trim());
	}

	private stringIsWeakMap (str: string): boolean {
		return Marshaller.MARSHALLED_WEAK_MAP_REGEX.test(str.trim());
	}

	private stringIsWeakSet (str: string): boolean {
		return Marshaller.MARSHALLED_WEAK_SET_REGEX.test(str.trim());
	}

	private stringIsClass (str: string): boolean {
		return Marshaller.CLASS_INSTANCE_REGEX.test(str) || Marshaller.MARSHALLED_CLASS_INSTANCE_REGEX.test(str);
	}

	private stringIsConstructor (str: string): boolean {
		return str.trim().startsWith("class ");
	}

	private stringIsSymbol (str: string): boolean {
		return Marshaller.SYMBOL_REGEX.test(str);
	}

	private stringIsObject (str: string): boolean {
		const trimmed = str.trim();
		return trimmed.startsWith("{") && trimmed.endsWith("}");
	}

	private stringIsArray (str: string): boolean {
		const trimmed = str.trim();
		return trimmed.startsWith("[") && trimmed.endsWith("]");
	}

	/**
	 * Marshals a class into a string.
	 * @param {{}} data
	 * @returns {string}
	 */
	private marshalClass (data: {}): string {
		// Take all instance values out of the class and make sure that they
		// can be reconstructed when the class is reassembled.
		const keyMap: { [key: string]: any } = {};
		const keys = Object.getOwnPropertyNames(data);
		keys.forEach(key => keyMap[key] = (<{ [key: string]: any }>data)[key]);

		const stringified = <string>this.marshal(data.constructor);
		const toLast = stringified.slice(0, stringified.length - 1);
		const fromLast = stringified.slice(stringified.length - 1);
		const normalized = `${toLast}\nstatic get ${Marshaller.CLASS_INSTANCE_INSTANCE_VALUES_MAP_NAME} () {return ${this.marshalObject(keyMap)}}\n${fromLast}`;

		return `new (${normalized})()`;
	}

	private reconstructClassInstance (data: {}): {} {
		const keyMap = (<any>data.constructor)[Marshaller.CLASS_INSTANCE_INSTANCE_VALUES_MAP_NAME];

		if (keyMap != null) {
			// Remove the property from the constructor (we won't need it anymore)
			delete (<any>data.constructor)[Marshaller.CLASS_INSTANCE_INSTANCE_VALUES_MAP_NAME];

			// Set the instance values on the new instance.
			Object.keys(keyMap).forEach(key => (<any>data)[key] = keyMap[key]);
		}

		return data;
	}

	/**
	 * Unmarshals a Class
	 * @param {string} data
	 * @returns {{}}
	 */
	private unmarshalClass (data: string): {} {

		// It is a marshalled class instance. We need to reconstruct its instance values.
		const marshalledMatch = data.match(Marshaller.MARSHALLED_CLASS_INSTANCE_REGEX);
		if (marshalledMatch != null) {
			const startIndex = data.indexOf(marshalledMatch[1]);
			const endIndex = data.lastIndexOf(")()");

			// Reconstruct the inner constructor
			const ctor = <new () => {}>this.unmarshalConstructor(data.slice(startIndex, endIndex));

			// Create an instance.
			const instance = new ctor();

			// Reconstruct the instance.
			return this.reconstructClassInstance(instance);
		}
		else {
			const ctor = <new () => {}>this.unmarshalConstructor(data);
			return new ctor();
		}
	}

	/**
	 * Marshals a Date into a string.
	 * @param {Date} data
	 * @returns {string}
	 */
	private marshalDate (data: Date): string {
		return `new Date("${data.toISOString()}")`;
	}

	/**
	 * Unmarshals a Date
	 * @param {string|String} data
	 * @returns {Date}
	 */
	private unmarshalDate (data: string|String): Date {
		const primitive = data instanceof String ? data.valueOf() : data;


		if (Marshaller.MARSHALLED_DATE_REGEX.test(primitive)) {
			return new Function (`return ${primitive}`)();
		}

		if (Marshaller.ISO_STRING_REGEX.test(primitive)) {
			return new Date(primitive);
		}

		if (Marshaller.UTC_STRING_REGEX.test(primitive)) {
			return new Date(primitive);
		}

		if (Marshaller.DEFAULT_DATE_STRING_REGEX.test(primitive)) {
			return new Date(primitive);
		}
		return new Date(data);
	}

	/**
	 * Marshals a RegExp into a string.
	 * @param {RegExp} data
	 * @returns {string}
	 */
	private marshalRegExp (data: RegExp): string {
		return data.toString();
	}

	/**
	 * Unmarshals a RegExp
	 * @param {string|String} data
	 * @returns {RegExp}
	 */
	private unmarshalRegExp (data: string|String): RegExp {
		const primitive = data instanceof String ? data.valueOf() : data;
		return new Function(`return ${primitive}`)();
	}

	/**
	 * Marshals a map into a string.
	 * @param {Map<{}, {}>} map
	 * @returns {string}
	 */
	private marshalMap (map: Map<{}, {}>): string {
		return `new Map(${this.marshalArray([...map.entries()])})`;
	}

	/**
	 * Unmarshals a Map
	 * @param {string} data
	 * @returns {Map<{}, {}>}
	 */
	private unmarshalMap (data: string|String): Map<{}, {}> {
		const primitive = data instanceof String ? data.valueOf() : data;
		return new Function(`return ${primitive}`)();
	}

	/**
	 * Marshals a WeakMap into a string.
	 * @param {WeakMap<{}, {}>} _
	 * @returns {string}
	 */
	private marshalWeakMap (_: WeakMap<{}, {}>): string {
		return `new WeakMap(${this.marshalArray([])})`;
	}

	/**
	 * Unmarshals a WeakMap
	 * @param {string} data
	 * @returns {WeakMap<{}, {}>}
	 */
	private unmarshalWeakMap (data: string|String): WeakMap<{}, {}> {
		const primitive = data instanceof String ? data.valueOf() : data;
		return new Function(`return ${primitive}`)();
	}

	/**
	 * Marshals a constructor into a string.
	 * @param {{}} data
	 * @returns {string}
	 */
	private marshalConstructor (data: {}): string {
		return data.toString();
	}

	/**
	 * Unmarshals a Constructor
	 * @param {string|String} data
	 * @returns {Function}
	 */
	private unmarshalConstructor (data: string|String): Function {
		const primitive = data instanceof String ? data.valueOf() : data;
		if (!primitive.trim().startsWith("class")) {
			class Class {
			}

			(<any>Class)[<any>data] = data;
			return Class;
		}
		return new Function(`return (${data})`)();
	}

	/**
	 * Marshals a Set into a string.
	 * @param {Set<T>} data
	 * @returns {string}
	 */
	private marshalSet<T> (data: Set<T>): string {
		return `new Set(${this.marshalArray([...data.keys()])})`;
	}

	/**
	 * Marshals a WeakSet into a string.
	 * @param {WeakSet<T>} _
	 * @returns {string}
	 */
	private marshalWeakSet<T> (_: WeakSet<T>): string {
		return `new WeakSet(${this.marshalArray([])})`;
	}

	/**
	 * Unmarshals a WeakSet
	 * @param {string} data
	 * @returns {WeakSet<T>}
	 */
	private unmarshalWeakSet<T> (data: string|String): WeakSet<T> {
		const primitive = data instanceof String ? data.valueOf() : data;
		return new Function(`return ${primitive}`)();
	}

	/**
	 * Unmarshals a Set
	 * @param {string} data
	 * @returns {Set<T>}
	 */
	private unmarshalSet<T> (data: string|String): Set<T> {
		const primitive = data instanceof String ? data.valueOf() : data;
		return new Function(`return ${primitive}`)();
	}

	/**
	 * Marshals undefined into a string.
	 * @param {?} _
	 * @returns {string}
	 */
	private marshalUndefined (_: undefined): string {
		return "undefined";
	}

	/**
	 * Unmarshals undefined
	 * @param {string} _
	 * @returns {?}
	 */
	private unmarshalUndefined (_: string): undefined {
		return undefined;
	}

	/**
	 * Marshals null into a string.
	 * @param {null} _
	 * @returns {string}
	 */
	private marshalNull (_: null): string {
		return "null";
	}

	/**
	 * Unmarshals null
	 * @param {string} _
	 * @returns {null}
	 */
	private unmarshalNull (_: string): null {
		return null;
	}

	/**
	 * Marshals a symbol into a string.
	 * @param {symbol} data
	 * @returns {string}
	 */
	private marshalSymbol (data: symbol): string {
		const match = data.toString().match(Marshaller.SYMBOL_REGEX);
		if (match == null) throw new ReferenceError(`${this.marshalSymbol.name} was given an invalid symbol to marshal!`);
		return match[1];
	}

	/**
	 * Unmarshals a Symbol
	 * @param {string} data
	 * @returns {symbol}
	 */
	private unmarshalSymbol (data: string|String): symbol {
		const primitive = data instanceof String ? data.valueOf() : data;

		if (Marshaller.SYMBOL_REGEX.test(primitive)) {
			const content = primitive.match(Marshaller.SYMBOL_REGEX);
			if (content != null) return Symbol(content[1]);
		}
		return Symbol(primitive);
	}

	/**
	 * Marshals an object into a string.
	 * @param {object} data
	 * @returns {string}
	 */
	private marshalObject<T> (data: { [key: string]: T }): string {
		let str = "{";
		const space = " ";
		const keys = Object.keys(data);
		keys.forEach((key, index) => {
			str += `"${key}":${space}`;
			const value = data[key];
			const isString = typeof value !== "string" ? false : typeof this.unmarshal(value) === "string";
			const marshalled = typeof value === "string" ? value : this.marshal(value);
			const isFunction = this.typeDetector.isFunction(value);

			if (isFunction) str += this.formatObjectLiteralFunction(<string>marshalled);
			else if (isString) str += this.quoteIfNecessary(<string>marshalled);
			else str += marshalled;
			if (index !== keys.length - 1) str += `,${space}`;
		});
		str += "}";
		return str;
	}

	/**
	 * Unmarshals an object
	 * @param {string|String} data
	 * @returns {object}
	 */
	private unmarshalObject (data: string|String): { [key: string]: any } {
		const primitive = data instanceof String ? data.valueOf() : data;

		const parsed = <{ [key: string]: any }> new Function(`return (${primitive})`)();
		const keys = Object.keys(parsed);

		keys.forEach(key => {
			const value = parsed[key];
			parsed[key] = this.handleComputedItem(value);
		});
		return parsed;
	}

	/**
	 * Marshals a boolean into a string.
	 * @param {boolean} data
	 * @returns {string}
	 */
	private marshalBoolean (data: boolean|Boolean): string {
		return `${data instanceof Boolean ? data.valueOf() : data}`;
	}

	/**
	 * Unmarshals a boolean
	 * @param {string} data
	 * @returns {boolean}
	 */
	private unmarshalBoolean (data: string|String): boolean {
		const primitive = data instanceof String ? data.valueOf() : data;
		return primitive === "true" || primitive === "1" || primitive === "";
	}

	/**
	 * Marshals a number into a string.
	 * @param {number} data
	 * @returns {string}
	 */
	private marshalNumber (data: number|Number): string {
		return `${data instanceof Number ? data.valueOf() : data}`;
	}

	/**
	 * Unmarshals a number
	 * @param {string} data
	 * @returns {number}
	 */
	private unmarshalNumber (data: string|String): number {
		const primitive = data instanceof String ? data.valueOf() : data;
		if (primitive === "NaN") return NaN;
		if (primitive === "Infinity") return Infinity;
		return Number.parseFloat(primitive);
	}

	/**
	 * Marshals an array into a string.
	 * @param {T[]} data
	 * @returns {string}
	 */
	private marshalArray<T> (data: T[]): string {
		let arr: string = "[";
		data.forEach((item, index) => {
			arr += this.marshal(item);
			if (index !== data.length - 1) arr += ",";
		});
		arr += "]";
		return arr;
	}

	/**
	 * Unmarshals an array
	 * @param {string} data
	 * @returns {(T|{}|null|?)[]}
	 */
	private unmarshalArray<T> (data: string|String): (T|{}|null|undefined)[] {
		const primitive = data instanceof String ? data.valueOf() : data;
		const parsed = <(T|{}|null|undefined)[]> new Function(`return ${primitive}`)();
		return parsed.map(item => this.handleComputedItem(item));
	}

	private handleComputedItem (data: {}|null|undefined|string): {}|null|undefined|string {
		if (this.shouldUnmarshalComputedItem(data)) return this.unmarshal(data);
		if (data != null && this.typeDetector.isClassInstance(data)) return this.reconstructClassInstance(data);
		return data;
	}

	private shouldUnmarshalComputedItem (data: {}|null|undefined|string): data is string {
		if (typeof data !== "string") return false;
		return !(this.stringIsNumber(data) || this.stringIsBoolean(data) || this.stringIsUndefined(data) || this.stringIsNull(data));
	}

	/**
	 * Marshals a function into a string.
	 * @param {Function} data
	 * @returns {string}
	 */
	private marshalFunction (data: Function): string {
		return data.toString();
	}

	/**
	 * Unmarshals a Function
	 * @param {string} data
	 * @returns {Function}
	 */
	private unmarshalFunction (data: string): Function {
		if (Marshaller.FUNCTION_REGEX_1.test(data.trim())) return new Function(`return ${data}`)();
		if (Marshaller.FUNCTION_REGEX_2.test(data.trim())) return new Function(`return ${data}`)();
		if (Marshaller.FUNCTION_REGEX_3.test(data.trim())) return new Function(`return ${data}`)();
		return () => data;
	}

	/**
	 * If the string starts with a number but should be a string nevertheless, this method returns true.
	 * @param {string} value
	 * @returns {boolean}
	 */
	private startsWithNumberButShouldEnforceString (value: string): boolean {
		// If the value starts with a digit and possibly a '.' character but then goes on with something
		// else, enforce a string.
		return /^\d+[.]*[^\d.]+/.test(value.trim());
	}

	/**
	 * Returns true if the given content is a quote.
	 * @param {string} content
	 * @returns {boolean}
	 */
	private isQuote (content: string): boolean {
		return /["'`]/.test(content);
	}

	private unquoteIfNecessary (content: string): string {
		if (!(typeof content === "string")) return content;
		const firstIndex = 0;
		const lastIndex = content.length - 1;
		const firstChar = content[firstIndex];
		const lastChar = content[lastIndex];
		if (this.isQuote(firstChar) && this.isQuote(lastChar) && firstChar === lastChar) return content.slice(firstIndex + 1, lastIndex);
		return content;
	}

	/**
	 * Quotes the given string if needed. It will escape the string if it already starts and/or ends with a clashing quote.
	 * @param {string} content
	 * @returns {string}
	 */
	private quoteIfNecessary (content: string): string {
		if (!(typeof content === "string")) return content;
		const firstChar = content[0];
		const lastChar = content[content.length - 1];
		if (this.isQuote(firstChar) && this.isQuote(lastChar)) return content;
		let str = "`";
		const startsWithClashingQuote = firstChar === "`";
		const endsWithClashingQuote = lastChar === "`";
		const startOffset = startsWithClashingQuote ? 1 : 0;
		const endOffset = endsWithClashingQuote ? 1 : 0;
		if (startsWithClashingQuote) str += "\`";
		str += content.slice(startOffset, content.length - endOffset);
		if (endsWithClashingQuote) str += "\`";
		str += "`";
		return str;
	}

	/**
	 * Returns true if the given string is an arrow function.
	 * @param {string} str
	 * @returns {boolean}
	 */
	private isArrowFunction (str: string): boolean {
		if (this.typeDetector.getTypeof(this.unmarshal(str)) !== "function") return false;
		const trimmed = str.trim();
		return !this.functionHasFunctionKeyword(str) && trimmed.includes("=>");
	}

	/**
	 * Returns true if the given stringified function starts with the "function" keyword.
	 * @param {string} str
	 * @returns {boolean}
	 */
	private functionHasFunctionKeyword (str: string): boolean {
		const trimmed = str.trim();
		return trimmed.startsWith("function");
	}

	/**
	 * Returns true if the given string starts with the "class" keyword.
	 * @param {string} str
	 * @returns {boolean}
	 */
	private isClass (str: string): boolean {
		const trimmed = str.trim();
		return trimmed.startsWith("class");
	}

	/**
	 * Extracts the name of the class (if the string is a class declaration).
	 * @param {string} str
	 * @returns {string}
	 */
	private takeClassName (str: string): string|null {
		const match = str.match(/class\s+([^\s\n\t\r{]*)[\s\n\t\r{]/);
		return match == null ? null : match[1];
	}

	/**
	 * Formats an object so it fits a reconstructed object literal from a string.
	 * @param {string} str
	 * @returns {string}
	 */
	private formatObjectLiteralFunction (str: string): string {
		if (this.isArrowFunction(str)) return str;
		if (this.functionHasFunctionKeyword(str)) return str;
		if (this.isClass(str)) {
			const className = this.takeClassName(str);
			if (className != null) return className;
		}
		return `function ${str}`;
	}

}