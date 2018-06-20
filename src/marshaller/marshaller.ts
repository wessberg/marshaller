import {MarshallDataType} from "./marshall-data-type";
import {Data, IMarshalledBigIntData, IMarshalledData, IMarshalledDateData, IMarshalledFloat32ArrayData, IMarshalledFloat64ArrayData, IMarshalledInt16ArrayData, IMarshalledInt32ArrayData, IMarshalledInt8ArrayData, IMarshalledMapData, IMarshalledRefData, IMarshalledRegExpData, IMarshalledSetData, IMarshalledSymbolData, IMarshalledUint16ArrayData, IMarshalledUint32ArrayData, IMarshalledUint8ArrayData, IMarshalledUint8ClampedArrayData, JsonType, MarshalledDataResult} from "./marshalled-data";
import {marshalledDataTypeKey, marshalledRefKey} from "./marshalled-data-keys";

// tslint:disable:no-any

/**
 * A Regular expression that matches the description of a Symbol
 * @type {RegExp}
 */
const SYMBOL_REGEX: RegExp = /Symbol\(([^)]*)\)/;

/**
 * How much to multiply a random number between 0 and 1 with
 * @type {number}
 */
const REF_QUANTIFIER = 100000000;

// Until Typescript ships typings for BigInt, declare it here
declare const BigInt: Function;

/**
 * Marshalls the given value
 * @param {T} value
 * @returns {string}
 */
export function marshall<T> (value: T): string {
	// Dates require special care since they - for whatever reason - is flattened to ISO strings before being passed on to the replacer hook
	if (value instanceof Date) {
		return JSON.stringify(JSON.stringify(marshallValue(value, new Map())));
	}
	return JSON.stringify(value, marshallReplacer);
}

/**
 * The replacer function for the marshalling call
 * @param {string} _key
 * @param {T} value
 * @returns {string?}
 */
function marshallReplacer<T> (_key: string, value: T): string | undefined {
	const marshalled = marshallValue(value, new Map());
	if (marshalled == null) return undefined;
	if (typeof marshalled === "string") return marshalled;
	return JSON.stringify(marshalled);
}

/**
 * The replacer function for the marshalling call
 * @param {T} value
 * @param {Map<{}, string>} refToRefIdentifierMap
 * @returns {Data}
 */
function marshallValue<T> (value: T, refToRefIdentifierMap: Map<{}, string>): MarshalledDataResult {
	const typeofValue = typeof value;

	if (isJsonType(value)) {
		return value;
	}

	switch (typeofValue) {

		case "undefined":
			return {[marshalledDataTypeKey]: "undefined"};

		case "function":
			throw new TypeError(`Cannot marshal functions since this is considered to be a security risk!`);

		case <MarshallDataType> "bigint":
			return {[marshalledDataTypeKey]: "bigint", value: value.toString()};

		case "symbol":
			return {[marshalledDataTypeKey]: "symbol", value: (<symbol><any>value).toString().match(SYMBOL_REGEX)![1]};

		default: {
			if (value === null) {
				return {[marshalledDataTypeKey]: "null"};
			}

			else if (value instanceof Date) {
				return {[marshalledDataTypeKey]: "date", value: value.toISOString()};
			}

			else if (value instanceof RegExp) {
				return {[marshalledDataTypeKey]: "regexp", value: value.toString()};
			}

			else if (value instanceof Set) {
				return {[marshalledDataTypeKey]: "set", value: [...value].map(v => marshallValue(v, refToRefIdentifierMap))};
			}

			else if (value instanceof Map) {
				return {[marshalledDataTypeKey]: "map", value: <[MarshalledDataResult, MarshalledDataResult][]> [...value].map(v => marshallValue(v, refToRefIdentifierMap))};
			}

			else if (value instanceof Uint8Array) {
				return {[marshalledDataTypeKey]: "uint8array", value: [...value]};
			}

			else if (value instanceof Uint16Array) {
				return {[marshalledDataTypeKey]: "uint16array", value: [...value]};
			}

			else if (value instanceof Uint32Array) {
				return {[marshalledDataTypeKey]: "uint32array", value: [...value]};
			}

			else if (value instanceof Int8Array) {
				return {[marshalledDataTypeKey]: "int8array", value: [...value]};
			}

			else if (value instanceof Int16Array) {
				return {[marshalledDataTypeKey]: "int16array", value: [...value]};
			}

			else if (value instanceof Int32Array) {
				return {[marshalledDataTypeKey]: "int32array", value: [...value]};
			}

			else if (value instanceof Float32Array) {
				return {[marshalledDataTypeKey]: "float32array", value: [...value]};
			}

			else if (value instanceof Float64Array) {
				return {[marshalledDataTypeKey]: "float64array", value: [...value]};
			}

			else if (Array.isArray(value)) {
				// @ts-ignore
				return value.map(marshallValue);
			}

			else if (typeofValue === "object" && value.constructor.name === "Object") {
				const refMapHit = refToRefIdentifierMap.get(value);
				if (refMapHit != null) {
					return {[marshalledDataTypeKey]: "ref", value: refMapHit};
				}

				const newBase = {[marshalledRefKey]: generateRef()};
				refToRefIdentifierMap.set(value, newBase[marshalledRefKey]);

				return Object.assign(newBase, ...Object.entries(value).map(([key, objectValue]) => {

					return {
						[key]: marshallValue(objectValue, refToRefIdentifierMap)
					};
				}));
			}

			else if (value instanceof WeakMap) {
				throw new TypeError(`WeakMaps cannot be marshalled since they aren't iterable`);
			}

			else if (value instanceof WeakSet) {
				throw new TypeError(`WeakSets cannot be marshalled since they aren't iterable`);
			}

			else {
				throw new TypeError(`Could not marshall a value of type: ${value.constructor.name}`);
			}
		}
	}
}

/**
 * Demarshalls the given string
 * @param {string} value
 * @returns {T}
 */
export function demarshall<T> (value: string): T {
	return JSON.parse(value, demarshallReplacer);
}

/**
 * The replacer function for the demarshalling call
 * @param {string} _key
 * @param {T} value
 * @returns {string|?}
 */
function demarshallReplacer<T> (_key: string, value: string): T {
	const parsed: MarshalledDataResult =  JSON.parse(value);
	return demarshallValue(parsed, new Map());
}

/**
 * The replacer function for the demarshalling call
 * @param {MarshalledDataResult} data
 * @returns {*}
 */
function demarshallValue (data: MarshalledDataResult | MarshalledDataResult[] | [MarshalledDataResult, MarshalledDataResult][], refMap: Map<string, {}>): any {
	if (isJsonType(data)) {
		return data;
	}

	else if (Array.isArray(data)) {
		return (<Data[]>data).map(v => demarshallValue(v, refMap));
	}

	else if (!isMarshalledData(data)) {
		const refMatch: string|undefined = (<any>data)[marshalledRefKey];
		const newData = {};
		if (refMatch != null) {
			refMap.set(refMatch, newData);
		}
		return Object.assign(newData, ...Object.entries(data).map(([key, objectValue]) => key === marshalledRefKey ? {} : {[key]: demarshallValue(<MarshalledDataResult> objectValue, refMap)}));
	}

	// Otherwise, it has to be some marshalled data

	switch (data[marshalledDataTypeKey]) {

		case "symbol":
			return Symbol((<IMarshalledSymbolData> data).value);

		case "ref":
			const refMapHit = refMap.get((<IMarshalledRefData> data).value);
			if (refMapHit == null) throw new ReferenceError(`Internal Error: Could not resolve a reference for a circular dependency!`);
			return refMapHit;

		case "bigint":
			return BigInt((<IMarshalledBigIntData> data).value);

		case "undefined":
			return undefined;

		case "null":
			return null;

		case "date":
			return new Date((<IMarshalledDateData> data).value);

		case "uint8array":
			return new Uint8Array((<IMarshalledUint8ArrayData> data).value);

		case "uint8clampedarray":
			return new Uint8ClampedArray((<IMarshalledUint8ClampedArrayData> data).value);

		case "uint16array":
			return new Uint16Array((<IMarshalledUint16ArrayData> data).value);

		case "uint32array":
			return new Uint32Array((<IMarshalledUint32ArrayData> data).value);

		case "int8array":
			return new Int8Array((<IMarshalledInt8ArrayData> data).value);

		case "int16array":
			return new Int16Array((<IMarshalledInt16ArrayData> data).value);

		case "int32array":
			return new Int32Array((<IMarshalledInt32ArrayData> data).value);

		case "float32array":
			return new Float32Array((<IMarshalledFloat32ArrayData> data).value);

		case "float64array":
			return new Float64Array((<IMarshalledFloat64ArrayData> data).value);

		case "regexp":
			return new Function(`return ${(<IMarshalledRegExpData> data).value}`)();

		case "set":
			return new Set(demarshallValue((<IMarshalledSetData> data).value, refMap));

		case "map":
			return new Map(demarshallValue((<IMarshalledMapData> data).value, refMap));

		default:
			throw new TypeError(`Could not demarshall a value: ${data}`);
	}
}

/**
 * Returns true if the given data is a JsonType
 * @param {*} data
 */
function isJsonType (data: any): data is JsonType {
	const typeofData = typeof data;
	return typeofData === "string" || typeofData === "number" || typeofData === "boolean";
}

/**
 * Returns true if the given data is some marshalled data
 * @param {*} data
 */
function isMarshalledData (data: any): data is IMarshalledData {
	return !isJsonType(data) && !Array.isArray(data) && marshalledDataTypeKey in data;
}

/**
 * Generates a ref
 * @returns {string}
 */
function generateRef (): string {
	return (Math.random() * REF_QUANTIFIER).toFixed(0);
}