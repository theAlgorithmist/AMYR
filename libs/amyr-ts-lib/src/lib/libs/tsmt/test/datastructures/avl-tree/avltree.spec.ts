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

// Specs for Typescript Math Toolkit AVL Tree

// test functions/classes
import { TSMT$BTreeNode      } from '../../../datastructures/b-tree-node';
import { TSMT$BTreeUtils     } from '../../../datastructures/utils/b-tree-utils';
import { TSMT$BTreeLight     } from '../../../datastructures/b-tree-light';
import { 
  TSMT$AVLTree,
  TSMT$NODE_DIRECTION
} from '../../../datastructures/avl-tree';

// Test Suites
describe('Binary Tree Node Tests: TSMT$BTreeNode<T>', () => {

  const utils: TSMT$BTreeUtils<number> = new TSMT$BTreeUtils<number>();

  it('properly constructs a new binary tree node of type number', () => {
    const node: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>();

    expect(node).toBeTruthy();
    expect(node.parent).toBe(null);
    expect(node.hasLeft).toBe(false);
    expect(node.hasRight).toBe(false);
  });

  it('properly constructs a new binary tree node with initial data', () => {
    const node: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(100.0);

    expect(node).toBeTruthy();
    expect(node.parent).toBe(null);
    expect(node.value).toBe(100.0);
    expect(node.hasLeft).toBe(false);
    expect(node.hasRight).toBe(false);
  });

  it('properly accepts balance data', () => {
    const node: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(1.0);

    node.balance = -2.1;
    expect(node.balance).toBe(-3);
  
    node.balance = 2.5;
    expect(node.balance).toBe(2);

    node.balance = 0;
    expect(node.balance).toBe(0);
  });

  it('properly accepts parent and child references', () => {
    const root: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(2.0);
    const left: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(1.0);
    const right: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);

    root.id  = "root";
    left.id  = "L";
    right.id = "R";

    left.parent  = root;
    right.parent = root;

    root.left  = left;
    root.right = right;

    expect(root.hasLeft).toBe(true);
    expect(root.hasRight).toBe(true);
    expect(left.parent.id  == root.id).toBe(true);
    expect(right.parent.id == root.id).toBe(true);
    expect(root.left.id  == left.id).toBe(true);
    expect(root.right.id == right.id).toBe(true);
  });

  it('properly compares two nodes', () => {
    const node1: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(1.0);
    const node2: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    const node3: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);

    expect(node1.compare(node2)).toBe(0);
    expect(node2.compare(node1)).toBe(1);
    expect(node2.compare(node3)).toBe(1);
  });
 
  it('properly computes node height #1', () => {
    const tree: TSMT$AVLTree<number>   = new TSMT$AVLTree<number>();
    const root: TSMT$BTreeNode<number> = tree.root as TSMT$BTreeNode<number>;

    expect(utils.nodeHeight(root)).toBe(0);
    expect(root).toBe(null);
  });

  it('properly computes node height #2', () => {
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(4.0);
    const five: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(5.0);

    two.left  = one;
    two.right = four;

    four.left  = three;
    four.right = five;

    expect(utils.nodeHeight(two)).toBe(3);
    expect(utils.nodeHeight(one)).toBe(1);
    expect(utils.nodeHeight(four)).toBe(2);
  });

  it('properly computes node height #3', () => {
    const twenty: TSMT$BTreeNode<number>     = new TSMT$BTreeNode<number>(20.0);
    const seventeen: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(17.0);
    const twentyfour: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(24.0);
    const ten: TSMT$BTreeNode<number>        = new TSMT$BTreeNode<number>(10.0);
    const eighteen: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(18.0);
    const eight: TSMT$BTreeNode<number>      = new TSMT$BTreeNode<number>(8.0);

    twenty.left  = seventeen;
    twenty.right = twentyfour;

    seventeen.left  = ten;
    seventeen.right = eighteen;

    ten.left = eight;

    expect(utils.nodeHeight(twenty)).toBe(4);
    expect(utils.nodeHeight(seventeen)).toBe(3);
    expect(utils.nodeHeight(ten)).toBe(2);
    expect(utils.nodeHeight(twentyfour)).toBe(1);
    expect(utils.nodeHeight(eighteen)).toBe(1);
    expect(utils.nodeHeight(eight)).toBe(1);
  });

  it('properly computes node depth', () => {
    const twenty: TSMT$BTreeNode<number>     = new TSMT$BTreeNode<number>(20.0);
    const seventeen: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(17.0);
    const twentyfour: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(24.0);
    const ten: TSMT$BTreeNode<number>        = new TSMT$BTreeNode<number>(10.0);
    const eighteen: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(18.0);
    const eight: TSMT$BTreeNode<number>      = new TSMT$BTreeNode<number>(8.0);

    twenty.left  = seventeen;
    twenty.right = twentyfour;

    seventeen.left  = ten;
    seventeen.right = eighteen;

    ten.left = eight;

    expect(utils.nodeDepth(twenty)).toBe(1);
    expect(utils.nodeDepth(seventeen)).toBe(2);
    expect(utils.nodeDepth(ten)).toBe(3);
    expect(utils.nodeDepth(twentyfour)).toBe(2);
    expect(utils.nodeDepth(eighteen)).toBe(3);
    expect(utils.nodeDepth(eight)).toBe(4);
  });

});

describe('AVL Tree Basic Tests: TSMT$AVLTree<T> and TSMT$BTreeLight<T>', () => {

  it('properly constructs an AVL Tree', () => {
    const tree: TSMT$AVLTree<number> = new TSMT$AVLTree<number>();
    
    expect(tree != null).toBe(true);
    expect(tree.size).toBe(0);
    expect(tree.root).toBe(null);
  });

  it('properly inserts a single node and assigns root', () => {
    const tree: TSMT$AVLTree<number>   = new TSMT$AVLTree<number>();
    const node: TSMT$BTreeNode<number> = new TSMT$BTreeNode(20.0);

    tree.insert(node);
    expect(tree.size).toBe(1);

    const root: TSMT$BTreeNode<number> = tree.root as TSMT$BTreeNode<number>;
    expect(root === node).toBe(true);
  });

  it('properly inserts a single root node and single child', () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const node: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(2.0);
    const node1: TSMT$BTreeNode<number> = new TSMT$BTreeNode(3.0);
    
    tree.insert(node);
    tree.insert(node1);
    expect(tree.size).toBe(2);
  });

  it('properly inserts a single root node and two children #1', () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(2.0);
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode(3.0);
    
    tree.insert(two);
    tree.insert(one);
    tree.insert(three);

    expect(tree.size).toBe(3);

    const root: TSMT$BTreeNode<number> = tree.root as TSMT$BTreeNode<number>;
    expect(root == two).toBe(true);
    expect(root.hasLeft).toBe(true);
    expect(root.hasRight).toBe(true);
    expect(root.left === one).toBe(true);
    expect(root.right === three).toBe(true);
  });

  it('properly inserts a single root node and two children #2', () => {
    const tree: TSMT$BTreeLight<number> = new TSMT$BTreeLight<number>();
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode(3.0);
    
    tree.insert(one);
    tree.insert(two);
    tree.insert(three);

    expect(tree.size).toBe(3);

    const root: TSMT$BTreeNode<number> = tree.root as TSMT$BTreeNode<number>;
    expect(root == one).toBe(true);
    expect(root.hasLeft).toBe(false);

    let child: TSMT$BTreeNode<number> = root.right as TSMT$BTreeNode<number>;
    expect(child.hasRight).toBe(true);
    expect(child.hasLeft).toBe(false);

    expect(child === two).toBe(true);
    
    child = child.right as TSMT$BTreeNode<number>;
    expect(child.hasRight).toBe(false);
    expect(child.hasLeft).toBe(false);

    expect(child === three).toBe(true);
  });
  
  it('properly inserts a single root node and two children #3', () => {
    const tree: TSMT$BTreeLight<number> = new TSMT$BTreeLight<number>();
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode(3.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(2.0);
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    
    tree.insert(three);
    tree.insert(two);
    tree.insert(one);

    expect(tree.size).toBe(3);

    const root: TSMT$BTreeNode<number> = tree.root as TSMT$BTreeNode<number>;
    expect(root == three).toBe(true);
    expect(root.hasRight).toBe(false);

    let child: TSMT$BTreeNode<number> = root.left as TSMT$BTreeNode<number>;
    expect(child.hasLeft).toBe(true);
    expect(child.hasRight).toBe(false);

    expect(child === two).toBe(true);
    
    child = child.left as TSMT$BTreeNode<number>;
    expect(child.hasLeft).toBe(false);
    expect(child.hasRight).toBe(false);

    expect(child === one).toBe(true);
  });

  it('properly inserts a single node and two children #4', () => {
    const tree: TSMT$BTreeLight<number>  = new TSMT$BTreeLight<number>();
    const five: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(5.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(4.0);
    
    five.id  = "5";
    three.id = "3";
    four.id  = "4";

    tree.insert(five);
    tree.insert(three);
    tree.insert(four);

    expect(tree.root?.id).toBe("5");
    expect(five.left?.id).toBe("3");
    expect(three.right?.id).toBe("4");
  });

  it('properly inserts multiple nodes', () => {
    const tree: TSMT$BTreeLight<number>  = new TSMT$BTreeLight<number>();
    const three: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(3.0);
    const four: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(4.0);
    const five: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(5.0);
    const two: TSMT$BTreeNode<number>    = new TSMT$BTreeNode(2.0);
    const one: TSMT$BTreeNode<number>    = new TSMT$BTreeNode(1.0);
    
    three.id = "3";
    four.id  = "4";
    five.id  = "5";
    two.id   = "2";
    one.id   = "1";

    tree.insert(three);
    tree.insert(four);
    tree.insert(five);
    tree.insert(two);
    tree.insert(one);

    expect(tree.size).toBe(5);
    expect(tree.root?.id).toBe("3");
    expect(three.right?.id).toBe("4");
    expect(four.right?.id).toBe("5");
    expect(three.left?.id).toBe("2");
    expect(two.left?.id).toBe("1");
  });

  it('basic multi-node insert #2', () => {
    const tree: TSMT$BTreeLight<number>     = new TSMT$BTreeLight<number>();
    const three: TSMT$BTreeNode<number>     = new TSMT$BTreeNode(3.0);
    const twenty: TSMT$BTreeNode<number>    = new TSMT$BTreeNode(20.0);
    const seventeen: TSMT$BTreeNode<number> = new TSMT$BTreeNode(17.0);
    const four: TSMT$BTreeNode<number>      = new TSMT$BTreeNode(4.0);
    const one: TSMT$BTreeNode<number>       = new TSMT$BTreeNode(1.0);
    
    three.id     = "3";
    twenty.id    = "20";
    seventeen.id = "17";
    four.id      = "4";
    one.id       = "1";

    tree.insert(three);
    tree.insert(twenty);
    tree.insert(seventeen);
    tree.insert(four);
    tree.insert(one);

    expect(tree.size).toBe(5);
    expect(tree.root?.id).toBe(three.id);
    expect(three.right?.id).toBe(twenty.id);
    expect(twenty.left?.id).toBe(seventeen.id);
    expect(seventeen.left?.id).toBe(four.id);
    expect(three.left?.id).toBe(one.id);
  });
});

describe('Light Binary Tree Update Balance On Insert Tests', () => {

  it('one-node insert' , () => {
    const tree: TSMT$BTreeLight<number>    = new TSMT$BTreeLight<number>();
    const node: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(1.0);
  
    node.id  = "node";

    tree.insert(node);
   
    expect(node.balance).toBe(0);
  });

  it('two-node insert #1' , () => {
    const tree: TSMT$BTreeLight<number> = new TSMT$BTreeLight<number>();
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(2.0);
    
    one.id = "1";
    two.id = "2";

    tree.insert(one);
    tree.insert(two);
   
    expect(one.balance).toBe(1);
    expect(two.balance).toBe(0);
  });

  it('two-node insert #2' , () => {
    const tree: TSMT$BTreeLight<number> = new TSMT$BTreeLight<number>();
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(2.0);
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    
    two.id = "2";
    one.id = "1";

    tree.insert(two);
    tree.insert(one);
   
    expect(two.balance).toBe(-1);
    expect(one.balance).toBe(0);
  });

  it('three-node insert #1' , () => {
    const tree: TSMT$BTreeLight<number> = new TSMT$BTreeLight<number>();
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(2.0);
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode(3.0);
    
    two.id   = "2";
    one.id   = "1";
    three.id = "3";

    tree.insert(two);
    tree.insert(one);
    tree.insert(three);

    expect(two.balance).toBe(0);
    expect(one.balance).toBe(0);
    expect(three.balance).toBe(0);
  });

  it('three-node insert #2' , () => {
    const tree: TSMT$BTreeLight<number> = new TSMT$BTreeLight<number>();
    const node: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(1.0);
    const node1: TSMT$BTreeNode<number> = new TSMT$BTreeNode(2.0);
    const node2: TSMT$BTreeNode<number> = new TSMT$BTreeNode(3.0);
    
    node.id  = "one";
    node1.id = "two";
    node2.id = "three";

    tree.insert(node);
    tree.insert(node1);
    tree.insert(node2);

    expect(node.balance).toBe(2);
    expect(node1.balance).toBe(1);
    expect(node2.balance).toBe(0);
  });

  it('three-node insert #3' , () => {
    const tree: TSMT$BTreeLight<number> = new TSMT$BTreeLight<number>();
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode(3.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(2.0);
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    
    three.id = "3";
    two.id   = "2";
    one.id   = "1";

    tree.insert(three);
    tree.insert(two);
    tree.insert(one);

    expect(three.balance).toBe(-2);
    expect(two.balance).toBe(-1);
    expect(one.balance).toBe(0);
  });

  it('mult-node test #1' , () => {
    const tree: TSMT$BTreeLight<number>   = new TSMT$BTreeLight<number>();
    const twelve: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(12.0);
    const eight: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(8.0);
    const five: TSMT$BTreeNode<number>    = new TSMT$BTreeNode(5.0);
    const nine: TSMT$BTreeNode<number>    = new TSMT$BTreeNode(9.0);
    const fifteen: TSMT$BTreeNode<number> = new TSMT$BTreeNode(15.0);
    
    twelve.id  = "12";
    eight.id   = "8";
    five.id    = "5";
    nine.id    = "9";
    fifteen.id = "15";

    tree.insert(twelve);
    expect(twelve.balance).toBe(0);

    tree.insert(eight);
    expect(twelve.balance).toBe(-1);

    tree.insert(five);
    expect(eight.balance).toBe(-1);
    expect(twelve.balance).toBe(-2);

    tree.insert(nine);
    expect(eight.balance).toBe(0);
    expect(twelve.balance).toBe(-2);

    tree.insert(fifteen);
    expect(fifteen.balance).toBe(0);
    expect(twelve.balance).toBe(-1);
  });

  it('mult-node test #2' , () => {
    const tree: TSMT$BTreeLight<number>  = new TSMT$BTreeLight<number>();
    const twelve: TSMT$BTreeNode<number> = new TSMT$BTreeNode(12.0);
    const eight: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(8.0);
    const five: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(5.0);
    const nine: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(9.0);
    const ten: TSMT$BTreeNode<number>    = new TSMT$BTreeNode(10.0);
    
    twelve.id = "12";
    eight.id  = "8";
    five.id   = "5";
    nine.id   = "9";
    ten.id    = "10";

    tree.insert(twelve);
    expect(twelve.balance).toBe(0);

    tree.insert(eight);
    expect(twelve.balance).toBe(-1);

    tree.insert(five);
    expect(eight.balance).toBe(-1);
    expect(twelve.balance).toBe(-2);

    tree.insert(nine);
    expect(eight.balance).toBe(0);
    expect(twelve.balance).toBe(-2);

    tree.insert(ten);
    expect(ten.balance).toBe(0);
    expect(nine.balance).toBe(1);
    expect(eight.balance).toBe(1);
    expect(twelve.balance).toBe(-3);
  });

  it('mult-node test #3' , () => {
    const tree: TSMT$BTreeLight<number>     = new TSMT$BTreeLight<number>();
    const twelve: TSMT$BTreeNode<number>    = new TSMT$BTreeNode(12.0);
    const eight: TSMT$BTreeNode<number>     = new TSMT$BTreeNode(8.0);
    const five: TSMT$BTreeNode<number>      = new TSMT$BTreeNode(5.0);
    const nine: TSMT$BTreeNode<number>      = new TSMT$BTreeNode(9.0);
    const twenty: TSMT$BTreeNode<number>    = new TSMT$BTreeNode(20.0);
    const eighteen: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(18.0);
    const seventeen: TSMT$BTreeNode<number> = new TSMT$BTreeNode(17.0);

    tree.insert(twelve);
    tree.insert(eight);
    tree.insert(five);
    tree.insert(nine);
    tree.insert(twenty);
    tree.insert(eighteen);
    tree.insert(seventeen);

    expect(seventeen.balance).toBe(0);
    expect(eighteen.balance).toBe(-1);
    expect(twenty.balance).toBe(-2);
    expect(twelve.balance).toBe(1);
  });
});

describe('AVL Tree Rotation Tests', () => {

  it('properly performs a single left rotation' , () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode(3.0);
    
    one.id   = "1";
    two.id   = "2";
    three.id = "3";

    one.right = two;
    two.right = three;

    const newRoot: TSMT$BTreeNode<number> | null = tree.singleRotation(one, TSMT$NODE_DIRECTION.LEFT);

    expect(newRoot?.id).toBe(two.id);
    expect(newRoot?.hasLeft).toBe(true);
    expect(newRoot?.hasRight).toBe(true);
    expect(newRoot?.left?.id).toBe(one.id);
    expect(newRoot?.right?.id).toBe(three.id);
    expect(one.parent?.id).toBe(two.id);

    expect(newRoot?.balance).toBe(0);
    expect(one.balance).toBe(0);
    expect(three.balance).toBe(0);
  });

  it('properly performs a single right rotation', () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode(3.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(2.0);
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    
    three.id = "3";
    two.id   = "2";
    one.id   = "1";

    three.left = two;
    two.left   = one;

    const newRoot: TSMT$BTreeNode<number> | null = tree.singleRotation(three, TSMT$NODE_DIRECTION.RIGHT);

    expect(newRoot?.id).toBe(two.id);
    expect(newRoot?.hasLeft).toBe(true);
    expect(newRoot?.hasRight).toBe(true);
    expect(newRoot?.left?.id).toBe(one.id);
    expect(newRoot?.right?.id).toBe(three.id);

    expect(newRoot?.balance).toBe(0);
    expect(one.balance).toBe(0);
    expect(three.balance).toBe(0);
  });

  it('3-node double right rotation', () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const five: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(5.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(4.0);
    
    five.id  = "5";
    three.id = "3";
    four.id  = "4";

    five.left   = three;
    three.right = four;

    const newRoot: TSMT$BTreeNode<number> | null = tree.doubleRotation(five, TSMT$NODE_DIRECTION.RIGHT);

    expect(newRoot?.id).toBe(four.id);
    expect(newRoot?.hasLeft).toBe(true);
    expect(newRoot?.hasRight).toBe(true);
    expect(newRoot?.left?.id).toBe(three.id);
    expect(newRoot?.right?.id).toBe(five.id);
    expect(newRoot?.parent).toBe(null);
    expect(newRoot?.left?.parent?.id).toBe(newRoot?.id);
    expect(newRoot?.right?.parent?.id).toBe(newRoot?.id);
  });

  it('3-node double left rotation', () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode(3.0);
    const five: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(5.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(4.0);
    
    three.id = "3";
    five.id  = "5";
    four.id  = "4";

    three.right = five;
    five.left   = four;

    const newRoot: TSMT$BTreeNode<number> | null = tree.doubleRotation(three, TSMT$NODE_DIRECTION.LEFT);

    expect(newRoot?.id).toBe(four.id);
    expect(newRoot?.hasLeft).toBe(true);
    expect(newRoot?.hasRight).toBe(true);
    expect(newRoot?.left?.id).toBe(three.id);
    expect(newRoot?.right?.id).toBe(five.id);
    expect(newRoot?.parent).toBe(null);
    expect(newRoot?.left?.parent?.id).toBe(newRoot?.id);
    expect(newRoot?.right?.parent?.id).toBe(newRoot?.id);
  });

  it('multi-node, single-rotation #1' , () => {
    const tree: TSMT$AVLTree<number>         = new TSMT$AVLTree<number>();
    const twenty: TSMT$BTreeNode<number>     = new TSMT$BTreeNode(20.0);
    const seventeen: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(17.0);
    const twentyfour: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(24.0);
    const eighteen: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(18.0);
    const ten: TSMT$BTreeNode<number>        = new TSMT$BTreeNode<number>(10.0);
    const eight: TSMT$BTreeNode<number>      = new TSMT$BTreeNode<number>(8.0);

    twenty.id     = "20";
    seventeen.id  = "17";
    twentyfour.id = "24";
    eighteen.id   = "18";
    ten.id        = "10";
    eight.id      = "8";

    twenty.left     = seventeen;
    twenty.right    = twentyfour;
    seventeen.right = eighteen;
    seventeen.left  = ten;
    ten.left        = eight;

    const newRoot: TSMT$BTreeNode<number> | null = tree.singleRotation(twenty, TSMT$NODE_DIRECTION.RIGHT);
   
    expect(newRoot?.id).toBe(seventeen.id);
    expect(newRoot?.left?.id).toBe(ten.id);
    expect(newRoot?.right?.id).toBe(twenty.id);
    expect(twenty.left.id).toBe(eighteen.id);
    expect(twenty.right.id).toBe(twentyfour.id);
    expect(ten.left.id).toBe(eight.id);
  });

  it('multi-node, single-rotation #2' , () => {
    const tree: TSMT$AVLTree<number>         = new TSMT$AVLTree<number>();
    const twenty: TSMT$BTreeNode<number>     = new TSMT$BTreeNode(20.0);
    const seventeen: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(17.0);
    const twentyfour: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(24.0);
    const eighteen: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(18.0);
    const ten: TSMT$BTreeNode<number>        = new TSMT$BTreeNode<number>(10.0);
    const eight: TSMT$BTreeNode<number>      = new TSMT$BTreeNode<number>(8.0);

    twenty.id     = "20";
    seventeen.id  = "17";
    twentyfour.id = "24";
    eighteen.id   = "18";
    ten.id        = "10";
    eight.id      = "8";

    ten.left       = eight;
    ten.right      = eighteen;
    eighteen.left  = seventeen;
    eighteen.right = twenty;
    twenty.right   = twentyfour;

    const newRoot: TSMT$BTreeNode<number>| null = tree.singleRotation(ten, TSMT$NODE_DIRECTION.LEFT);
   
    expect(newRoot?.id).toBe(eighteen.id);
    expect(newRoot?.left?.id).toBe(ten.id);
    expect(newRoot?.right?.id).toBe(twenty.id);
    expect(ten.left.id).toBe(eight.id);
    expect(ten.right.id).toBe(seventeen.id);
    expect(twenty.right.id).toBe(twentyfour.id);
  });

  it('multi-node, double-rotation #1' , () => {
    const tree: TSMT$AVLTree<number>         = new TSMT$AVLTree<number>();
    const twelve: TSMT$BTreeNode<number>     = new TSMT$BTreeNode(12.0);
    const ten: TSMT$BTreeNode<number>        = new TSMT$BTreeNode(10.0);
    const twenty: TSMT$BTreeNode<number>     = new TSMT$BTreeNode<number>(20.0);
    const fifteen: TSMT$BTreeNode<number>    = new TSMT$BTreeNode<number>(15.0);
    const twentyfour: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(24.0);
    const thirteen: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(13.0);

    twelve.id     = "12";
    ten.id        = "10";
    twenty.id     = "20";
    fifteen.id    = "15";
    twentyfour.id = "24";
    thirteen.id   = "13";

    twelve.left = ten;
    twelve.right = twenty;
    twenty.left  = fifteen;
    twenty.right = twentyfour;
    fifteen.left = thirteen;

    const newRoot: TSMT$BTreeNode<number> | null = tree.doubleRotation(twelve, TSMT$NODE_DIRECTION.LEFT);

    expect(newRoot?.id).toBe(fifteen.id);
    expect(newRoot?.left?.id).toBe(twelve.id);
    expect(newRoot?.right?.id).toBe(twenty.id);
    expect(twelve.left.id).toBe(ten.id);
    expect(twelve.right.id).toBe(thirteen.id);
    expect(twenty.left).toBe(null);
    expect(twenty.right.id).toBe(twentyfour.id);
  });

  it('multi-node, double-rotation #2' , () => {
    const tree: TSMT$AVLTree<number>         = new TSMT$AVLTree<number>();
    const twelve: TSMT$BTreeNode<number>     = new TSMT$BTreeNode(12.0);
    const ten: TSMT$BTreeNode<number>        = new TSMT$BTreeNode(10.0);
    const twenty: TSMT$BTreeNode<number>     = new TSMT$BTreeNode<number>(20.0);
    const fifteen: TSMT$BTreeNode<number>    = new TSMT$BTreeNode<number>(15.0);
    const twentyfour: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(24.0);
    const sixteen: TSMT$BTreeNode<number>    = new TSMT$BTreeNode<number>(16.0);

    twelve.id     = "12";
    ten.id        = "10";
    twenty.id     = "20";
    fifteen.id    = "15";
    twentyfour.id = "24";
    sixteen.id    = "16";

    twelve.left     = ten;
    twelve.right    = twenty;
    twenty.left     = fifteen;
    twenty.right    = twentyfour;
    fifteen.right   = sixteen;

    const newRoot: TSMT$BTreeNode<number> | null = tree.doubleRotation(twelve, TSMT$NODE_DIRECTION.LEFT);

    expect(newRoot?.id).toBe(fifteen.id);
    expect(newRoot?.left?.id).toBe(twelve.id);
    expect(newRoot?.right?.id).toBe(twenty.id);
    expect(twelve.left.id).toBe(ten.id);
    expect(twelve.right).toBe(null);
    expect(twenty.left.id).toBe(sixteen.id);
    expect(twenty.right.id).toBe(twentyfour.id);
  });
});

describe('AVL Tree Insert With Rebalance Tests', () => {

  it('no rebalance on one-node insert' , () => {
    const tree: TSMT$AVLTree<number>   = new TSMT$AVLTree<number>();
    const one: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(1.0);
  
    one.id = "1";

    tree.insert(one);
   
    expect(tree.size).toBe(1);
    expect(one.balance).toBe(0);
  });

  it('no rebalance on two-node insert #1' , () => {
    const tree: TSMT$AVLTree<number>  = new TSMT$AVLTree<number>();
    const one: TSMT$BTreeNode<number> = new TSMT$BTreeNode(1.0);
    const two: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(2.0);

    one.id = "1";
    two.id = "2";

    tree.insert(one);
    tree.insert(two);

    expect(tree.size).toBe(2);
    expect(one.balance).toBe(1);
    expect(two.balance).toBe(0);
    expect(tree.root?.id).toBe(one.id);
    expect(one.right?.id).toBe(two.id);
  });

  it('no rebalance on two-node insert #2' , () => {
    const tree: TSMT$AVLTree<number>  = new TSMT$AVLTree<number>();
    const one: TSMT$BTreeNode<number> = new TSMT$BTreeNode(1.0);
    const two: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(2.0);

    one.id = "1";
    two.id = "2";

    tree.insert(two);
    tree.insert(one);

    expect(tree.size).toBe(2);
    expect(two.balance).toBe(-1);
    expect(one.balance).toBe(0);
    expect(tree.root?.id).toBe(two.id);
    expect(two.left?.id).toBe(one.id);
  });

  it('no rebalance on one node, two-child insert #1' , () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode(3.0);
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);

    one.id   = "1";
    two.id   = "2";
    three.id = "3";

    tree.insert(two);
    tree.insert(one);
    tree.insert(three);

    expect(tree.size).toBe(3);
    expect(tree.root?.id).toBe(two.id);
    expect(two.left?.id).toBe(one.id);
    expect(two.right?.id).toBe(three.id);
    expect(two.balance).toBe(0);
    expect(one.balance).toBe(0);
    expect(three.balance).toBe(0);
  });

  it('no rebalance on one node, two-child insert #2' , () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode(3.0);
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);

    one.id   = "1";
    two.id   = "2";
    three.id = "3";

    tree.insert(two);
    tree.insert(three);
    tree.insert(one);

    expect(tree.size).toBe(3);
    expect(tree.root?.id).toBe(two.id);
    expect(two.left?.id).toBe(one.id);
    expect(two.right?.id).toBe(three.id);
    expect(two.balance).toBe(0);
    expect(one.balance).toBe(0);
    expect(three.balance).toBe(0);
  });

  it('three-node test #1 (single rotation)' , () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode(3.0);
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);

    one.id   = "1";
    two.id   = "2";
    three.id = "3";

    tree.insert(three);
    tree.insert(two);
    tree.insert(one);

    expect(tree.size).toBe(3);
    expect(tree.root?.id).toBe(two.id);
    expect(two.left?.id).toBe(one.id);
    expect(two.right?.id).toBe(three.id);
  });

  it('three-node test #2 (single rotation)' , () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode(3.0);
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);

    one.id   = "1";
    two.id   = "2";
    three.id = "3";

    tree.insert(one);
    tree.insert(two);
    tree.insert(three);

    expect(tree.size).toBe(3);
    expect(tree.root?.id).toBe(two.id);
    expect(two.left?.id).toBe(one.id);
    expect(two.right?.id).toBe(three.id);
  });

  it('three-node test #3 (double rotation)' , () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const five: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(5.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(4.0);

    five.id  = "5";
    three.id = "3";
    four.id  = "4";

    tree.insert(five);
    tree.insert(three);
    tree.insert(four);

    expect(tree.size).toBe(3);
    expect(tree.root?.id).toBe(four.id);
    expect(four.left?.id).toBe(three.id);
    expect(four.right?.id).toBe(five.id);
  });

  it('three-node test #4 (double rotation)' , () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const five: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(5.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(4.0);

    five.id  = "5";
    three.id = "3";
    four.id  = "4";

    tree.insert(three);
    tree.insert(five);
    tree.insert(four);

    expect(tree.size).toBe(3);
    expect(tree.root?.id).toBe(four.id);
    expect(four.left?.id).toBe(three.id);
    expect(four.right?.id).toBe(five.id);
  });

  it('multi-node test #1' , () => {
    const tree: TSMT$AVLTree<number>         = new TSMT$AVLTree<number>();
    const twenty: TSMT$BTreeNode<number>     = new TSMT$BTreeNode(20.0);
    const seventeen: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(17.0);
    const twentyfour: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(24.0);
    const eighteen: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(18.0);
    const ten: TSMT$BTreeNode<number>        = new TSMT$BTreeNode<number>(10.0);
    const eight: TSMT$BTreeNode<number>      = new TSMT$BTreeNode<number>(8.0);

    twenty.id     = "20";
    seventeen.id  = "17";
    twentyfour.id = "24";
    eighteen.id   = "18";
    ten.id        = "10";
    eight.id      = "8";

    tree.insert(ten);
    tree.insert(eighteen);
    tree.insert(eight);
    tree.insert(seventeen);
    tree.insert(twenty);
    tree.insert(twentyfour);

    const root: TSMT$BTreeNode<number> | null = tree.root;

    expect(tree.root?.id).toBe(eighteen.id);
    expect(root?.left?.id).toBe(ten.id);
    expect(root?.right?.id).toBe(twenty.id);
    expect(ten.left?.id).toBe(eight.id);
    expect(ten.right?.id).toBe(seventeen.id);
    expect(twenty.right?.id).toBe(twentyfour.id);

    expect(root?.balance).toBe(0);
    expect(ten.balance).toBe(0);
    expect(twenty.balance).toBe(1);
    expect(eight.balance).toBe(0);
    expect(seventeen.balance).toBe(0);
    expect(twentyfour.balance).toBe(0);
  });

  it('multi-node test #2' , () => {
    const tree: TSMT$AVLTree<number>         = new TSMT$AVLTree<number>();
    const twenty: TSMT$BTreeNode<number>     = new TSMT$BTreeNode(20.0);
    const seventeen: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(17.0);
    const twentyfour: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(24.0);
    const eighteen: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(18.0);
    const ten: TSMT$BTreeNode<number>        = new TSMT$BTreeNode<number>(10.0);
    const eight: TSMT$BTreeNode<number>      = new TSMT$BTreeNode<number>(8.0);

    twenty.id     = "20";
    seventeen.id  = "17";
    twentyfour.id = "24";
    eighteen.id   = "18";
    ten.id        = "10";
    eight.id      = "8";

    tree.insert(twenty);
    tree.insert(seventeen);
    tree.insert(twentyfour);
    tree.insert(eighteen);
    tree.insert(ten);
    tree.insert(eight);

    const root: TSMT$BTreeNode<number> | null = tree.root;

    expect(root?.id).toBe(seventeen.id);
    expect(root?.left?.id).toBe(ten.id);
    expect(root?.right?.id).toBe(twenty.id);
    expect(ten?.left?.id).toBe(eight.id);
    expect(twenty?.left?.id).toBe(eighteen.id);
    expect(twenty?.right?.id).toBe(twentyfour.id);

    expect(seventeen.balance).toBe(0);
    expect(ten.balance).toBe(-1);
    expect(twenty.balance).toBe(0);
    expect(eight.balance).toBe(0);
    expect(eighteen.balance).toBe(0);
    expect(twentyfour.balance).toBe(0);
  });

  it('multi-node test 3 (sequential inputs)' , () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const zero: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(0);
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(4.0);
    const five: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(5.0);
    const six: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(6.0);
    const seven: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(7.0);
    const eight: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(8.0);
    const nine: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(9.0);

    zero.id  = "0";
    one.id   = "1";
    two.id   = "2";
    three.id = "3";
    four.id  = "4";
    five.id  = "5";
    six.id   = "6";
    seven.id = "7";
    eight.id = "8";
    nine.id  = "9";

    tree.insert(zero);
    tree.insert(one);
    tree.insert(two);
  
    expect(tree.root?.id).toBe(one.id);
    expect(tree.size).toBe(3);

    tree.insert(three);
    let root: TSMT$BTreeNode<number> | null = tree.root;

    expect(root?.id).toBe(one.id);
    expect(root?.left?.id).toBe(zero.id);
    expect(root?.right?.id).toBe(two.id);
    expect(tree.size).toBe(4);

    tree.insert(four);
    root = tree.root;

    expect(root?.left?.id).toBe(zero.id);
    expect(root?.right?.id).toBe(three.id);
    expect(three?.left?.id).toBe(two.id);
    expect(three?.right?.id).toBe(four.id);

    tree.insert(five);
    root = tree.root
    
    expect(root?.id).toBe(three.id);
    expect(root?.left?.id).toBe(one.id);
    expect(root?.right?.id).toBe(four.id);
    expect(one?.left?.id).toBe(zero.id);
    expect(one?.right?.id).toBe(two.id);
    expect(four?.right?.id).toBe(five.id);

    expect(three.balance).toBe(0);
    expect(one.balance).toBe(0);
    expect(four.balance).toBe(1);
    expect(zero.balance).toBe(0);
    expect(two.balance).toBe(0);
    expect(five.balance).toBe(0);

    tree.insert(six);
    root = tree.root;

    expect(root?.id).toBe(three.id);
    expect(root?.left?.id).toBe(one.id);
    expect(root?.right?.id).toBe(five.id);
    expect(one?.left?.id).toBe(zero.id);
    expect(one?.right?.id).toBe(two.id);
    expect(five?.left?.id).toBe(four.id);
    expect(five?.right?.id).toBe(six.id);
    expect(tree.size).toBe(7);

    tree.insert(seven);
    root = tree.root;

    expect(root?.id).toBe(three.id);
    expect(six.right?.id).toBe(seven.id);
    expect(root?.balance).toBe(1);
    expect(six.balance).toBe(1);
    expect(five.balance).toBe(1);
    expect(one.balance).toBe(0);

    tree.insert(eight);
    root = tree.root;

    expect(root?.id).toBe(three.id);
    expect(seven.left?.id).toBe(six.id);
    expect(seven.right?.id).toBe(eight.id);
    expect(root?.balance).toBe(1);
    expect(five.balance).toBe(1);
    expect(one.balance).toBe(0);

    tree.insert(nine);
    root = tree.root;

    expect(root?.id).toBe(three.id);
    expect(root?.left?.id).toBe(one.id);
    expect(root?.right?.id).toBe(seven.id);
    expect(one?.left?.id).toBe(zero.id);
    expect(one?.right?.id).toBe(two.id);
    expect(seven?.left?.id).toBe(five.id);
    expect(seven?.right?.id).toBe(eight.id);
    expect(five?.left?.id).toBe(four.id);
    expect(five?.right?.id).toBe(six.id);
    expect(eight?.right?.id).toBe(nine.id);

    expect(root?.balance).toBe(1);
    expect(one.balance).toBe(0);
    expect(seven.balance).toBe(0);
    expect(five.balance).toBe(0);
    expect(eight.balance).toBe(1);
  });

  it('multi-node test 4 (sequential inputs)' , () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const zero: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(0);
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(4.0);
    const five: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(5.0);
    const six: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(6.0);
    const seven: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(7.0);
    const eight: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(8.0);
    const nine: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(9.0);

    zero.id  = "0";
    one.id   = "1";
    two.id   = "2";
    three.id = "3";
    four.id  = "4";
    five.id  = "5";
    six.id   = "6";
    seven.id = "7";
    eight.id = "8";
    nine.id  = "9";

    tree.insert(nine);
    tree.insert(eight);
    tree.insert(seven);
    tree.insert(six);
    tree.insert(five);
    tree.insert(four);
    tree.insert(three);
    tree.insert(two);
    tree.insert(one);
    tree.insert(zero);

    const root: TSMT$BTreeNode<number> | null = tree.root;

    expect(root?.id).toBe(six.id);
    expect(root?.left?.id).toBe(two.id);
    expect(root?.right?.id).toBe(eight.id);
    expect(two?.left?.id).toBe(one.id);
    expect(two?.right?.id).toBe(four.id);
    expect(eight?.left?.id).toBe(seven.id);
    expect(eight?.right?.id).toBe(nine.id);
    expect(four?.left?.id).toBe(three.id);
    expect(four?.right?.id).toBe(five.id);
    expect(one?.left?.id).toBe(zero.id);

    expect(root?.balance).toBe(-1);
    expect(one.balance).toBe(-1);
    expect(two.balance).toBe(0);
    expect(eight.balance).toBe(0);
    expect(four.balance).toBe(0);
  });

  it('insert by value testt #2', () => {
    const tree: TSMT$AVLTree<number> = new TSMT$AVLTree<number>();

    tree.insertByValue(3, "3");
    tree.insertByValue(20, "20");
    tree.insertByValue(17, "17");
    tree.insertByValue(4, "4");
    tree.insertByValue(1, "1");

    const root: TSMT$BTreeNode<number> | null  = tree.root;
    const left: TSMT$BTreeNode<number>  = root?.left as TSMT$BTreeNode<number>;
    const right: TSMT$BTreeNode<number> = root?.right as TSMT$BTreeNode<number>;

    expect(tree.size).toBe(5);
    expect(root?.value).toBe(17);
    expect(left.value).toBe(3);
    expect(right.value).toBe(20);
  });
});

describe('AVL Tree Min/Max/Find Tests', () => {

  it('returns null for empty tree' , () => {
    const tree: TSMT$AVLTree<number> = new TSMT$AVLTree<number>();
   
    expect(tree.size).toBe(0);
    expect(tree.getMin()).toBe(null);
    expect(tree.getMax()).toBe(null);
    expect(tree.find(1.0)).toBe(null);
  });

  it('returns correct results from 1-node tree' , () => {
    const tree: TSMT$AVLTree<number>  = new TSMT$AVLTree<number>();
    const one: TSMT$BTreeNode<number> = new TSMT$BTreeNode(1.0);
  
    one.id = "1";

    tree.insert(one);
   
    expect(tree.size).toBe(1);
    expect(tree?.getMin()?.id).toBe(one.id);
    expect(tree?.getMax()?.id).toBe(one.id);
    expect(tree?.find(1.0)?.id).toBe(one.id);
  });

  it('returns correct results from 2-node tree #1' , () => {
    const tree: TSMT$AVLTree<number>  = new TSMT$AVLTree<number>();
    const one: TSMT$BTreeNode<number> = new TSMT$BTreeNode(1.0);
    const two: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(2.0);

    one.id = "1";
    two.id = "2";

    tree.insert(one);
    tree.insert(two);

    expect(tree.size).toBe(2);
    expect(tree?.getMin()?.id).toBe(one.id);
    expect(tree?.getMax()?.id).toBe(two.id);
    expect(tree?.find(1.0)?.id).toBe(one.id);
    expect(tree?.find(2.0)?.id).toBe(two.id);
    expect(tree.find(3.0)).toBe(null);
  });

  it('returns correct results from 2-node tree #2' , () => {
    const tree: TSMT$AVLTree<number>  = new TSMT$AVLTree<number>();
    const one: TSMT$BTreeNode<number> = new TSMT$BTreeNode(1.0);
    const two: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(2.0);

    one.id = "1";
    two.id = "2";

    tree.insert(two);
    tree.insert(one);

    expect(tree.size).toBe(2);
    expect(tree?.getMin()?.id).toBe(one.id);
    expect(tree?.getMax()?.id).toBe(two.id);
    expect(tree?.find(1.0)?.id).toBe(one.id);
    expect(tree?.find(2.0)?.id).toBe(two.id);
    expect(tree?.find(3.0)).toBe(null);
  });

  it('returns correct results from 3-node tree #1' , () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode(3.0);
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);

    one.id   = "1";
    two.id   = "2";
    three.id = "3";

    tree.insert(two);
    tree.insert(one);
    tree.insert(three);

    expect(tree.size).toBe(3);
    expect(tree?.getMin()?.id).toBe(one.id);
    expect(tree?.getMax()?.id).toBe(three.id);
    expect(tree?.find(1.0)?.id).toBe(one.id);
    expect(tree?.find(2.0)?.id).toBe(two.id);
    expect(tree?.find(3.0)?.id).toBe(three.id);
    expect(tree?.find(5.0)).toBe(null);
  });

  it('returns correct results from 3-node tree #2' , () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode(3.0);
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);

    one.id   = "1";
    two.id   = "2";
    three.id = "3";

    tree.insert(three);
    tree.insert(two);
    tree.insert(one);

    expect(tree.size).toBe(3);
    expect(tree?.getMin()?.id).toBe(one.id);
    expect(tree?.getMax()?.id).toBe(three.id);
    expect(tree?.find(1.0)?.id).toBe(one.id);
    expect(tree?.find(2.0)?.id).toBe(two.id);
    expect(tree?.find(3.0)?.id).toBe(three.id);
    expect(tree?.find(5.0)).toBe(null);
  });

  it('multi-node test #1' , () => {
    const tree: TSMT$AVLTree<number>         = new TSMT$AVLTree<number>();
    const twenty: TSMT$BTreeNode<number>     = new TSMT$BTreeNode(20.0);
    const seventeen: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(17.0);
    const twentyfour: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(24.0);
    const eighteen: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(18.0);
    const ten: TSMT$BTreeNode<number>        = new TSMT$BTreeNode<number>(10.0);
    const eight: TSMT$BTreeNode<number>      = new TSMT$BTreeNode<number>(8.0);

    twenty.id     = "20";
    seventeen.id  = "17";
    twentyfour.id = "24";
    eighteen.id   = "18";
    ten.id        = "10";
    eight.id      = "8";

    tree.insert(ten);
    tree.insert(eighteen);
    tree.insert(eight);
    tree.insert(seventeen);
    tree.insert(twenty);
    tree.insert(twentyfour);

    expect(tree.size).toBe(6);
    expect(tree?.getMin()?.id).toBe(eight.id);
    expect(tree?.getMax()?.id).toBe(twentyfour.id);
    expect(tree?.find(18)?.id).toBe(eighteen.id);
    expect(tree?.find(10)?.id).toBe(ten.id);
    expect(tree?.find(17)?.id).toBe(seventeen.id);
    expect(tree?.find(5.0)).toBe(null);
  });

  it('multi-node test #2' , () => {
    const tree: TSMT$AVLTree<number>         = new TSMT$AVLTree<number>();
    const twenty: TSMT$BTreeNode<number>     = new TSMT$BTreeNode(20.0);
    const seventeen: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(17.0);
    const twentyfour: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(24.0);
    const eighteen: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(18.0);
    const ten: TSMT$BTreeNode<number>        = new TSMT$BTreeNode<number>(10.0);
    const eight: TSMT$BTreeNode<number>      = new TSMT$BTreeNode<number>(8.0);

    twenty.id     = "20";
    seventeen.id  = "17";
    twentyfour.id = "24";
    eighteen.id   = "18";
    ten.id        = "10";
    eight.id      = "8";

    tree.insert(twenty);
    tree.insert(seventeen);
    tree.insert(twentyfour);
    tree.insert(eighteen);
    tree.insert(ten);
    tree.insert(eight);

    expect(tree.size).toBe(6);
    expect(tree?.getMin()?.id).toBe(eight.id);
    expect(tree?.getMax()?.id).toBe(twentyfour.id);
    expect(tree?.find(18)?.id).toBe(eighteen.id);
    expect(tree?.find(10)?.id).toBe(ten.id);
    expect(tree?.find(17)?.id).toBe(seventeen.id);
    expect(tree?.find(5.0)).toBe(null);
  });

  it('multi-node test #3' , () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const zero: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(0);
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(4.0);
    const five: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(5.0);
    const six: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(6.0);
    const seven: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(7.0);
    const eight: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(8.0);
    const nine: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(9.0);

    zero.id  = "0";
    one.id   = "1";
    two.id   = "2";
    three.id = "3";
    four.id  = "4";
    five.id  = "5";
    six.id   = "6";
    seven.id = "7";
    eight.id = "8";
    nine.id  = "9";

    tree.insert(zero);
    tree.insert(one);
    tree.insert(two);
    tree.insert(three);
    tree.insert(four);
    tree.insert(five);
    tree.insert(six);
    tree.insert(seven);
    tree.insert(eight);
    tree.insert(nine);
   
    expect(tree.size).toBe(10);
    expect(tree?.getMin()?.id).toBe(zero.id);
    expect(tree?.getMax()?.id).toBe(nine.id);
    expect(tree?.find(8)?.id).toBe(eight.id);
    expect(tree?.find(0)?.id).toBe(zero.id);
    expect(tree?.find(7)?.id).toBe(seven.id);
    expect(tree?.find(15.0)).toBe(null);
  });

 it('multi-node test #4' , () => {
   const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
   const zero: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(0);
   const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
   const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
   const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
   const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(4.0);
   const five: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(5.0);
   const six: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(6.0);
   const seven: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(7.0);
   const eight: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(8.0);
   const nine: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(9.0);

    zero.id  = "0";
    one.id   = "1";
    two.id   = "2";
    three.id = "3";
    four.id  = "4";
    five.id  = "5";
    six.id   = "6";
    seven.id = "7";
    eight.id = "8";
    nine.id  = "9";

    tree.insert(nine);
    tree.insert(eight);
    tree.insert(seven);
    tree.insert(six);
    tree.insert(five);
    tree.insert(four);
    tree.insert(three);
    tree.insert(two);
    tree.insert(one);
    tree.insert(zero);
   
    expect(tree.size).toBe(10);
    expect(tree?.getMin()?.id).toBe(zero.id);
    expect(tree?.getMax()?.id).toBe(nine.id);
    expect(tree?.find(8)?.id).toBe(eight.id);
    expect(tree?.find(6)?.id).toBe(six.id);
    expect(tree?.find(4)?.id).toBe(four.id);
    expect(tree?.find(15.0)).toBe(null);
  });
});

describe('Inorder Traversal Tests', () => {

  const utils: TSMT$BTreeUtils<number> = new TSMT$BTreeUtils<number>();

  it('inorder returns empty path for null node', () => {
    const path: Array<TSMT$BTreeNode<number>> = utils.inorder(null);
    
    expect(path.length).toBe(0);
  });

  it('inorder returns singleton path for one-node tree node', () => {
    const node: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(1.0);
    node.id                          = "1";

    const path: Array<TSMT$BTreeNode<number>> = utils.inorder(node);

    expect(path.length).toBe(1);
    expect(path[0].id).toBe(node.id);
  });

  it('inorder two-node test #1', () => {
    const one: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(2.0);
    
    one.id = "1";
    two.id = "2";

    one.right = two;

    const path: Array<TSMT$BTreeNode<number>> = utils.inorder(one);
    
    expect(path.length).toBe(2);
    expect(path[0].id).toBe(one.id);
    expect(path[1].id).toBe(two.id);
  });

  it('inorder two-node test #2', () => {
    const one: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(2.0);
    
    one.id = "1";
    two.id = "2";

    two.left = one;

    const path: Array<TSMT$BTreeNode<number>> = utils.inorder(two);

    expect(path.length).toBe(2);
    expect(path[0].id).toBe(one.id);
    expect(path[1].id).toBe(two.id);
  });

  it('inorder three-node test', () => {
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);

    one.id   = "1";
    two.id   = "2";
    three.id = "3";

    one.left  = two;
    one.right = three;

    const path: Array<TSMT$BTreeNode<number>> = utils.inorder(one);

    expect(path.length).toBe(3);
    expect(path[0].id).toBe(two.id);
    expect(path[1].id).toBe(one.id);
    expect(path[2].id).toBe(three.id);
  });

  it('inorder multi-node test #1', () => {
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(4.0);
    const five: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(5.0);

    one.id   = "1";
    two.id   = "2";
    three.id = "3";
    four.id  = "4";
    five.id  = "5";

    four.left  = two;
    four.right = five;
    two.left   = one;
    two.right  = three;

    const path: Array<TSMT$BTreeNode<number>> = utils.inorder(four);

    expect(path.length).toBe(5);
    expect(path[0].id).toBe(one.id);
    expect(path[1].id).toBe(two.id);
    expect(path[2].id).toBe(three.id);
    expect(path[3].id).toBe(four.id);
    expect(path[4].id).toBe(five.id);
  });

  it('inorder multi-node test #2', () => {
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(4.0);
    const five: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(5.0);

    one.id   = "1";
    two.id   = "2";
    three.id = "3";
    four.id  = "4";
    five.id  = "5";

    two.left    = one;
    two.right   = three;
    three.left  = four;
    three.right = five;

    const path: Array<TSMT$BTreeNode<number>> = utils.inorder(two);

    expect(path.length).toBe(5);
    expect(path[0].id).toBe(one.id);
    expect(path[1].id).toBe(two.id);
    expect(path[2].id).toBe(four.id);
    expect(path[3].id).toBe(three.id);
    expect(path[4].id).toBe(five.id);
  });

  it('inorder multi-node test #3', () => {
    const tree: TSMT$AVLTree<number>         = new TSMT$AVLTree<number>();

    // this example taken from https://www.cs.swarthmore.edu/~newhall/unixhelp/Java_bst.pdf
    const twentyfive: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(25);
    const fifteen: TSMT$BTreeNode<number>    = new TSMT$BTreeNode<number>(15);
    const fifty: TSMT$BTreeNode<number>      = new TSMT$BTreeNode<number>(50);
    const ten: TSMT$BTreeNode<number>        = new TSMT$BTreeNode<number>(10);
    const twentytwo: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(22);
    const thirtyfive: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(35);
    const seventy: TSMT$BTreeNode<number>    = new TSMT$BTreeNode<number>(70);
    const four: TSMT$BTreeNode<number>       = new TSMT$BTreeNode<number>(4);
    const twelve: TSMT$BTreeNode<number>     = new TSMT$BTreeNode<number>(12);
    const eighteen: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(18);
    const twentyfour: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(24);
    const thirtyone: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(31);
    const fortyfour: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(44);
    const sixtysix: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(66);
    const ninety: TSMT$BTreeNode<number>     = new TSMT$BTreeNode<number>(90);

    twentyfive.id = "25";
    fifteen.id    = "15";
    fifty.id      = "50";
    ten.id        = "10";
    twentytwo.id  = "22";
    thirtyfive.id = "35";
    seventy.id    = "70";
    four.id       = "4";
    twelve.id     = "12";
    eighteen.id   = "18";
    twentyfour.id = "24";
    thirtyone.id  = "31";
    fortyfour.id  = "44";
    sixtysix.id   = "66";
    ninety.id     = "90";

    tree.insert(twentyfive);
    tree.insert(fifteen);
    tree.insert(fifty);
    tree.insert(ten);
    tree.insert(twentytwo);
    tree.insert(thirtyfive);
    tree.insert(seventy);
    tree.insert(four);
    tree.insert(twelve);
    tree.insert(eighteen);
    tree.insert(twentyfour);
    tree.insert(thirtyone);
    tree.insert(fortyfour);
    tree.insert(sixtysix);
    tree.insert(ninety);

    const root: TSMT$BTreeNode<number> | null = tree.root;
    const path: Array<TSMT$BTreeNode<number>> = utils.inorder(root as TSMT$BTreeNode<number>);

    expect(path.length).toBe(15);
    expect(path[0].id).toBe(four.id);
    expect(path[1].id).toBe(ten.id);
    expect(path[2].id).toBe(twelve.id);
    expect(path[3].id).toBe(fifteen.id);
    expect(path[4].id).toBe(eighteen.id);
    expect(path[5].id).toBe(twentytwo.id);
    expect(path[6].id).toBe(twentyfour.id);
    expect(path[7].id).toBe(twentyfive.id);
    expect(path[8].id).toBe(thirtyone.id);
    expect(path[9].id).toBe(thirtyfive.id);
    expect(path[10].id).toBe(fortyfour.id);
    expect(path[11].id).toBe(fifty.id);
    expect(path[12].id).toBe(sixtysix.id);
    expect(path[13].id).toBe(seventy.id);
    expect(path[14].id).toBe(ninety.id);
  });

  it('inorder multi-node test #4', () => {
    const tree: TSMT$AVLTree<number> = new TSMT$AVLTree<number>();

    const zero: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(0);
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(4.0);
    const five: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(5.0);
    const six: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(6.0);
    const seven: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(7.0);
    const eight: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(8.0);
    const nine: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(9.0);

    zero.id  = "0";
    one.id   = "1";
    two.id   = "2";
    three.id = "3";
    four.id  = "4";
    five.id  = "5";
    six.id   = "6";
    seven.id = "7";
    eight.id = "8";
    nine.id  = "9";

    tree.insert(nine);
    tree.insert(eight);
    tree.insert(seven);
    tree.insert(six);
    tree.insert(five);
    tree.insert(four);
    tree.insert(three);
    tree.insert(two);
    tree.insert(one);
    tree.insert(zero);

    const root: TSMT$BTreeNode<number> | null = tree.root;
    const path: Array<TSMT$BTreeNode<number>> = utils.inorder(root as TSMT$BTreeNode<number>);

    // results should be in sorted (ascending) order of value
    expect(path.length).toBe(10);

    expect(path[0].id).toBe(zero.id);
    expect(path[1].id).toBe(one.id);
    expect(path[2].id).toBe(two.id);
    expect(path[3].id).toBe(three.id);
    expect(path[4].id).toBe(four.id);
    expect(path[5].id).toBe(five.id);
    expect(path[6].id).toBe(six.id);
    expect(path[7].id).toBe(seven.id);
    expect(path[8].id).toBe(eight.id);
    expect(path[9].id).toBe(nine.id);
  });
});

describe('Preorder Traversal Tests', () => {

  const utils: TSMT$BTreeUtils<number> = new TSMT$BTreeUtils<number>();

  it('preorder returns empty path for null node', () => {
    const path: Array<TSMT$BTreeNode<number>> = utils.preorder(null);
    
    expect(path.length).toBe(0);
  });

  it('preorder returns singleton path for one-node tree node', () => {
    const node: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(1.0);
    node.id                          = "1";

    const path: Array<TSMT$BTreeNode<number>> = utils.inorder(node);

    expect(path.length).toBe(1);
    expect(path[0].id).toBe(node.id);
  });

  it('preorder two-node test #1', () => {
    const one: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(2.0);
    
    one.id = "1";
    two.id = "2";

    one.right = two;

    const path: Array<TSMT$BTreeNode<number>> = utils.preorder(one);
    
    expect(path.length).toBe(2);
    expect(path[0].id).toBe(one.id);
    expect(path[1].id).toBe(two.id);
  });

  it('preorder two-node test #2', () => {
    const one: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(2.0);
    
    one.id = "1";
    two.id = "2";

    two.left = one;

    const path: Array<TSMT$BTreeNode<number>> = utils.preorder(two);

    expect(path.length).toBe(2);
    expect(path[0].id).toBe(two.id);
    expect(path[1].id).toBe(one.id);
  });

  it('preorder three-node test', () => {
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);

    one.id   = "1";
    two.id   = "2";
    three.id = "3";

    one.left  = two;
    one.right = three;

    const path: Array<TSMT$BTreeNode<number>> = utils.preorder(one);

    expect(path.length).toBe(3);
    expect(path[0].id).toBe(one.id);
    expect(path[1].id).toBe(two.id);
    expect(path[2].id).toBe(three.id);
  });

  it('preorder multi-node test #1', () => {
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(4.0);
    const five: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(5.0);

    one.id   = "1";
    two.id   = "2";
    three.id = "3";
    four.id  = "4";
    five.id  = "5";

    four.left  = two;
    four.right = five;
    two.left   = one;
    two.right  = three;

    const path: Array<TSMT$BTreeNode<number>> = utils.preorder(four);

    expect(path.length).toBe(5);
    expect(path[0].id).toBe(four.id);
    expect(path[1].id).toBe(two.id);
    expect(path[2].id).toBe(one.id);
    expect(path[3].id).toBe(three.id);
    expect(path[4].id).toBe(five.id);
  });

  it('preorder multi-node test #2', () => {
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(4.0);
    const five: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(5.0);

    one.id   = "1";
    two.id   = "2";
    three.id = "3";
    four.id  = "4";
    five.id  = "5";

    two.left   = one;
    two.right  = four;
    four.left  = three;
    four.right = five;

    const path: Array<TSMT$BTreeNode<number>> = utils.preorder(two);

    expect(path.length).toBe(5);
    expect(path[0].id).toBe(two.id);
    expect(path[1].id).toBe(one.id);
    expect(path[2].id).toBe(four.id);
    expect(path[3].id).toBe(three.id);
    expect(path[4].id).toBe(five.id);
  });

  it('preorder multi-node test #3', () => {
    const tree: TSMT$AVLTree<number>         = new TSMT$AVLTree<number>();

    // this example taken from https://www.cs.swarthmore.edu/~newhall/unixhelp/Java_bst.pdf
    const twentyfive: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(25);
    const fifteen: TSMT$BTreeNode<number>    = new TSMT$BTreeNode<number>(15);
    const fifty: TSMT$BTreeNode<number>      = new TSMT$BTreeNode<number>(50);
    const ten: TSMT$BTreeNode<number>        = new TSMT$BTreeNode<number>(10);
    const twentytwo: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(22);
    const thirtyfive: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(35);
    const seventy: TSMT$BTreeNode<number>    = new TSMT$BTreeNode<number>(70);
    const four: TSMT$BTreeNode<number>       = new TSMT$BTreeNode<number>(4);
    const twelve: TSMT$BTreeNode<number>     = new TSMT$BTreeNode<number>(12);
    const eighteen: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(18);
    const twentyfour: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(24);
    const thirtyone: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(31);
    const fortyfour: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(44);
    const sixtysix: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(66);
    const ninety: TSMT$BTreeNode<number>     = new TSMT$BTreeNode<number>(90);

    twentyfive.id = "25";
    fifteen.id    = "15";
    fifty.id      = "50";
    ten.id        = "10";
    twentytwo.id  = "22";
    thirtyfive.id = "35";
    seventy.id    = "70";
    four.id       = "4";
    twelve.id     = "12";
    eighteen.id   = "18";
    twentyfour.id = "24";
    thirtyone.id  = "31";
    fortyfour.id  = "44";
    sixtysix.id   = "66";
    ninety.id     = "90";

    tree.insert(twentyfive);
    tree.insert(fifteen);
    tree.insert(fifty);
    tree.insert(ten);
    tree.insert(twentytwo);
    tree.insert(thirtyfive);
    tree.insert(seventy);
    tree.insert(four);
    tree.insert(twelve);
    tree.insert(eighteen);
    tree.insert(twentyfour);
    tree.insert(thirtyone);
    tree.insert(fortyfour);
    tree.insert(sixtysix);
    tree.insert(ninety);

    const root: TSMT$BTreeNode<number> | null = tree.root;
    const path: Array<TSMT$BTreeNode<number>> = utils.preorder(root);

    expect(path.length).toBe(15);
    expect(path[0].id).toBe(twentyfive.id);
    expect(path[1].id).toBe(fifteen.id);
    expect(path[2].id).toBe(ten.id);
    expect(path[3].id).toBe(four.id);
    expect(path[4].id).toBe(twelve.id);
    expect(path[5].id).toBe(twentytwo.id);
    expect(path[6].id).toBe(eighteen.id);
    expect(path[7].id).toBe(twentyfour.id);
    expect(path[8].id).toBe(fifty.id);
    expect(path[9].id).toBe(thirtyfive.id);
    expect(path[10].id).toBe(thirtyone.id);
    expect(path[11].id).toBe(fortyfour.id);
    expect(path[12].id).toBe(seventy.id);
    expect(path[13].id).toBe(sixtysix.id);
    expect(path[14].id).toBe(ninety.id);
  });

  it('preorder multi-node test #4', () => {
    const tree: TSMT$AVLTree<number> = new TSMT$AVLTree<number>();

    const zero: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(0);
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(4.0);
    const five: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(5.0);
    const six: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(6.0);
    const seven: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(7.0);
    const eight: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(8.0);
    const nine: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(9.0);

    zero.id  = "0";
    one.id   = "1";
    two.id   = "2";
    three.id = "3";
    four.id  = "4";
    five.id  = "5";
    six.id   = "6";
    seven.id = "7";
    eight.id = "8";
    nine.id  = "9";

    tree.insert(nine);
    tree.insert(eight);
    tree.insert(seven);
    tree.insert(six);
    tree.insert(five);
    tree.insert(four);
    tree.insert(three);
    tree.insert(two);
    tree.insert(one);
    tree.insert(zero);

    const root: TSMT$BTreeNode<number> | null = tree.root;
    const path: Array<TSMT$BTreeNode<number>> = utils.preorder(root as TSMT$BTreeNode<number>);

    expect(path.length).toBe(10);
    expect(path[0].id).toBe(six.id);
    expect(path[1].id).toBe(two.id);
    expect(path[2].id).toBe(one.id);
    expect(path[3].id).toBe(zero.id);
    expect(path[4].id).toBe(four.id);
    expect(path[5].id).toBe(three.id);
    expect(path[6].id).toBe(five.id);
    expect(path[7].id).toBe(eight.id);
    expect(path[8].id).toBe(seven.id);
    expect(path[9].id).toBe(nine.id);
  });
});

describe('Postorder Traversal Tests', () => {

  const utils: TSMT$BTreeUtils<number> = new TSMT$BTreeUtils<number>();

  it('postorder returns empty path for null node', () => {
    const path: Array<TSMT$BTreeNode<number>> = utils.postorder(null);
    
    expect(path.length).toBe(0);
  });

  it('postorder returns singleton path for one-node tree node', () => {
    const node: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(1.0);
    node.id                          = "1";

    const path: Array<TSMT$BTreeNode<number>> = utils.postorder(node);

    expect(path.length).toBe(1);
    expect(path[0].id).toBe(node.id);
  });

  it('postorder two-node test #1', () => {
    const one: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(2.0);
    
    one.id = "1";
    two.id = "2";

    one.right = two;

    const path: Array<TSMT$BTreeNode<number>> = utils.postorder(one);
    
    expect(path.length).toBe(2);
    expect(path[0].id).toBe(two.id);
    expect(path[1].id).toBe(one.id);
  });

  it('postorder two-node test #2', () => {
    const one: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(2.0);
    
    one.id = "1";
    two.id = "2";

    two.left = one;

    const path: Array<TSMT$BTreeNode<number>> = utils.postorder(two);

    expect(path.length).toBe(2);
    expect(path[0].id).toBe(one.id);
    expect(path[1].id).toBe(two.id);
  });

  it('postorder three-node test', () => {
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);

    one.id   = "1";
    two.id   = "2";
    three.id = "3";

    one.left  = two;
    one.right = three;

    const path: Array<TSMT$BTreeNode<number>> = utils.preorder(one);

    expect(path.length).toBe(3);
    expect(path[0].id).toBe(one.id);
    expect(path[1].id).toBe(two.id);
    expect(path[2].id).toBe(three.id);
  });

  it('postorder multi-node test #1', () => {
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(4.0);
    const five: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(5.0);

    one.id   = "1";
    two.id   = "2";
    three.id = "3";
    four.id  = "4";
    five.id  = "5";

    four.left  = two;
    four.right = five;
    two.left   = one;
    two.right  = three;

    const path: Array<TSMT$BTreeNode<number>> = utils.postorder(four);

    expect(path.length).toBe(5);
    expect(path[0].id).toBe(one.id);
    expect(path[1].id).toBe(three.id);
    expect(path[2].id).toBe(two.id);
    expect(path[3].id).toBe(five.id);
    expect(path[4].id).toBe(four.id);
  });

  it('postorder multi-node test #2', () => {
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(4.0);
    const five: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(5.0);

    one.id   = "1";
    two.id   = "2";
    three.id = "3";
    four.id  = "4";
    five.id  = "5";

    two.left   = one;
    two.right  = four;
    four.left  = three;
    four.right = five;

    const path: Array<TSMT$BTreeNode<number>> = utils.postorder(two);

    expect(path.length).toBe(5);
    expect(path[0].id).toBe(one.id);
    expect(path[1].id).toBe(three.id);
    expect(path[2].id).toBe(five.id);
    expect(path[3].id).toBe(four.id);
    expect(path[4].id).toBe(two.id);
  });

  it('postorder multi-node test #3', () => {
    const tree: TSMT$AVLTree<number>         = new TSMT$AVLTree<number>();

    // this example taken from https://www.cs.swarthmore.edu/~newhall/unixhelp/Java_bst.pdf
    const twentyfive: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(25);
    const fifteen: TSMT$BTreeNode<number>    = new TSMT$BTreeNode<number>(15);
    const fifty: TSMT$BTreeNode<number>      = new TSMT$BTreeNode<number>(50);
    const ten: TSMT$BTreeNode<number>        = new TSMT$BTreeNode<number>(10);
    const twentytwo: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(22);
    const thirtyfive: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(35);
    const seventy: TSMT$BTreeNode<number>    = new TSMT$BTreeNode<number>(70);
    const four: TSMT$BTreeNode<number>       = new TSMT$BTreeNode<number>(4);
    const twelve: TSMT$BTreeNode<number>     = new TSMT$BTreeNode<number>(12);
    const eighteen: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(18);
    const twentyfour: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(24);
    const thirtyone: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(31);
    const fortyfour: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(44);
    const sixtysix: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(66);
    const ninety: TSMT$BTreeNode<number>     = new TSMT$BTreeNode<number>(90);

    twentyfive.id = "25";
    fifteen.id    = "15";
    fifty.id      = "50";
    ten.id        = "10";
    twentytwo.id  = "22";
    thirtyfive.id = "35";
    seventy.id    = "70";
    four.id       = "4";
    twelve.id     = "12";
    eighteen.id   = "18";
    twentyfour.id = "24";
    thirtyone.id  = "31";
    fortyfour.id  = "44";
    sixtysix.id   = "66";
    ninety.id     = "90";

    tree.insert(twentyfive);
    tree.insert(fifteen);
    tree.insert(fifty);
    tree.insert(ten);
    tree.insert(twentytwo);
    tree.insert(thirtyfive);
    tree.insert(seventy);
    tree.insert(four);
    tree.insert(twelve);
    tree.insert(eighteen);
    tree.insert(twentyfour);
    tree.insert(thirtyone);
    tree.insert(fortyfour);
    tree.insert(sixtysix);
    tree.insert(ninety);

    const root: TSMT$BTreeNode<number> | null = tree.root;
    const path: Array<TSMT$BTreeNode<number>> = utils.postorder(root);

    expect(path.length).toBe(15);
    expect(path[0].id).toBe(four.id);
    expect(path[1].id).toBe(twelve.id);
    expect(path[2].id).toBe(ten.id);
    expect(path[3].id).toBe(eighteen.id);
    expect(path[4].id).toBe(twentyfour.id);
    expect(path[5].id).toBe(twentytwo.id);
    expect(path[6].id).toBe(fifteen.id);
    expect(path[7].id).toBe(thirtyone.id);
    expect(path[8].id).toBe(fortyfour.id);
    expect(path[9].id).toBe(thirtyfive.id);
    expect(path[10].id).toBe(sixtysix.id);
    expect(path[11].id).toBe(ninety.id);
    expect(path[12].id).toBe(seventy.id);
    expect(path[13].id).toBe(fifty.id);
    expect(path[14].id).toBe(twentyfive.id);
  });

  it('postorder multi-node test #4', () => {
    const tree: TSMT$AVLTree<number> = new TSMT$AVLTree<number>();

    const zero: TSMT$BTreeNode<number>  = new TSMT$BTreeNode(0);
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(4.0);
    const five: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(5.0);
    const six: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(6.0);
    const seven: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(7.0);
    const eight: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(8.0);
    const nine: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(9.0);

    zero.id  = "0";
    one.id   = "1";
    two.id   = "2";
    three.id = "3";
    four.id  = "4";
    five.id  = "5";
    six.id   = "6";
    seven.id = "7";
    eight.id = "8";
    nine.id  = "9";

    tree.insert(nine);
    tree.insert(eight);
    tree.insert(seven);
    tree.insert(six);
    tree.insert(five);
    tree.insert(four);
    tree.insert(three);
    tree.insert(two);
    tree.insert(one);
    tree.insert(zero);

    const root: TSMT$BTreeNode<number> | null = tree.root;
    const path: Array<TSMT$BTreeNode<number>> = utils.postorder(root);

    expect(path.length).toBe(10);
    expect(path[0].id).toBe(zero.id);
    expect(path[1].id).toBe(one.id);
    expect(path[2].id).toBe(three.id);
    expect(path[3].id).toBe(five.id);
    expect(path[4].id).toBe(four.id);
    expect(path[5].id).toBe(two.id);
    expect(path[6].id).toBe(seven.id);
    expect(path[7].id).toBe(nine.id);
    expect(path[8].id).toBe(eight.id);
    expect(path[9].id).toBe(six.id);
  });
});

describe('TSMT$AVLTree<T> Clear/FromArray Tests', () => {

  it('fromArray does nothing on empty or null array', () => {
    const tree: TSMT$AVLTree<number> = new TSMT$AVLTree<number>();

    tree.fromArray([]);

    expect(tree.size).toBe(0);
    expect(tree.root).toBe(null);
  });

  it('multi-node insert/clear/fromArray test #1', () => {
    const tree: TSMT$AVLTree<number> = new TSMT$AVLTree<number>();

    const seven: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(7.0);
    const eight: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(8.0);
    const nine: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(9.0);

    seven.id = "7";
    eight.id = "8";
    nine.id  = "9";

    tree.insert(nine);
    tree.insert(eight);
    tree.insert(seven);
  
    expect(tree.size).toBe(3);
    expect(tree.root?.id).toBe(eight.id);

    tree.clear();
    expect(tree.size).toBe(0);
    expect(tree.root).toBe(null);

    tree.fromArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    const root: TSMT$BTreeNode<number> | null = tree.root;

    expect(root?.value).toBe(3);
    expect(root?.left?.value).toBe(1);
    expect(root?.right?.value).toBe(7);
  });

  it('multi-node insert/clear/fromArray test #2', () => {
    const tree: TSMT$AVLTree<number> = new TSMT$AVLTree<number>();

    const seven: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(7.0);
    const eight: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(8.0);
    const nine: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(9.0);

    seven.id = "7";
    eight.id = "8";
    nine.id  = "9";

    tree.insert(nine);
    tree.insert(eight);
    tree.insert(seven);
  
    expect(tree.size).toBe(3);
    expect(tree?.root?.id).toBe(eight.id);

    tree.clear();
    expect(tree.size).toBe(0);
    expect(tree.root).toBe(null);

    tree.fromArray([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);

    const root: TSMT$BTreeNode<number> | null = tree.root;

    expect(root?.value).toBe(6);
    expect(root?.left?.value).toBe(2);
    expect(root?.right?.value).toBe(8);
  });
});

describe('TSMT$AVLTree<T> Delete Tests', () => {

  it('delete takes no action on empty tree', () => {
    const tree: TSMT$AVLTree<number>   = new TSMT$AVLTree<number>();
    const node: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(1.0);
    
    tree.delete(node);

    expect(tree.size).toBe(0);
    expect(tree.root).toBe(null);
  });

  it('delete takes no action on null input node', () => {
    const tree: TSMT$AVLTree<number>   = new TSMT$AVLTree<number>();
    const node: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(1.0);
    
    node.id = "1";

    tree.insert(node)
    tree.delete(null);

    expect(tree.size).toBe(1);
    expect(tree.root?.id).toBe(node.id);
  });

  it('correctly deletes node from singleton tree', () => {
    const tree: TSMT$AVLTree<number>   = new TSMT$AVLTree<number>();
    const node: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(1.0);
    
    node.id = "1";

    tree.insert(node)
    tree.delete(node);

    expect(tree.size).toBe(0);
    expect(tree.root).toBe(null);
  });

  // noew the fun begins ...
  it('2-node tree test #1', () => {
    const tree: TSMT$AVLTree<number>   = new TSMT$AVLTree<number>();
    const one: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(2.0);
    
    one.id = "1";
    two.id = "2";

    tree.insert(one);
    tree.insert(two);

    tree.delete(two);

    expect(tree.size).toBe(1);
    expect(tree.root?.id).toBe(one.id);
  });

  it('2-node tree test #2', () => {
    const tree: TSMT$AVLTree<number>   = new TSMT$AVLTree<number>();
    const one: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(2.0);
    
    one.id = "1";
    two.id = "2";

    tree.insert(one)
    tree.insert(two);

    tree.delete(one);

    expect(tree.size).toBe(1);
    expect(tree.root?.id).toBe(two.id);
    expect(tree.root?.hasLeft).toBe(false);
    expect(tree.root?.hasRight).toBe(false);
  });

  it('2-node tree test #3', () => {
    const tree: TSMT$AVLTree<number>  = new TSMT$AVLTree<number>();
    const one: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(2.0);
    
    two.id = "2";
    one.id = "1";

    tree.insert(two)
    tree.insert(one);

    tree.delete(two);

    expect(tree.size).toBe(1);
    expect(tree.root?.id).toBe(one.id);
    expect(tree.root?.hasLeft).toBe(false);
    expect(tree.root?.hasRight).toBe(false);
  });

  it('3-node tree test #1', () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    
    two.id   = "2";
    one.id   = "1";
    three.id = "3";

    tree.insert(two)
    tree.insert(one);
    tree.insert(three);

    tree.delete(one);

    const root: TSMT$BTreeNode<number> | null = tree.root;

    expect(tree.size).toBe(2);
    expect(root?.id).toBe(two.id);
    expect(root?.right?.id).toBe(three.id);
    expect(root?.hasLeft).toBe(false);
  });

  it('3-node tree test #2', () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    
    two.id   = "2";
    one.id   = "1";
    three.id = "3";

    tree.insert(two)
    tree.insert(one);
    tree.insert(three);

    tree.delete(three);

    const root: TSMT$BTreeNode<number> | null = tree.root;

    expect(tree.size).toBe(2);
    expect(root?.id).toBe(two.id);
    expect(root?.left?.id).toBe(one.id);
    expect(root?.hasRight).toBe(false);
  });

  it('3-node tree test #3', () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    
    two.id   = "2";
    one.id   = "1";
    three.id = "3";

    tree.insert(two)
    tree.insert(one);
    tree.insert(three);

    tree.delete(two);

    const root: TSMT$BTreeNode<number> | null = tree.root;

    expect(tree.size).toBe(2);
    expect(root?.id).toBe(three.id);
    expect(root?.left?.id).toBe(one.id);
    expect(root?.hasRight).toBe(false);
  });

  it('multi-node tree test #1', () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(4.0);
    
    two.id   = "2";
    one.id   = "1";
    three.id = "3";
    four.id  = "4";

    tree.insert(two)
    tree.insert(one);
    tree.insert(four);
    tree.insert(three);
    
    tree.delete(three);

    const root: TSMT$BTreeNode<number> | null = tree.root;

    expect(tree.size).toBe(3);
    expect(root?.id).toBe(two.id);
    expect(root?.right?.id).toBe(four.id);
    expect(four.hasRight).toBe(false);
    expect(four.hasLeft).toBe(false);
  });

  it('multi-node tree test #2', () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(4.0);
    
    two.id   = "2";
    one.id   = "1";
    three.id = "3";
    four.id  = "4";

    tree.insert(two)
    tree.insert(one);
    tree.insert(four);
    tree.insert(three);
    
    tree.delete(one);

    const root: TSMT$BTreeNode<number> | null = tree.root;

    expect(tree.size).toBe(3);
    expect(root?.id).toBe(three.id);
    expect(root?.right?.id).toBe(four.id);
    expect(root?.left?.id).toBe(two.id);
    expect(four.hasRight).toBe(false);
    expect(four.hasLeft).toBe(false);
    expect(two.hasLeft).toBe(false);
    expect(two.hasRight).toBe(false);
  });

  it('multi-node tree test #3', () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(4.0);
    
    two.id   = "2";
    one.id   = "1";
    three.id = "3";
    four.id  = "4";

    tree.insert(two)
    tree.insert(one);
    tree.insert(four);
    tree.insert(three);
    
    tree.delete(four);

    const root: TSMT$BTreeNode<number> | null = tree.root;

    // we should not do this, but can get away with it for such a tiny tree - traverse the tree 
    // directly post-delete (do not rely on other node references remaining valid)
    expect(tree.size).toBe(3);
    expect(root?.id).toBe(two.id);
    expect(root?.right?.id).toBe(three.id);
    expect(root?.left?.id).toBe(one.id);
    expect(three.hasRight).toBe(false);
    expect(three.hasLeft).toBe(false);
    expect(one.hasLeft).toBe(false);
    expect(one.hasRight).toBe(false);
  });

  it('multi-node tree test #4', () => {
    const tree: TSMT$AVLTree<number>    = new TSMT$AVLTree<number>();
    const one: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(1.0);
    const two: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(2.0);
    const three: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(3.0);
    const four: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(4.0);
    
    two.id   = "2";
    one.id   = "1";
    three.id = "3";
    four.id  = "4";

    tree.insert(two)
    tree.insert(one);
    tree.insert(four);
    tree.insert(three);
    
    tree.delete(two);

    const root: TSMT$BTreeNode<number> | null = tree.root;

    expect(tree.size).toBe(3);
    expect(root?.id).toBe(three.id);
    expect(root?.right?.id).toBe(four.id);
    expect(root?.left?.id).toBe(one.id);
    expect(four.hasRight).toBe(false);
    expect(four.hasLeft).toBe(false);
    expect(one.hasLeft).toBe(false);
    expect(one.hasRight).toBe(false);

    expect(three.balance).toBe(0);
    expect(one.balance).toBe(0);
    expect(four.balance).toBe(0);
  });

  it('multi-node tree test #5', () => {
    const tree: TSMT$AVLTree<number>         = new TSMT$AVLTree<number>();
    const ten: TSMT$BTreeNode<number>        = new TSMT$BTreeNode<number>(10.0);
    const eight: TSMT$BTreeNode<number>      = new TSMT$BTreeNode<number>(8.0);
    const eighteen: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(18.0);
    const seventeen: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(17.0);
    const twenty: TSMT$BTreeNode<number>     = new TSMT$BTreeNode<number>(20.0);
    const twentyfour: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(24.0);
    
    ten.id        = "10";
    eight.id      = "8";
    eighteen.id   = "18";
    seventeen.id  = "17";
    twenty.id     = "20";
    twentyfour.id = "24";

    tree.insert(ten)
    tree.insert(eight);
    tree.insert(eighteen);
    tree.insert(seventeen);
    tree.insert(twenty);
    tree.insert(twentyfour);
    
    tree.delete(ten);

    const root: TSMT$BTreeNode<number> | null = tree.root;

    expect(tree.size).toBe(5);
    expect(root?.id).toBe(eighteen.id);
    expect(root?.left?.id).toBe("17");
    expect(root?.right?.id).toBe("20");

    // traverse the tree to obtain node information; do not use prior references
    const left: TSMT$BTreeNode<number>  = root?.left as TSMT$BTreeNode<number>;
    const right: TSMT$BTreeNode<number> = root?.right as TSMT$BTreeNode<number>;

    expect(left.id).toBe("17");
    expect(left.value).toBe(17);
    expect(left.left?.id).toBe("8");
    expect(left.right).toBe(null);

    expect(root?.balance).toBe(0);
    expect(left.balance).toBe(-1);
    expect(right.balance).toBe(1);
    expect(left.left?.balance).toBe(0);
    expect(right.right?.balance).toBe(0);
  });

  it('multi-node tree test #6', () => {
    const tree: TSMT$AVLTree<number>         = new TSMT$AVLTree<number>();
    const ten: TSMT$BTreeNode<number>        = new TSMT$BTreeNode<number>(10.0);
    const eight: TSMT$BTreeNode<number>      = new TSMT$BTreeNode<number>(8.0);
    const eighteen: TSMT$BTreeNode<number>   = new TSMT$BTreeNode<number>(18.0);
    const seventeen: TSMT$BTreeNode<number>  = new TSMT$BTreeNode<number>(17.0);
    const fifteen: TSMT$BTreeNode<number>    = new TSMT$BTreeNode<number>(15.0);
    const twenty: TSMT$BTreeNode<number>     = new TSMT$BTreeNode<number>(20.0);
    const twentyfour: TSMT$BTreeNode<number> = new TSMT$BTreeNode<number>(24.0);
    
    ten.id        = "10";
    eight.id      = "8";
    eighteen.id   = "18";
    seventeen.id  = "17";
    fifteen.id    = "15";
    twenty.id     = "20";
    twentyfour.id = "24";

    tree.insert(ten)
    tree.insert(eight);
    tree.insert(eighteen);
    tree.insert(seventeen);
    tree.insert(twenty);
    tree.insert(twentyfour);
    tree.insert(fifteen);
    
    tree.delete(ten);

    const root: TSMT$BTreeNode<number> | null = tree.root;
    let left: TSMT$BTreeNode<number>   | null = root?.left as TSMT$BTreeNode<number>;
    let right: TSMT$BTreeNode<number>  | null = root?.right as TSMT$BTreeNode<number>;

    expect(tree.size).toBe(6);

    expect(root?.id).toBe(eighteen.id);
    expect(left.id).toBe("15");
    expect(left.value).toBe(15);
    expect(right.id).toBe("20");

    // traverse the tree to obtain node information; do not use prior references
    right = left.right;
    left  = left.left;

    expect(left?.id).toBe("8");
    expect(left?.value).toBe(8);
    expect(right?.id).toBe("17");
    expect(right?.value).toBe(17);
    expect(root?.right?.right?.id).toBe("24");

    expect(root?.balance).toBe(0);
    expect(root?.left?.balance).toBe(0);
    expect(root?.right?.balance).toBe(1);
  });

  it('multi-node tree test #7', () => {
    const tree: TSMT$AVLTree<number> = new TSMT$AVLTree<number>();

    tree.fromArray([10, 8, 18, 17, 20, 24, 15]);

    let node: TSMT$BTreeNode<number> | null = tree.find(10); 
    expect(node?.id).toBe("0");
    expect(node?.value).toBe(10);

    tree.delete(node as TSMT$BTreeNode<number>);

    node = tree.find(20);
    tree.delete(node as TSMT$BTreeNode<number>);

    const root: TSMT$BTreeNode<number>  | null = tree.root;
    const left: TSMT$BTreeNode<number>  | null = root?.left as TSMT$BTreeNode<number>;
    const right: TSMT$BTreeNode<number> | null = root?.right as TSMT$BTreeNode<number>;

    expect(tree.size).toBe(5);
    expect(root?.value).toBe(18);
    expect(left.value).toBe(15);
    expect(right.value).toBe(24);
    expect(left?.left?.value).toBe(8);
    expect(left?.right?.value).toBe(17);

    expect(root?.balance).toBe(-1);
    expect(left.balance).toBe(0);
    expect(right.balance).toBe(0);
  });

  it('multi-node tree test #8', () => {
    const tree: TSMT$AVLTree<number> = new TSMT$AVLTree<number>();

    tree.fromArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
 
    let root: TSMT$BTreeNode<number>  | null = tree.root;
    let left: TSMT$BTreeNode<number>  | null = root?.left as TSMT$BTreeNode<number>;
    let right: TSMT$BTreeNode<number> | null = root?.right as TSMT$BTreeNode<number>;

    expect(root?.value).toBe(3);
    expect(left.value).toBe(1);
    expect(right.value).toBe(7);
    expect(tree.size).toBe(10);
 
    // delete nodes in order of increasing value
    let node: TSMT$BTreeNode<number> | null = tree.find(0);
    tree.delete(node as TSMT$BTreeNode<number>);

    root  = tree.root;
    left  = root?.left as TSMT$BTreeNode<number>;
    right = root?.right as TSMT$BTreeNode<number>;

    expect(tree.size).toBe(9);
    expect(root?.value).toBe(3);
    expect(left.value).toBe(1);
    expect(right.value).toBe(7);
    expect(left.hasLeft).toBe(false);
    expect(left.right?.value).toBe(2);

    expect(root?.balance).toBe(1);
    expect(left.balance).toBe(1);
    expect(right.balance).toBe(0);
    expect(right.right?.balance).toBe(1); 

    node = tree.find(1);
    tree.delete(node as TSMT$BTreeNode<number>);

    root  = tree.root;
    left  = root?.left as TSMT$BTreeNode<number>;
    right = root?.right as TSMT$BTreeNode<number>;

    expect(tree.size).toBe(8);
    expect(root?.value).toBe(7);
    expect(left.value).toBe(3);
    expect(right.value).toBe(8);
    expect(left.left?.value).toBe(2);
    expect(left.right?.value).toBe(5);
    expect(right.right?.value).toBe(9);

    expect(root?.balance).toBe(-1);
    expect(left.balance).toBe(1);
    expect(right.balance).toBe(1);
    expect(left.left?.balance).toBe(0);
    expect(left.right?.balance).toBe(0);
    expect(right.right?.balance).toBe(0);

    node = tree.find(2);
    tree.delete(node as TSMT$BTreeNode<number>);

    root  = tree.root;
    left  = root?.left as TSMT$BTreeNode<number>;
    right = root?.right as TSMT$BTreeNode<number>;

    expect(tree.size).toBe(7);
    expect(root?.value).toBe(7);
    expect(left.value).toBe(5);
    expect(right.value).toBe(8);
    expect(left.left?.value).toBe(3);
    expect(left.right?.value).toBe(6);
    expect(right.right?.value).toBe(9);
    expect(left.left?.right?.value).toBe(4);
    expect(left.left?.hasLeft).toBe(false);

    expect(root?.balance).toBe(-1);
    expect(left.balance).toBe(-1);
    expect(right.balance).toBe(1);
    expect(left.left?.balance).toBe(1);
    expect(left.right?.balance).toBe(0);
    expect(right.right?.balance).toBe(0);

    node = tree.find(3);
    tree.delete(node as TSMT$BTreeNode<number>);

    root  = tree.root;
    left  = root?.left as TSMT$BTreeNode<number>;
    right = root?.right as TSMT$BTreeNode<number>;

    expect(tree.size).toBe(6);
    expect(root?.value).toBe(7);
    expect(left.value).toBe(5);
    expect(right.value).toBe(8);
    expect(left.left?.value).toBe(4);
    expect(left.right?.value).toBe(6);
    expect(right.right?.value).toBe(9);

    expect(root?.balance).toBe(0);
    expect(left.balance).toBe(0);
    expect(right.balance).toBe(1);
    expect(left.left?.balance).toBe(0);
    expect(left.right?.balance).toBe(0);
    expect(right.right?.balance).toBe(0);

    node = tree.find(4);
    tree.delete(node as TSMT$BTreeNode<number>);

    root  = tree.root;
    left  = root?.left as TSMT$BTreeNode<number>;
    right = root?.right as TSMT$BTreeNode<number>;

    expect(tree.size).toBe(5);
    expect(root?.value).toBe(7);
    expect(left.value).toBe(5);
    expect(right.value).toBe(8);
    expect(left.hasLeft).toBe(false);
    expect(left.right?.value).toBe(6);
    expect(right.hasLeft).toBe(false);
    expect(right.right?.value).toBe(9);

    expect(root?.balance).toBe(0);
    expect(left.balance).toBe(1);
    expect(right.balance).toBe(1);
    expect(left.right?.balance).toBe(0);
    expect(right.right?.balance).toBe(0);

    node = tree.find(5);
    tree.delete(node as TSMT$BTreeNode<number>);

    root  = tree.root;
    left  = root?.left as TSMT$BTreeNode<number>;
    right = root?.right as TSMT$BTreeNode<number>;

    expect(tree.size).toBe(4);
    expect(root?.value).toBe(7);
    expect(left.value).toBe(6);
    expect(right.value).toBe(8);
    expect(left.hasLeft).toBe(false);
    expect(left.hasRight).toBe(false);
    expect(right.hasLeft).toBe(false);
    expect(right.right?.value).toBe(9);

    expect(root?.balance).toBe(1);
    expect(left.balance).toBe(0);
    expect(right.balance).toBe(1);
    expect(right.right?.balance).toBe(0);

    node = tree.find(6);
    tree.delete(node as TSMT$BTreeNode<number>);

    root  = tree.root;
    left  = root?.left as TSMT$BTreeNode<number>;
    right = root?.right as TSMT$BTreeNode<number>;

    expect(tree.size).toBe(3);
    expect(root?.value).toBe(8);
    expect(left.value).toBe(7);
    expect(right.value).toBe(9);
    expect(left.hasLeft).toBe(false);
    expect(left.hasRight).toBe(false);
    expect(right.hasLeft).toBe(false);
    expect(right.hasRight).toBe(false);

    expect(root?.balance).toBe(0);
    expect(left.balance).toBe(0);
    expect(right.balance).toBe(0);

    // continuing only duplicates prior 3-node tests
  });

 it('multi-node tree test #9', () => {
   const tree: TSMT$AVLTree<number> = new TSMT$AVLTree<number>();

    tree.fromArray([9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
 
    let root: TSMT$BTreeNode<number>  | null = tree.root;
    let left: TSMT$BTreeNode<number>  | null = root?.left as TSMT$BTreeNode<number>;
    let right: TSMT$BTreeNode<number> | null = root?.right as TSMT$BTreeNode<number>;

    expect(root?.value).toBe(6);
    expect(left?.value).toBe(2);
    expect(right?.value).toBe(8);
    expect(tree.size).toBe(10);

    // remove nodes in decreasing order
    let node: TSMT$BTreeNode<number> | null = tree.find(9);
    tree.delete(node as TSMT$BTreeNode<number>);

    root  = tree.root;
    left  = root?.left as TSMT$BTreeNode<number>;
    right = root?.right as TSMT$BTreeNode<number>;

    expect(tree.size).toBe(9);
    expect(root?.value).toBe(6);
    expect(left.value).toBe(2);
    expect(right.value).toBe(8);
    expect(right.left?.value).toBe(7);
    expect(right.hasRight).toBe(false);

    expect(root?.balance).toBe(-1);
    expect(left.balance).toBe(0);
    expect(right.balance).toBe(-1);

    node = tree.find(8);
    tree.delete(node as TSMT$BTreeNode<number>);

    root  = tree.root;
    left  = root?.left as TSMT$BTreeNode<number>;
    right = root?.right as TSMT$BTreeNode<number>;

    expect(tree.size).toBe(8);
    expect(root?.value).toBe(2);
    expect(left.value).toBe(1);
    expect(right.value).toBe(6);
    expect(left.left?.value).toBe(0);
    expect(right.left?.value).toBe(4);
    expect(right.right?.value).toBe(7);
    expect(right.left?.left?.value).toBe(3);
    expect(right.left?.right?.value).toBe(5);
    expect(right.right?.hasLeft).toBe(false);
    expect(right.right?.hasRight).toBe(false);

    expect(root?.balance).toBe(1);
    expect(left.balance).toBe(-1);
    expect(right.balance).toBe(-1);
    expect(right.left?.balance).toBe(0);

    node = tree.find(7);
    tree.delete(node as TSMT$BTreeNode<number>);

    root  = tree.root;
    left  = root?.left as TSMT$BTreeNode<number>;
    right = root?.right as TSMT$BTreeNode<number>;

    expect(tree.size).toBe(7)
    expect(root?.value).toBe(2);
    expect(left.value).toBe(1);
    expect(right.value).toBe(4);

    expect(right.left?.value).toBe(3);
    expect(right.right?.value).toBe(6);
    expect(right.right?.hasLeft).toBe(true);
    expect(right.right?.hasRight).toBe(false);
    expect(right.right?.left?.value).toBe(5);

    expect(root?.balance).toBe(1);
    expect(left.balance).toBe(-1);
    expect(right.balance).toBe(1);
    expect(right.left?.balance).toBe(0);
    expect(right.right?.balance).toBe(-1);
    expect(right.right?.left?.balance).toBe(0);

    node = tree.find(6);
    tree.delete(node as TSMT$BTreeNode<number>);

    root  = tree.root;
    left  = root?.left as TSMT$BTreeNode<number>;
    right = root?.right as TSMT$BTreeNode<number>;

    expect(tree.size).toBe(6);
    expect(root?.value).toBe(2);
    expect(left.value).toBe(1);
    expect(right.value).toBe(4);
    expect(right.left?.value).toBe(3);
    expect(right.right?.value).toBe(5);
    expect(right.right?.hasLeft).toBe(false);
    expect(right.right?.hasRight).toBe(false);

    expect(root?.balance).toBe(0);
    expect(left.balance).toBe(-1);
    expect(right.balance).toBe(0);

    node = tree.find(5);
    tree.delete(node as TSMT$BTreeNode<number>);

    root  = tree.root;
    left  = root?.left as TSMT$BTreeNode<number>;
    right = root?.right as TSMT$BTreeNode<number>;

    expect(tree.size).toBe(5);
    expect(root?.value).toBe(2);
    expect(left?.value).toBe(1);
    expect(right?.value).toBe(4);
    expect(right?.left?.value).toBe(3);
    expect(right?.hasRight).toBe(false);

    expect(root?.balance).toBe(0);
    expect(left?.balance).toBe(-1);
    expect(right?.balance).toBe(-1);

    node = tree.find(4);
    tree.delete(node as TSMT$BTreeNode<number>);

    root  = tree.root;
    left  = root?.left as TSMT$BTreeNode<number>;
    right = root?.right as TSMT$BTreeNode<number>;

    expect(tree.size).toBe(4);
    expect(root?.value).toBe(2);
    expect(left.value).toBe(1);
    expect(right.value).toBe(3);

    expect(left.value).toBe(1);
    expect(right.hasLeft).toBe(false);
    expect(right.hasRight).toBe(false);

    node = tree.find(3);
    tree.delete(node as TSMT$BTreeNode<number>);

    root  = tree.root;
    left  = root?.left as TSMT$BTreeNode<number>;
    right = root?.right as TSMT$BTreeNode<number>;

    expect(tree.size).toBe(3);
    expect(root?.value).toBe(1);
    expect(left.value).toBe(0);
    expect(right.value).toBe(2);
    expect(left.hasLeft).toBe(false);
    expect(left.hasRight).toBe(false);
    expect(right.hasLeft).toBe(false);
    expect(right.hasRight).toBe(false);

    // remainder of process duplicates prior 3-node tests
 });

 it('delete by value test', () => {
    const tree: TSMT$AVLTree<number> = new TSMT$AVLTree<number>();

    tree.fromArray([10, 8, 18, 17, 20, 24, 15]);

    const node: TSMT$BTreeNode<number> | null = tree.find(10); 
    expect(node?.id).toBe("0");
    expect(node?.value).toBe(10);

    tree.deleteByValue(10);
    tree.deleteByValue(20);

    const root: TSMT$BTreeNode<number>  | null = tree.root;
    const left: TSMT$BTreeNode<number>  | null = root?.left as TSMT$BTreeNode<number>;
    const right: TSMT$BTreeNode<number> | null = root?.right as TSMT$BTreeNode<number>;

    expect(tree.size).toBe(5);
    expect(root?.value).toBe(18);
    expect(left.value).toBe(15);
    expect(right.value).toBe(24);
    expect(left.left?.value).toBe(8);
    expect(left.right?.value).toBe(17);

    expect(root?.balance).toBe(-1);
    expect(left.balance).toBe(0);
    expect(right.balance).toBe(0);
  });
});