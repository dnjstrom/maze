import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { Menu } from "./index.js"
import * as downloadAsSvgModule from "./downloadAsSvg.js"

const getToggleButton = () => screen.getAllByRole("button")[0]

describe("Menu", () => {
  it("toggles the menu open and closed when clicked", async () => {
    const user = userEvent.setup()
    render(<Menu />, { wrapper: MemoryRouter })

    expect(screen.queryByText("Download SVG")).not.toBeInTheDocument()

    await user.click(getToggleButton())
    expect(screen.getByText("Download SVG")).toBeInTheDocument()

    await user.click(getToggleButton())
    expect(screen.queryByText("Download SVG")).not.toBeInTheDocument()
  })

  it("downloads the page's SVG when 'Download SVG' is clicked", async () => {
    const user = userEvent.setup()
    const downloadSpy = vi
      .spyOn(downloadAsSvgModule, "downloadAsSvg")
      .mockImplementation(() => {})

    render(
      <MemoryRouter>
        <svg />
        <Menu />
      </MemoryRouter>,
    )

    await user.click(getToggleButton())
    await user.click(screen.getByText("Download SVG"))

    expect(downloadSpy).toHaveBeenCalledTimes(1)
  })

  it("links to the maze generator page", async () => {
    const user = userEvent.setup()
    render(<Menu />, { wrapper: MemoryRouter })

    await user.click(getToggleButton())

    expect(screen.getByText("Maze generator")).toHaveAttribute(
      "href",
      "/generate",
    )
  })
})
