import { delay } from "../utils/delay.js"
import { generateLabyrint } from "./generateMaze.js"
import { lastOf } from "../utils/lastOf.js"
import { mazeToSvgPath } from "./mazeToSvgPath.js"
import { useEffect, useRef, useState } from "react"

let activeMazeIndex = 0

export const Maze = () => {
  const ref = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const isPausedRef = useRef(false)
  const fastForwardRef = useRef(false)

  const togglePause = () => {
    isPausedRef.current = !isPausedRef.current
    setIsPaused(isPausedRef.current)
  }

  const fastForward = () => {
    fastForwardRef.current = true
  }

  useEffect(() => {
    if (ref.current) {
      const container = ref.current

      const observer = new ResizeObserver(async () => {
        container.replaceChildren() // Clear the maze

        const currentMazeIndex = (activeMazeIndex += 1)
        fastForwardRef.current = false
        isPausedRef.current = false
        setIsPaused(false)

        const cellSize = 16
        const WIDTH = Math.floor(container.clientWidth / cellSize)
        const HEIGHT = Math.floor(container.clientHeight / cellSize)

        const mazeOptions = {
          cellSize,
          width: WIDTH,
          height: HEIGHT,
        }

        const isCancelled = () => currentMazeIndex !== activeMazeIndex

        // While paused, block here. Fast-forwarding always wins over pause,
        // so it can still jump to the end while the animation is paused.
        const waitWhilePaused = async () => {
          while (
            isPausedRef.current &&
            !fastForwardRef.current &&
            !isCancelled()
          ) {
            await delay(50)
          }
        }

        let lastMaze
        for (const maze of generateLabyrint(WIDTH, HEIGHT)) {
          if (isCancelled()) {
            return
          }

          lastMaze = maze

          await waitWhilePaused()
          if (isCancelled()) {
            return
          }

          if (fastForwardRef.current) {
            continue // skip rendering/delaying this step
          }

          container.replaceChildren(mazeToSvgPath(maze, mazeOptions))
          await delay(30)
        }

        if (lastMaze) {
          container.replaceChildren(mazeToSvgPath(lastMaze, mazeOptions))
        }
      })

      observer.observe(container)
    }

    return () => {
      if (ref.current) {
        // Clear the maze on unmount
        ref.current.replaceChildren()
      }
    }
  }, [ref])

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div ref={ref} className="w-full h-full"></div>

      <div className="self-end flex gap-2 shrink-0 opacity-30 hover:opacity-100 transition-opacity">
        <button
          className="outline-none hover:cursor-pointer focus-visible:opacity-100"
          aria-label={isPaused ? "Play" : "Pause"}
          onClick={togglePause}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 fill-current text-neutral-700"
          >
            {isPaused ? (
              <path d="M8 5v14l11-7z" />
            ) : (
              <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
            )}
          </svg>
        </button>

        <button
          className="outline-none hover:cursor-pointer focus-visible:opacity-100"
          aria-label="Skip to end"
          onClick={fastForward}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 fill-current text-neutral-700"
          >
            <path d="M4 5v14l8-7zM13 5v14l8-7z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
