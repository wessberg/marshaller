export declare type Arbitrary = /*tslint:disable*/any/*tslint:enable*/;
export declare type ConstructorArgument = Arbitrary;
export declare type NewableGeneric<U> = new (...args: ConstructorArgument[]) => U;
export declare type Newable<U> = NewableGeneric<U>|StringConstructor|NumberConstructor|BooleanConstructor|FunctionConstructor|ObjectConstructor|ArrayConstructor|SetConstructor|SymbolConstructor;

export interface IMarshaller {
	marshal<T> (data: T): string;
	unmarshal<T> (data: string): T|{}|null|undefined;
}