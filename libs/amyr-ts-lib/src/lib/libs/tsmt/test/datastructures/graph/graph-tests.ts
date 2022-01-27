/**
 * Some sample graphs for testing DFS/BFS
 *
 * @author Jim Armstrong (https://www.linkedin.com/in/jimarmstrong/)
 *
 * @version 1.0
 */
import { GraphList } from "../../../datastructures/graph-list";

export const testGraph1: GraphList<string> =
{
  id: 'graph1',
  nodes: [
    { id: 'R' },
    { id: 'A' },
    { id: 'B' },
    { id: 'C' },
    { id: 'D' },
    { id: 'E' },
    { id: 'F' },
    { id: 'G'}
  ],

  edges: [
    {
      from: 'R',
      to: ['A', 'B', 'C']
    },
    {
      from: 'A',
      to: 'D'
    },
    {
      from: 'B',
      to: 'E'
    },
    {
      from: 'C',
      to: 'F'
    },
    {
      from: 'D',
      to: 'G'
    },
    {
      from: 'E',
      to: 'G'
    },
    {
      from: 'F',
      to: 'G'
    }
  ],
};

export const testGraph2: GraphList<string> =
{
  id: 'graph2',
  nodes: [
    { id: '0' },
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ],

  edges: [
    {
      from: '0',
      to: ['1', '2', '3']
    },
    {
      from: '1',
      to: '2'
    },
    {
      from: '2',
      to: '4'
    },
  ],
};

export const testGraph3: GraphList<string> =
{
  id: 'graph3',
  nodes: [
    { id: 'A' },
    { id: 'B' },
    { id: 'C' },
    { id: 'D' },
    { id: 'E' },
    { id: 'F' },
    { id: 'G' },
    { id: 'H' },
    { id: 'S' },
  ],

  edges: [
    {
      from: 'A',
      to: ['B', 'S']
    },
    {
      from: 'S',
      to: ['C', 'G']
    },
    {
      from: 'C',
      to: ['D', 'E', 'F']
    },
    {
      from: 'G',
      to: ['F', 'H']
    },
    {
      from: 'E',
      to: 'H'
    },
  ],
};

export const testGraph4: GraphList<string> =
{
  id: 'graph4',
  nodes: [
    { id: '0' },
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
  ],

  edges: [
    {
      from: '0',
      to: ['1', '2', '3']
    },
    {
      from: '1',
      to: ['4', '5']
    },
    {
      from: '2',
      to: ['6', '7']
    },
    {
      from: '3',
      to: '7'
    },
  ],
};

export const testGraph5: GraphList<string> =
  {
    id: 'graph5',
    nodes: [
      { id: 'R' },
      { id: '1' },
      { id: '2' },
      { id: '3' },
      { id: '4' },
      { id: '5' },
    ],

    edges: [
      {
        from: 'R',
        to: ['1', '2']
      },
      {
        from: '1',
        to: '3'
      },
      {
        from: '2',
        to: ['3', '4']
      },
      {
        from: '3',
        to: '5'
      },
    ],
  };
