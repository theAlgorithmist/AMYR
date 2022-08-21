/**
 * Copyright 2016 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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

/**
 * AMYR Library Decision Tree.  Each node represents an expression that is evaluated against the properties
 * of an Object.  Leaf nodes contain named actions.  Node expressions are based on allowable expressions in the
 * Typescript Math Toolkit expression engine, with the exception that expressions <b>must</b> evaluation to a
 * boolean.  Operands may still be {boolean}, {number}, or {string}.
 *
 * Nodes at a given level should be defined in order of highest priority to lowest priority (highest priority is 1
 * and lower priorities increase in value).  Priority order is likely to be used in the future and is only relevant
 * on a level basis, i.e. as a means to optionally order node evaluations in a given level.  In the current
 * implementation, nodes should be placed in the data object in order of decreasing priority as evaluations are
 * performed left-to-right at each level.
 *
 * Currently, the tree is created from an object (JSON).  After creation, call the evaluate() method with an Object
 * whose keys match the independent variables in the node expressions.  A named action from a leaf node is returned or
 * indication is provided that an error occurred or no action is possible.
 *
 * It is not necessary to associate an expression with the root node.  If blank, this means that the tree may be
 * fully evaluated for every call to evaluate().  A 'guard' expression may be placed on the root node.  If this
 * expression is false, the remainder of the tree is ignored and the return indicates that the guard expression
 * failed.  This feature provides an easy means to support conditional evaluation of a tree.
 * <br/>
 * Tree nodes follow the model provided by {IDecisionNode}. While a 'priority' variable is provided in the model,
 * is is not currently used.  Nodes should be defined in priority order (high-to-low) in JSON data.
 * <br/>
 * The result of tree definition or evaluation is an instance of {IDecisionTreeAction}.  This action indicates
 * success or failure of the operation.  In the case of success, the 'action' property is the named action to perform
 * based on the evaluation.  In the case of failure, the action is one of the following symbolic constants
 * from the {DecisionTree} class and the 'node' property contains a reference to the offending node.
 * <br/>
 *
 * NO_ACTION (no action can be taken - usually from failure to init tree or provide data)
 * PROCEED (tree definition successful; may proceed with evaluation)
 * BLOCKED (tree evaluation blocked because guard expression on root node failed);
 * PARSE_ERROR (error during expression parsing)
 * NOT_BOOLEAN (expression evaluations to non-boolean type)
 * NO_NODE_ACTION (action is missing from a leaf node)
 * INVALID_NODE (node data is invalid)
 * NO_PATH (no valid path during evaluation, i.e. no path leads to a sequence of true evaluations that terminates
 * in a leaf node with a named action)
 *
 * Refer to the specs for this class for usage examples.
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

// expression engine imports
import {
  expressionOperand,
  expressionValue,
  ExpressionEngine
} from "../../expression-engine/expression-engine";

// general tree
import { TSMT$Tree } from "../../tsmt/datastructures/tree";

import {
  TSMT$TreeNode,
  TSMT$ITreeList
} from "../../tsmt/datastructures/tree-node";

import { DecisionNode       } from "../../../models/decision-tree";
import { DecisionTreeAction } from "@algorithmist/amyr-ts-lib";

import { extractVariables } from "./extract-variables";

import { DECISION_TREE_ACTIONS } from "../../../models/decision-tree";

export const CHAR_EXP = /^[A-Za-z]+$/;

export class DecisionTree
{
  protected _tree: TSMT$Tree<DecisionNode>;  // reference to general tree with DecisionNode nodes

  protected _id = 0;                         // internal id for auto-generation of node id

  protected _expEngine: ExpressionEngine;    // internal reference to expression engine

  constructor()
  {
    this._tree         = new TSMT$Tree<DecisionNode>();
    this._tree.ordered = false;

    this._expEngine = new ExpressionEngine();
  }

  /**
   * Access the number of decision nodes in this tree
   */
  public get nodes(): number
  {
    return this._tree.size;
  }

  /**
   * Access the number of levels in this decision tree
   */
  public get levels(): number
  {
    return this._tree.levels;
  }

  /**
   * Flatten the tree.  Returns {Array<TSMT$TreeNode<DecisionNode>>} or a level-order traversal of the tree
   */
  public flatten(): Array< TSMT$TreeNode<DecisionNode> >
  {
    return this._tree.levelOrder();
  }

  /**
   * Create the tree from an {object} (JSON data)
   *
   * @param {object} data TODO - need formal model for tree data
   */
  public fromJson(data: object): DecisionTreeAction
  {
    // edge cases
    if (!data)
    {
      return {
        success: false,
        action: DECISION_TREE_ACTIONS.INVALID_NODE
      };
    }

    const keys: Array<string> = Object.keys(data);

    // at a minimum, a node should have priority and expression properties
    if (keys.length < 2)
    {
      return {
        success: false,
        action: DECISION_TREE_ACTIONS.INVALID_NODE,
        node: data
      };
    }

    // new data overwrites existing tree
    if (this._tree.size > 0) this.clear();

    // set tree root and then recursively process remaining data into tree
    const node: DecisionNode = <DecisionNode> data;
    if (this.__isValidNode(node))
    {
      node.id = this.__getId(node);
      const root: TSMT$TreeNode<DecisionNode> = this._tree.setRoot(node.id, node) as TSMT$TreeNode<DecisionNode>;

      if (node['children'] !== undefined && node['children'] instanceof Array)
      {
        // recursively build remainder of tree
        return this.__toTree(<Array<DecisionNode>> node['children'], root);
      }
      else
      {
        // just one node ... okay if that's what you want ...
        return {
          success: true,
          action: DECISION_TREE_ACTIONS.PROCEED
        };
      }
    }
    else
    {
      // bad node
      return {
        success: false,
        action: DECISION_TREE_ACTIONS.INVALID_NODE,
        node: node
      };
    }
  }

  protected __getId(node: DecisionNode): string
  {
    return node.id ? node.id : (++this._id).toString();
  }

  protected __isValidNode(node: DecisionNode): boolean
  {
    // minimal required properties
    return node['priority'] !== undefined && node['expression'] !== undefined;
  }

  protected __toTree(data: Array<DecisionNode>, root: TSMT$TreeNode<DecisionNode>): DecisionTreeAction
  {
    // this is the fun part ...
    const len: number = data.length;
    let i: number;
    let res: DecisionNode;
    let node: DecisionNode;

    for (i = 0; i < len; ++i)
    {
      res = data[i];

      // is this a minimum viable node?
      if (this.__isValidNode(res))
      {
        node = res as DecisionNode;

        // insert as a child into the supplied parent
        node.id = this.__getId(res as DecisionNode);

        const inserted: TSMT$TreeNode<DecisionNode> = this._tree.insert(node.id, node, root) as TSMT$TreeNode<DecisionNode>;

        if (node.children !== undefined && node.children != null && Array.isArray(node.children))
        {
          // node has children, so continue processing into the tree
          this.__toTree(node.children, inserted);
        }
        else if (node.action === undefined || typeof node.action !== 'string')
        {
          // if there are no children, then this must be a leaf node, in which case an 'action' property must exist
          return {
            success: false,
            action: DECISION_TREE_ACTIONS.NO_NODE_ACTION,
            node: node
          };
        }
      }
      else
      {
        return {
          success: false,
          action: DECISION_TREE_ACTIONS.INVALID_NODE,
          node: res
        };
      }
    }

    return {
      success: true,
      action: DECISION_TREE_ACTIONS.PROCEED
    }
  }

  /**
   * Evaluate the decision tree with the supplied data
   *
   * @param {[key:string]: any} data All independent variables across all node expressions should be keys of this
   * parameter.  Property values are the actual values used to evaluate each node expression.
   */
  public evaluate(data: { [key:string]: any }): DecisionTreeAction
  {
    if (!data || this._tree.size === 0)
    {
      return {
        success: false,
        action: DECISION_TREE_ACTIONS.NO_ACTION
      }
    }

    // begin with the root node; it is not necessary for the root node to have an expression - this is allowed
    // to serve as a 'guard' so that the tree logic is executed only if some initial condition is met.
    const root: TSMT$TreeNode<DecisionNode> = this._tree.root as TSMT$TreeNode<DecisionNode>;

    if (root.data.expression === '')
    {
      // handle edge case; this should never happen, but just in case ...
      if (this._tree.size === 1)
      {
        // no action is possible since there is only a single node
        return {
          success: false,
          action: DECISION_TREE_ACTIONS.NO_ACTION
        }
      }
      else
      {
        // no guard, so evaluate remainder of tree
        return this.__evaluateTree(root.head, data);
      }
    }

    // extract the independent variables from the guard expression
    const vars: Array<string> = extractVariables(root.data.expression);
    this._expEngine.variables = vars;

    // extract the variable values from the data object
    const values: Array<expressionOperand> = this.__extractVariableValues(data, vars);

    // parse expression
    const parsed: boolean = this._expEngine.parse(root.data.expression);
    if (!parsed)
    {
      // bad news
      return {
        success: false,
        action: DECISION_TREE_ACTIONS.PARSE_ERROR,
        node: root.data
      }
    }

    // evaluate the guard expression
    const result: expressionValue = this._expEngine.evaluate(values);

    if (typeof result === 'boolean')
    {
      if (result)
      {
        // check if the guard is used for a single node - again, an extremely unlikely case, but possible
        if (this._tree.size === 1) {
          return {
            success: true,
            action: DECISION_TREE_ACTIONS.PROCEED
          }
        }
        else
        {
          // guard passes, evaluate remainder of tree
          return this.__evaluateTree(root.head, data);
        }
      }
      else
      {
        // guard fails, further evaluation is blocked
        return {
          success: false,
          action: DECISION_TREE_ACTIONS.BLOCKED
        }
      }
    }
    else
    {
      // another bad expression
      return {
        success: false,
        action: DECISION_TREE_ACTIONS.NOT_BOOLEAN,
        node: root.data
      }
    }
  }

  /**
   * Evaluate the tree starting at the specified child node list and process expressions until a leaf is found
   *
   * @param {TSMT$ITreeList<DecisionNode>} list Child list
   *
   * @param {[key:string]: any } data Object properties for keys corresponding to independent expression variables provide the
   * actual values used in evaluating expressions at each node
   *
   * @private
   */
  protected __evaluateTree(list: TSMT$ITreeList<DecisionNode>, data: { [key:string]: any }): DecisionTreeAction
  {
    let node: TSMT$TreeNode<DecisionNode> | null = list.node;
    let expression: string;

    while (node != null)
    {
      expression = node.data.expression;

      // are we at a leaf node?
      const action: string = node?.data.action as string;
      if (expression === '' && action !== undefined)
      {
        return {
          success: true,
          action: node.data.action as string
        }
      }

      const vars: Array<string> = extractVariables(expression);
      this._expEngine.variables = vars;

      // extract the variable values from the data object
      const values: Array<expressionOperand> = this.__extractVariableValues(data, vars);

      const parsed: boolean = this._expEngine.parse(expression);
      if (!parsed)
      {
        // homey don't play that ...
        return {
          success: false,
          action: DECISION_TREE_ACTIONS.PARSE_ERROR,
          node: node.data
        }
      }

      // evaluate the current expression
      const result: expressionValue = this._expEngine.evaluate(values);

      if (typeof result === 'boolean')
      {
        if (result)
        {
          // expression yields true, so evaluate remainder of tree - false means we go onto the next node at this level
          return this.__evaluateTree(node.head, data);
        }
      }
      else
      {
        // bad expression; should always return a boolean until leaf node, which is the action
        return {
          success: false,
          action: DECISION_TREE_ACTIONS.NOT_BOOLEAN,
          node: node.data
        }
      }

      list = list.next as TSMT$ITreeList<DecisionNode>;
      node = list ? list.node : null;
    }

    // if we get here, then an entire level was processed without finding a true expression, so the evaluation fails
    return {
      success: false,
      action: DECISION_TREE_ACTIONS.NO_PATH
    }
  }

  /**
   * Extract actual values of independent variables from the supplied input or insert {NaN} if the variable value
   * does not exist in the input collection of key/value pairs.
   *
   * @param {[key:string]: any} data Input data
   *
   * @param {Array<string>} vars Independent variable names
   *
   * @private
   */
  protected __extractVariableValues(data: { [key: string]: any }, vars: Array<string>): Array<expressionOperand>
  {
    const variables: Array<expressionOperand> = new Array<expressionOperand>();

    const n: number = vars.length;
    let i: number;
    let prop: string;
    let value: expressionOperand;

    for (i = 0; i < n; ++i)
    {
      prop  = vars[i];
      value = data[prop] !== undefined ? data[prop] as expressionOperand : NaN;

      variables.push(value);
    }

    return variables;
  }

  /**
   * Clear this decision tree and prepare for new data
   */
  public clear(): void
  {
    this._tree.clear();

    this._id = 0;
  }
}
