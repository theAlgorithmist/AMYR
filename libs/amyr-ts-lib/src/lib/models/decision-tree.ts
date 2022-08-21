/** Copyright 2021 Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
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
 * Decision Node Model
 */
export interface DecisionNode
{
  id?: string;                      // optional id for this node - highly recommended

  priority: number;                 // priority in interval [1, 2, ...] with 1 being highest priority

  expression: string;               // TSMT$ExpressionEngine-compatible expression

  action?: string;                  // named action (required for leaf nodes)

  children?: Array<DecisionNode>;  // child nodes of this node
}

/**
 * Enumeration of possible decision-tree actions
 */
export enum DECISION_TREE_ACTIONS
{
  NO_ACTION      = '[Action] NONE',
  PROCEED        = '[Action] PROCEED',
  BLOCKED        = '[Action] BLOCKED',
  PARSE_ERROR    = '[Error] PARSE',
  NOT_BOOLEAN    = '[Error] NOT_BOOLEAN',
  NO_NODE_ACTION = '[Error] NO_NODE_ACTION',
  INVALID_NODE   = '[Error] INVALID_NODE',
  NO_PATH        = '[Error] NO_PATH'
}
