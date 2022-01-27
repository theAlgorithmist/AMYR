/** Copyright 2018 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Specs for Typescript Math Toolkit Disjoint Set

// test functions/classes
import { TSMT$DSNode      } from "../../../datastructures/ds-node-impl";
import { TSMT$DisjointSet } from "../../../datastructures/disjoint-set";

export type NumberModel = Record<string, number>;

// Test Suites
const set: TSMT$DisjointSet = new TSMT$DisjointSet();

describe("DSNode Basic tests", () =>
{
  it('constructs a new DSNode', () => {
    const node: TSMT$DSNode = new TSMT$DSNode();

    expect(node.key).toBe('');
    expect(node.value).toBe('');
    expect(node.rank).toBe(-1);
    expect(node.next).toBe(null);
    expect(node.parent).toBe(null);
  });

  it('constructs a new DSNode with provided key', () => {
    const node: TSMT$DSNode = new TSMT$DSNode('7');

    expect(node.key).toBe('7');
  });

  it('clones a single node', () => {
    const node1: TSMT$DSNode = new TSMT$DSNode();
    node1.key                = '1';
    node1.value              = 'one';
    node1.rank               = 3;
    node1.data               = {a: 1, b: 2, c: 3};

    const node2: TSMT$DSNode = node1.clone();

    const data: NumberModel = node2.data as NumberModel;

    expect(node2.key).toBe('1');
    expect(node2.value).toBe('one');
    expect(node2.rank).toBe(3);
    expect(data['a']).toBe(1);
    expect(data['b']).toBe(2);
    expect(data['c']).toBe(3);
    expect(node2.next).toBe(null);
    expect(node2.parent).toBe(null);
  });

  it('clones a linked set of nodes', () => {
    const node1: TSMT$DSNode = new TSMT$DSNode('1');
    node1.value              = 'one';
    node1.rank               = 3;
    node1.data               = {a: 1, b: 2, c: 3};

    const node2: TSMT$DSNode = new TSMT$DSNode('2');
    node1.next               = node2;
    node1.parent             = node1;

    const node3: TSMT$DSNode = new TSMT$DSNode('3');
    node2.next               = node3;
    node2.parent             = node1;

    const node4: TSMT$DSNode = new TSMT$DSNode('4');
    node3.next               = node4;
    node3.parent             = node2;
    node4.next               = node1;

    const node: TSMT$DSNode = node1.cloneSet();
    expect(node.key).toBe('1');

    // test immutability
    node.key = 'one';
    expect(node1.key).toBe('1');

    let next: TSMT$DSNode = node.next as TSMT$DSNode;
    expect(next.key).toBe('2');

    next.key = 'two';
    expect(node2.key).toBe('2');

    next = next.next as TSMT$DSNode;
    expect(next.key).toBe('3');

    next.key = 'three';
    expect(node3.key).toBe('3');

    next = next.next as TSMT$DSNode;
    expect(next.key).toBe('4');

    next.key = 'four';
    expect(node4.key).toBe('4');

    next = next.next as TSMT$DSNode;
    expect(next.key).toBe('one');
  });

  it('isEqual properly compares nodes', () => {
    const node1: TSMT$DSNode = new TSMT$DSNode();
    node1.key                = '1';
    node1.value              = 'one';
    node1.rank               = 3;
    node1.data               = {a: 1, b: 2, c: 3};

    const node2: TSMT$DSNode = node1.clone();
    expect(node1.isEqual(node2)).toBe(true);

    node2.key = '2';
    expect(node1.isEqual(node2)).toBe(false);
  });
});

describe("Disjoint Set Basic Tests", () => {

  it('constructs a new Disjoint Set', () => {
    expect(set.size).toBe(0);
    expect(set.find(null)).toBe(null);
    expect(set.copySet(null).length).toBe(0);
  });

  it('correctly adds a collection of singleton nodes', () => {
    set.clear();

    const n: TSMT$DSNode  = new TSMT$DSNode('1');
    const n1: TSMT$DSNode = new TSMT$DSNode('2');
    const n2: TSMT$DSNode = new TSMT$DSNode('3');

    expect(set.size).toBe(0);

    set.makeSet(n, true);
    expect(set.size).toBe(1);

    set.makeSet(n1, true);
    expect(set.size).toBe(2);

    set.makeSet(n2, true);
    expect(set.size).toBe(3);

    expect(n.parent?.key).toBe(n.key);
    expect(n1.parent?.key).toBe(n1.key);
    expect(n2.parent?.key).toBe(n2.key);
  });

  it('correctly adds an existing tree', () => {
    set.clear();

    // simulate a simple tree
    const n: TSMT$DSNode  = new TSMT$DSNode('1');
    const n1: TSMT$DSNode = new TSMT$DSNode('2');
    const n2: TSMT$DSNode = new TSMT$DSNode('3');

    n.parent  = n;
    n1.parent = n;
    n2.parent = n;
    n.next    = n1;
    n1.next   = n2;
    n2.next   = n;

    expect(set.size).toBe(0);

    set.makeSet(n);
    expect(set.size).toBe(1);

    expect(n.parent.key).toBe(n.key);
    expect(n1.parent.key).toBe(n.key);
    expect(n2.parent.key).toBe(n.key);
  });

  it('find works from a collection of singletons', () => {
    set.clear();

    const n: TSMT$DSNode  = new TSMT$DSNode('1');
    const n1: TSMT$DSNode = new TSMT$DSNode('2');
    const n2: TSMT$DSNode = new TSMT$DSNode('3');

    expect(set.size).toBe(0);

    set.makeSet(n, true);
    set.makeSet(n1, true);
    set.makeSet(n2, true);

    expect(set.size).toBe(3);

    const node: TSMT$DSNode | null = set.find(n);
    expect(n.isEqual(node as TSMT$DSNode)).toBe(true);
  });

  it('clones an empty forest', () => {
    set.clear();

    const set2: TSMT$DisjointSet = set.clone();

    expect(set2.size).toBe(0);
  });

  it('properly finds by ID from a set of singletons', () => {
    set.clear();

    const n: TSMT$DSNode  = new TSMT$DSNode('1');
    const n1: TSMT$DSNode = new TSMT$DSNode('2');
    const n2: TSMT$DSNode = new TSMT$DSNode('3');

    expect(set.size).toBe(0);

    set.makeSet(n, true);
    set.makeSet(n1, true);
    set.makeSet(n2, true);

    expect(set.size).toBe(3);

    let node: TSMT$DSNode | null= set.findByID('1');
    expect(node?.isEqual(n)).toBe(true);

    node = set.findByID('2');
    expect(node?.isEqual(n1)).toBe(true);

    node = set.findByID('3');
    expect(node?.isEqual(n2)).toBe(true);

    node = set.findByID('4');
    expect(node).toBe(null);
  });

  it('copySet works with a singleton', () => {
    set.clear();

    const n: TSMT$DSNode  = new TSMT$DSNode('1');
    const n1: TSMT$DSNode = new TSMT$DSNode('2');
    const n2: TSMT$DSNode = new TSMT$DSNode('3');

    expect(set.size).toBe(0);

    set.makeSet(n, true);
    set.makeSet(n1, true);
    set.makeSet(n2, true);

    expect(set.size).toBe(3);

    let result: Array<TSMT$DSNode> = set.copySet(n);
    expect(result.length).toBe(1);

    let node: TSMT$DSNode = result[0];
    expect(node.key).toBe('1');

    // test mutation to ensure proper copy
    node.key = 'one';
    expect(n.key).toBe('1');

    result = set.copySet(n2);
    node   = result[0];
    expect(node.key).toBe('3');

    node.key = 'three';
    expect(n2.key).toBe('3');
  });

});

describe("Disjoint Set Advanced Tests", () => {

  it('joins two singletons #1', () => {
    set.clear();

    const n: TSMT$DSNode  = new TSMT$DSNode('1');
    const n1: TSMT$DSNode = new TSMT$DSNode('2');
    const n2: TSMT$DSNode = new TSMT$DSNode('3');

    expect(set.size).toBe(0);

    set.makeSet(n, true);
    set.makeSet(n1, true);
    set.makeSet(n2, true);

    set.union(n, n1);
    expect(set.size).toBe(2);

    // find the representative for n1 (should be n)
    const node: TSMT$DSNode | null = set.find(n1);
    expect(node?.key).toBe('1');

    const next: TSMT$DSNode = node?.next as TSMT$DSNode;
    expect(next.key).toBe('2');
    expect(node?.rank).toBe(1);

    // test circularity
    expect(next.next?.key).toBe('1');
  });

  it('joins two singletons #2', () => {
    set.clear();

    const n: TSMT$DSNode  = new TSMT$DSNode('1');
    const n1: TSMT$DSNode = new TSMT$DSNode('2');
    const n2: TSMT$DSNode = new TSMT$DSNode('3');

    expect(set.size).toBe(0);

    set.makeSet(n, true);
    set.makeSet(n1, true);
    set.makeSet(n2, true);

    set.union(n1, n2);
    expect(set.size).toBe(2);

    // find the representative for n2 (should be n1)
    const node: TSMT$DSNode | null = set.find(n2);
    expect(node?.key).toBe('2');

    const next: TSMT$DSNode = node?.next as TSMT$DSNode;
    expect(next.key).toBe('3');
    expect(node?.rank).toBe(1);

    // test circularity
    expect(next.next?.key).toBe('2');
  });

  it('union returns gracefully with null inputs', () => {
    set.clear();

    const n: TSMT$DSNode  = new TSMT$DSNode('1');
    const n1: TSMT$DSNode = new TSMT$DSNode('2');
    const n2: TSMT$DSNode = new TSMT$DSNode('3');

    expect(set.size).toBe(0);

    set.makeSet(n, true);
    set.makeSet(n1, true);
    set.makeSet(n2, true);

    set.union(n1, null);
    expect(set.size).toBe(3);
  });

  it('find with path compression #1', () => {
    set.clear();

    const n: TSMT$DSNode  = new TSMT$DSNode('1');
    const n1: TSMT$DSNode = new TSMT$DSNode('2');
    const n2: TSMT$DSNode = new TSMT$DSNode('3');
    const n3: TSMT$DSNode = new TSMT$DSNode('4');

    expect(set.size).toBe(0);

    // create a tree of height 3
    n.parent = n;
    n.rank   = 3;
    n.next   = n1;

    n1.parent = n;
    n1.next   = n2;

    n2.parent = n1;
    n2.next   = n3;

    n3.parent = n2;
    n3.next   = n;

    // add as existing set
    set.makeSet(n);

    expect(set.size).toBe(1);

    const node: TSMT$DSNode | null = set.find(n3);
    expect(node?.key).toBe('1');
    expect(node?.rank).toBe(2);

    // with path compression, this should be '1' since n is the new parent after the find
    expect(n3.parent.key).toBe('1');
  });

  it('joins two trees of equal rank greater than one', () => {
    set.clear();

    const n: TSMT$DSNode  = new TSMT$DSNode('1');
    const n1: TSMT$DSNode = new TSMT$DSNode('2');
    const n2: TSMT$DSNode = new TSMT$DSNode('3');
    const n3: TSMT$DSNode = new TSMT$DSNode('4');
    const n4: TSMT$DSNode = new TSMT$DSNode('5');
    const n5: TSMT$DSNode = new TSMT$DSNode('6');

    n.parent = n;
    n.rank   = 3;
    n.next   = n1;

    n1.parent = n;
    n1.next   = n2;

    n2.parent = n1;
    n2.next   = n;

    set.makeSet(n);

    n3.parent = n3;
    n3.next   = n4;

    n4.parent = n3;
    n4.next   = n5;

    n5.parent = n4;
    n5.next   = n3;

    set.makeSet(n3);

    expect(set.size).toBe(2);

    set.union(n, n3);

    expect(set.size).toBe(1);

    // equal rank means first one wins at becoming new parent
    const node: TSMT$DSNode | null = set.find(n5);
    expect(node?.key).toBe('1');
  });

  it('post-union set by ID', () => {
    set.clear();

    const n: TSMT$DSNode  = new TSMT$DSNode('1');
    const n1: TSMT$DSNode = new TSMT$DSNode('2');
    const n2: TSMT$DSNode = new TSMT$DSNode('3');
    const n3: TSMT$DSNode = new TSMT$DSNode('4');
    const n4: TSMT$DSNode = new TSMT$DSNode('5');
    const n5: TSMT$DSNode = new TSMT$DSNode('6');

    n.parent = n;
    n.rank   = 2;
    n.next   = n1;

    n1.parent = n;
    n1.next   = n2;

    n2.parent = n1;
    n2.next   = n;

    set.makeSet(n);

    n3.parent = n3;
    n3.rank   = 2;
    n3.next   = n4;

    n4.parent = n3;
    n4.next   = n5;

    n5.parent = n4;
    n5.next   = n3;

    set.makeSet(n3);

    expect(set.size).toBe(2);

    set.union(n, n3);

    const id: Array<string> = set.byId( set.copySet(n5) );

    expect(id[0]).toBe('1');
    expect(id[1]).toBe('5');
    expect(id[2]).toBe('6');
    expect(id[3]).toBe('4');
    expect(id[4]).toBe('2');
    expect(id[5]).toBe('3');
  });

  it('joins two trees of non-equal rank greater than one', () => {
    set.clear();

    const n: TSMT$DSNode  = new TSMT$DSNode('1');
    const n1: TSMT$DSNode = new TSMT$DSNode('2');
    const n2: TSMT$DSNode = new TSMT$DSNode('3');
    const n3: TSMT$DSNode = new TSMT$DSNode('4');
    const n4: TSMT$DSNode = new TSMT$DSNode('5');
    const n5: TSMT$DSNode = new TSMT$DSNode('6');
    const n6: TSMT$DSNode = new TSMT$DSNode('7');

    n.parent = n;
    n.rank   = 2;
    n.next   = n1;

    n1.parent = n;
    n1.next   = n2;

    n2.parent = n1;
    n2.next   = n;

    set.makeSet(n);

    n3.parent = n3;
    n3.rank   = 3;
    n3.next   = n4;

    n4.parent = n3;
    n4.next   = n5;

    n5.parent = n4;
    n5.next   = n6;

    n6.parent = n5;
    n6.next   = n3;

    set.makeSet(n3);

    expect(set.size).toBe(2);

    set.union(n, n3);

    expect(set.size).toBe(1);

    let node: TSMT$DSNode | null = set.find(n2);
    expect(node?.key).toBe('4');

    node = set.find(n6);
    expect(node?.key).toBe('4');

    const id: Array<string> = set.byId( set.copySet(n5) );

    expect(id[0]).toBe('4');
    expect(id[1]).toBe('2');
    expect(id[2]).toBe('3');
    expect(id[3]).toBe('1');
    expect(id[4]).toBe('5');
    expect(id[5]).toBe('6');
    expect(id[6]).toBe('7');
  });

  it('find by ID, arbitrary forest', () => {
    set.clear();

    const n: TSMT$DSNode  = new TSMT$DSNode('1');
    const n1: TSMT$DSNode = new TSMT$DSNode('2');
    const n2: TSMT$DSNode = new TSMT$DSNode('3');
    const n3: TSMT$DSNode = new TSMT$DSNode('4');
    const n4: TSMT$DSNode = new TSMT$DSNode('5');
    const n5: TSMT$DSNode = new TSMT$DSNode('6');
    const n6: TSMT$DSNode = new TSMT$DSNode('7');

    n.parent = n;
    n.rank   = 2;
    n.next   = n1;

    n1.parent = n;
    n1.next   = n2;

    n2.parent = n1;
    n2.next   = n;

    set.makeSet(n);

    n3.parent = n3;
    n3.rank   = 3;
    n3.next   = n4;

    n4.parent = n3;
    n4.next   = n5;

    n5.parent = n4;
    n5.next   = n6;

    n6.parent = n5;
    n6.next   = n3;

    set.makeSet(n3);

    expect(set.size).toBe(2);

    set.union(n, n3);

    let node: TSMT$DSNode | null = set.findByID('2');
    expect(node?.key).toBe('2');

    // test from-cache
    node = set.findByID('2');
    expect(node?.key).toBe('2');

    node = set.findByID('3');
    expect(node?.key).toBe('3');
  });

  it('multi-union test #1', () => {
    set.clear();

    const n: TSMT$DSNode  = new TSMT$DSNode('1');
    const n1: TSMT$DSNode = new TSMT$DSNode('2');
    const n2: TSMT$DSNode = new TSMT$DSNode('3');
    const n3: TSMT$DSNode = new TSMT$DSNode('4');
    const n4: TSMT$DSNode = new TSMT$DSNode('5');
    const n5: TSMT$DSNode = new TSMT$DSNode('6');
    const n6: TSMT$DSNode = new TSMT$DSNode('7');
    const n7: TSMT$DSNode = new TSMT$DSNode('8');
    const n8: TSMT$DSNode = new TSMT$DSNode('9');
    const n9: TSMT$DSNode = new TSMT$DSNode('10');

    set.makeSet(n, true);
    set.makeSet(n1, true);
    set.makeSet(n2, true);
    set.makeSet(n3, true);
    set.makeSet(n4, true);
    set.makeSet(n5, true);
    set.makeSet(n6, true);
    set.makeSet(n7, true);
    set.makeSet(n8, true);
    set.makeSet(n9, true);

    expect(set.size).toBe(10);

    set.union(n, n1);
    set.union(n2, n3);
    set.union(n4, n5);
    set.union(n6, n7);
    set.union(n8, n9);

    expect(set.size).toBe(5);

    set.union(n, n2);
    set.union(n4, n6);

    expect(set.size).toBe(3);

    let node: TSMT$DSNode | null = set.findByID('1');
    expect(node?.key).toBe('1');

    node = set.findByID('2');
    expect(node?.key).toBe('2');

    node = set.findByID('3');
    expect(node?.key).toBe('3');

    node = set.findByID('4');
    expect(node?.key).toBe('4');

    node = set.findByID('5');
    expect(node?.key).toBe('5');

    node = set.findByID('6');
    expect(node?.key).toBe('6');

    node = set.findByID('7');
    expect(node?.key).toBe('7');

    node = set.findByID('8');
    expect(node?.key).toBe('8');

    node = set.findByID('9');
    expect(node?.key).toBe('9');

    node = set.findByID('10');
    expect(node?.key).toBe('10');

    // structure check
    expect(n3.parent?.key).toBe(n2.key);
    expect(n7.parent?.key).toBe(n6.key);

    expect(n2.parent?.key).toBe(n.key);
    expect(n6.parent?.key).toBe(n4.key);

    expect(n9.parent?.key).toBe(n8.key);

    // structure changes from path compression
    node = set.find(n3);
    expect(node?.key).toBe(n.key);
    expect(node?.parent?.key).toBe(n.key);

    node = set.find(n7);
    expect(node?.key).toBe(n4.key);
    expect(node?.parent?.key).toBe(n4.key);
  });

  it('clones a forest', () => {
    set.clear();

    const n: TSMT$DSNode  = new TSMT$DSNode('1');
    const n1: TSMT$DSNode = new TSMT$DSNode('2');
    const n2: TSMT$DSNode = new TSMT$DSNode('3');
    const n3: TSMT$DSNode = new TSMT$DSNode('4');
    const n4: TSMT$DSNode = new TSMT$DSNode('5');
    const n5: TSMT$DSNode = new TSMT$DSNode('6');
    const n6: TSMT$DSNode = new TSMT$DSNode('7');
    const n7: TSMT$DSNode = new TSMT$DSNode('8');
    const n8: TSMT$DSNode = new TSMT$DSNode('9');
    const n9: TSMT$DSNode = new TSMT$DSNode('10');

    set.makeSet(n, true);
    set.makeSet(n1, true);
    set.makeSet(n2, true);
    set.makeSet(n3, true);
    set.makeSet(n4, true);
    set.makeSet(n5, true);
    set.makeSet(n6, true);
    set.makeSet(n7, true);
    set.makeSet(n8, true);
    set.makeSet(n9, true);

    expect(set.size).toBe(10);

    set.union(n, n1);
    set.union(n2, n3);
    set.union(n4, n5);
    set.union(n6, n7);
    set.union(n8, n9);

    expect(set.size).toBe(5);

    set.union(n, n2);
    set.union(n4, n6);

    const clone: TSMT$DisjointSet = set.clone();

    expect(clone.size).toBe(3);

    // check immutability
    const node: TSMT$DSNode | null = clone.findByID('10');
    (node as TSMT$DSNode).key      = 'c-10';

    expect(node?.key).toBe('c-10');
    expect(n9.key).toBe('10');
  });

  it('multi-union test #2', () => {
    set.clear();

    const n: TSMT$DSNode   = new TSMT$DSNode('1');
    const n1: TSMT$DSNode  = new TSMT$DSNode('2');
    const n2: TSMT$DSNode  = new TSMT$DSNode('3');
    const n3: TSMT$DSNode  = new TSMT$DSNode('4');
    const n4: TSMT$DSNode  = new TSMT$DSNode('5');
    const n5: TSMT$DSNode  = new TSMT$DSNode('6');
    const n6: TSMT$DSNode  = new TSMT$DSNode('7');
    const n7: TSMT$DSNode  = new TSMT$DSNode('8');
    const n8: TSMT$DSNode  = new TSMT$DSNode('9');
    const n9: TSMT$DSNode  = new TSMT$DSNode('10');
    const n10: TSMT$DSNode = new TSMT$DSNode('11');

    set.makeSet(n, true);
    set.makeSet(n1, true);
    set.makeSet(n2, true);
    set.makeSet(n3, true);
    set.makeSet(n4, true);
    set.makeSet(n5, true);
    set.makeSet(n6, true);
    set.makeSet(n7, true);
    set.makeSet(n8, true);
    set.makeSet(n9, true);
    set.makeSet(n10, true);

    expect(set.size).toBe(11);

    set.union(n, n1);
    set.union(n2, n3);
    set.union(n4, n5);
    set.union(n6, n7);
    set.union(n8, n9);
    set.union(n8, n10);

    expect(set.size).toBe(5);

    set.union(n, n2);
    set.union(n4, n6);

    expect(set.size).toBe(3);

    set.union(n4, n8);

    expect(set.size).toBe(2);

    let node: TSMT$DSNode | null = set.find(n);
    expect(node?.key).toBe(n.key);

    node = set.find(n1);
    expect(node?.key).toBe(n.key);

    node = set.find(n2);
    expect(node?.key).toBe(n.key);

    node = set.find(n3);
    expect(node?.key).toBe(n.key);

    node = set.find(n4);
    expect(node?.key).toBe(n4.key);

    node = set.find(n5);
    expect(node?.key).toBe(n4.key);

    node = set.find(n5);
    expect(node?.key).toBe(n4.key);

    node = set.find(n6);
    expect(node?.key).toBe(n4.key);

    node = set.find(n7);
    expect(node?.key).toBe(n4.key);

    node = set.find(n8);
    expect(node?.key).toBe(n4.key);

    node = set.find(n9);
    expect(node?.key).toBe(n4.key);

    node = set.find(n10);
    expect(node?.key).toBe(n4.key);

    // do it again as the structure is modified with path compression
    node = set.find(n);
    expect(node?.key).toBe(n.key);

    node = set.find(n1);
    expect(node?.key).toBe(n.key);

    node = set.find(n2);
    expect(node?.key).toBe(n.key);

    node = set.find(n3);
    expect(node?.key).toBe(n.key);

    node = set.find(n4);
    expect(node?.key).toBe(n4.key);

    node = set.find(n5);
    expect(node?.key).toBe(n4.key);

    node = set.find(n5);
    expect(node?.key).toBe(n4.key);

    node = set.find(n6);
    expect(node?.key).toBe(n4.key);

    node = set.find(n7);
    expect(node?.key).toBe(n4.key);

    node = set.find(n8);
    expect(node?.key).toBe(n4.key);

    node = set.find(n9);
    expect(node?.key).toBe(n4.key);

    node = set.find(n10);
    expect(node?.key).toBe(n4.key);

    // finally, the traversals
    let id: Array<string> = set.byId( set.copySet(n1) );
    expect(id[0]).toBe('1');
    expect(id[1]).toBe('4');
    expect(id[2]).toBe('3');
    expect(id[3]).toBe('2');

    id = set.byId( set.copySet(n10) );
    expect(id[0]).toBe('5');
    expect(id[1]).toBe('11');
    expect(id[2]).toBe('10');
    expect(id[3]).toBe('9');
    expect(id[4]).toBe('8');
    expect(id[5]).toBe('7');
    expect(id[6]).toBe('6');
  });
});
