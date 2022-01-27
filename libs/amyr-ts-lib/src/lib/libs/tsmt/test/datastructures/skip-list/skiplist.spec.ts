/** Copyright 2017 Jim Armstrong (www.algorithmist.net)
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

// Specs for Typescript Math Toolkit Skip List

// test functions/classes
import { TSMT$ISkipListData } from "../../../datastructures/skip-list-node";
import { TSMT$SkipList      } from "../../../datastructures/skip-list";

// Test Suites
describe('Skip List Tests: TSMT$SkipList', () =>
{
  // uncomment to log the list during test
  // const __list: Function = function(result: Array<Array<TSMT$ISkipListData>>): void
  // {
  //   const n: number = result.length;
  //   let i: number;
  //   let row: Array<TSMT$ISkipListData>;

  //   for (i = 0; i < n; ++i)
  //   {
  //     console.log( "" );
  //     console.log( "   Level: ", i);
  //     row = result[i];

  //     console.log( row );
  //   }
  // };

  // Usage (to view the structure of small lists)
  // const result: Array<Array<TSMT$ISkipListData>> = list.list;
  // __list(result);

  it('properly constructs a new skip list', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();
  
    expect(list.size).toBe(0);
    expect(list.toArray().length).toBe(0);
    expect(list.min).toBe(-Number.MAX_VALUE);
    expect(list.max).toBe(Number.MAX_VALUE);
  });

  
  it('find from an empty list returns null', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();
  
    expect(list.find(1)).toBe(null);
  });
  
  it('Insert a singleton results in list size of one', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();
  
    list.insert('0', 0);
  
    expect(list.size).toBe(1);
  });
  
  it('find works with a singleton', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();
  
    list.insert('0', 0);
  
    const result: TSMT$ISkipListData | null = list.find(0);
  
    expect(result?.value).toBe(0);
  });
  
  it('toArray works with a singleton', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();
  
    list.insert('0', 0);
  
    const result: Array<TSMT$ISkipListData> = list.toArray();
  
    expect(result.length).toBe(1);
    expect(result[0].key).toBe('0');
    expect(list.levels).toBe(1);      // about the only time we expect this to be deterministic
  });
  
  it('does not insert duplicates multiple times', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();
  
    list.insert('0', 0);
    list.insert('1', 0);
  
    expect(list.size).toBe(1);
    expect(list.toArray()[0].key).toBe('0');
  });
  
  it('inserts two nodes correctly #1', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();
  
    list.insert('0', 0);
    list.insert('1', 1);
  
    const elements: Array<TSMT$ISkipListData> = list.toArray();
  
    expect(list.size).toBe(2);
    expect(elements[0].key).toBe('0');
    expect(elements[1].key).toBe('1');
  });
  
  it('inserts two nodes correctly #2', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();
  
    list.insert('1', 1);
    list.insert('0', 0);
  
    const elements: Array<TSMT$ISkipListData> = list.toArray();
  
    expect(list.size).toBe(2);
    expect(elements[0].key).toBe('0');
    expect(elements[1].key).toBe('1');
  });
  
  it('inserts three nodes correctly #1', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();
  
    list.insert('0', 0);
    list.insert('1', 1);
    list.insert('2', 2);
  
    const elements: Array<TSMT$ISkipListData> = list.toArray();
  
    expect(list.size).toBe(3);
    expect(elements[0].key).toBe('0');
    expect(elements[1].key).toBe('1');
    expect(elements[2].key).toBe('2');

    expect(list.min).toBe(0);
    expect(list.max).toBe(2);
  });

  it('inserts three nodes correctly #2', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.insert('1', 1);
    list.insert('0', 0);
    list.insert('2', 2);

    const elements: Array<TSMT$ISkipListData> = list.toArray();

    expect(list.size).toBe(3);
    expect(elements[0].key).toBe('0');
    expect(elements[1].key).toBe('1');
    expect(elements[2].key).toBe('2');
  });

  it('inserts three nodes correctly #3', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.insert('2', 2);
    list.insert('1', 1);
    list.insert('0', 0);

    const elements: Array<TSMT$ISkipListData> = list.toArray();

    expect(list.size).toBe(3);
    expect(elements[0].key).toBe('0');
    expect(elements[1].key).toBe('1');
    expect(elements[2].key).toBe('2');
  });

  it('inserts four nodes correctly #1', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.insert('2', 2);
    list.insert('1', 1);
    list.insert('0', 0);
    list.insert('3', 3);

    const elements: Array<TSMT$ISkipListData> = list.toArray();

    expect(list.size).toBe(4);
    expect(elements[0].key).toBe('0');
    expect(elements[1].key).toBe('1');
    expect(elements[2].key).toBe('2');
    expect(elements[3].key).toBe('3');
  });

  it('inserts four nodes correctly #2', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.insert('2', 2);
    list.insert('1', 1);
    list.insert('3', 3);
    list.insert('0', 0);

    const elements: Array<TSMT$ISkipListData> = list.toArray();

    expect(list.size).toBe(4);
    expect(elements[0].key).toBe('0');
    expect(elements[1].key).toBe('1');
    expect(elements[2].key).toBe('2');
    expect(elements[3].key).toBe('3');
  });

  it('inserts five nodes correctly', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();
  
    list.insert('2', 2);
    list.insert('1', 1);
    list.insert('4', 4);
    list.insert('0', 0);
    list.insert('3', 3);
  
    const elements: Array<TSMT$ISkipListData> = list.toArray();
  
    expect(list.size).toBe(5);
    expect(elements[0].key).toBe('0');
    expect(elements[1].key).toBe('1');
    expect(elements[2].key).toBe('2');
    expect(elements[3].key).toBe('3');
    expect(elements[4].key).toBe('4');

    expect(list.min).toBe(0);
    expect(list.max).toBe(4);
  
    // const result: Array<Array<TSMT$ISkipListData>> = list.list;
    // __list(result);
  });

  it('toArray works in reverse', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.insert('2', 2);
    list.insert('1', 1);
    list.insert('4', 4);
    list.insert('0', 0);
    list.insert('3', 3);

    const elements: Array<TSMT$ISkipListData> = list.toArray(true);

    expect(list.size).toBe(5);
    expect(elements.length).toBe(5);

    expect(elements[0].key).toBe('4');
    expect(elements[1].key).toBe('3');
    expect(elements[2].key).toBe('2');
    expect(elements[3].key).toBe('1');
    expect(elements[4].key).toBe('0');

    expect(list.min).toBe(0);
    expect(list.max).toBe(4);
  });

  it('removeMin returns null for empty list', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    expect(list.size).toBe(0);

    const removed: TSMT$ISkipListData | null = list.removeMin();

    expect(removed).toBe(null);
  });

  it('removeMin multinode test', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.insert('2', 2);
    list.insert('1', 1);
    list.insert('4', 4);
    list.insert('0', 0);
    list.insert('3', 3);

    expect(list.size).toBe(5);

    // let result: Array<Array<TSMT$ISkipListData>> = list.list;
    // __list(result);

    list.removeMin();

    expect(list.size).toBe(4);

    expect(list.min).toBe(1);
    expect(list.max).toBe(4);
  });

  it('removeMax returns null for empty list', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    expect(list.size).toBe(0);

    const removed: TSMT$ISkipListData | null = list.removeMax();

    expect(removed).toBe(null);
  });

  it('removeMax multinode test', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.insert('2', 2);
    list.insert('1', 1);
    list.insert('4', 4);
    list.insert('0', 0);
    list.insert('3', 3);

    expect(list.size).toBe(5);

    // let result: Array<Array<TSMT$ISkipListData>> = list.list;
    // __list(result);

    list.removeMax();

    expect(list.size).toBe(4);

    expect(list.min).toBe(0);
    expect(list.max).toBe(3);
  });

  it('fromArray creates null list for no input', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.fromArray( [] );

    expect(list.size).toBe(0);
  });

  it('fromArray works with multiple values', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.fromArray( [2, 1, 3, 0] );

    expect(list.size).toBe(4);

    const elements: Array<TSMT$ISkipListData> = list.toArray();

    expect(elements[0].value).toBe(0);
    expect(elements[1].value).toBe(1);
    expect(elements[2].value).toBe(2);
    expect(elements[3].value).toBe(3);
  });

  it('find from an empty list returns null', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    const result: TSMT$ISkipListData | null = list.find(1);

    expect(result).toBe(null);
  });

  it('find from an singleton list returns correct value', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.insert('0', 0);

    const result: TSMT$ISkipListData | null = list.find(0);

    expect(result?.value).toBe(0);
  });

  it('find returns cached value on two calls with same value', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.insert('0', 0);

    let result: TSMT$ISkipListData | null = list.find(0);
    expect(result?.value).toBe(0);

    result = list.find(0);
    expect(result?.value).toBe(0);
  });

  it('find returns aux data correctly', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.insert('0', 0, {key: 'zero', value: 0});

    const result: TSMT$ISkipListData | null  = list.find(0);
    const data: {key: string, value: number} = result?.aux as {key: string, value: number};

    expect(result?.value).toBe(0);
    expect(data.key).toBe('zero');
    expect(data.value).toBe(0);
  });

  it('find works on a 2-node list #1', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.insert('0', 0);
    list.insert('1', 1);

    const result: TSMT$ISkipListData = list.find(0) as TSMT$ISkipListData;

    expect(result.key).toBe('0');
    expect(result.value).toBe(0);
  });

  it('find works on a 2-node list #2', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.insert('0', 0);
    list.insert('1', 1);

    const result: TSMT$ISkipListData = list.find(1) as TSMT$ISkipListData;

    expect(result.key).toBe('1');
    expect(result.value).toBe(1);
  });

  it('find works on a 3-node list', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.insert('0', 0);
    list.insert('1', 1);
    list.insert('2', 2);

    let result: TSMT$ISkipListData = list.find(0) as TSMT$ISkipListData;

    expect(result.key).toBe('0');
    expect(result.value).toBe(0);

    result = list.find(2) as TSMT$ISkipListData;

    expect(result.key).toBe('2');
    expect(result.value).toBe(2);
  });

  it('find works on a 4-node list #1', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.insert('0', 0);
    list.insert('1', 1);
    list.insert('2', 2);
    list.insert('3', 3);

    const result: TSMT$ISkipListData = list.find(3) as TSMT$ISkipListData;

    expect(result.key).toBe('3');
    expect(result.value).toBe(3);
  });

  it('find works on a 4-node list #2', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.insert('0', 0);
    list.insert('1', 1);
    list.insert('2', 2);
    list.insert('3', 3);

    let result: TSMT$ISkipListData = list.find(2) as TSMT$ISkipListData;

    expect(result.key).toBe('2');
    expect(result.value).toBe(2);

    result = list.find(3) as TSMT$ISkipListData;
    expect(result.key).toBe('3');
    expect(result.value).toBe(3);

    result = list.find(0) as TSMT$ISkipListData;
    expect(result.key).toBe('0');
    expect(result.value).toBe(0);
  });

  it('multi-node find', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.insert('0', 0);
    list.insert('1', 1);
    list.insert('2', 2);
    list.insert('3', 3);
    list.insert('7', 7);
    list.insert('21', 21);
    list.insert('16', 16);
    list.insert('11', 11);

    expect(list.size).toBe(8);

    expect(list.min).toBe(0);
    expect(list.max).toBe(21);

    // const result: Array<Array<TSMT$ISkipListData>> = list.list;
    // __list(result);

    let node: TSMT$ISkipListData = list.find(2) as TSMT$ISkipListData;
    expect(node.key).toBe('2');
    expect(node.value).toBe(2);

    node = list.find(3) as TSMT$ISkipListData;
    expect(node.key).toBe('3');
    expect(node.value).toBe(3);

    node = list.find(4) as TSMT$ISkipListData;
    expect(node).toBe(null);

    node = list.find(7) as TSMT$ISkipListData;
    expect(node.key).toBe('7');
    expect(node.value).toBe(7);

    node = list.find(11) as TSMT$ISkipListData;
    expect(node.key).toBe('11');
    expect(node.value).toBe(11);

    node = list.find(16) as TSMT$ISkipListData;
    expect(node.key).toBe('16');
    expect(node.value).toBe(16);

    node = list.find(21) as TSMT$ISkipListData;
    expect(node.key).toBe('21');
    expect(node.value).toBe(21);
  });

  it('delete on an empty list returns null', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();
  
    const result: TSMT$ISkipListData = list.delete(2) as TSMT$ISkipListData;
  
    expect(list.size).toBe(0);
    expect(result).toBe(null);
  });
  
  it('delete on invalid value returns null', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();
  
    list.insert('0', 0);
    list.insert('1', 1);
  
    const result: TSMT$ISkipListData = list.delete(2) as TSMT$ISkipListData;
  
    expect(list.size).toBe(2);
    expect(result).toBe(null);
  });

  it('delete 2-node test #1', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.insert('0', 0);
    list.insert('1', 1);

    const result: TSMT$ISkipListData = list.delete(0) as TSMT$ISkipListData;

    expect(list.size).toBe(1);
    expect(result.value).toBe(0);

    expect(list.min).toBe(1);
    expect(list.max).toBe(1);
  });


  it('delete 2-node test #2', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.insert('0', 0);
    list.insert('1', 1);

    const result: TSMT$ISkipListData = list.delete(1) as TSMT$ISkipListData;

    expect(list.size).toBe(1);
    expect(result.value).toBe(1);

    expect(list.min).toBe(0);
    expect(list.max).toBe(0);
  });

  it('delete multi-node test', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.insert('0', 0);
    list.insert('5', 5);
    list.insert('15', 15);
    list.insert('1', 1);
    list.insert('11', 11);
    list.insert('21', 21);
    list.insert('2', 2);

    expect(list.size).toBe(7);
    expect(list.min).toBe(0);
    expect(list.max).toBe(21);

    let result: TSMT$ISkipListData = list.delete(11) as TSMT$ISkipListData;

    expect(result.value).toBe(11);
    expect(list.size).toBe(6);

    expect(list.min).toBe(0);
    expect(list.max).toBe(21);

    result = list.delete(21) as TSMT$ISkipListData;
    expect(result.value).toBe(21);
    expect(list.size).toBe(5);

    expect(list.min).toBe(0);
    expect(list.max).toBe(15);

    result = list.delete(0) as TSMT$ISkipListData;
    expect(result.value).toBe(0);
    expect(list.size).toBe(4);

    expect(list.min).toBe(1);
    expect(list.max).toBe(15);

    result = list.delete(30) as TSMT$ISkipListData;
    expect(result).toBe(null);
  });

  it('delete-find test', () =>
  {
    const list: TSMT$SkipList = new TSMT$SkipList();

    list.insert('0', 0);
    list.insert('5', 5);
    list.insert('16', 16);
    list.insert('15', 15);
    list.insert('11', 11);
    list.insert('21', 21);
    list.insert('2', 2);
    list.insert('3', 3);

    expect(list.size).toBe(8);
    expect(list.min).toBe(0);
    expect(list.max).toBe(21);

    let result: TSMT$ISkipListData = list.delete(11) as TSMT$ISkipListData;

    expect(result.value).toBe(11);
    expect(list.size).toBe(7);

    expect(list.min).toBe(0);
    expect(list.max).toBe(21);

    result = list.find(21) as TSMT$ISkipListData;
    expect(result.key).toBe('21');

    result = list.delete(21) as TSMT$ISkipListData;
    expect(result.value).toBe(21);
    expect(list.size).toBe(6);

    expect(list.min).toBe(0);
    expect(list.max).toBe(16);

    result = list.find(21) as TSMT$ISkipListData;
    expect(result).toBe(null);

    result = list.delete(3) as TSMT$ISkipListData;
    expect(list.size).toBe(5);
    expect(list.min).toBe(0);
    expect(list.max).toBe(16);

    result = list.delete(16) as TSMT$ISkipListData;
    result = list.delete(0) as TSMT$ISkipListData;
    expect(list.size).toBe(3);
    expect(list.min).toBe(2);
    expect(list.max).toBe(15);
  });
});
