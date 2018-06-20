import {MarshallDataType} from "./marshall-data-type";
import {marshalledDataTypeKey} from "./marshalled-data-keys";

export declare type JsonType = string|number|boolean;
export declare type Data = JsonType|MarshalledData;
export declare type MarshalledDataResult = Data[]|MarshalledData[]|Data|MarshalledData;

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
	value: string;
}

export interface IMarshalledDateData extends IMarshalledData {
	[marshalledDataTypeKey]: "date";
	value: string;
}

export interface IMarshalledRegExpData extends IMarshalledData {
	[marshalledDataTypeKey]: "regexp";
	value: string;
}

export interface IMarshalledSetData extends IMarshalledData {
	[marshalledDataTypeKey]: "set";
	value: MarshalledDataResult[];
}

export interface IMarshalledMapData extends IMarshalledData {
	[marshalledDataTypeKey]: "map";
	value: [MarshalledDataResult, MarshalledDataResult][];
}

export interface IMarshalledUndefinedData extends IMarshalledData {
	[marshalledDataTypeKey]: "undefined";
}

export interface IMarshalledUint8ArrayData extends IMarshalledData {
	[marshalledDataTypeKey]: "uint8array";
	value: number[];
}

export interface IMarshalledUint8ClampedArrayData extends IMarshalledData {
	[marshalledDataTypeKey]: "uint8clampedarray";
	value: number[];
}

export interface IMarshalledUint16ArrayData extends IMarshalledData {
	[marshalledDataTypeKey]: "uint16array";
	value: number[];
}

export interface IMarshalledUint32ArrayData extends IMarshalledData {
	[marshalledDataTypeKey]: "uint32array";
	value: number[];
}

export interface IMarshalledInt8ArrayData extends IMarshalledData {
	[marshalledDataTypeKey]: "int8array";
	value: number[];
}

export interface IMarshalledInt16ArrayData extends IMarshalledData {
	[marshalledDataTypeKey]: "int16array";
	value: number[];
}

export interface IMarshalledInt32ArrayData extends IMarshalledData {
	[marshalledDataTypeKey]: "int32array";
	value: number[];
}

export interface IMarshalledFloat32ArrayData extends IMarshalledData {
	[marshalledDataTypeKey]: "float32array";
	value: number[];
}

export interface IMarshalledRefData extends IMarshalledData {
	[marshalledDataTypeKey]: "ref";
	value: string;
}

export interface IMarshalledFloat64ArrayData extends IMarshalledData {
	[marshalledDataTypeKey]: "float64array";
	value: number[];
}

export interface IMarshalledNullData extends IMarshalledData {
	[marshalledDataTypeKey]: "null";
}

export declare type MarshalledData = IMarshalledSymbolData|IMarshalledBigIntData|IMarshalledDateData|IMarshalledRegExpData|IMarshalledSetData|IMarshalledMapData|IMarshalledUndefinedData|IMarshalledNullData|IMarshalledUint8ArrayData|IMarshalledUint8ArrayData|IMarshalledUint8ClampedArrayData|IMarshalledUint16ArrayData|IMarshalledUint32ArrayData|IMarshalledInt8ArrayData|IMarshalledInt16ArrayData|IMarshalledInt32ArrayData|IMarshalledFloat32ArrayData|IMarshalledFloat64ArrayData|IMarshalledRefData;