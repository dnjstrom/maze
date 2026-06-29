import { describe, expect, it } from "vitest"
import { gridIterator } from "./gridIterator.js"

describe("gridIterator", () => {
  it("yields every cell, column by column", () => {
    const grid = [
      ["a0", "a1"],
      ["b0", "b1"],
    ]

    expect([...gridIterator(grid)]).toEqual(["a0", "a1", "b0", "b1"])
  })
})
