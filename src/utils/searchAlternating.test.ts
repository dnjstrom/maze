import { describe, expect, it } from "vitest"
import { searchAlternating } from "./searchAlternating.js"

describe("searchAlternating", () => {
  it("returns the starting item if it matches", () => {
    const list = [0, 1, 2, 3, 4]
    expect(searchAlternating(list, 2, (item) => item === 2)).toBe(2)
  })

  it("searches outward from the starting index, alternating sides", () => {
    const list = [0, 1, 2, 3, 4, 5, 6]
    // Starting at index 3, the search order is 3,2,4,1,5,0,6 - upper side
    // first at each distance, so 1 (distance 2) is found before 5 (distance 2,
    // but checked after the upper side at that distance).
    expect(searchAlternating(list, 3, (item) => item === 1 || item === 5)).toBe(1)
  })

  it("returns undefined when nothing matches", () => {
    const list = [0, 1, 2]
    expect(searchAlternating(list, 1, (item) => item === 99)).toBeUndefined()
  })
})
