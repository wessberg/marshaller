import {IMarshaller, Newable} from "./interface/IMarshaller";
import {ITypeDetector, IArbitraryObject} from "@wessberg/typedetector";

/**
 * A class that maps between a variety of data types.
 * @author Frederik Wessberg
 */
export class Marshaller implements IMarshaller {
	private static readonly SYMBOL_REGEX: RegExp = /Symbol\(([^)]*)\)/;
	private static readonly FUNCTION_REGEX_1: RegExp = /function\s*\w*\s*\([^)]*\)\s*{/;
	private static readonly FUNCTION_REGEX_2: RegExp = /\([^)]*\)\s*=>/;
	private static readonly FUNCTION_REGEX_3: RegExp = /\w+\s*=>/;

	constructor (private typeDetector: ITypeDetector) {}

	/**
	 * Takes some data and marshals it into the other data-type given as hint.
	 * A hint can be a constructor for a type or an instance of one.
	 * If none is given, it will attempt to figure out which data type to marshal into.
	 * @param {T} data
	 * @param {U} [hint]
	 * @returns {null|U}
	 */
	public marshal<T, U> (data: T, hint?: U|Newable<U>): U | null|undefined {
		if (hint != null) return <U | null>this.marshalTo(data, hint);
		else return <U | null>this.marshalToBestGuess<T>(data);
	}

	/**
	 * Marshals a set into a string.
	 * @param {Set<T>} data
	 * @returns {string}
	 */
	private marshalSetToString<T> (data: Set<T>): string {
		let representation = "";
		data.forEach(entry => representation += JSON.stringify(entry, null, "\t"));
		return representation;
	}

	/**
	 * Marshals a set into a function.
	 * @param {Set<T>} data
	 * @returns {Function}
	 */
	private marshalSetToFunction<T> (data: Set<T>): Function {
		return () => data;
	}

	/**
	 * Marshals a symbol into a string.
	 * @param {symbol} data
	 * @returns {string}
	 */
	private marshalSymbolToString (data: symbol): string {
		const match = data.toString().match(Marshaller.SYMBOL_REGEX);
		if (match == null) throw new ReferenceError(`${this.marshalSymbolToString.name} was given an invalid symbol to marshal!`);
		return match[1];
	}

	/**
	 * Marshals a symbol into a function.
	 * @param {symbol} data
	 * @returns {Function}
	 */
	private marshalSymbolToFunction (data: symbol): Function {
		return () => data;
	}

	/**
	 * Marshals an object into a string.
	 * @param {object} data
	 * @returns {string}
	 */
	private marshalObjectToString<T> (data: { [key: string]: T }): string {
		return JSON.stringify(data);
	}

	/**
	 * Marshals an object into a function.
	 * @param {object} data
	 * @returns {Function}
	 */
	private marshalObjectToFunction<T> (data: { [key: string]: T }): Function {
		return () => data;
	}

	/**
	 * Marshals a boolean into a string.
	 * @param {boolean} data
	 * @returns {string}
	 */
	private marshalBooleanToString (data: boolean | Boolean): string {
		return `${data instanceof Boolean ? data.valueOf() : data}`;
	}

	/**
	 * Marshals a boolean into a Function.
	 * @param {boolean} data
	 * @returns {Function}
	 */
	private marshalBooleanToFunction (data: boolean | Boolean): Function {
		return () => data;
	}

	/**
	 * Marshals a number into a string.
	 * @param {number} data
	 * @returns {string}
	 */
	private marshalNumberToString (data: number | Number): string {
		return `${data instanceof Number ? data.valueOf() : data}`;
	}

	/**
	 * Marshals a number into a Function.
	 * @param {number} data
	 * @returns {Function}
	 */
	private marshalNumberToFunction (data: number | Number): Function {
		return () => data;
	}

	/**
	 * Marshals an array into a string.
	 * @param {T[]} data
	 * @returns {string}
	 */
	private marshalArrayToString<T> (data: T[]): string {
		return JSON.stringify(data);
	}

	/**
	 * Marshals a function into a string.
	 * @param {Function} data
	 * @returns {string}
	 */
	private marshalFunctionToString (data: Function): string {
		return data.toString();
	}

	/**
	 * Marshals an array into a Function.
	 * @param {T[]} data
	 * @returns {Function}
	 */
	private marshalArrayToFunction<T> (data: T[]): Function {
		return () => data;
	}

	/**
	 * Marshals a string into a Function.
	 * @param {string} data
	 * @returns {Function}
	 */
	private marshalStringToFunction (data: string): Function {
		if (Marshaller.FUNCTION_REGEX_1.test(data)) return new Function(`return ${data}`)();
		if (Marshaller.FUNCTION_REGEX_2.test(data)) return new Function(`return ${data}`)();
		if (Marshaller.FUNCTION_REGEX_3.test(data)) return new Function(`return ${data}`)();
		return () => data;
	}

	/**
	 * Marshals a string into a boolean.
	 * @param {string} data
	 * @returns {boolean}
	 */
	private marshalStringToBoolean (data: string | String): boolean {
		const primitive = data instanceof String ? data.valueOf() : data;
		return primitive === "true" || primitive === "1" || primitive === "";
	}

	/**
	 * Marshals a Function into a boolean.
	 * @param {Function} _
	 * @returns {boolean}
	 */
	private marshalFunctionToBoolean (_: Function): boolean {
		return true;
	}

	/**
	 * Marshals a symbol into a boolean.
	 * @param {symbol} data
	 * @returns {boolean}
	 */
	private marshalSymbolToBoolean (data: symbol): boolean {
		const match = data.toString().match(Marshaller.SYMBOL_REGEX);
		if (match == null) throw new ReferenceError(`${this.marshalSymbolToBoolean.name} was given an invalid symbol to marshal!`);
		return this.marshalStringToBoolean(match[1]);
	}

	/**
	 * Marshals a Set into a boolean.
	 * @param {Set<T>} _
	 * @returns {boolean}
	 */
	private marshalSetToBoolean<T> (_: Set<T>): boolean {
		return true;
	}

	/**
	 * Marshals an array into a boolean.
	 * @param {T[]} _
	 * @returns {boolean}
	 */
	private marshalArrayToBoolean<T> (_: T[]): boolean {
		return true;
	}

	/**
	 * Marshals an object into a boolean.
	 * @param {object} _
	 * @returns {boolean}
	 */
	private marshalObjectToBoolean<T> (_: {[key: string]: T}): boolean {
		return true;
	}

	/**
	 * Marshals a number into a boolean.
	 * @param {number} data
	 * @returns {boolean}
	 */
	private marshalNumberToBoolean (data: number | Number): boolean {
		const primitive = data instanceof Number ? data.valueOf() : data;
		return primitive > 0;
	}

	/**
	 * Marshals a string into a symbol.
	 * @param {string} data
	 * @returns {symbol}
	 */
	private marshalStringToSymbol (data: string | String): symbol {
		const primitive = data instanceof String ? data.valueOf() : data;

		if (Marshaller.SYMBOL_REGEX.test(primitive)) {
			const content = primitive.match(Marshaller.SYMBOL_REGEX);
			if (content != null) return Symbol(content[1]);
		}
		return Symbol(primitive);
	}

	/**
	 * Marshals a number into a symbol.
	 * @param {number} data
	 * @returns {symbol}
	 */
	private marshalNumberToSymbol (data: number | Number): symbol {
		const primitive = data instanceof Number ? data.valueOf() : data;
		return Symbol(this.marshalNumberToString(primitive));
	}

	/**
	 * Marshals a number into a symbol.
	 * @param {Function} data
	 * @returns {symbol}
	 */
	private marshalFunctionToSymbol (data: Function): symbol {
		return Symbol(this.marshalFunctionToString(data));
	}

	/**
	 * Marshals a set into a symbol.
	 * @param {Set<T>} data
	 * @returns {symbol}
	 */
	private marshalSetToSymbol<T> (data: Set<T>): symbol {
		return Symbol(this.marshalSetToString(data));
	}

	/**
	 * Marshals an array into a symbol.
	 * @param {T[]} data
	 * @returns {symbol}
	 */
	private marshalArrayToSymbol<T> (data: T[]): symbol {
		return Symbol(this.marshalArrayToString(data));
	}

	/**
	 * Marshals an object into a symbol.
	 * @param {object} data
	 * @returns {symbol}
	 */
	private marshalObjectToSymbol<T> (data: { [key: string]: T }): symbol {
		return Symbol(this.marshalObjectToString(data));
	}

	/**
	 * Marshals a boolean into a symbol.
	 * @param {boolean} data
	 * @returns {symbol}
	 */
	private marshalBooleanToSymbol (data: boolean | Boolean): symbol {
		const primitive = data instanceof Boolean ? data.valueOf() : data;
		return Symbol(this.marshalBooleanToString(primitive));
	}

	/**
	 * Marshals a string into a number.
	 * @param {string} data
	 * @returns {number}
	 */
	private marshalStringToNumber (data: string | String): number {
		const primitive = data instanceof String ? data.valueOf() : data;
		return Number.parseFloat(primitive);
	}

	/**
	 * Marshals a Function into a number.
	 * @param {Function} _
	 * @returns {number}
	 */
	private marshalFunctionToNumber (_: Function): number {
		return 1;
	}

	/**
	 * Marshals a symbol into a number.
	 * @param {symbol} data
	 * @returns {number}
	 */
	private marshalSymbolToNumber (data: symbol): number {
		const match = data.toString().match(Marshaller.SYMBOL_REGEX);
		if (match == null) throw new ReferenceError(`${this.marshalSymbolToNumber.name} was given an invalid symbol to marshal!`);
		return this.marshalStringToNumber(match[1]);
	}

	/**
	 * Marshals a set into a number.
	 * @param {Set<T>} data
	 * @returns {number}
	 */
	private marshalSetToNumber<T> (data: Set<T>): number {
		return data.size;
	}

	/**
	 * Marshals an array into a number.
	 * @param {T[]} data
	 * @returns {number}
	 */
	private marshalArrayToNumber<T> (data: T[]): number {
		return data.length;
	}

	/**
	 * Marshals an object into a number.
	 * @param {object} data
	 * @returns {number}
	 */
	private marshalObjectToNumber<T> (data: { [key: string]: T }): number {
		return Object.keys(data).length;
	}

	/**
	 * Marshals a boolean into a number.
	 * @param {boolean} data
	 * @returns {number}
	 */
	private marshalBooleanToNumber (data: boolean | Boolean): number {
		const primitive = data instanceof Boolean ? data.valueOf() : data;
		return primitive ? 1 : 0;
	}

	/**
	 * Marshals a string into a Set.
	 * @param {string} data
	 * @returns {Set<string>}
	 */
	private marshalStringToSet (data: string | String): Set<string> {
		const primitive = data instanceof String ? data.valueOf() : data;
		return new Set([primitive]);
	}

	/**
	 * Marshals a symbol into a Set.
	 * @param {symbol} data
	 * @returns {Set<string>}
	 */
	private marshalSymbolToSet (data: symbol): Set<Symbol> {
		return new Set([data]);
	}

	/**
	 * Marshals a Function into a Set.
	 * @param {Function} data
	 * @returns {Set<Function>}
	 */
	private marshalFunctionToSet (data: Function): Set<Function> {
		return new Set([data]);
	}

	/**
	 * Marshals an array into a Set.
	 * @param {T[]} data
	 * @returns {Set<T>}
	 */
	private marshalArrayToSet<T> (data: T[]): Set<T> {
		return new Set(data);
	}

	/**
	 * Marshals an object into a Set.
	 * @param {object} data
	 * @returns {Set<[string, T]>}
	 */
	private marshalObjectToSet<T> (data: { [key: string]: T }): Set<[string, T]> {
		return new Set(Object.entries(data));
	}

	/**
	 * Marshals a boolean into a Set.
	 * @param {boolean} data
	 * @returns {Set<boolean>}
	 */
	private marshalBooleanToSet (data: boolean | Boolean): Set<boolean> {
		const primitive = data instanceof Boolean ? data.valueOf() : data;
		return new Set([primitive]);
	}

	/**
	 * Marshals a number into a Set.
	 * @param {number} data
	 * @returns {Set<number>}
	 */
	private marshalNumberToSet (data: number | Number): Set<number> {
		const primitive = data instanceof Number ? data.valueOf() : data;
		return new Set([primitive]);
	}

	/**
	 * Marshals a string into an Array.
	 * @param {string} data
	 * @returns {string[]}
	 */
	private marshalStringToArray (data: string | String): string[] {
		const primitive = data instanceof String ? data.valueOf() : data;
		try {
			// It might be a stringified array.
			if (data.startsWith("[") && data.endsWith("]")) return JSON.parse(primitive);
		} catch (e) {
		}

		return [primitive];
	}

	/**
	 * Marshals a symbol into an array.
	 * @param {symbol} data
	 * @returns {string[]}
	 */
	private marshalSymbolToArray (data: symbol): string[] {
		const match = data.toString().match(Marshaller.SYMBOL_REGEX);
		if (match == null) throw new ReferenceError(`${this.marshalSymbolToArray.name} was given an invalid symbol to marshal!`);
		return this.marshalStringToArray(match[1]);
	}

	/**
	 * Marshals a Function into an array.
	 * @param {Function} data
	 * @returns {Function[]}
	 */
	private marshalFunctionToArray (data: Function): Function[] {
		return [data];
	}

	/**
	 * Marshals a set into an Array.
	 * @param {Set<T>} data
	 * @returns {T[]}
	 */
	private marshalSetToArray<T> (data: Set<T>): T[] {
		return Array.from(data);
	}

	/**
	 * Marshals an object into an Array.
	 * @param {object} data
	 * @returns {[string, T][]}
	 */
	private marshalObjectToArray<T> (data: object): [string, T][] {
		return Object.entries(data);
	}

	/**
	 * Marshals a boolean into an Array.
	 * @param {boolean} data
	 * @returns {boolean[]}
	 */
	private marshalBooleanToArray (data: boolean | Boolean): boolean[] {
		const primitive = data instanceof Boolean ? data.valueOf() : data;
		return [primitive];
	}

	/**
	 * Marshals a number into an Array.
	 * @param {number} data
	 * @returns {number[]}
	 */
	private marshalNumberToArray (data: number | Number): number[] {
		const primitive = data instanceof Number ? data.valueOf() : data;
		return [primitive];
	}

	/**
	 * Marshals an Array into an Object.
	 * @param {T[]} data
	 * @returns {object}
	 */
	private marshalArrayToObject<T> (data: T[]): { [key: number]: T } {
		const obj: { [key: string]: T } = {};
		for (let i = 0; i < data.length; i++) obj[i] = data[i];
		return obj;
	}

	/**
	 * Marshals a string into an Object.
	 * @param {string|String} data
	 * @param {number} [attempt=0]
	 * @returns {object}
	 */
	private marshalStringToObject (data: string|String, attempt: number = 0): { [key: string]: string } {
		const primitive = data instanceof String ? data.valueOf() : data;
		try { return JSON.parse(primitive);
		} catch (e) {

			if (attempt === 0) {
				// Try to format the string so it fits the JSON standard.
				let trimmed = primitive
					.replace(/([{,:}"\]])([ \t\r\n]*)/g, (_, p1) => `${p1}`)
					.replace(/([{,])(\w+)(:)/g, (_, p1, p2, p3) => `${p1}"${p2}"${p3}`)
					.trim();
				if (trimmed.endsWith(";")) trimmed = trimmed.slice(0, trimmed.length - 1);
				return this.marshalStringToObject(trimmed, ++attempt);
			}

			const obj: { [key: number]: string } = {};
			for (let i = 0; i < primitive.length; i++) obj[i] = primitive[i];
			return obj;
		}
	}

	/**
	 * Marshals a Function into an Object.
	 * @param {Function} data
	 * @returns {object}
	 */
	private marshalFunctionToObject (data: Function): { [key: string]: Function } {
		return {[data.name]: data};
	}

	/**
	 * Marshals a symbol into an object.
	 * @param {symbol} data
	 * @returns {object}
	 */
	private marshalSymbolToObject (data: symbol): { [key: string]: string } {
		const match = data.toString().match(Marshaller.SYMBOL_REGEX);
		if (match == null) throw new ReferenceError(`${this.marshalSymbolToObject.name} was given an invalid symbol to marshal!`);
		return this.marshalStringToObject(match[1]);
	}

	/**
	 * Marshals a Set into an Object.
	 * @param {Set<T>} data
	 * @returns {object}
	 */
	private marshalSetToObject<T> (data: Set<T>): { [key: number]: T } {
		const obj: { [key: number]: T } = {};
		const arr = Array.from(data.values());
		for (let i = 0; i < arr.length; i++) obj[i] = arr[i];
		return obj;
	}

	/**
	 * Marshals a boolean into an Object.
	 * @param {boolean} data
	 * @returns {object}
	 */
	private marshalBooleanToObject (data: boolean | Boolean): { 0: boolean } {
		const primitive = data instanceof Boolean ? data.valueOf() : data;
		return {0: primitive};
	}

	/**
	 * Marshals a number into an Object.
	 * @param {number} data
	 * @returns {object}
	 */
	private marshalNumberToObject (data: number | Number): { [key: number]: number } {
		const primitive = data instanceof Number ? data.valueOf() : data;
		return {0: primitive};
	}

	/**
	 * Marshals the given data, whatever the type, into a boolean.
	 * @param {T} data
	 * @returns {boolean|null}
	 */
	private marshalToBoolean<T> (data: T): boolean | null {
		if (this.typeDetector.isBoolean(data)) return data;
		if (this.typeDetector.isFunction(data)) return this.marshalFunctionToBoolean(data);
		if (this.typeDetector.isString(data))  return this.marshalStringToBoolean(data);
		if (typeof data === "symbol") return this.marshalSymbolToBoolean(data);
		if (data instanceof Set)     return this.marshalSetToBoolean(data);
		if (Array.isArray(data))   return this.marshalArrayToBoolean(data);
		if (this.typeDetector.isObject(data))  return this.marshalObjectToBoolean(data);
		if (this.typeDetector.isNumber(data))  return this.marshalNumberToBoolean(data);
		return data == null ? null : false;
	}

	/**
	 * Marshals the given data, whatever the type, into a number.
	 * @param {T} data
	 * @returns {number|null}
	 */
	private marshalToNumber<T> (data: T): number | null {
		if (this.typeDetector.isNumber(data))   return data;
		if (this.typeDetector.isFunction(data)) return this.marshalFunctionToNumber(data);
		if (this.typeDetector.isString(data))  return this.marshalStringToNumber(data);
		if (typeof data === "symbol") return this.marshalSymbolToNumber(data);
		if (data instanceof Set)     return this.marshalSetToNumber(data);
		if (Array.isArray(data))   return this.marshalArrayToNumber(data);
		if (this.typeDetector.isObject(data))  return this.marshalObjectToNumber(data);
		if (this.typeDetector.isBoolean(data)) return this.marshalBooleanToNumber(data);
		return data == null ? null : 0;
	}

	/**
	 * Marshals the given data, whatever the type, into a symbol.
	 * @param {T} data
	 * @returns {symbol|null}
	 */
	private marshalToSymbol<T> (data: T): symbol | null {
		if (typeof data === "symbol") return data;
		if (this.typeDetector.isFunction(data)) return this.marshalFunctionToSymbol(data);
		if (this.typeDetector.isString(data)) return this.marshalStringToSymbol(data);
		if (data instanceof Set)      return this.marshalSetToSymbol(data);
		if (Array.isArray(data))    return this.marshalArrayToSymbol(data);
		if (this.typeDetector.isObject(data))  return this.marshalObjectToSymbol(data);
		if (this.typeDetector.isBoolean(data))  return this.marshalBooleanToSymbol(data);
		if (this.typeDetector.isNumber(data))    return this.marshalNumberToSymbol(data);
		if (data == null) return null;
		return Symbol(data.toString());
	}

	/**
	 * Marshals the given data, whatever the type, into a string.
	 * @param {T} data
	 * @returns {string|null}
	 */
	private marshalToString<T> (data: T): string | null {
		if (this.typeDetector.isString(data)) return (<String>data instanceof String ? <string>data.valueOf() : data);
		if (this.typeDetector.isFunction(data)) return this.marshalFunctionToString(data);
		if (typeof data === "symbol") return this.marshalSymbolToString(data);
		if (data instanceof Set)      return this.marshalSetToString(data);
		if (Array.isArray(data))    return this.marshalArrayToString(data);
		if (this.typeDetector.isObject(data))  return this.marshalObjectToString(data);
		if (this.typeDetector.isBoolean(data))  return this.marshalBooleanToString(data);
		if (this.typeDetector.isNumber(data))    return this.marshalNumberToString(data);
		if (data == null) return null;
		return data.toString();
	}

	/**
	 * Marshals the given data, whatever the type, into a Function.
	 * @param {T} data
	 * @returns {Function|null}
	 */
	private marshalToFunction<T> (data: T): Function | null {
		if (this.typeDetector.isFunction(data)) return data;
		if (this.typeDetector.isString(data)) return this.marshalStringToFunction(data);
		if (typeof data === "symbol") return this.marshalSymbolToFunction(data);
		if (data instanceof Set)      return this.marshalSetToFunction(data);
		if (Array.isArray(data))    return this.marshalArrayToFunction(data);
		if (this.typeDetector.isObject(data))  return this.marshalObjectToFunction(data);
		if (this.typeDetector.isBoolean(data))  return this.marshalBooleanToFunction(data);
		if (this.typeDetector.isNumber(data))    return this.marshalNumberToFunction(data);
		if (data == null) return null;
		return () => data;
	}

	/**
	 * Marshals the given data, whatever the type, into a Set.
	 * @param {T} data
	 * @returns {Set<{}>|null}
	 */
	private marshalToSet<T> (data: T): Set<{}> | null {
		if (data instanceof Set)      return data;
		if (this.typeDetector.isString(data))   return this.marshalStringToSet(data);
		if (this.typeDetector.isFunction(data)) return this.marshalFunctionToSet(data);
		if (typeof data === "symbol") return this.marshalSymbolToSet(data);
		if (Array.isArray(data))    return this.marshalArrayToSet(data);
		if (this.typeDetector.isObject(data))    return this.marshalObjectToSet(data);
		if (this.typeDetector.isBoolean(data))  return this.marshalBooleanToSet(data);
		if (this.typeDetector.isNumber(data))   return this.marshalNumberToSet(data);
		return data == null ? null : new Set();
	}

	/**
	 * Marshals the given data, whatever the type, into an Array.
	 * @param {T} data
	 * @returns {{}[]|null}
	 */
	private marshalToArray<T> (data: T): {}[] | null {
		if (Array.isArray(data))    return data;
		if (this.typeDetector.isString(data))   return this.marshalStringToArray(data);
		if (this.typeDetector.isFunction(data)) return this.marshalFunctionToArray(data);
		if (typeof data === "symbol") return this.marshalSymbolToArray(data);
		if (data instanceof Set)      return this.marshalSetToArray(data);
		if (this.typeDetector.isObject(data))    return this.marshalObjectToArray(data);
		if (this.typeDetector.isBoolean(data))  return this.marshalBooleanToArray(data);
		if (this.typeDetector.isNumber(data))   return this.marshalNumberToArray(data);
		return data == null ? null : [];
	}

	/**
	 * Marshals the given data, whatever the type, into an Object.
	 * @param {T} data
	 * @returns {object|null}
	 */
	private marshalToObject<T> (data: T): IArbitraryObject<{}>|null {
		if (this.typeDetector.isObject(data))    return data;
		if (this.typeDetector.isFunction(data)) return this.marshalFunctionToObject(data);
		if (Array.isArray(data))    return this.marshalArrayToObject(data);
		if (typeof data === "symbol") return this.marshalSymbolToObject(data);
		if (this.typeDetector.isString(data))   return this.marshalStringToObject(data);
		if (data instanceof Set)      return this.marshalSetToObject(data);
		if (this.typeDetector.isBoolean(data))  return this.marshalBooleanToObject(data);
		if (this.typeDetector.isNumber(data))   return this.marshalNumberToObject(data);
		return data == null ? null : {};
	}

	/**
	 * Marshals the given data into the most fitting type based on heuristics.
	 * @param {T} data
	 * @returns {object|null}
	 */
	private marshalToBestGuess<T> (data: T): {}|null|undefined {
		if (this.typeDetector.isString(data)) return this.marshalFromStringToBestGuess(data);
		if (typeof data === "symbol") return this.marshalFromSymbolToBestGuess(data);
		return data;
	}

	/**
	 * Parses the symbol and and marshals it into the most fitting type based on heuristics.
	 * @param {symbol} data
	 * @returns {{}|null}
	 */
	private marshalFromSymbolToBestGuess (data: symbol): {}|null|undefined {
		const stringified = this.marshalSymbolToString(data);
		return this.marshalFromStringToBestGuess(stringified);
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
	 * Parses the string and and marshals it into the most fitting type based on heuristics.
	 * @param {string} data
	 * @returns {{}|null}
	 */
	private marshalFromStringToBestGuess (data: string | String): {}|null|undefined {
		const primitive = data instanceof String ? data.valueOf() : data;

		// It might be a boolean.
		if (primitive === "true") return true;
		if (primitive === "false") return false;

		if (Marshaller.SYMBOL_REGEX.test(primitive)) {
			return this.marshalStringToSymbol(primitive);
		}

		// It might be a number.
		const toNum = Number.parseFloat(primitive);
		if (!isNaN(toNum)) {
			if (this.startsWithNumberButShouldEnforceString(primitive)) return primitive;
			return toNum;
		}

		if (data === "null") return null;
		if (data === "undefined") return undefined;
		if (data === "NaN") return NaN;
		if (data === "Infinity") return Infinity;

		if (Marshaller.FUNCTION_REGEX_1.test(primitive)) return new Function(`return ${primitive}`)();
		if (Marshaller.FUNCTION_REGEX_2.test(primitive)) return new Function(`return ${primitive}`)();
		if (Marshaller.FUNCTION_REGEX_3.test(primitive)) return new Function(`return ${primitive}`)();

		try {
			return JSON.parse(primitive);
		} catch (e) {
			return primitive;
		}
	}

	/**
	 * Marshals from the given type into the other hint type.
	 * @param {T} data
	 * @param {Newable<U>|U} to
	 * @returns {{}|null}
	 */
	private marshalTo<T, U> (data: T, to: Newable<U> | U): {} | null {
		if (typeof to === "symbol" || to === Symbol) return this.marshalToSymbol(data);
		if (this.typeDetector.isString(to) || to === String) return this.marshalToString(data);
		if (data instanceof Set || to === Set) return this.marshalToSet(data);
		if (Array.isArray(to) || to === Array) return this.marshalToArray(data);
		if (this.typeDetector.isObject(to) || to === Object) return this.marshalToObject(data);
		if (this.typeDetector.isBoolean(to) || to === Boolean) return this.marshalToBoolean(data);
		if (this.typeDetector.isNumber(to) || to === Number) return this.marshalToNumber(data);
		if (this.typeDetector.isFunction(to) || to === <{}>Function) return this.marshalToFunction(data);
		return this.marshalToString(data);
	}

}