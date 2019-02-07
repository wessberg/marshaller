import test from "ava";
import { demarshall, marshall } from "../src/marshaller/marshaller";

// tslint:disable:no-any
// tslint:disable:no-construct

test("#1", t => {
  const original = undefined;
  const marshalled = marshall(original);
  const demarshalled = demarshall(marshalled);
  t.deepEqual(original, demarshalled);
});

test("#2", t => {
  const original = null;
  const marshalled = marshall(original);
  const demarshalled = demarshall(marshalled);
  t.deepEqual(original, demarshalled);
});

test("#3", t => {
  const original = new Date();
  const marshalled = marshall(original);
  const demarshalled = demarshall(marshalled);
  t.deepEqual(original, demarshalled);
});

test("#4", t => {
  const original = new Set([1, 2, 3]);
  const marshalled = marshall(original);
  const demarshalled = demarshall(marshalled);
  t.deepEqual(original, demarshalled);
});

test("#5", t => {
  const original = new Map([[1, 1], [2, 2], [3, 3]]);
  const marshalled = marshall(original);
  const demarshalled = demarshall(marshalled);
  t.deepEqual(original, demarshalled);
});

test("#6", t => {
  const original = new Map([
    [new Uint16Array([1, 2, 3]), /foo/],
    [new Uint16Array([1, 2, 3]), /bar/],
    [new Uint16Array([1, 2, 3]), /baz/]
  ]);
  const marshalled = marshall(original);
  const demarshalled = demarshall(marshalled);
  t.deepEqual(original, demarshalled);
});

test("#7", t => {
  const original = Symbol("123");
  const marshalled = marshall(original);
  const demarshalled = demarshall(marshalled);
  t.deepEqual(original.toString(), demarshalled.toString());
});

test("#8", t => {
  const original = {
    a: {
      b: {
        foo: [/foo/],
        bar: new Date()
      }
    }
  };
  const marshalled = marshall(original);
  const demarshalled = demarshall(marshalled);
  t.deepEqual(original, demarshalled);
});

test("#9", t => {
  const parent: any = { prop1: "value" };
  parent.child = { prop2: "value", parent };
  parent.child.child = { prop3: "value", parent: parent.child };
  const marshalled = marshall(parent);
  const demarshalled = demarshall(marshalled);
  t.deepEqual(parent, demarshalled);
});

test("#10", t => {
  const arr: any[] = [1, 2, 3];
  // Push the arr itself to the array (circular dependency)
  arr.push(arr);
  const marshalled = marshall(arr);
  const demarshalled = demarshall(marshalled);
  t.deepEqual(arr, demarshalled);
});

test("#11", t => {
  const set: any = new Set([1, 2, 3]);
  // Push the Set itself to the Set (circular dependency)
  set.add(set);
  const marshalled = marshall(set);
  const demarshalled = demarshall(marshalled);
  t.deepEqual(set, demarshalled);
});

test("#12", t => {
  const arr: any = new Uint8Array([1, 2, 3]);
  // Push the Set itself to the Set (circular dependency)
  arr[4] = arr;
  const marshalled = marshall(arr);
  const demarshalled = demarshall(marshalled);
  t.deepEqual(arr, demarshalled);
});

test("#13", t => {
  const original = NaN;
  const marshalled = marshall(original);
  const demarshalled = demarshall(marshalled);
  t.deepEqual(original, demarshalled);
});

test("#14", t => {
  const original = Infinity;
  const marshalled = marshall(original);
  const demarshalled = demarshall(marshalled);
  t.deepEqual(original, demarshalled);
});

test("#15", t => {
  const referenceObject = new Float32Array();
  const original = { a: referenceObject, b: referenceObject };
  const marshalled = marshall(original);
  const demarshalled = demarshall(marshalled);
  t.deepEqual(original, demarshalled);
});

test("#16", t => {
  // noinspection JSPrimitiveTypeWrapperUsage
  const referenceObject = new String("foo");
  const original = { a: referenceObject, b: referenceObject };
  const marshalled = marshall(original);
  const demarshalled = demarshall(marshalled);
  t.deepEqual(original, demarshalled);
});

test("#17", t => {
  // noinspection JSPrimitiveTypeWrapperUsage
  const referenceObject = new Number(2);
  const original = { a: referenceObject, b: referenceObject };
  const marshalled = marshall(original);
  const demarshalled = demarshall(marshalled);
  t.deepEqual(original, demarshalled);
});

test("#18", t => {
  // noinspection JSPrimitiveTypeWrapperUsage
  const referenceObject = new Boolean(true);
  const original = { a: referenceObject, b: referenceObject };
  const marshalled = marshall(original);
  const demarshalled = demarshall(marshalled);
  t.deepEqual(original, demarshalled);
});

test("#19", t => {
  const original = /\s*foo\s*\(hello\)/gm;
  const marshalled = marshall(original);
  const demarshalled = demarshall(marshalled);
  t.deepEqual(original, demarshalled);
});
