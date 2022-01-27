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
 * Typescript Math Toolkit: Prioritizable Interface - minimal methods required for an item to be prioritized and used in the
 * TSMT priority queue
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 * 
 * @version 1.0
 */
export interface IPrioritizable<T>
{
  priority: number;
  timestamp: number;
  data: T | null;
}