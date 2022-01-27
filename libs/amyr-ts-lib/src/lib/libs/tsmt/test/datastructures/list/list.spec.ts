/* eslint-disable @typescript-eslint/no-empty-function */
/** Copyright 2016 Jim Armstrong (www.algorithmist.net)
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

// Specs for Typescript Math Toolkit linked list
import { TSMT$ListNode } from '../../../datastructures/list-node';
import {
  TSMT$LinkedList,
  LinkedListType
} from '../../../datastructures/linked-list';

// built on top of Linked List and serves as an additional set of tests
import {
  TSMT$UndoRedo,
  IUndoListData,
  IUndoRedoOperation,
  IUndoTransform,
  UndoRedoTypes
} from "../../../../misc/undo-redo";

// Test Suites
describe('Linked List', () => {
  const list: TSMT$LinkedList = new TSMT$LinkedList();

  it('newly constructed list has zero size', function() {   
    expect(list.size).toBe(0);
  });

  it('default list type is single', function() {   
    expect(list.type).toBe(LinkedListType.SINGLE);
  });

  it('first node of empty list is null', function() {   
    expect(list.getNode(0) == null).toBe(true);
  });

  it('adds a single node correctly', function() {
    list.clear();
    list.add("0", {});

    const node: TSMT$ListNode | null = list.getNode(0);
    const head: TSMT$ListNode | null = list.head;
    const tail: TSMT$ListNode | null = list.tail;

    expect(list.size).toBe(1);
    expect(node?.id).toBe("0");
    expect(head?.id).toBe("0");
    expect(tail?.id).toBe("0");
  });

  it('returns null node for invalid index', function() {
    list.clear();
    list.add("0", {});

    const node: TSMT$ListNode | null = list.getNode(-1);

    expect(node).toBe(null);
  });

  it('adds two nodes correctly', function() {
    list.clear();
    list.add("0", {});
    list.add("1", {});

    const node: TSMT$ListNode | null = list.getNode(1);
    const head: TSMT$ListNode | null = list.head;
    const tail: TSMT$ListNode | null = list.tail;

    expect(list.size).toBe(2);
    expect(node?.id).toBe("1");
    expect(head?.id).toBe("0");
    expect(tail?.id).toBe("1");
  });

  it('properly fetches a node by id', function() {
    list.clear();
    list.add("0", {});
    list.add("1", {});
    list.add("2", {});

    const node: TSMT$ListNode | null = list.getNodeById("1");
    const tail: TSMT$ListNode | null = list.tail;

    expect(list.size).toBe(3);
    expect(node?.id).toBe("1");
    expect(tail?.id).toBe("2");
  });

  it('properly fetches a node by index #1', function() {
    list.clear();
    list.add("0", {});
    list.add("1", {});
    list.add("2", {});
    list.add("3", {});
   
    // test head-forward followed by cached-node forward
    const node1: TSMT$ListNode | null = list.getNode(0);
    const node2: TSMT$ListNode | null = list.getNode(1);
    const node3: TSMT$ListNode | null = list.getNode(2);
    const node4: TSMT$ListNode | null = list.getNode(3);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const node5: TSMT$ListNode | null = list.getNode(3);  // test re-fetch of same node (comes from cache)

    expect(list.size).toBe(4);
    expect(node1?.id).toBe("0");
    expect(node2?.id).toBe("1");
    expect(node3?.id).toBe("2");
    expect(node4?.id).toBe("3");
    expect(node4?.id).toBe("3");
  });

  it('properly fetches a node by index #2', function() {
    list.clear();
    list.add("0", {});
    list.add("1", {});
    list.add("2", {});
    list.add("3", {});
    list.add("4", {});
   
    // test head-forward and then unable to use cached node
    const node1: TSMT$ListNode | null = list.getNode(3);
    const node2: TSMT$ListNode | null = list.getNode(1);

    expect(list.size).toBe(5);
    expect(node1?.id).toBe("3");
    expect(node2?.id).toBe("1");
  });

  it('properly converts from single- to circular-connected list', function() {
    list.clear();
    list.add("0", {});
    list.add("1", {});
    list.add("2", {});
    list.add("3", {});
    list.add("4", {});

    const node1: TSMT$ListNode | null = list.getNode(4);
    const node2: TSMT$ListNode | null = list.getNode(1);

    expect(list.size).toBe(5);
    expect(node1?.id).toBe("4");
    expect(node2?.id).toBe("1");

    list.type = LinkedListType.CIRCULAR;
    const tail: TSMT$ListNode | null = list.tail;
    expect(tail?.next?.id).toBe("0");
  });

  it('properly removes a node #1', function() {
    list.clear();
    list.add("0", {});
    list.add("1", {});

    expect(list.size).toBe(2);
    list.remove(0);
    expect(list.size).toBe(1);

    const head: TSMT$ListNode | null = list.head;
    const tail: TSMT$ListNode | null = list.tail;

    expect(head?.id).toBe("1");
    expect(tail?.id).toBe("1");
  });

  it('properly removes a node #2', function() {
    list.clear();
    list.add("0", {});
    list.add("1", {});

    expect(list.size).toBe(2);
    list.remove(1);
    expect(list.size).toBe(1);

    const head: TSMT$ListNode | null = list.head;
    const tail: TSMT$ListNode | null = list.tail;

    expect(head?.id).toBe("0");
    expect(tail?.id).toBe("0");
  });

  it('properly removes a node #3', function() {
    list.clear();
    list.add("0", {});
    list.add("1", {});
    list.add("2", {});

    expect(list.size).toBe(3);
    list.remove(1);
    expect(list.size).toBe(2);

    const head: TSMT$ListNode | null = list.head;
    const tail: TSMT$ListNode | null = list.tail;

    expect(head?.id).toBe("0");
    expect(tail?.id).toBe("2");
  });

  it('properly removes a node #4', function() {
    list.clear();
    list.add("0", {});

    let head: TSMT$ListNode | null = list.head; 
    let tail: TSMT$ListNode | null = list.tail;

    expect(list.size).toBe(1);
    expect(head?.id).toBe("0");
    expect(tail?.id).toBe("0");

    list.remove(0);
    expect(list.size).toBe(0);

    head = list.head; 
    tail = list.tail;

    expect(head).toBe(null);
    expect(tail).toBe(null);
  });

  it('properly inserts into an empty list', function() {
    list.clear();
    list.insert(0, "0", {})

    const head: TSMT$ListNode | null = list.head;
    const tail: TSMT$ListNode | null = list.tail;

    expect(list.size).toBe(1);
    expect(head?.id).toBe("0");
    expect(tail?.id).toBe("0");
  });

  it('properly inserts into beginning of list', function() {
    list.clear();
    list.add("0", {});
    list.add("1", {});
    list.add("2", {});

    list.insert(0, "0a", {});

    const head: TSMT$ListNode   | null = list.head;
    const middle: TSMT$ListNode | null = list.getNode(2);
    const tail: TSMT$ListNode   | null = list.tail;

    expect(list.size).toBe(4);
    expect(head?.id).toBe("0a");
    expect(middle?.id).toBe("1");
    expect(tail?.id).toBe("2");
  });

  it('does not add onto a list with a sentinel tail', function() {
    list.clear();
    list.add("0", {});
    list.add("1", {});
    list.add("2", {}, true);
    list.add("3", {});

    const head: TSMT$ListNode   | null = list.head;
    const middle: TSMT$ListNode | null = list.getNode(1);
    const tail: TSMT$ListNode   | null = list.tail;

    expect(list.size).toBe(3);
    expect(head?.id).toBe("0");
    expect(middle?.id).toBe("1");
    expect(tail?.id).toBe("2");
  });

  it('properly converts from singly- to doubly-linked list', function() {
    list.clear();
    list.add("0", {});
    list.add("1", {});
    list.add("2", {});
    list.add("3", {});

    const middle: TSMT$ListNode | null = list.getNode(2);

    expect(list.size).toBe(4);
    expect(middle?.id).toBe("2");
    expect(middle?.prev).toBe(null);
    
    list.type = LinkedListType.DOUBLE;
    expect(middle?.prev?.id).toBe("1");

    const head: TSMT$ListNode | null  = list.head;
    const tail: TSMT$ListNode | null  = list.tail;

    expect(head?.prev).toBe(null);
    expect(tail?.prev?.id).toBe("2");
  });

  it('properly converts to array', function() {
    list.clear();

    list.type = LinkedListType.DOUBLE;
    list.add("0", {});
    list.add("1", {});
    list.add("2", {});
    list.add("3", {});

    const nodes: Array<TSMT$ListNode> = list.toArray();
    let node: TSMT$ListNode;

    expect(nodes.length).toBe(4);
    node = nodes.shift() as TSMT$ListNode;
    expect(node.prev).toBe(null);
    expect(node.next).toBe(null);

    node = nodes.shift() as TSMT$ListNode;
    expect(node.prev).toBe(null);
    expect(node.next).toBe(null);

    node = nodes.shift() as TSMT$ListNode;
    expect(node.prev).toBe(null);
    expect(node.next).toBe(null);

    node = nodes.shift() as TSMT$ListNode;
    expect(node.prev).toBe(null);
    expect(node.next).toBe(null);
  });

  it('properly adds/inserts into to doubly-connected list', function() {
    list.clear();
    list.type = LinkedListType.DOUBLE;

    list.add("0", {});
    list.add("1", {});

    const head: TSMT$ListNode | null = list.head;
    const tail: TSMT$ListNode | null = list.tail;

    expect(list.size).toBe(2);
    expect(head?.id).toBe("0");
    expect(head?.prev).toBe(null);
    expect(head?.next?.id).toBe("1");
    expect(tail?.id).toBe("1");
    expect(tail?.next).toBe(null);
    expect(tail?.prev?.id).toBe("0");

    list.insert(1, "0a", {});
    const middle: TSMT$ListNode | null = list.getNode(1);
  
    expect(list.size).toBe(3);
    expect(middle?.id).toBe("0a");
    expect(middle?.prev?.id).toBe("0");
    expect(middle?.next?.id).toBe("1");
  });

  it('properly computes search start/end/direction for a doubly-linked list', function() {
    list.clear();

    list.type = LinkedListType.DOUBLE;

    list.add("0", {});
    list.add("1", {});
    list.add("2", {});
    list.add("3", {});
    list.add("4", {});
    list.add("5", {});
    list.add("6", {});
    list.add("7", {});
    list.add("8", {});
    list.add("9", {});

    const node1: TSMT$ListNode | null = list.getNode(3);   // head-forward
    const node2: TSMT$ListNode | null = list.getNode(5);   // cached node-forward
    const node3: TSMT$ListNode | null = list.getNode(5);   // return cached node;
    const node4: TSMT$ListNode | null = list.getNode(4);   // cached node-backward;
    const node5: TSMT$ListNode | null = list.getNode(8);   // tail-node, backward

    expect(list.size).toBe(10);
    expect(node1?.id).toBe("3");
    expect(node2?.id).toBe("5");
    expect(node3?.id).toBe("5");
    expect(node4?.id).toBe("4");
    expect(node5?.id).toBe("8");
  });
});

describe('Undo/Redo', () => {
  let undo: TSMT$UndoRedo = new TSMT$UndoRedo();

  // null forward/inverse transform
  const nullXform: IUndoTransform = (data: Array<number>): void => {};

  // a data-change only operation
  const dataOnly: IUndoRedoOperation = {
    forward: null,
    inverse: null,
    value: 0
  };

  // a null transform
  const emptyXform: IUndoRedoOperation = {
    forward: nullXform,
    inverse: nullXform
  };

  // default single
  const single: IUndoListData = {
    type: UndoRedoTypes.SINGLE,
    operation: dataOnly,
    params: {}
  };

  // default range
  const range: IUndoListData = {
    type: UndoRedoTypes.RANGE,
    operation: emptyXform,
    params: {}
  };

  it('newly constructed undo/redo list has zero size', function () {
    expect(undo.size).toBe(0);
    expect(undo.index).toBe(-1);
  });

  it('Undo/Redo has the correct list type', function () {
    expect(undo.type).toBe(LinkedListType.DOUBLE);
  });

  it('Adds single node', function () {
    undo.addNode('0', single);

    expect(undo.size).toBe(1);
    expect(undo.index).toBe(0);
  });

  it('Adds two nodes', function () {
    undo = new TSMT$UndoRedo();

    undo.addNode('0', single);
    undo.addNode('1', range);

    expect(undo.size).toBe(2);
    expect(undo.index).toBe(1);
  });

  it('undo/redo clears', function () {
    undo = new TSMT$UndoRedo();

    undo.addNode('0', single);
    undo.addNode('1', range);
    undo.addNode('2', range);

    expect(undo.size).toBe(3);

    undo.clear();
    expect(undo.size).toBe(0);
    expect(undo.index).toBe(-1);
  });

  it('Insert and invalidate #1', function () {
    undo = new TSMT$UndoRedo();

    undo.addNode('0', single);
    undo.addNode('1', range);
    undo.addNode('2', range);

    expect(undo.size).toBe(3);
    expect(undo.index).toBe(2);

    undo.insertAndInvalidate('3', single);
    expect(undo.size).toBe(4);
    expect(undo.index).toBe(3);
  });

  it('Levels works correctly', function () {
    undo = new TSMT$UndoRedo();
    undo.levels = 3;

    undo.addNode('0', single);
    undo.addNode('1', range);
    undo.addNode('2', range);
    undo.addNode('3', single);

    expect(undo.size).toBe(3);
    expect(undo.index).toBe(2);
  });

  it('undo test #1', function () {
    undo = new TSMT$UndoRedo();

    undo.addNode('0', single);
    undo.addNode('1', range);
    undo.addNode('2', range);

    undo.undo();

    expect(undo.index).toBe(1);
  });

  it('undo test #2', function () {
    undo = new TSMT$UndoRedo();

    const data: IUndoListData | null = undo.undo();

    expect(data).toBe(null);
  });

  it('undo test #3', function () {
    undo = new TSMT$UndoRedo();

    undo.addNode('0', single);

    let data: IUndoListData | null = undo.undo();

    expect(undo.index).toBe(0);
    expect(data?.operation.value).toBe(0);

    data = undo.undo();
    expect(data).toBe(null);
  });

  it('redo test #1', function () {
    undo = new TSMT$UndoRedo();

    undo.addNode('0', single);
    undo.addNode('1', range);
    undo.addNode('2', range);

    undo.undo();

    expect(undo.index).toBe(1);
    expect(undo.size).toBe(3);

    undo.redo();
    expect(undo.index).toBe(2);
  });

  it('redo test #2', function () {
    undo = new TSMT$UndoRedo();

    const data: IUndoListData | null = undo.redo();

    expect(data).toBe(null);
  });

  it('redo test #3', function () {
    undo = new TSMT$UndoRedo();

    undo.addNode('0', single);

    let data: IUndoListData | null = undo.redo();

    expect(undo.index).toBe(0);
    expect(data?.operation.value).toBe(0);

    data = undo.redo();
    expect(data).toBe(null);
  });

  it('undo/redo combo', function () {
    undo = new TSMT$UndoRedo();

    undo.addNode('0', single);
    undo.addNode('1', single);
    undo.addNode('2', single);
    undo.addNode('3', single);

    expect(undo.size).toBe(4);
    undo.undo();

    expect(undo.index).toBe(2);

    undo.undo();
    expect(undo.index).toBe(1);

    undo.undo();
    expect(undo.index).toBe(0);

    undo.undo();
    expect(undo.index).toBe(0);

    let data: IUndoListData | null = undo.undo();
    expect(data).toBe(null);

    undo.redo();
    expect(undo.index).toBe(1);

    undo.redo();
    expect(undo.index).toBe(2);

    undo.redo();
    expect(undo.index).toBe(3);

    undo.redo();
    expect(undo.index).toBe(3);

    data = undo.redo();
    expect(data).toBe(null);
  });
  
});
