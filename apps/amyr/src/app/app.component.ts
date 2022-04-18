import { Component } from '@angular/core';

// Sample AMYR Imports
import { TSMT$AVLTree } from '@algorithmist/amyr-ts-lib';
import { TSMT$Queue   } from '@algorithmist/amyr-ts-lib';
import { AStar        } from '@algorithmist/amyr-ts-lib';

import * as back from '@algorithmist/amyr-ts-lib';

import { FiniteStateMachine } from "@algorithmist/amyr-ts-lib";

@Component({
  selector: 'algorithmist-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent
{
  public title = 'amyr';

  private _tree: TSMT$AVLTree<number>;
  private _queue: TSMT$Queue<number>;
  private _astar: AStar;

  constructor()
  {
    this._tree = new TSMT$AVLTree<number>();

    this._queue = new TSMT$Queue<number>();

    this._astar = new AStar();

    const fsm: FiniteStateMachine<unknown> = new FiniteStateMachine<unknown>();
  }
}
