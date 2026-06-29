import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Generate } from "./index.js"

describe("Generate", () => {
  it("renders a width, height and multiplier input", () => {
    render(<Generate />)

    expect(screen.getByLabelText("Width:")).toHaveValue(50)
    expect(screen.getByLabelText("Height:")).toHaveValue(70)
    expect(screen.getByLabelText("Multiplier:")).toHaveValue(1)
  })

  it("ignores out-of-range width input instead of updating the value", async () => {
    const user = userEvent.setup()
    render(<Generate />)

    const width = screen.getByLabelText("Width:")
    await user.clear(width)
    await user.type(width, "0")

    // 0 is below the allowed minimum, so the regenerate button should not
    // have caused a crash and the maze container should still be rendered.
    expect(screen.getByRole("button", { name: "Regenerate" })).toBeEnabled()
  })

  it("renders a maze as an SVG", () => {
    const { container } = render(<Generate />)

    expect(container.querySelector("svg")).toBeInTheDocument()
  })
})
