import { IAStarGraphData } from "../../../pathfinding/astar-graph";

export const graph1: IAStarGraphData = {

  isCartesian: true,

  waypoints: [
    {
      key: "1",
      x: 1,
      y: 1
    },
    {
      key: "2",
      x: 4,
      y: 5
    },
    {
      key: "3",
      x: 6,
      y: 0
    },
    {
      key: "4",
      x: 7,
      y: 6
    },
    {
      key: "5",
      x: 8,
      y: 3
    },
    {
      key: "6",
      x: 9,
      y: 1
    },
    {
      key: "7",
      x: 8,
      y: 7
    },
    {
      key: "8",
      x: 12,
      y: 4
    }
  ],

  edges: [
    {
      key: "1",
      from: "1",
      to: "2",
    },
    {
      key: "2",
      from: "1",
      to: "3"
    },
    {
      key: "3",
      from: "2",
      to: "4"
    },
    {
      key: "4",
      from: "3",
      to: "4"
    },
    {
      key: "5",
      from: "3",
      to: "5"
    },
    {
      key: "6",
      from: "3",
      to: "6"
    },
    {
      key: "7",
      from: "4",
      to: "7"
    },
    {
      key: "8",
      from: "5",
      to: "7"
    },
    {
      key: "9",
      from: "5",
      to: "8"
    },
    {
      key: "10",
      from: "6",
      to: "8"
    },
    {
      key: "11",
      from: "7",
      to: "8"
    }
  ]
};
