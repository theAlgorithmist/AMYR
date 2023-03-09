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

// Specs for AMYR Library Item allocation

// test functions/classes
import { AllocatableItem } from '../allocatable-item';
import { ItemAllocation  } from '../item-allocation';
import { Knapsack        } from '../knapsack';

// Test Suites
describe('Allocatable Item Tests', () => {

  const value1: any    = "abc";
  const value2: any    = null;
  const value3         = -1;

  it('properly constructs a new item', () => {
    const item: AllocatableItem = new AllocatableItem();

    expect(item).toBeTruthy();
    expect(item.capacity).toBe(0);
    expect(item.payoff).toBe(0);
    expect(item.capacityRisk).toBe(0);
    expect(item.payoffRisk).toBe(0);
  });

  it('item payoff mutator properly rejects invalid values', () => {
    const item: AllocatableItem = new AllocatableItem();

    item.payoff = value1;
    expect(item.payoff).toBe(0);

    item.payoff = value2;
    expect(item.payoff).toBe(0);

    item.payoff = value3;
    expect(item.payoff).toBe(0);
  });

  it('item capacity mutator properly rejects invalid values', () => {
    const item: AllocatableItem = new AllocatableItem();

    item.capacity = value1;
    expect(item.payoff).toBe(0);

    item.capacity = value2;
    expect(item.payoff).toBe(0);

    item.capacity = value3;
    expect(item.payoff).toBe(0);
  });

  it('item payoff mutator properly accepts valid values', () => {
    const item: AllocatableItem = new AllocatableItem();

    item.payoff = 1.0;
    expect(item.payoff).toBe(1.0);

    item.payoff = 0;
    expect(item.payoff).toBe(0);
  });

  it('properly clones an Alllocatable Item', () => {
    const item: AllocatableItem = new AllocatableItem();

    item.capacity     = 3.0;
    item.payoff       = 100.0;
    item.capacityRisk = 1.0;
    item.payoffRisk   = 1.0;

    const item2: AllocatableItem = item.clone();

    expect(item.capacity).toBe(item2.capacity);
    expect(item.payoff).toBe(item2.payoff);
    expect(item.capacityRisk).toBe(item2.capacityRisk);
    expect(item.payoffRisk).toBe(item2.payoffRisk);
  });

});

describe('Item Allocation Environment Tests', () => {

  const value1: any = "abc";
  const value2: any = null;
  const value3      = -1;

  it('properly constructs a new item allocation environment', () => {
    const allocation: ItemAllocation = new ItemAllocation();

    expect(allocation).toBeTruthy();
    expect(allocation.capacity).toBe(0);
    expect(allocation.solutionCapacity).toBe(0);
    expect(allocation.payoff).toBe(0);
    expect(allocation.itemCount).toBe(0);
  });

  it('properly clears an environment', () => {
    const allocation: ItemAllocation = new ItemAllocation();

    allocation.capacity = 10;
    allocation.clear();

    expect(allocation.capacity).toBe(0);
    expect(allocation.solutionCapacity).toBe(0);
    expect(allocation.payoff).toBe(0);
    expect(allocation.itemCount).toBe(0);
  });

  it('capacity mutator properly rejects invalid values', () => {
    const allocation: ItemAllocation = new ItemAllocation();

    allocation.capacity = value1;
    expect(allocation.payoff).toBe(0);

    allocation.capacity = value2;
    expect(allocation.payoff).toBe(0);

    allocation.capacity = value3;
    expect(allocation.payoff).toBe(0);
  });

  it('adds items to the environment and returns correct count', () => {
    const allocation: ItemAllocation = new ItemAllocation();
    const item1: AllocatableItem     = new AllocatableItem();
    const item2: AllocatableItem     = new AllocatableItem();
    const item3: AllocatableItem     = new AllocatableItem();

    allocation.addItem(item1);
    allocation.addItem(item2);
    allocation.addItem(item3);

    expect(allocation.itemCount).toBe(3);
  });

  it('returns correct count after removing an item', () => {
    const allocation: ItemAllocation = new ItemAllocation();
    const item1: AllocatableItem     = new AllocatableItem();
    const item2: AllocatableItem     = new AllocatableItem();
    const item3: AllocatableItem     = new AllocatableItem();

    allocation.addItem(item1);
    allocation.addItem(item2);
    allocation.addItem(item3);

    allocation.removeItem(item2);

    expect(allocation.itemCount).toBe(2);
  });

  it('returns correct count after too many remove calls', () => {
    const allocation: ItemAllocation = new ItemAllocation();
    const item1: AllocatableItem     = new AllocatableItem();
    const item2: AllocatableItem     = new AllocatableItem();

    allocation.addItem(item1);
    allocation.addItem(item2);

    allocation.removeItem(item1);
    allocation.removeItem(item2);
    allocation.removeItem(item1);

    expect(allocation.itemCount).toBe(0);
  });

  it('preserves item count after attempt to remove item not in environment', () => {
    const allocation: ItemAllocation = new ItemAllocation();
    const item1: AllocatableItem     = new AllocatableItem();
    const item2: AllocatableItem     = new AllocatableItem();
    const item3: AllocatableItem     = new AllocatableItem();

    allocation.addItem(item1);
    allocation.addItem(item2);

    allocation.removeItem(item3);

    expect(allocation.itemCount).toBe(2);
  });

  it('returns empty array from item allocation with no items in environment', () => {
    const allocation: ItemAllocation = new ItemAllocation();

    const optimal: Array<AllocatableItem> = allocation.allocate();

    expect(optimal.length).toBe(0);
  });

  it('returns correct allocation with only one Item and full allowable capacity', () => {
    const allocation: ItemAllocation = new ItemAllocation();
    const item1: AllocatableItem     = new AllocatableItem();

    item1.name     = "item1";
    item1.capacity = 5;

    allocation.capacity = 10;   // entire environment capacity can be filled with the single item

    allocation.addItem(item1);

    const optimal: Array<AllocatableItem> = allocation.allocate();  // note that capacity of the environment defaults to zero which means no allocation possible

    expect(optimal.length).toBe(1);

    const item: AllocatableItem = optimal[0];
    expect(item === item1).toBe(true);
  });

  it('returns correct allocation with one Item and partial allowable capacity', () => {
    const allocation: ItemAllocation = new ItemAllocation();
    const item1: AllocatableItem     = new AllocatableItem();

    item1.name     = "item1";
    item1.capacity = 5;
    item1.payoff   = 100;

    allocation.capacity = 2.5;   // entire environment capacity is filled with half of the single Item

    allocation.addItem(item1);

    const optimal: Array<AllocatableItem> = allocation.allocate();  // note that capacity of the environment defaults to zero which means no allocation possible

    expect(optimal.length).toBe(1);
    expect(allocation.payoff).toBe(50);

    const item: AllocatableItem = optimal[0];
    expect(item === item1).toBe(true);
    expect(item.solutionCapacity).toBe(2.5);
    expect(item.solutionValue).toBe(50);
  });

  it('returns correct allocation with two Items and full allowable capacity', () => {
    const allocation: ItemAllocation = new ItemAllocation();
    const item1: AllocatableItem     = new AllocatableItem();
    const item2: AllocatableItem     = new AllocatableItem();

    item1.name     = "item1";
    item1.capacity = 5;
    item1.payoff   = 100;

    item2.name     = "item2";
    item2.capacity = 8;
    item2.payoff   = 150;

    allocation.capacity = 20;   // both items do not consume full capacity of the environment

    allocation.addItem(item1);
    allocation.addItem(item2);

    const optimal: Array<AllocatableItem> = allocation.allocate();  // note that capacity of the environment defaults to zero which means no allocation possible

    expect(optimal.length).toBe(2);
    expect(allocation.payoff).toBe(250);  // environment can accommodate entire capacity of both items

    const solution1: AllocatableItem = optimal[0];
    expect(solution1 === item1).toBe(true);

    const solution2: AllocatableItem = optimal[1];
    expect(solution2 === item2).toBe(true);
  });

  // now the fun begins ...
  it('returns correct allocation with two Items and only partial environment capacity #1', () => {
    const allocation: ItemAllocation = new ItemAllocation();
    const item1: AllocatableItem     = new AllocatableItem();
    const item2: AllocatableItem     = new AllocatableItem();

    item1.name     = "item1";
    item1.capacity = 5;
    item1.payoff   = 100;

    item2.name     = "item2";
    item2.capacity = 8;
    item2.payoff   = 150;

    // only part of item 1 may be consumed
    allocation.capacity = 4;

    allocation.addItem(item1);
    allocation.addItem(item2);

    const optimal: Array<AllocatableItem> = allocation.allocate();

    expect(optimal.length).toBe(1);
    expect(allocation.payoff).toBe(80);

    const solution1: AllocatableItem = optimal[0];
    expect(solution1 === item1).toBe(true);
    expect(solution1.solutionValue).toBe(80);
    expect(solution1.solutionCapacity).toBe(4);
  });

  it('returns correct allocation with two Items and only partial environment capacity #2', () => {
    const allocation: ItemAllocation = new ItemAllocation();
    const item1: AllocatableItem     = new AllocatableItem();
    const item2: AllocatableItem     = new AllocatableItem();

    item1.name     = "item1";
    item1.capacity = 5;
    item1.payoff   = 100;

    item2.name     = "item2";
    item2.capacity = 8;
    item2.payoff   = 150;

    // may consume all of item 1 and 3 parts of item 2
    allocation.capacity = 8;

    allocation.addItem(item1);
    allocation.addItem(item2);

    const optimal: Array<AllocatableItem> = allocation.allocate();

    expect(optimal.length).toBe(2);
    expect(allocation.payoff).toBe(156.25);

    const solution1: AllocatableItem = optimal[0];
    expect(solution1 === item1).toBe(true);
    expect(solution1.solutionValue).toBe(100);
    expect(solution1.solutionCapacity).toBe(5);

    const solution2: AllocatableItem = optimal[1];
    expect(solution2 === item2).toBe(true);
    expect(solution2.solutionValue).toBe(56.25);
    expect(solution2.solutionCapacity).toBe(3);
  });

  it('returns correct allocation with two Items and only partial environment capacity #3', () => {
    const allocation: ItemAllocation = new ItemAllocation();
    const item1: AllocatableItem     = new AllocatableItem();
    const item2: AllocatableItem     = new AllocatableItem();

    // same as last test, but reverse the item properties
    item1.name     = "item1";
    item1.capacity = 8;
    item1.payoff   = 150;

    item2.name     = "item2";
    item2.capacity = 5;
    item2.payoff   = 100;

    allocation.capacity = 8;

    allocation.addItem(item1);
    allocation.addItem(item2);

    const optimal: Array<AllocatableItem> = allocation.allocate();

    expect(optimal.length).toBe(2);
    expect(allocation.payoff).toBe(156.25);

    const solution1: AllocatableItem = optimal[0];
    expect(solution1 === item2).toBe(true);
    expect(solution1.solutionValue).toBe(100);
    expect(solution1.solutionCapacity).toBe(5);

    const solution2: AllocatableItem = optimal[1];
    expect(solution2 === item1).toBe(true);
    expect(solution2.solutionValue).toBe(56.25);
    expect(solution2.solutionCapacity).toBe(3);
  });

  it('returns correct allocation with arbitrary number of Items and specified capacity', () => {
    const allocation: ItemAllocation = new ItemAllocation();
    const item1: AllocatableItem     = new AllocatableItem();
    const item2: AllocatableItem     = new AllocatableItem();
    const item3: AllocatableItem     = new AllocatableItem();
    const item4: AllocatableItem     = new AllocatableItem();
    const item5: AllocatableItem     = new AllocatableItem();
    const item6: AllocatableItem     = new AllocatableItem();
    const item7: AllocatableItem     = new AllocatableItem();
    const item8: AllocatableItem     = new AllocatableItem();

    item1.name     = "item1";
    item1.capacity = 8.5;
    item1.payoff   = 20;

    item2.name     = "item2";
    item2.capacity = 5.0;
    item2.payoff   = 10;

    item3.name     = "item3";
    item3.capacity = 1.25;
    item3.payoff   = 40;

    item4.name     = "item4";
    item4.capacity = 4.0;
    item4.payoff   = 12;

    item5.name     = "item5";
    item5.capacity = 6.5;
    item5.payoff   = 26;

    item6.name     = "item6";
    item6.capacity = 15.0;
    item6.payoff   = 20;

    item7.name     = "item7";
    item7.capacity = 3.0;
    item7.payoff   = 14;

    item8.name     = "item8";
    item8.capacity = 1.0;
    item8.payoff   = 2;

    allocation.capacity = 30;

    allocation.addItem(item1);
    allocation.addItem(item2);
    allocation.addItem(item3);
    allocation.addItem(item4);
    allocation.addItem(item5);
    allocation.addItem(item6);
    allocation.addItem(item7);
    allocation.addItem(item8);

    const optimal: Array<AllocatableItem> = allocation.allocate();

    expect(optimal.length).toBe(8);
    expect(allocation.payoff).toBe(125);

    const solution1: AllocatableItem = optimal[0];
    expect(solution1 === item3).toBe(true);
    expect(solution1.solutionValue).toBe(40);
    expect(solution1.solutionCapacity).toBe(1.25);

    const solution2: AllocatableItem = optimal[7];
    expect(solution2 === item6).toBe(true);
    expect(Math.abs(1-solution2.solutionValue)).toBeLessThan(0.001);
    expect(solution2.solutionCapacity).toBe(0.75);
  });
});

describe('0-1 Knapsack Tests', () => {

  const value1: any = {};
  const value2: any = null;
  const value3      = -1;

  it('properly constructs a new 0-1 knapsack environment', () => {
    const allocation: Knapsack = new Knapsack();

    expect(allocation).toBeTruthy();
    expect(allocation.capacity).toBe(0);
    expect(allocation.solutionCapacity).toBe(0);
    expect(allocation.payoff).toBe(0);
    expect(allocation.itemCount).toBe(0);
  });

  it('properly clears an environment', () => {
    const allocation: Knapsack = new Knapsack();

    allocation.capacity = 10;
    allocation.clear();

    expect(allocation.capacity).toBe(0);
    expect(allocation.solutionCapacity).toBe(0);
    expect(allocation.payoff).toBe(0);
    expect(allocation.itemCount).toBe(0);
  });

  it('capacity mutator properly rejects invalid values', () => {
    const allocation: Knapsack = new Knapsack();

    allocation.capacity = value1;
    expect(allocation.payoff).toBe(0);

    allocation.capacity = value2;
    expect(allocation.payoff).toBe(0);

    allocation.capacity = value3;
    expect(allocation.payoff).toBe(0);
  });

  it('adds items to the environment and returns correct count', () => {
    const allocation: Knapsack   = new Knapsack();
    const item1: AllocatableItem = new AllocatableItem();
    const item2: AllocatableItem = new AllocatableItem();
    const item3: AllocatableItem = new AllocatableItem();

    allocation.addItem(item1);
    allocation.addItem(item2);
    allocation.addItem(item3);

    expect(allocation.itemCount).toBe(3);
  });

  it('returns correct count after removing an item', () => {
    const allocation: Knapsack   = new Knapsack();
    const item1: AllocatableItem = new AllocatableItem();
    const item2: AllocatableItem = new AllocatableItem();
    const item3: AllocatableItem = new AllocatableItem();

    allocation.addItem(item1);
    allocation.addItem(item2);
    allocation.addItem(item3);

    allocation.removeItem(item2);

    expect(allocation.itemCount).toBe(2);
  });

  it('returns correct count after too many remove calls', () => {
    const allocation: Knapsack   = new Knapsack();
    const item1: AllocatableItem = new AllocatableItem();
    const item2: AllocatableItem = new AllocatableItem();

    allocation.addItem(item1);
    allocation.addItem(item2);

    allocation.removeItem(item1);
    allocation.removeItem(item2);
    allocation.removeItem(item1);

    expect(allocation.itemCount).toBe(0);
  });

  it('preserves item count after attempt to remove item not in environment', () => {
    const allocation: Knapsack   = new Knapsack();
    const item1: AllocatableItem = new AllocatableItem();
    const item2: AllocatableItem = new AllocatableItem();
    const item3: AllocatableItem = new AllocatableItem();

    allocation.addItem(item1);
    allocation.addItem(item2);

    allocation.removeItem(item3);

    expect(allocation.itemCount).toBe(2);
  });

  it('returns empty solution array from item allocation with no items in environment', () => {
    const allocation: Knapsack = new Knapsack();

    const optimal: Array<AllocatableItem> = allocation.allocate();

    expect(optimal.length).toBe(0);
  });

  it('returns empty solution array with one item that exceeds environment capacity', () => {
    const allocation: Knapsack   = new Knapsack();
    const item1: AllocatableItem = new AllocatableItem();

    item1.capacity = 10;
    item1.payoff   = 100;

    allocation.capacity = 5;

    allocation.addItem(item1);

    const optimal: Array<AllocatableItem> = allocation.allocate();

    expect(optimal.length).toBe(0);
  });

  it('returns correct solution array with one item less than or equal to environment capacity', () => {
    const allocation: Knapsack   = new Knapsack();
    const item1: AllocatableItem = new AllocatableItem();

    item1.capacity = 4;
    item1.payoff   = 10;

    allocation.capacity = 5;

    allocation.addItem(item1);

    const optimal: Array<AllocatableItem> = allocation.allocate();

    expect(optimal.length).toBe(1);
  });

  it('returns correct solution for simple problem #1', () => {
    const allocation: Knapsack   = new Knapsack();
    const item1: AllocatableItem = new AllocatableItem();
    const item2: AllocatableItem = new AllocatableItem();
    const item3: AllocatableItem = new AllocatableItem();
    const item4: AllocatableItem = new AllocatableItem();

    allocation.addItem(item1);
    allocation.addItem(item2);
    allocation.addItem(item3);
    allocation.addItem(item4);

    item1.name     = "item1";
    item1.capacity = 5;
    item1.payoff   = 10;

    item2.name     = "item2";
    item2.capacity = 4;
    item2.payoff   = 40;

    item3.name     = "item3";
    item3.capacity = 6;
    item3.payoff   = 30;

    item4.name     = "item4";
    item4.capacity = 3;
    item4.payoff   = 50;

    allocation.capacity = 10;

    const optimal: Array<AllocatableItem> = allocation.allocate();

    expect(allocation.payoff).toBe(90);
    expect(optimal.length).toBe(2);

    // because of backtracking, items will be added from the end of the list, forward
    const solution1: AllocatableItem = optimal[0];
    expect(solution1===item4).toBe(true);
    expect(solution1.solutionCapacity).toBe(solution1.capacity);
    expect(solution1.solutionValue).toBe(solution1.payoff);
  });

  it('returns correct solution for simple problem #2', () => {
    const allocation: Knapsack   = new Knapsack();
    const item1: AllocatableItem = new AllocatableItem();
    const item2: AllocatableItem = new AllocatableItem();
    const item3: AllocatableItem = new AllocatableItem();
    const item4: AllocatableItem = new AllocatableItem();

    allocation.addItem(item1);
    allocation.addItem(item2);
    allocation.addItem(item3);
    allocation.addItem(item4);

    // reorder same data - alters how the value table is constructed, but same solution
    item1.name     = "item1";
    item1.capacity = 4;
    item1.payoff   = 40;

    item2.name     = "item2";
    item2.capacity = 5;
    item2.payoff   = 10;

    item3.name     = "item3";
    item3.capacity = 3;
    item3.payoff   = 50;

    item4.name     = "item4";
    item4.capacity = 6;
    item4.payoff   = 30;

    allocation.capacity = 10;

    const optimal: Array<AllocatableItem> = allocation.allocate();

    expect(allocation.payoff).toBe(90);
    expect(optimal.length).toBe(2);

    // because of backtracking, items will be added from the end of the list, forward
    const solution1: AllocatableItem = optimal[0];
    expect(solution1===item3).toBe(true);
    expect(solution1.solutionCapacity).toBe(solution1.capacity);
    expect(solution1.solutionValue).toBe(solution1.payoff);
  });

  it('returns correct solution for simple problem #3', () => {
    const allocation: Knapsack   = new Knapsack();
    const item1: AllocatableItem = new AllocatableItem();
    const item2: AllocatableItem = new AllocatableItem();
    const item3: AllocatableItem = new AllocatableItem();
    const item4: AllocatableItem = new AllocatableItem();

    // reorder same data - alters how the value table is constructed, but same solution
    item1.name     = "item1";
    item1.capacity = 2;
    item1.payoff   = 3;

    item2.name     = "item2";
    item2.capacity = 3;
    item2.payoff   = 4;

    item3.name     = "item3";
    item3.capacity = 4;
    item3.payoff   = 5;

    item4.name     = "item4";
    item4.capacity = 5;
    item4.payoff   = 6;

    allocation.addItem(item1);
    allocation.addItem(item2);
    allocation.addItem(item3);
    allocation.addItem(item4);

    allocation.capacity = 5;

    const optimal: Array<AllocatableItem> = allocation.allocate();

    expect(allocation.payoff).toBe(7);
    expect(optimal.length).toBe(2);

    // because of backtracking, items will be added from the end of the list, forward
    const solution1: AllocatableItem = optimal[0];
    expect(solution1===item2).toBe(true);
    expect(solution1.solutionCapacity).toBe(solution1.capacity);
    expect(solution1.solutionValue).toBe(solution1.payoff);
  });
});
