import {MarshallDataType} from "./marshall-data-type";
import {marshalledDataTypeKey, marshalledRefKey} from "./marshalled-data-keys";

export declare type JsonType = string|number|boolean;
export declare type Data = JsonType|MarshalledData;
export declare type MarshalledDataResult = Data|{[key: string]: MarshalledDataResult};

// tslint:disable:no-any

export interface IMarshalledData {
	[marshalledDataTypeKey]: MarshallDataType;
}

export interface IMarshalledSymbolData extends IMarshalledData{
	[marshalledDataTypeKey]: "symbol";
	value: string;
}

export interface IMarshalledBigIntData extends IMarshalledData {
	[marshalledDataTypeKey]: "bigint";
	[marshalledRefKey]: string;
	value: string;
}

export interface IMarshalledStringBoxedData extends IMarshalledData {
	[marshalledDataTypeKey]: "string-boxed";
	[marshalledRefKey]: string;
	value: string;
}

export interface IMarshalledNumberBoxedData extends IMarshalledData {
	[marshalledDataTypeKey]: "number-boxed";
	[marshalledRefKey]: string;
	value: number;
}

export interface IMarshalledBooleanBoxedData extends IMarshalledData {
	[marshalledDataTypeKey]: "boolean-boxed";
	[marshalledRefKey]: string;
	value: boolean;
}

export interface IMarshalledDateData extends IMarshalledData {
	[marshalledDataTypeKey]: "date";
	[marshalledRefKey]: string;
	value: string;
}

export interface IMarshalledRegExpData extends IMarshalledData {
	[marshalledDataTypeKey]: "regexp";
	[marshalledRefKey]: string;
	value: string;
}

export interface IMarshalledArrayData extends IMarshalledData {
	[marshalledDataTypeKey]: "array";
	[marshalledRefKey]: string;
	value: MarshalledDataResult[];
}

export interface IMarshalledObjectData extends IMarshalledData {
	[marshalledDataTypeKey]: "object";
	[marshalledRefKey]: string;
	value: {[key: string]: MarshalledDataResult};
}

export interface IMarshalledSetData extends IMarshalledData {
	[marshalledDataTypeKey]: "set";
	[marshalledRefKey]: string;
	value: IMarshalledArrayData;
}

export interface IMarshalledMapData extends IMarshalledData {
	[marshalledDataTypeKey]: "map";
	[marshalledRefKey]: string;
	value: IMarshalledArrayData;
}

export interface IMarshalledUndefinedData extends IMarshalledData {
	[marshalledDataTypeKey]: "undefined";
}

export interface IMarshalledUint8ArrayData extends IMarshalledData {
	[marshalledDataTypeKey]: "uint8array";
	[marshalledRefKey]: string;
	value: number[];
}

export interface IMarshalledUint8ClampedArrayData extends IMarshalledData {
	[marshalledDataTypeKey]: "uint8clampedarray";
	[marshalledRefKey]: string;
	value: number[];
}

export interface IMarshalledUint16ArrayData extends IMarshalledData {
	[marshalledDataTypeKey]: "uint16array";
	[marshalledRefKey]: string;
	value: number[];
}

export interface IMarshalledUint32ArrayData extends IMarshalledData {
	[marshalledDataTypeKey]: "uint32array";
	[marshalledRefKey]: string;
	value: number[];
}

export interface IMarshalledInt8ArrayData extends IMarshalledData {
	[marshalledDataTypeKey]: "int8array";
	[marshalledRefKey]: string;
	value: number[];
}

export interface IMarshalledInt16ArrayData extends IMarshalledData {
	[marshalledDataTypeKey]: "int16array";
	[marshalledRefKey]: string;
	value: number[];
}

export interface IMarshalledInt32ArrayData extends IMarshalledData {
	[marshalledDataTypeKey]: "int32array";
	[marshalledRefKey]: string;
	value: number[];
}

export interface IMarshalledFloat32ArrayData extends IMarshalledData {
	[marshalledDataTypeKey]: "float32array";
	[marshalledRefKey]: string;
	value: number[];
}

export interface IMarshalledNaNData extends IMarshalledData {
	[marshalledDataTypeKey]: "nan";
}

export interface IMarshalledInfinityData extends IMarshalledData {
	[marshalledDataTypeKey]: "infinity";
}

export interface IMarshalledFloat64ArrayData extends IMarshalledData {
	[marshalledDataTypeKey]: "float64array";
	[marshalledRefKey]: string;
	value: number[];
}

export interface IMarshalledRefData extends IMarshalledData {
	[marshalledDataTypeKey]: "ref";
	value: string;
}

export interface IMarshalledNullData extends IMarshalledData {
	[marshalledDataTypeKey]: "null";
}

export declare type TypedArrayData = IMarshalledUint8ArrayData|IMarshalledUint8ClampedArrayData|IMarshalledUint16ArrayData|IMarshalledUint32ArrayData|IMarshalledInt8ArrayData|IMarshalledInt16ArrayData|IMarshalledInt32ArrayData|IMarshalledFloat32ArrayData|IMarshalledFloat64ArrayData;
export declare type MarshalledData = TypedArrayData|IMarshalledSymbolData|IMarshalledBigIntData|IMarshalledDateData|IMarshalledRegExpData|IMarshalledSetData|IMarshalledMapData|IMarshalledUndefinedData|IMarshalledNullData|IMarshalledRefData|IMarshalledArrayData|IMarshalledObjectData|IMarshalledNaNData|IMarshalledInfinityData|IMarshalledStringBoxedData|IMarshalledNumberBoxedData|IMarshalledBooleanBoxedData;