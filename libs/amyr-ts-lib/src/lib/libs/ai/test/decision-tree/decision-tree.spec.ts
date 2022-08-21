/** Copyright 2016 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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

// Decision Tree Specs
import { DecisionNode,
  DECISION_TREE_ACTIONS
} from "../../../../models/decision-tree";

import { DecisionTreeAction } from "../../../../models/decision-tree-action";
import { DecisionTree       } from "../../decision-tree/decision-tree";
import { extractVariables   } from "../../decision-tree/extract-variables";
import { TSMT$TreeNode      } from "../../../../libs/tsmt/datastructures/tree-node";

// Test Suites
describe('extractVariables function', () => {

  const tmp: any = null;

  it('returns empty array for null data', () => {
    const result: Array<string> = extractVariables(tmp);

    expect(result.length).toBe(0);
  });

  it('blank input returns empty array', () => {
    const result: Array<string> = extractVariables('');

    expect(result.length).toBe(0);
  });

  it('singleton returns one-element array that mirrors input', () => {
    const result: Array<string> = extractVariables('A');

    expect(result.length).toBe(1);
    expect(result[0]).toBe('A');
  });

  it('one-variable expression returns correct result', () => {
    const result: Array<string> = extractVariables('x + 1 > 0');

    expect(result.length).toBe(1);
    expect(result[0]).toBe('x');
  });

  it('two-variable expression returns correct result', () => {
    const result: Array<string> = extractVariables('x || y');

    expect(result.length).toBe(2);
    expect(result[0]).toBe('x');
    expect(result[1]).toBe('y');
  });

  it('one-variable expression w/operator returns correct result #1', () => {
    const result: Array<string> = extractVariables('2.5*x + 1 > 0');

    expect(result.length).toBe(1);
    expect(result[0]).toBe('x');
  });

  it('one-variable expression w/operator returns correct result #2', () => {
    const result: Array<string> = extractVariables('-x + 4 > 0');

    expect(result.length).toBe(1);
    expect(result[0]).toBe('x');
  });


  it('one-variable expression w/operator returns correct result #3', () => {
    const result: Array<string> = extractVariables('x/2 + 4 > 0');

    expect(result.length).toBe(1);
    expect(result[0]).toBe('x');
  });

  it('one-variable expression w/operator returns correct result #4', () => {
    const result: Array<string> = extractVariables('x^3 + 4 > 0');

    expect(result.length).toBe(1);
    expect(result[0]).toBe('x');
  });

  it('two-variable expression w/operator returns correct result', () => {
    const result: Array<string> = extractVariables('!x || y');

    expect(result.length).toBe(2);
    expect(result[0]).toBe('x');
    expect(result[1]).toBe('y');
  });

  it('one-variable expression w/parens returns correct result #1', () => {
    const result: Array<string> = extractVariables('(3*x + 2) > 0');

    expect(result.length).toBe(1);
    expect(result[0]).toBe('x');
  });

  it('one-variable expression w/parens returns correct result #2', () => {
    const result: Array<string> = extractVariables('(2.5 + x) == 3');

    expect(result.length).toBe(1);
    expect(result[0]).toBe('x');
  });

  it('one-variable expression w/parens returns correct result #3', () => {
    const result: Array<string> = extractVariables('(2.5 + 3*x) > 10');

    expect(result.length).toBe(1);
    expect(result[0]).toBe('x');
  });

  it('one-variable complex expression returns correct result', () => {
    const result: Array<string> = extractVariables('x^2 - 3*x + 2 > 0');

    expect(result.length).toBe(1);
    expect(result[0]).toBe('x');
  });

  it('two-variable complex expression returns correct result #1', () => {
    const result: Array<string> = extractVariables("-3*x + y/2");

    expect(result.length).toBe(2);
    expect(result[0]).toBe('x');
    expect(result[1]).toBe('y');
  });

  it('two-variable complex expression returns correct result #2', () => {
    const result: Array<string> = extractVariables("(2*x + 1) - (3*y - 2)");

    expect(result.length).toBe(2);
    expect(result[0]).toBe('x');
    expect(result[1]).toBe('y');
  });

  it('two-variable complex expression returns correct result #3', () => {
    const result: Array<string> = extractVariables("(2*x) = (3*y - 2)");

    expect(result.length).toBe(2);
    expect(result[0]).toBe('x');
    expect(result[1]).toBe('y');
  });
});

describe('Decision Tree', () => {

  it('properly constructs a new Decision Tree', () =>
  {
    const tree: DecisionTree = new DecisionTree();

    expect(tree.nodes).toBe(0);
    expect(tree.levels).toBe(0);
    expect(tree.flatten.length).toBe(0);
  });

  it('empty tree results in no action', () =>
  {
    const tree: DecisionTree = new DecisionTree();

    const action: DecisionTreeAction = tree.evaluate({value: 0});

    expect(action.action).toBe(DECISION_TREE_ACTIONS.NO_ACTION);
  });

  it('null data Object returns false success code in fromJson()', () =>
  {
    const tmp: any = null;

    const tree: DecisionTree          = new DecisionTree();
    const result: DecisionTreeAction = tree.fromJson(tmp);

    expect(result.success).toBe(false);
  });

  it('empty data Object returns false success code in fromJson()', () =>
  {
    const tree: DecisionTree          = new DecisionTree();
    const result: DecisionTreeAction = tree.fromJson({});

    expect(result.success).toBe(false);
  });

  it('too many root nodes returns false success code in fromJson()', () =>
  {
    const tree: DecisionTree          = new DecisionTree();
    const result: DecisionTreeAction = tree.fromJson({val1: 'a', val2: 'b'});

    expect(result.success).toBe(false);
    expect(result.node).toBeTruthy();
  });

  it('incorrect data returns false success code in fromJson()', () =>
  {
    const tree: DecisionTree          = new DecisionTree();
    const result: DecisionTreeAction = tree.fromJson({id: '0'});

    expect(result.success).toBe(false);
    expect(result.node).toBeTruthy();
  });

  it('singleton node results in one-node tree in fromJson()', () =>
  {
    const tree: DecisionTree          = new DecisionTree();
    const result: DecisionTreeAction = tree.fromJson({id: '0', priority: 1, expression: 'x + 1 > 0'});

    expect(result.success).toBe(true);
    expect(tree.nodes).toBe(1);
  });

  it('two-node test produces proper hierarchy', () =>
  {
    const tree: DecisionTree          = new DecisionTree();
    const result: DecisionTreeAction = tree.fromJson({id: '0', priority: 1, expression: 'x + 1 > 0',
      children: [{id: '1', priority: 2, expression: '', action: 'Action1'}]});

    expect(result.success).toBe(true);
    expect(tree.nodes).toBe(2);

    const arr: Array<TSMT$TreeNode<DecisionNode>> = tree.flatten();
    expect(arr[0].id).toBe('0');
    expect(arr[1].id).toBe('1');
  });

  it('leaf node without action generates false success code', () =>
  {
    const tree: DecisionTree          = new DecisionTree();
    const result: DecisionTreeAction = tree.fromJson({id: '0', priority: 1, expression: 'x + 1 > 0',
      children: [{id: '1', priority: 2, expression: ''}]});

    expect(result.success).toBe(false);
  });

  it('three-node test produces proper hierarchy', () =>
  {
    const tree: DecisionTree          = new DecisionTree();
    const result: DecisionTreeAction = tree.fromJson({id: '0', priority: 1, expression: 'x + 1 > 0',
      children: [{id: '1', priority: 2, expression: '', action: 'Action1'},
                 {id: '2', priority: 3, expression: '', action: 'Action2'}
      ]});

    expect(result.success).toBe(true);
    expect(tree.nodes).toBe(3);

    const arr: Array<TSMT$TreeNode<DecisionNode>> = tree.flatten();
    expect(arr[0].id).toBe('0');
    expect(arr[1].id).toBe('1');
    expect(arr[2].id).toBe('2');
  });

  it('evaluate() handles no expression on root node', () =>
  {
    const tree: DecisionTree          = new DecisionTree();
    const result: DecisionTreeAction = tree.fromJson( {id: '0', priority: 1, expression: ''} );

    expect(result.success).toBe(true);

    const action: DecisionTreeAction = tree.evaluate({x: 2});

    expect(action.action).toBe(DECISION_TREE_ACTIONS.NO_ACTION);
  });

  it('evaluate() handles a guard expression on root node', () =>
  {
    const tree: DecisionTree          = new DecisionTree();
    const result: DecisionTreeAction = tree.fromJson( {id: '0', priority: 1, expression: 'x > 0'} );

    expect(result.success).toBe(true);

    const action: DecisionTreeAction = tree.evaluate({x: 2});

    expect(action.action).toBe(DECISION_TREE_ACTIONS.PROCEED);
  });

  it('multi-level test #1', () =>
  {
    const tree: DecisionTree          = new DecisionTree();
    const result: DecisionTreeAction = tree.fromJson(
      {
        id: '0', priority: 1, expression: '',
        children: [
          {
            id: '1', priority: 1, expression: 'x < 0',
            children: [
              {id: '4', priority: 1, expression: '', action: 'A1'}
            ]
          },
          {
            id: '2', priority: 2, expression: 'x = 0',
            children: [
              {id: '5', priority: 2, expression: '', action: 'A2'}
            ]
          },
          {
            id: '3', priority: 3, expression: 'x > 0',
            children: [
              {id: '6', priority: 3, expression: '', action: 'A3'}
            ]
          }
        ]
      });

    expect(result.success).toBe(true);
    expect(tree.nodes).toBe(7);

    const arr: Array< TSMT$TreeNode<DecisionNode> > = tree.flatten();
    expect(arr[0].id).toBe('0');
    expect(arr[1].id).toBe('1');
    expect(arr[2].id).toBe('2');
    expect(arr[3].id).toBe('3');
    expect(arr[4].id).toBe('4');
    expect(arr[5].id).toBe('5');
    expect(arr[6].id).toBe('6');

    let action: DecisionTreeAction = tree.evaluate({x: -2});
    expect(action.action).toBe('A1');

    action = tree.evaluate({x: 0});
    expect(action.action).toBe('A2');

    action = tree.evaluate({x: 5});
    expect(action.action).toBe('A3');
  });

  it('multi-level test #1 (no possible action)', () =>
  {
    const tree: DecisionTree          = new DecisionTree();
    const result: DecisionTreeAction = tree.fromJson(
      {
        id: '0', priority: 1, expression: '',
        children: [
          {
            id: '1', priority: 1, expression: 'x < 0',
            children: [
              {id: '4', priority: 1, expression: '', action: 'A1'}
            ]
          },
          {
            id: '2', priority: 2, expression: 'x = 0',
            children: [
              {id: '5', priority: 2, expression: '', action: 'A2'}
            ]
          },
          {
            id: '3', priority: 3, expression: 'x < 5',
            children: [
              {id: '6', priority: 3, expression: '', action: 'A3'}
            ]
          }
        ]
      });

    expect(result.success).toBe(true);
    expect(tree.nodes).toBe(7);

    const action: DecisionTreeAction = tree.evaluate({x: 15});
    expect(action.success).toBe(false);
    expect(action.action).toBe(DECISION_TREE_ACTIONS.NO_PATH);
  });

  it('multi-level test #2 (multi-variable)', () =>
  {
    const tree: DecisionTree          = new DecisionTree();
    const result: DecisionTreeAction = tree.fromJson(
      {
        id: '0', priority: 1, expression: '(x >= lower) && (x <= upper)',  // guard expression
        children: [
          {
            id: '1', priority: 1, expression: 'x < 0',
            children: [
              {id: '4', priority: 1, expression: '', action: 'A1'}
            ]
          },
          {
            id: '2', priority: 2, expression: 'x = 0',
            children: [
              {
                id: '5', priority: 2, expression: 'y < 0',
                children: [
                  {id: '8', priority: 1, expression: '', action: 'A2-1'}
                ]
              },
              {
                id: '6', priority: 3, expression: 'y > 0',
                children: [
                  {id: '9', priority: 1, expression: '', action: 'A2-2'}
                ]
              }
            ]
          },
          {
            id: '3', priority: 3, expression: 'x > 0',
            children: [
              {id: '7', priority: 3, expression: '', action: 'A3'}
            ]
          }
        ]
      });

    expect(result.success).toBe(true);
    expect(tree.nodes).toBe(10);

    const arr: Array< TSMT$TreeNode<DecisionNode> > = tree.flatten();
    expect(arr[0].id).toBe('0');
    expect(arr[1].id).toBe('1');
    expect(arr[2].id).toBe('2');
    expect(arr[3].id).toBe('3');
    expect(arr[4].id).toBe('4');
    expect(arr[5].id).toBe('5');
    expect(arr[6].id).toBe('6');
    expect(arr[7].id).toBe('7');
    expect(arr[8].id).toBe('8');
    expect(arr[9].id).toBe('9');

    // test the root guard
    let action: DecisionTreeAction = tree.evaluate({lower: -10, upper: 10, x: -20, y: 4});
    expect(action.action).toBe(DECISION_TREE_ACTIONS.BLOCKED);

    action = tree.evaluate({lower: -10, upper: 10, x: -2, y: 4})
    expect(action.action).toBe('A1');

    action = tree.evaluate({lower: -10, upper: 10, x: 5, y: 4});
    expect(action.action).toBe('A3');

    action = tree.evaluate({lower: -10, upper: 10, x: 0, y: -1});
    expect(action.action).toBe('A2-1');

    action = tree.evaluate({lower: -10, upper: 10, x: 0, y: 1});
    expect(action.action).toBe('A2-2');
  });
});
