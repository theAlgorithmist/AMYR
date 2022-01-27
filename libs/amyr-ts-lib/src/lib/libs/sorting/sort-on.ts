/**
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
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
 * Typescript implementation of a sort-on, i.e. sort an Array of Objects on one or more (numeric) properties
 *
 * @param {Array<Record<string, number>>} data Data array to be sorted 
 *
 * @param {Array<string>} sortProps List of {Object} properties to sort on in the order provided, e.g. sort on 'priority' first,
 * and then by 'time'.
 *
 * @param {boolean} increasing True if data is to be sorted in increasing order
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */

 export function sortOn(data: Array<object>, sortProps: Array<string>, increasing: boolean = true): void
 {
   if (sortProps === undefined || (sortProps.length && sortProps.length == 0)) {
     return;
   }
 
   data.sort
   (
     function(a: object, b: object): number
     {
       const props: Array<string> = sortProps.slice();
       let prop: string         = props.shift() as string;

       const aRecord: Record<string, number> = a as Record<string, number>;
       const bRecord: Record<string, number> = b as Record<string, number>;
 
       while (aRecord[prop] === bRecord[prop] && props.length > 0) {
         prop = props.shift() as string;
       }
 
       if (increasing)
       {
         // return data in increasing numerical order
         return aRecord[prop] === bRecord[prop] ? 0 : aRecord[prop] > bRecord[prop] ? 1 : -1;
       }
       else
       {
         // return data in decreasing numerical order
         return aRecord[prop] === bRecord[prop] ? 0 : aRecord[prop] < bRecord[prop] ? 1 : -1;
       }
     }
   );
 
   return;
 }
 