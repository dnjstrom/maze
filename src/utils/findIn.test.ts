import { describe, expect, it } from "vitest"
import { findIn } from "./findIn.js"

describe("findIn", () => {
  it("returns the first value matching the predicate", () => {
    function* numbers() {
      yield 1
      yield 2
      yield 3
    }

    expect(findIn(numbers(), (n) => n > 1)).toBe(2)
  })

  it("returns undefined when no value matches", () => {
    function* numbers() {
      yield 1
      yield 2
    }

    expect(findIn(numbers(), (n) => n > 10)).toBeUndefined()
  })
})
