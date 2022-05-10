/**
 * Decision-Tree Action model
 */
export interface DecisionTreeAction
{
  success: boolean;                 // true if operation was successful

  node?: object;                    // reference to the data Object in which an error was detected

  action: string;                   // action to take
}
