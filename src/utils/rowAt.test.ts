import { describe, expect, it } from "vitest"
import { rowAt } from "./rowAt.js"

describe("rowAt", () => {
  it("extracts the value at the given y from every column", () => {
    const grid = [
      ["a0", "a1", "a2"],
      ["b0", "b1", "b2"],
    ]

    expect(rowAt(grid, 1)).toEqual(["a1", "b1"])
  })
})
