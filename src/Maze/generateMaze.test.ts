import { describe, expect, it } from "vitest"
import { generateLabyrint, type Maze } from "./generateMaze.js"
import { lastOf } from "../utils/lastOf.js"
import { gridIterator } from "../utils/gridIterator.js"

const generate = (width: number, height: number): Maze =>
  lastOf(generateLabyrint(width, height))

describe("generateLabyrint", () => {
  it("produces a grid of the requested dimensions", () => {
    const maze = generate(20, 30)

    expect(maze.length).toBe(20)
    expect(maze[0].length).toBe(30)
  })

  it("clears the selected flag on every cell once generation is done", () => {
    const maze = generate(20, 30)

    for (const cell of gridIterator(maze)) {
      expect(cell.selected).toBe(false)
    }
  })

  it("carves an entrance on the top edge and an exit on the bottom edge", () => {
    const maze = generate(20, 30)

    const topRowHasPath = maze.some((column) => column[0].type === "PATH")
    const bottomRowHasPath = maze.some(
      (column) => column[column.length - 1].type === "PATH",
    )

    expect(topRowHasPath).toBe(true)
    expect(bottomRowHasPath).toBe(true)
  })

  it("keeps the left and right edges (2 cells thick) as walls", () => {
    const maze = generate(20, 30)
    const width = maze.length

    for (const cell of gridIterator(maze)) {
      const isLeftOrRightEdge =
        cell.x === 0 || cell.x === 1 || cell.x === width - 1 || cell.x === width - 2

      if (isLeftOrRightEdge) {
        expect(cell.type).toBe("WALL")
      }
    }
  })

  it("carves at least one path cell", () => {
    const maze = generate(20, 30)

    const pathCells = [...gridIterator(maze)].filter(
      (cell) => cell.type === "PATH",
    )

    expect(pathCells.length).toBeGreaterThan(0)
  })
})
