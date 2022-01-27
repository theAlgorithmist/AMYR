/* eslint-disable @typescript-eslint/no-unused-vars */
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

// Specs for Typescript Math Toolkit General Tree

// test functions/classes
import {
  TSMT$TreeNode,
  TSMT$ITreeList
} from '../../../datastructures/tree-node';

import { TSMT$Tree } from '../../../datastructures/tree';

// Test Suites
describe('Tree Node Tests: TSMT$TreeNode<T>', () =>
{
  it('properly constructs a new tree node of type number', () =>
  {
    const node: TSMT$TreeNode<number> = new TSMT$TreeNode<number>();

    expect(node.parent).toBe(null);
    expect(node.hasChildren).toBe(false);
    expect(node.id).toBe("");
    expect(node.data).toBe(undefined);

    const head: TSMT$ITreeList<number> = node.head;
    expect(head.prev).toBe(null);
    expect(head.next).toBe(null);
    expect(head.node).toBe(null);
  });

  it('properly constructs a new tree node with initial data', () =>
  {
    const node: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(100.0);

    expect(node).toBeTruthy();
    expect(node.parent).toBe(null);
    expect(node.value).toBe(100.0);
    expect(node.hasChildren).toBe(false);
  });

  it('properly accepts parent reference', () =>
  {
    const root: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);
    const one: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);

    root.id    = "root";
    one.id     = "one";
    one.parent = root;

    expect(one.parent.id == root.id).toBe(true);
  });

  it('properly compares two nodes', () =>
  {
    const node1: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);
    const node2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(3.0);
    const node3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(3.0);

    expect(node1.compare(node2)).toBe(0);
    expect(node2.compare(node1)).toBe(1);
    expect(node2.compare(node3)).toBe(1);
  });

  it('properly adds a single child', () =>
  {
    const root: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);

    expect(root.size).toBe(1);

    root.addChild(child);

    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(1);
    expect(root.size).toBe(2);

    const head: TSMT$ITreeList<number> = root.head;
    expect(head?.node?.value).toBe(2.0);
  });

  it('properly adds two children', () =>
  {
    const root: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(-1.0);

    root.addChild(child);
    root.addChild(child2);

    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(2);
    expect(root.size).toBe(3);

    let list: TSMT$ITreeList<number> | null = root.head;
    expect(list?.node?.value).toBe(2.0);

    list = list.next;
    expect(list?.node?.value).toBe(-1.0);
  });

  it('properly adds two children and traverses backwards from tail', () =>
  {
    const root: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(-1.0);

    root.addChild(child);
    root.addChild(child2);

    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(2);

    let list: TSMT$ITreeList<number> | null = root.tail;
    expect(list?.node?.value).toBe(-1.0);

    list = list.prev;
    expect(list?.node?.value).toBe(2.0);

    expect(list?.prev).toBe(null);
  });

  it('properly inserts multiple children', () =>
  {
    const root: TSMT$TreeNode<number>   = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(2.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(-1.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(-2.0);

    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";

    root.addChild(child);
    root.addChild(child2);
    root.addChild(child3);

    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(3);

    const list: TSMT$ITreeList<number> = root.head;
    expect(list?.node?.id).toBe("c1");

    const tail: TSMT$ITreeList<number> = root.tail;
    expect(tail?.node?.id).toBe("c3");
  });

  it('properly clears a tree node with one level', () =>
  {
    const root: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(-1.0);

    root.addChild(child);
    root.addChild(child2);

    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(2);

    root.clear();

    expect(root.hasChildren).toBe(false);
    expect(root.childCount).toBe(0);
  });

  it('properly clears a tree node with two levels', () =>
  {
    const root: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(-1.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(-2.0);

    root.addChild(child);
    root.addChild(child2);
    child2.addChild(child3);

    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(2);
    expect(child2.childCount).toBe(1);

    root.clear();

    expect(root.hasChildren).toBe(false);
    expect(root.childCount).toBe(0);
    expect(child2.hasChildren).toBe(false);
  });

  it('properly deletes a tree node #1', () =>
  {
    const root: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(-1.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(-2.0);

    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";

    root.addChild(child);
    root.addChild(child2);
    root.addChild(child3);

    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(3);

    root.deleteChild(child);
    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(2);
    expect(root.size).toBe(3);

    const list: TSMT$ITreeList<number> = root.head;
    expect(list?.node?.id).toBe("c2");
    expect(list?.next?.node?.id).toBe("c3");

    const tail: TSMT$ITreeList<number> = root.tail;
    expect(tail?.node?.id).toBe("c3");
  });

  it('properly deletes a tree node #2', () =>
  {
    const root: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(-1.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(-2.0);

    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";

    root.addChild(child);
    root.addChild(child2);
    root.addChild(child3);

    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(3);
    expect(root.size).toBe(4);

    root.deleteChild(child2);
    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(2);

    const list: TSMT$ITreeList<number> = root.head;
    expect(list?.node?.id).toBe("c1");
    expect(list?.next?.node?.id).toBe("c3");

    const tail: TSMT$ITreeList<number> = root.tail;
    expect(tail?.node?.id).toBe("c3");
  });

  it('properly deletes a tree node #3', () =>
  {
    const root: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(-1.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(-2.0);

    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";

    root.addChild(child);
    root.addChild(child2);
    root.addChild(child3);

    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(3);

    root.deleteChild(child3);
    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(2);

    const list: TSMT$ITreeList<number> = root.head;
    expect(list?.node?.id).toBe("c1");
    expect(list?.next?.node?.id).toBe("c2");

    const tail: TSMT$ITreeList<number> = root.tail;
    expect(tail?.node?.id).toBe("c2");
  });

  it('returns null when deleting a non-existing node id', () =>
  {
    const root: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(-1.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(-2.0);

    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";

    root.addChild(child);
    root.addChild(child2);
    root.addChild(child3);

    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(3);

    const n: TSMT$TreeNode<number> | null = root.deleteChildByID('id');
    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(3);
    expect(n).toBe(null);

    let list: TSMT$ITreeList<number> | null = root.head;
    expect(list?.node?.id).toBe("c1");

    list = list.next;
    expect(list?.node?.id).toBe("c2");

    list = list?.next as TSMT$ITreeList<number>;
    expect(list?.node?.id).toBe("c3");

    list = root.tail;
    expect(list?.node?.id).toBe("c3");

    list = list.prev;
    expect(list?.node?.id).toBe("c2");

    list = list?.prev as TSMT$ITreeList<number>;
    expect(list?.node?.id).toBe("c1");
  });

  it('correctly does ordered insert #1', () =>
  {
    const root: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);

    // assign an ordered child list
    root.ordered = true;

    // id for each node
    root.id  = "root";
    child.id = "c1";

    root.addChild(child);

    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(1);

    let list: TSMT$ITreeList<number> = root.head;
    expect(list?.node?.id).toBe("c1");

    list = root.tail;
    expect(list?.node?.id).toBe("c1");
  });

  it('correctly does ordered insert #2', () =>
  {
    const root: TSMT$TreeNode<number>   = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(2.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(5.0);

    // assign an ordered child list
    root.ordered = true;

    // id for each node
    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";

    root.addChild(child);
    root.addChild(child2);

    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(2);

    let list: TSMT$ITreeList<number> = root.head;
    expect(list?.node?.id).toBe("c1");

    list = root.tail;
    expect(list?.node?.id).toBe("c2");
  });

  it('correctly does ordered insert #3', () =>
  {
    const root: TSMT$TreeNode<number>   = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(2.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(5.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(10.0);

    // assign an ordered child list
    root.ordered = true;

    // id for each node
    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";

    root.addChild(child);
    root.addChild(child2);
    root.addChild(child3);

    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(3);

    let list: TSMT$ITreeList<number> = root.head;
    expect(list?.node?.id).toBe("c1");

    list = list.next as TSMT$ITreeList<number>;
    expect(list?.node?.id).toBe("c2");

    list = root.tail;
    expect(list?.node?.id).toBe("c3");
  });

  it('correctly does ordered insert #3', () =>
  {
    const root: TSMT$TreeNode<number>   = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(2.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(5.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(10.0);
    const child4: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(8.0);

    // assign an ordered child list
    root.ordered = true;

    // id for each node
    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";
    child4.id = "c4";

    root.addChild(child);
    root.addChild(child2);
    root.addChild(child3);
    root.addChild(child4);

    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(4);

    let list: TSMT$ITreeList<number> = root.head;
    expect(list?.node?.id).toBe("c1");

    list = list.next as TSMT$ITreeList<number>;
    expect(list?.node?.id).toBe("c2");

    list = list.next as TSMT$ITreeList<number>;
    expect(list?.node?.id).toBe("c4");

    list = root.tail;
    expect(list?.node?.id).toBe("c3");
  });

  it('correctly does ordered insert #4', () =>
  {
    const root: TSMT$TreeNode<number>   = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(3.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(5.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(10.0);
    const child4: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(8.0);
    const child5: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(6.0);

    // assign an ordered child list
    root.ordered = true;

    // id for each node
    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";
    child4.id = "c4";
    child5.id = "c5";

    root.addChild(child);
    root.addChild(child2);
    root.addChild(child3);
    root.addChild(child4);
    root.addChild(child5);

    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(5);

    const list: Array<string> = root.childIdList;
    expect(list.length).toBe(5);

    expect(list[0]).toBe("c1");
    expect(list[1]).toBe("c2");
    expect(list[2]).toBe("c5");
    expect(list[3]).toBe("c4");
    expect(list[4]).toBe("c3");
  });

  it('correctly does ordered insert #5', () =>
  {
    const root: TSMT$TreeNode<number>   = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(3.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(5.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(10.0);
    const child4: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(8.0);
    const child5: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(6.0);
    const child6: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);

    // assign an ordered child list
    root.ordered = true;

    // id for each node
    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";
    child4.id = "c4";
    child5.id = "c5";
    child6.id = "c6";

    root.addChild(child);
    root.addChild(child2);
    root.addChild(child3);
    root.addChild(child4);
    root.addChild(child5);
    root.addChild(child6);

    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(6);

    const list: Array<string> = root.childIdList;
    expect(list.length).toBe(6);

    expect(list[0]).toBe("c6");
    expect(list[1]).toBe("c1");
    expect(list[2]).toBe("c2");
    expect(list[3]).toBe("c5");
    expect(list[4]).toBe("c4");
    expect(list[5]).toBe("c3");

    let nodeList: TSMT$ITreeList<number> = root.head;
    expect(nodeList?.node?.id).toBe("c6");

    nodeList = root.tail;
    expect(nodeList?.node?.id).toBe("c3");
  });

  it('correctly returns min/max #1', () =>
  {
    const root: TSMT$TreeNode<number>   = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(3.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(5.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(10.0);
    const child4: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(8.0);
    const child5: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(6.0);
    const child6: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);

    // id for each node
    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";
    child4.id = "c4";
    child5.id = "c5";
    child6.id = "c6";

    expect(root.min).toBe(0);
    expect(root.max).toBe(0);

    root.addChild(child);
    root.addChild(child2);
    root.addChild(child3);
    root.addChild(child4);
    root.addChild(child5);
    root.addChild(child6);

    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(6);

    expect(root.min).toBe(2.0);
    expect(root.max).toBe(10.0);
  });

  it('correctly returns min/max #2', () =>
  {
    const root: TSMT$TreeNode<number>   = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(3.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(5.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(10.0);
    const child4: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(8.0);
    const child5: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(6.0);
    const child6: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);

    // order the child list
    root.ordered = true;

    // id for each node
    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";
    child4.id = "c4";
    child5.id = "c5";
    child6.id = "c6";

    expect(root.min).toBe(0);
    expect(root.max).toBe(0);

    root.addChild(child);
    root.addChild(child2);
    root.addChild(child3);
    root.addChild(child4);
    root.addChild(child5);
    root.addChild(child6);

    expect(root.hasChildren).toBe(true);
    expect(root.childCount).toBe(6);

    expect(root.min).toBe(2.0);
    expect(root.max).toBe(10.0);
  });

  it('height of a singleton node is 0', () =>
  {
    const root: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);

    expect(root.height).toBe(0);
  });

  it('height of a node w/one level of children is 1', () =>
  {
    const root: TSMT$TreeNode<number>   = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(3.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(5.0);

    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";

    root.addChild(child);
    root.addChild(child2);

    expect(root.height).toBe(1);
  });

  it('height of a node w/two levels of children is 2', () =>
  {
    const root: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(3.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(5.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(10.0);
    const child4: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(8.0);

    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";
    child4.id = "c4";

    root.addChild(child);
    root.addChild(child2);

    child.addChild(child3);
    child.addChild(child4);

    expect(root.height).toBe(2);

    root.clear();
    expect(root.size).toBe(1);
    expect(root.hasChildren).toBe(false);

    root.addChild(child);
    root.addChild(child2);

    child2.addChild(child3);
    child2.addChild(child4);
    expect(root.height).toBe(2);
  });

  it('height of a node w/three levels of children is 3', () =>
  {
    const root: TSMT$TreeNode<number>   = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(3.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(5.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(10.0);
    const child4: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(8.0);
    const child5: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(6.0);
    const child6: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);

    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";
    child4.id = "c4";
    child5.id = "c5";
    child6.id = "c6";

    root.addChild(child);
    root.addChild(child2);

    child.addChild(child3);
    child.addChild(child4);

    child4.addChild(child5);
    child4.addChild(child6);

    expect(root.height).toBe(3);
    expect(root.size).toBe(7);
  });

});

describe('Tree Tests: TSMT$Tree<T>', () => {

  it('properly constructs a new tree of type number', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    expect(tree.size).toBe(0);
    expect(tree.root).toBe(null);
    expect(tree.ordered).toBe(true);
  });

  it('properly constructs a new tree of type number', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    expect(tree.size).toBe(0);
    expect(tree.root).toBe(null);
    expect(tree.ordered).toBe(true);
  });

  it('properly assigns a pre-created node as tree root', () =>
  {
    const tree: TSMT$Tree<number>     = new TSMT$Tree<number>();
    const root: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);

    root.id = "root";

    tree.root = root;
    expect(tree.size).toBe(1);

    const node: TSMT$TreeNode<number> = tree.root;
    expect(node.id).toBe('root');
  });

  it('properly creates a root node from id and value', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    expect(tree.size).toBe(0);

    const root: TSMT$TreeNode<number> | null = tree.setRoot('root', 1.0);
    expect(root?.id).toBe('root');
    expect(root?.value).toBe(1.0);
    expect(root?.ordered).toBe(true);

    const node: TSMT$TreeNode<number> | null = tree.root;
    expect(node?.id).toBe(root?.id);
  });

  it('properly does insertion by id and value', () =>
  {
    const tree: TSMT$Tree<number>  = new TSMT$Tree<number>();

    const root: TSMT$TreeNode<number> | null = tree.setRoot('root', 1.0);
    expect(root?.id).toBe('root');
    expect(root?.value).toBe(1.0);

    tree.insert('c1', 3.0 , root);
    tree.insert('c2', 5.0 , root);
    tree.insert('c3', 10.0, root);
    tree.insert('c4', 8.0 , root);
    tree.insert('c5', 6.0 , root);
    tree.insert('c6', 2.0 , root);

    expect(tree.size).toBe(7);
  });

  it('find works for singleton node', () =>
  {
    const tree: TSMT$Tree<number>  = new TSMT$Tree<number>();

    const root: TSMT$TreeNode<number> | null = tree.setRoot('root', 1.0);
    expect(root?.id).toBe('root');
    expect(root?.value).toBe(1.0);

    const node: TSMT$TreeNode<number> | null = tree.find('root');

    expect(node?.id).toBe('root');
  });

  it('find works for one level', () =>
  {
    const tree: TSMT$Tree<number>  = new TSMT$Tree<number>();

    const root: TSMT$TreeNode<number> | null = tree.setRoot('root', 1.0);
    expect(root?.id).toBe('root');
    expect(root?.value).toBe(1.0);

    tree.insert('c1', 3.0 , root);
    tree.insert('c2', 5.0 , root);
    tree.insert('c3', 10.0, root);
    tree.insert('c4', 8.0 , root);
    tree.insert('c5', 6.0 , root);
    tree.insert('c6', 2.0 , root);

    let node: TSMT$TreeNode<number> | null = tree.find('c1');
    expect(node?.id).toBe('c1');

    node = tree.find('c6');
    expect(node?.id).toBe('c6');

    node = tree.find('c3');
    expect(node?.id).toBe('c3');
    expect(node?.value).toBe(10);
  });

  it('find works for two levels', () =>
  {
    const tree: TSMT$Tree<number>  = new TSMT$Tree<number>();

    const root: TSMT$TreeNode<number> | null = tree.setRoot('root', 1.0);
    expect(root?.id).toBe('root');
    expect(root?.value).toBe(1.0);

    tree.insert('c1', 3.0 , root);
    tree.insert('c2', 5.0 , root);
    tree.insert('c3', 10.0, root);
    tree.insert('c4', 8.0 , root);
    tree.insert('c5', 6.0 , root);
    tree.insert('c6', 2.0 , root);

    let node: TSMT$TreeNode<number> | null = tree.find('c1');
    expect(node?.id).toBe('c1');

    node = tree.find('c6');
    expect(node?.id).toBe('c6');

    node = tree.find('c3');
    expect(node?.id).toBe('c3');
    expect(node?.value).toBe(10);
  });

  it('find works for three levels #1', () =>
  {
    const tree: TSMT$Tree<number>  = new TSMT$Tree<number>();

    const root: TSMT$TreeNode<number>   = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(3.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(5.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(10.0);
    const child4: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(8.0);
    const child5: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(6.0);
    const child6: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);
    const child7: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);

    // id for each node
    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";
    child4.id = "c4";
    child5.id = "c5";
    child6.id = "c6";
    child7.id = "c7";

    root.addChild(child);
    root.addChild(child2);
    root.addChild(child3);
    root.addChild(child4);

    child2.addChild(child5);
    child3.addChild(child6);
    child3.addChild(child7);

    tree.root = root;

    expect(tree.size).toBe(8);

    let node: TSMT$TreeNode<number> | null = tree.find('root');
    expect(node?.id).toBe('root');
    expect(node?.value).toBe(1.0);

    node = tree.find('c1');
    expect(node?.id).toBe('c1');
    expect(node?.value).toBe(3.0);

    node = tree.find('c4');
    expect(node?.id).toBe('c4');
    expect(node?.value).toBe(8.0);

    node = tree.find('c5');
    expect(node?.id).toBe('c5');
    expect(node?.value).toBe(6.0);

    node = tree.find('c5');
    expect(node?.id).toBe('c5');
    expect(node?.value).toBe(6.0);

    node = tree.find('c6');
    expect(node?.id).toBe('c6');
    expect(node?.value).toBe(2.0);

    node = tree.find('c7');
    expect(node?.id).toBe('c7');
    expect(node?.value).toBe(1.0);
  });

  it('find works for three levels #2', () =>
  {
    const tree: TSMT$Tree<number>  = new TSMT$Tree<number>();

    const root: TSMT$TreeNode<number>   = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(3.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(5.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(10.0);
    const child4: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(8.0);
    const child5: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(6.0);
    const child6: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);
    const child7: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);

    // id for each node
    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";
    child4.id = "c4";
    child5.id = "c5";
    child6.id = "c6";
    child7.id = "c7";

    root.addChild(child);
    root.addChild(child2);
    root.addChild(child3);
    root.addChild(child4);

    child.addChild(child5);
    child4.addChild(child6);
    child4.addChild(child7);

    tree.root = root;

    expect(tree.size).toBe(8);

    let node: TSMT$TreeNode<number> | null = tree.find('root');
    expect(node?.id).toBe('root');
    expect(node?.value).toBe(1.0);

    node = tree.find('c1');
    expect(node?.id).toBe('c1');
    expect(node?.value).toBe(3.0);

    node = tree.find('c2');
    expect(node?.id).toBe('c2');
    expect(node?.value).toBe(5.0);

    node = tree.find('c3');
    expect(node?.id).toBe('c3');
    expect(node?.value).toBe(10.0);

    node = tree.find('c4');
    expect(node?.id).toBe('c4');
    expect(node?.value).toBe(8.0);

    node = tree.find('c5');
    expect(node?.id).toBe('c5');
    expect(node?.value).toBe(6.0);

    node = tree.find('c5');
    expect(node?.id).toBe('c5');
    expect(node?.value).toBe(6.0);

    node = tree.find('c6');
    expect(node?.id).toBe('c6');
    expect(node?.value).toBe(2.0);

    node = tree.find('c7');
    expect(node?.id).toBe('c7');
    expect(node?.value).toBe(1.0);
  });

  it('find returns null when no node found', () =>
  {
    const tree: TSMT$Tree<number>  = new TSMT$Tree<number>();

    const root: TSMT$TreeNode<number>   = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(3.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(5.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(10.0);
    const child4: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(8.0);
    const child5: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(6.0);
    const child6: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);
    const child7: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);

    // id for each node
    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";
    child4.id = "c4";
    child5.id = "c5";
    child6.id = "c6";
    child7.id = "c7";

    root.addChild(child);
    root.addChild(child2);
    root.addChild(child3);
    root.addChild(child4);

    child.addChild(child5);
    child4.addChild(child6);
    child4.addChild(child7);

    tree.root = root;

    expect(tree.size).toBe(8);

    const node: TSMT$TreeNode<number> | null = tree.find('blah');
    expect(node).toBe(null);
  });

  it('delete takes no action if node to be deleted does not exist (4 levels)', () =>
  {
    const tree: TSMT$Tree<number>  = new TSMT$Tree<number>();

    const root: TSMT$TreeNode<number>   = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(3.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(5.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(10.0);
    const child4: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(8.0);
    const child5: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(6.0);
    const child6: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);
    const child7: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);
    const child8: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(-1.0);

    // id for each node
    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";
    child4.id = "c4";
    child5.id = "c5";
    child6.id = "c6";
    child7.id = "c7";
    child8.id = "c8";

    root.addChild(child);
    root.addChild(child2);
    root.addChild(child3);
    root.addChild(child4);

    child.addChild(child5);
    child4.addChild(child6);
    child4.addChild(child7);

    child7.addChild(child8);

    tree.root = root;

    expect(tree.size).toBe(9);

    tree.delete('blah');
    expect(tree.size).toBe(9);
  });

  it('delete works on singleton at lowest of 4 levels', () =>
  {
    const tree: TSMT$Tree<number>  = new TSMT$Tree<number>();

    const root: TSMT$TreeNode<number>   = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(3.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(5.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(10.0);
    const child4: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(8.0);
    const child5: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(6.0);
    const child6: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);
    const child7: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);
    const child8: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(-1.0);

    // id for each node
    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";
    child4.id = "c4";
    child5.id = "c5";
    child6.id = "c6";
    child7.id = "c7";
    child8.id = "c8";

    root.addChild(child);
    root.addChild(child2);
    root.addChild(child3);
    root.addChild(child4);

    child.addChild(child5);
    child4.addChild(child6);
    child4.addChild(child7);

    child7.addChild(child8);

    tree.root = root;

    expect(tree.size).toBe(9);

    tree.delete('c8');
    expect(tree.size).toBe(8);
    expect(child7.hasChildren).toBe(false);
  });

  it('delete multiple nodes works up entire tree, through to root', () =>
  {
    const tree: TSMT$Tree<number>  = new TSMT$Tree<number>();

    const root: TSMT$TreeNode<number>   = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(3.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(5.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(10.0);
    const child4: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(8.0);
    const child5: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(6.0);
    const child6: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);
    const child7: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);
    const child8: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(-1.0);

    // id for each node
    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";
    child4.id = "c4";
    child5.id = "c5";
    child6.id = "c6";
    child7.id = "c7";
    child8.id = "c8";

    root.addChild(child);
    root.addChild(child2);
    root.addChild(child3);
    root.addChild(child4);

    child.addChild(child5);

    child4.addChild(child6);
    child4.addChild(child7);

    child7.addChild(child8);

    tree.root = root;

    expect(tree.size).toBe(9);

    tree.delete('c8');
    expect(tree.size).toBe(8);
    expect(child7.hasChildren).toBe(false);

    tree.delete('c7');
    expect(tree.size).toBe(7);
    expect(child4.childCount).toBe(1);

    tree.delete('c6');
    expect(tree.size).toBe(6);
    expect(child4.hasChildren).toBe(false);

    tree.delete('c1');
    expect(tree.size).toBe(4);
    expect(root.childCount).toBe(3);

    const list: TSMT$ITreeList<number> = root.head;
    expect(list?.node?.id).toBe('c2');
    expect(list?.next?.node?.id).toBe('c3');

    tree.delete('root');
    expect(tree.size).toBe(0);
    expect(tree.root).toBe(null);
  });

  it('delete works on arbitrary node in middle of hierarchy', () =>
  {
    const tree: TSMT$Tree<number>  = new TSMT$Tree<number>();

    const root: TSMT$TreeNode<number>   = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(3.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(5.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(10.0);
    const child4: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(8.0);
    const child5: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(6.0);
    const child6: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);
    const child7: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);
    const child8: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(-1.0);

    // id for each node
    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";
    child4.id = "c4";
    child5.id = "c5";
    child6.id = "c6";
    child7.id = "c7";
    child8.id = "c8";

    root.addChild(child);
    root.addChild(child2);
    root.addChild(child3);
    root.addChild(child4);

    child.addChild(child5);

    child4.addChild(child6);
    child4.addChild(child7);

    child7.addChild(child8);

    tree.root = root;

    expect(tree.size).toBe(9);

    tree.delete('c4');
    expect(tree.size).toBe(5);
    expect(root.childCount).toBe(3);
  });


  it('height of an empty tree is zero', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    expect(tree.size).toBe(0);
    expect(tree.height).toBe(0);
  });

  it('height of a tree with a singleton node is zero', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    tree.insert('root', 1.0);

    expect(tree.size).toBe(1);
    expect(tree.height).toBe(0);
    expect(tree?.root?.id).toBe('root');
  });

  it('height of a tree with a a single child is 1', () =>
  {
    const tree: TSMT$Tree<number>      = new TSMT$Tree<number>();
    const root: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(3.0);

    // id for each node
    root.id  = "root";
    child.id = "c1";

    root.addChild(child);

    tree.root = root;

    expect(tree.size).toBe(2);
    expect(tree.height).toBe(1);

    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(5.0);
    child2.id = 'c2';
    root.addChild(child2);

    expect(tree.height).toBe(1);
  });

  it('height test (four levels, height is 3) ', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    const root: TSMT$TreeNode<number>   = new TSMT$TreeNode<number>(1.0);
    const child: TSMT$TreeNode<number>  = new TSMT$TreeNode<number>(3.0);
    const child2: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(5.0);
    const child3: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(10.0);
    const child4: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(8.0);
    const child5: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(6.0);
    const child6: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(2.0);
    const child7: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(1.0);
    const child8: TSMT$TreeNode<number> = new TSMT$TreeNode<number>(-1.0);

    // id for each node
    root.id   = "root";
    child.id  = "c1";
    child2.id = "c2";
    child3.id = "c3";
    child4.id = "c4";
    child5.id = "c5";
    child6.id = "c6";
    child7.id = "c7";
    child8.id = "c8";

    root.addChild(child);
    root.addChild(child2);
    root.addChild(child3);
    root.addChild(child4);

    child.addChild(child5);

    child4.addChild(child6);
    child4.addChild(child7);

    child7.addChild(child8);

    tree.root = root;

    expect(tree.size).toBe(9);
    expect(tree.height).toBe(3);
  });

  it('computes height of binary tree correctly', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    const F: TSMT$TreeNode<number> | null = tree.insert('F', 1.0);

    expect(tree.height).toBe(0);

    const B: TSMT$TreeNode<number> | null = tree.insert('B', 1.0, F);
    const G: TSMT$TreeNode<number> | null= tree.insert('G', 1.0, F);

    expect(tree.height).toBe(1);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const A: TSMT$TreeNode<number> | null = tree.insert('A', 1.0, B);
    const D: TSMT$TreeNode<number> | null = tree.insert('D', 1.0, B);

    expect(tree.height).toBe(2);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const C: TSMT$TreeNode<number> | null = tree.insert('C', 1.0, D);
    const E: TSMT$TreeNode<number> | null = tree.insert('E', 1.0, D);

    expect(tree.height).toBe(3);

    const I: TSMT$TreeNode<number> | null = tree.insert('I', 1.0, G)

    expect(tree.height).toBe(3);

    const H: TSMT$TreeNode<number> | null = tree.insert('H', 1.0, I);

    expect(tree.height).toBe(3);
  });

  it('# levels of a null root is zero', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    expect(tree.levels).toBe(0);
  })

  it('# levels of singleton is one', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();
    tree.insert('root', 1.0);

    expect(tree.levels).toBe(1);
  });

  it('general level test', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    const F: TSMT$TreeNode<number> | null = tree.insert('F', 1.0);

    const B: TSMT$TreeNode<number> | null = tree.insert('B', 1.0, F);
    const G: TSMT$TreeNode<number> | null = tree.insert('G', 1.0, F);

    const A: TSMT$TreeNode<number> | null = tree.insert('A', 1.0, B);
    const D: TSMT$TreeNode<number> | null = tree.insert('D', 1.0, B);

    const C: TSMT$TreeNode<number> | null = tree.insert('C', 1.0, D);
    const E: TSMT$TreeNode<number> | null = tree.insert('E', 1.0, D);

    const I: TSMT$TreeNode<number> | null = tree.insert('I', 1.0, G)

    const H: TSMT$TreeNode<number> | null = tree.insert('H', 1.0, I);

    expect(tree.levels).toBe(4);
  });

  // it('out-of-order insertion', () =>
  // {
  //   const tree: TSMT$Tree<number> = new TSMT$Tree<number>();
  //
  //   const ZERO: TSMT$TreeNode<number> = tree.setRoot('0', 0);
  //
  //   const ONE: TSMT$TreeNode<number> = tree.insert('1', 1, ZERO);
  //   const FOUR: TSMT$TreeNode<number> = tree.insert('4', 4, ONE);
  //
  //   const TWO: TSMT$TreeNode<number> = tree.insert('2', 2, ZERO);
  //   const FIVE: TSMT$TreeNode<number> = tree.insert('5', 5, TWO);
  //
  //   const THREE: TSMT$TreeNode<number> = tree.insert('3', 3, ZERO);
  //   const SIX: TSMT$TreeNode<number> = tree.insert('5', 5, THREE);
  //
  //   const root: TSMT$TreeNode<number> = tree.root;
  //   console.log( "root: ", root.id);
  //
  //   let head: TSMT$ITreeList<number> = root.head;
  //   while (head)
  //   {
  //     console.log( head.node.id );
  //     head = head.next;
  //   }
  //
  //   expect(tree.size).toBe(7);
  // });

  it('preorder of an empty tree is an empty array', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    const path: Array<TSMT$TreeNode<number>> = tree.preorder();
    expect(path.length).toBe(0);
  });

  it('preorder of a single root node is a singleton', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    tree.insert('root', 1.0);

    const path: Array<TSMT$TreeNode<number>> = tree.preorder();
    expect(path.length).toBe(1);
  });

  it('preorder test #1 one root, two children', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    const root: TSMT$TreeNode<number> | null = tree.insert('root', 1.0);
    tree.insert('c1', 2.0, root);
    tree.insert('c2', 3.0, root);

    expect(tree.size).toBe(3);
    expect(tree.height).toBe(1);

    const path: Array<TSMT$TreeNode<number>> = tree.preorder();
    expect(path.length).toBe(3);
    expect(path[0].id).toBe('root');
    expect(path[1].id).toBe('c1');
    expect(path[2].id).toBe('c2');
  });

  it('preorder test #2', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    const root: TSMT$TreeNode<number> | null = tree.insert('root', 1.0);
    tree.insert('c1', 2.0, root);
    tree.insert('c2', 3.0, root);
    tree.insert('c3', 4.0, root);

    expect(tree.size).toBe(4);
    expect(tree.height).toBe(1);

    const path: Array<TSMT$TreeNode<number>> = tree.preorder();
    expect(path.length).toBe(4);
    expect(path[0].id).toBe('root');
    expect(path[1].id).toBe('c1');
    expect(path[2].id).toBe('c2');
    expect(path[3].id).toBe('c3');
  });

  it('preorder test #3', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    const root: TSMT$TreeNode<number> | null = tree.insert('root', 1.0);
    tree.insert('c1', 2.0, root);

    const child2: TSMT$TreeNode<number>| null = tree.insert('c2', 3.0, root);

    tree.insert('c3', 4.0, child2);

    expect(tree.size).toBe(4);
    expect(tree.height).toBe(2);

    const path: Array<TSMT$TreeNode<number>> = tree.preorder();
    expect(path.length).toBe(4);
    expect(path[0].id).toBe('root');
    expect(path[1].id).toBe('c1');
    expect(path[2].id).toBe('c2');
    expect(path[3].id).toBe('c3');
  });

  it('preorder test #4', () =>
  {
    // a simple binary tree - this one is easy to check
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    const F: TSMT$TreeNode<number> | null = tree.insert('F', 1.0);

    const B: TSMT$TreeNode<number> | null = tree.insert('B', 1.0, F);
    const G: TSMT$TreeNode<number> | null = tree.insert('G', 1.0, F);

    const A: TSMT$TreeNode<number> | null = tree.insert('A', 1.0, B);
    const D: TSMT$TreeNode<number> | null = tree.insert('D', 1.0, B);

    const C: TSMT$TreeNode<number> | null = tree.insert('C', 1.0, D);
    const E: TSMT$TreeNode<number> | null = tree.insert('E', 1.0, D);

    const I: TSMT$TreeNode<number> | null = tree.insert('I', 1.0, G)

    const H: TSMT$TreeNode<number> | null = tree.insert('H', 1.0, I);

    expect(tree.size).toBe(9);
    expect(tree.height).toBe(3);

    const path: Array<TSMT$TreeNode<number>> = tree.preorder();
    expect(path.length).toBe(9);

    // F B A D C E G I H
    expect(path[0].id).toBe('F');
    expect(path[1].id).toBe('B');
    expect(path[2].id).toBe('A');
    expect(path[3].id).toBe('D');
    expect(path[4].id).toBe('C');
    expect(path[5].id).toBe('E');
    expect(path[6].id).toBe('G');
    expect(path[7].id).toBe('I');
    expect(path[8].id).toBe('H');
  });

  it('preorder test #5', () =>
  {
    // a simple binary tree - this one is easy to check
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();
    tree.ordered = false;

    const R: TSMT$TreeNode<number> | null = tree.insert('R', 1.0);

    const A: TSMT$TreeNode<number> | null = tree.insert('A', 1.0, R);
    const B: TSMT$TreeNode<number> | null = tree.insert('B', 1.0, R);

    const C: TSMT$TreeNode<number> | null = tree.insert('C', 1.0, A);
    const D: TSMT$TreeNode<number> | null = tree.insert('D', 1.0, A);
    const E: TSMT$TreeNode<number> | null = tree.insert('E', 1.0, A);

    const F: TSMT$TreeNode<number> | null = tree.insert('F', 1.0, B)

    expect(tree.size).toBe(7);
    expect(tree.height).toBe(2);

    const path: Array<TSMT$TreeNode<number>> = tree.preorder();
    expect(path.length).toBe(7);

    // R A C D E B F
    expect(path[0].id).toBe('R');
    expect(path[1].id).toBe('A');
    expect(path[2].id).toBe('C');
    expect(path[3].id).toBe('D');
    expect(path[4].id).toBe('E');
    expect(path[5].id).toBe('B');
    expect(path[6].id).toBe('F');
  });

  it('preorder test #6', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();
    tree.ordered = false;

    const A: TSMT$TreeNode<number> | null = tree.insert('A', 1.0);

    const B: TSMT$TreeNode<number> | null = tree.insert('B', 1.0, A);
    const C: TSMT$TreeNode<number> | null = tree.insert('C', 1.0, A);
    const D: TSMT$TreeNode<number> | null = tree.insert('D', 1.0, A);
    const E: TSMT$TreeNode<number> | null = tree.insert('E', 1.0, A);

    const F: TSMT$TreeNode<number> | null = tree.insert('F', 1.0, B);
    const G: TSMT$TreeNode<number> | null = tree.insert('G', 1.0, B);
    const H: TSMT$TreeNode<number> | null = tree.insert('H', 1.0, B);

    const I: TSMT$TreeNode<number> | null = tree.insert('I', 1.0, C);

    const J: TSMT$TreeNode<number> | null = tree.insert('J', 1.0, E);
    const K: TSMT$TreeNode<number> | null = tree.insert('K', 1.0, E);
    const L: TSMT$TreeNode<number> | null = tree.insert('L', 1.0, E);

    const M: TSMT$TreeNode<number> | null = tree.insert('M', 1.0, G);
    const N: TSMT$TreeNode<number> | null = tree.insert('N', 1.0, G);
    const O: TSMT$TreeNode<number> | null = tree.insert('O', 1.0, G);

    const P: TSMT$TreeNode<number> | null = tree.insert('P', 1.0, M);

    expect(tree.size).toBe(16);
    expect(tree.height).toBe(4);

    const path: Array<TSMT$TreeNode<number>> = tree.preorder();
    expect(path.length).toBe(16);

    // A B F G M P N O H C I D E J K L
    expect(path[0].id).toBe('A');
    expect(path[1].id).toBe('B');
    expect(path[2].id).toBe('F');
    expect(path[3].id).toBe('G');
    expect(path[4].id).toBe('M');
    expect(path[5].id).toBe('P');
    expect(path[6].id).toBe('N');
    expect(path[7].id).toBe('O');
    expect(path[8].id).toBe('H');
    expect(path[9].id).toBe('C');
    expect(path[10].id).toBe('I');
    expect(path[11].id).toBe('D');
    expect(path[12].id).toBe('E');
    expect(path[13].id).toBe('J');
    expect(path[14].id).toBe('K');
    expect(path[15].id).toBe('L');
  });

  it('postorder of an empty tree is an empty array', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    const path: Array<TSMT$TreeNode<number>> = tree.postorder();
    expect(path.length).toBe(0);
  });

  it('postorder of a single root node is a singleton', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    tree.insert('root', 1.0);

    const path: Array<TSMT$TreeNode<number>> = tree.postorder();
    expect(path.length).toBe(1);
  });

  it('postorder test #1 one root, two children', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    const root: TSMT$TreeNode<number> | null = tree.insert('root', 1.0);
    tree.insert('c1', 2.0, root);
    tree.insert('c2', 3.0, root);

    expect(tree.size).toBe(3);
    expect(tree.height).toBe(1);

    const path: Array<TSMT$TreeNode<number>> = tree.postorder();
    expect(path.length).toBe(3);
    expect(path[0].id).toBe('c1');
    expect(path[1].id).toBe('c2');
    expect(path[2].id).toBe('root');
  });

  it('postorder test #2', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    const root: TSMT$TreeNode<number> | null = tree.insert('root', 1.0);
    tree.insert('c1', 2.0, root);
    tree.insert('c2', 3.0, root);
    tree.insert('c3', 4.0, root);

    expect(tree.size).toBe(4);
    expect(tree.height).toBe(1);

    const path: Array<TSMT$TreeNode<number>> = tree.postorder();
    expect(path.length).toBe(4);
    expect(path[0].id).toBe('c1');
    expect(path[1].id).toBe('c2');
    expect(path[2].id).toBe('c3');
    expect(path[3].id).toBe('root');
  });

  it('postorder test #3', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    const root: TSMT$TreeNode<number> | null = tree.insert('root', 1.0);
    tree.insert('c1', 2.0, root);

    const child2: TSMT$TreeNode<number> | null = tree.insert('c2', 3.0, root);

    tree.insert('c3', 4.0, child2);

    expect(tree.size).toBe(4);
    expect(tree.height).toBe(2);

    const path: Array<TSMT$TreeNode<number>> = tree.postorder();
    expect(path.length).toBe(4);
    expect(path[0].id).toBe('c1');
    expect(path[1].id).toBe('c3');
    expect(path[2].id).toBe('c2');
    expect(path[3].id).toBe('root');
  });

  it('postorder test #4', () =>
  {
    // a simple binary tree - this one is easy to check
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    const F: TSMT$TreeNode<number> | null = tree.insert('F', 1.0);

    const B: TSMT$TreeNode<number> | null = tree.insert('B', 1.0, F);
    const G: TSMT$TreeNode<number> | null = tree.insert('G', 1.0, F);

    const A: TSMT$TreeNode<number> | null = tree.insert('A', 1.0, B);
    const D: TSMT$TreeNode<number> | null = tree.insert('D', 1.0, B);

    const C: TSMT$TreeNode<number> | null = tree.insert('C', 1.0, D);
    const E: TSMT$TreeNode<number> | null = tree.insert('E', 1.0, D);

    const I: TSMT$TreeNode<number> | null = tree.insert('I', 1.0, G)

    const H: TSMT$TreeNode<number> | null = tree.insert('H', 1.0, I);

    expect(tree.size).toBe(9);
    expect(tree.height).toBe(3);

    const path: Array<TSMT$TreeNode<number>> = tree.postorder();
    expect(path.length).toBe(9);

    // A C E D B H I G F
    expect(path[0].id).toBe('A');
    expect(path[1].id).toBe('C');
    expect(path[2].id).toBe('E');
    expect(path[3].id).toBe('D');
    expect(path[4].id).toBe('B');
    expect(path[5].id).toBe('H');
    expect(path[6].id).toBe('I');
    expect(path[7].id).toBe('G');
    expect(path[8].id).toBe('F');
  });

  it('postorder test #5', () =>
  {
    // a simple binary tree - this one is easy to check
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();
    tree.ordered = false;

    const R: TSMT$TreeNode<number> | null = tree.insert('R', 1.0);

    const A: TSMT$TreeNode<number> | null = tree.insert('A', 1.0, R);
    const B: TSMT$TreeNode<number> | null = tree.insert('B', 1.0, R);

    const C: TSMT$TreeNode<number> | null = tree.insert('C', 1.0, A);
    const D: TSMT$TreeNode<number> | null = tree.insert('D', 1.0, A);
    const E: TSMT$TreeNode<number> | null = tree.insert('E', 1.0, A);

    const F: TSMT$TreeNode<number> | null = tree.insert('F', 1.0, B)

    expect(tree.size).toBe(7);
    expect(tree.height).toBe(2);

    const path: Array<TSMT$TreeNode<number>> = tree.postorder();
    expect(path.length).toBe(7);

    // C D E A F B R
    expect(path[0].id).toBe('C');
    expect(path[1].id).toBe('D');
    expect(path[2].id).toBe('E');
    expect(path[3].id).toBe('A');
    expect(path[4].id).toBe('F');
    expect(path[5].id).toBe('B');
    expect(path[6].id).toBe('R');
  });

  it('postorder test #6', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();
    tree.ordered = false;

    const A: TSMT$TreeNode<number> | null = tree.insert('A', 1.0);

    const B: TSMT$TreeNode<number> | null = tree.insert('B', 1.0, A);
    const C: TSMT$TreeNode<number> | null = tree.insert('C', 1.0, A);
    const D: TSMT$TreeNode<number> | null = tree.insert('D', 1.0, A);
    const E: TSMT$TreeNode<number> | null = tree.insert('E', 1.0, A);

    const F: TSMT$TreeNode<number> | null = tree.insert('F', 1.0, B);
    const G: TSMT$TreeNode<number> | null = tree.insert('G', 1.0, B);
    const H: TSMT$TreeNode<number> | null = tree.insert('H', 1.0, B);

    const I: TSMT$TreeNode<number> | null = tree.insert('I', 1.0, C);

    const J: TSMT$TreeNode<number> | null = tree.insert('J', 1.0, E);
    const K: TSMT$TreeNode<number> | null = tree.insert('K', 1.0, E);
    const L: TSMT$TreeNode<number> | null = tree.insert('L', 1.0, E);

    const M: TSMT$TreeNode<number> | null = tree.insert('M', 1.0, G);
    const N: TSMT$TreeNode<number> | null = tree.insert('N', 1.0, G);
    const O: TSMT$TreeNode<number> | null = tree.insert('O', 1.0, G);

    const P: TSMT$TreeNode<number> | null = tree.insert('P', 1.0, M);

    expect(tree.size).toBe(16);
    expect(tree.height).toBe(4);

    const path: Array<TSMT$TreeNode<number>> = tree.postorder();
    expect(path.length).toBe(16);

    // F P M N O G H B I C D J K L E A
    expect(path[0].id).toBe('F');
    expect(path[1].id).toBe('P');
    expect(path[2].id).toBe('M');
    expect(path[3].id).toBe('N');
    expect(path[4].id).toBe('O');
    expect(path[5].id).toBe('G');
    expect(path[6].id).toBe('H');
    expect(path[7].id).toBe('B');
    expect(path[8].id).toBe('I');
    expect(path[9].id).toBe('C');
    expect(path[10].id).toBe('D');
    expect(path[11].id).toBe('J');
    expect(path[12].id).toBe('K');
    expect(path[13].id).toBe('L');
    expect(path[14].id).toBe('E');
    expect(path[15].id).toBe('A');
  });

  it('level order traversal of empty tree is empty', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();

    const path: Array<TSMT$TreeNode<number>> = tree.levelOrder();

    expect(path.length).toBe(0);
  });

  it('level order traversal of a singleton is a singleton', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();
    tree.ordered = false;
    tree.insert('R', 1.0);

    const path: Array<TSMT$TreeNode<number>> = tree.levelOrder();

    expect(path.length).toBe(1);
  });

  it('general level order traversal #1', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();
    tree.ordered = false;

    const R: TSMT$TreeNode<number> | null = tree.insert('R', 1.0);

    tree.insert('A', 1.0, R);

    const path: Array<TSMT$TreeNode<number>> = tree.levelOrder();

    expect(path.length).toBe(2);
    expect(path[0].id).toBe('R');
    expect(path[1].id).toBe('A');
  });

  it('general level order traversal #2', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();
    tree.ordered = false;

    const R: TSMT$TreeNode<number> | null = tree.insert('R', 1.0);

    tree.insert('A', 1.0, R);
    tree.insert('B', 1.0, R);
    tree.insert('C', 1.0, R);

    const path: Array<TSMT$TreeNode<number>> = tree.levelOrder();

    expect(path.length).toBe(4);
    expect(path[0].id).toBe('R');
    expect(path[1].id).toBe('A');
    expect(path[2].id).toBe('B');
    expect(path[3].id).toBe('C');
  });

  it('general level order traversal #3', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();
    tree.ordered = false;

    const R: TSMT$TreeNode<number> | null = tree.insert('R', 1.0);

    const A: TSMT$TreeNode<number> | null = tree.insert('A', 1.0, R);
    const B: TSMT$TreeNode<number> | null = tree.insert('B', 1.0, R);
    const C: TSMT$TreeNode<number> | null = tree.insert('C', 1.0, R);

    const D: TSMT$TreeNode<number> | null = tree.insert('D', 1.0, B);
    const E: TSMT$TreeNode<number> | null = tree.insert('E', 1.0, B);
    const F: TSMT$TreeNode<number> | null = tree.insert('F', 1.0, B);

    const path: Array<TSMT$TreeNode<number>> = tree.levelOrder();

    expect(path.length).toBe(7);

    expect(path[0].id).toBe('R');
    expect(path[1].id).toBe('A');
    expect(path[2].id).toBe('B');
    expect(path[3].id).toBe('C');
    expect(path[4].id).toBe('D');
    expect(path[5].id).toBe('E');
    expect(path[6].id).toBe('F');
  });

  it('general level order traversal #4', () =>
  {
    const tree: TSMT$Tree<number> = new TSMT$Tree<number>();
    tree.ordered = false;

    const A: TSMT$TreeNode<number> | null = tree.insert('A', 1.0);

    const B: TSMT$TreeNode<number> | null = tree.insert('B', 1.0, A);
    const C: TSMT$TreeNode<number> | null = tree.insert('C', 1.0, A);
    const D: TSMT$TreeNode<number> | null = tree.insert('D', 1.0, A);
    const E: TSMT$TreeNode<number> | null = tree.insert('E', 1.0, A);

    const F: TSMT$TreeNode<number> | null = tree.insert('F', 1.0, B);
    const G: TSMT$TreeNode<number> | null = tree.insert('G', 1.0, B);
    const H: TSMT$TreeNode<number> | null = tree.insert('H', 1.0, B);

    const I: TSMT$TreeNode<number> | null = tree.insert('I', 1.0, C);

    const J: TSMT$TreeNode<number> | null = tree.insert('J', 1.0, E);
    const K: TSMT$TreeNode<number> | null = tree.insert('K', 1.0, E);
    const L: TSMT$TreeNode<number> | null = tree.insert('L', 1.0, E);

    const M: TSMT$TreeNode<number> | null = tree.insert('M', 1.0, G);
    const N: TSMT$TreeNode<number> | null = tree.insert('N', 1.0, G);
    const O: TSMT$TreeNode<number> | null = tree.insert('O', 1.0, G);

    const P: TSMT$TreeNode<number> | null = tree.insert('P', 1.0, M);

    expect(tree.size).toBe(16);
    expect(tree.height).toBe(4);

    const path: Array<TSMT$TreeNode<number>> = tree.levelOrder();
    expect(path.length).toBe(16);

    // A B C D E F G H I J L M N O P
    expect(path[0].id).toBe('A');
    expect(path[1].id).toBe('B');
    expect(path[2].id).toBe('C');
    expect(path[3].id).toBe('D');
    expect(path[4].id).toBe('E');
    expect(path[5].id).toBe('F');
    expect(path[6].id).toBe('G');
    expect(path[7].id).toBe('H');
    expect(path[8].id).toBe('I');
    expect(path[9].id).toBe('J');
    expect(path[10].id).toBe('K');
    expect(path[11].id).toBe('L');
    expect(path[12].id).toBe('M');
    expect(path[13].id).toBe('N');
    expect(path[14].id).toBe('O');
    expect(path[15].id).toBe('P');
  });
});
