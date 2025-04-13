"use client"

import { useEffect, useRef } from "react"
import p5 from "p5"

interface P5WrapperProps {
  onP5Create?: (p5Instance: any) => void
  onParticleCountChange?: (count: number) => void
  moveUIMode?: boolean
}

export default function P5Wrapper({ onP5Create, onParticleCountChange, moveUIMode }: P5WrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sketchRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Define the p5 sketch
    const sketch = (p: p5) => {
      // Constants
      const CELL_SIZE = 8 // Size of each cell in the grid

      // Grid to track occupied cells
      let grid = []
      let cols = 0
      let rows = 0

      // Particles array
      let particles = []

      // Settings
      let brushSize = 10
      let tool = "brush"
      let showGrid = false
      let frameCount = 0
      let inverted = false
      let invertedGravity = false

      // Earthquake settings
      let earthquakeActive = false
      let earthquakeIntensity = 5
      let earthquakeDuration = 0
      const earthquakeMaxDuration = 120 // frames (2 seconds at 60fps)
      let canvasShakeX = 0
      let canvasShakeY = 0

      // UI Mode - IMPORTANT: This is now only used to disable drawing while dragging
      // It no longer affects the sand simulation
      let moveUIMode = false

      // Colors for the sand particles
      const COLORS = [
        p.color(245, 158, 11), // amber
        p.color(217, 119, 6), // amber dark
        p.color(249, 115, 22), // orange
        p.color(234, 88, 12), // orange dark
        p.color(251, 191, 36), // yellow
      ]

      // Inverted colors for the sand particles
      const INVERTED_COLORS = [
        p.color(10, 97, 244), // blue
        p.color(38, 136, 216), // light blue
        p.color(6, 140, 233), // sky blue
        p.color(21, 167, 243), // bright blue
        p.color(4, 64, 219), // deep blue
      ]

      // Particle class
      class Particle {
        gridX: number
        gridY: number
        color: p5.Color
        invertedColor: p5.Color
        size: number
        falling: boolean
        checked: boolean

        constructor(gridX: number, gridY: number) {
          this.gridX = gridX
          this.gridY = gridY

          const colorIndex = Math.floor(p.random(COLORS.length))
          this.color = COLORS[colorIndex]
          this.invertedColor = INVERTED_COLORS[colorIndex]

          this.size = CELL_SIZE
          this.falling = true
          this.checked = false

          // Mark this cell as occupied
          grid[gridX][gridY] = this
        }

        update() {
          // Reset checked flag each frame
          this.checked = false

          // Skip if not falling
          if (!this.falling) return

          if (!invertedGravity) {
            // NORMAL GRAVITY - Fall down
            // Check if we can fall down
            if (this.gridY + 1 < rows && !grid[this.gridX][this.gridY + 1]) {
              // Move down
              grid[this.gridX][this.gridY] = null
              this.gridY += 1
              grid[this.gridX][this.gridY] = this
            }
            // Try to slide down-left or down-right
            else if (this.gridY + 1 < rows) {
              const canSlideLeft = this.gridX > 0 && !grid[this.gridX - 1][this.gridY + 1]
              const canSlideRight = this.gridX < cols - 1 && !grid[this.gridX + 1][this.gridY + 1]

              if (canSlideLeft && canSlideRight) {
                // Choose randomly
                if (p.random() < 0.5) {
                  grid[this.gridX][this.gridY] = null
                  this.gridX -= 1
                  this.gridY += 1
                  grid[this.gridX][this.gridY] = this
                } else {
                  grid[this.gridX][this.gridY] = null
                  this.gridX += 1
                  this.gridY += 1
                  grid[this.gridX][this.gridY] = this
                }
              } else if (canSlideLeft) {
                grid[this.gridX][this.gridY] = null
                this.gridX -= 1
                this.gridY += 1
                grid[this.gridX][this.gridY] = this
              } else if (canSlideRight) {
                grid[this.gridX][this.gridY] = null
                this.gridX += 1
                this.gridY += 1
                grid[this.gridX][this.gridY] = this
              } else {
                // Can't move, stop falling
                this.falling = false
              }
            } else {
              // At bottom of canvas, stop falling
              this.falling = false
            }
          } else {
            // INVERTED GRAVITY - Fall up
            // Check if we can fall up
            if (this.gridY - 1 >= 0 && !grid[this.gridX][this.gridY - 1]) {
              // Move up
              grid[this.gridX][this.gridY] = null
              this.gridY -= 1
              grid[this.gridX][this.gridY] = this
            }
            // Try to slide up-left or up-right
            else if (this.gridY - 1 >= 0) {
              const canSlideLeft = this.gridX > 0 && !grid[this.gridX - 1][this.gridY - 1]
              const canSlideRight = this.gridX < cols - 1 && !grid[this.gridX + 1][this.gridY - 1]

              if (canSlideLeft && canSlideRight) {
                // Choose randomly
                if (p.random() < 0.5) {
                  grid[this.gridX][this.gridY] = null
                  this.gridX -= 1
                  this.gridY -= 1
                  grid[this.gridX][this.gridY] = this
                } else {
                  grid[this.gridX][this.gridY] = null
                  this.gridX += 1
                  this.gridY -= 1
                  grid[this.gridX][this.gridY] = this
                }
              } else if (canSlideLeft) {
                grid[this.gridX][this.gridY] = null
                this.gridX -= 1
                this.gridY -= 1
                grid[this.gridX][this.gridY] = this
              } else if (canSlideRight) {
                grid[this.gridX][this.gridY] = null
                this.gridX += 1
                this.gridY -= 1
                grid[this.gridX][this.gridY] = this
              } else {
                // Can't move, stop falling
                this.falling = false
              }
            } else {
              // At top of canvas, stop falling
              this.falling = false
            }
          }
        }

        // Check if this particle has proper support
        hasSupport() {
          // Already checked this particle in this stability check
          if (this.checked) return true
          this.checked = true

          if (!invertedGravity) {
            // NORMAL GRAVITY - Support is below

            // On the bottom row
            if (this.gridY >= rows - 1) return true

            // Check if there's a particle directly below
            if (grid[this.gridX][this.gridY + 1] !== null) {
              // Only consider it support if that particle itself is supported
              return grid[this.gridX][this.gridY + 1].hasSupport()
            }

            // No direct support below, check diagonal support
            let diagonalSupports = 0

            // Check bottom-left
            if (this.gridX > 0 && grid[this.gridX - 1][this.gridY + 1] !== null) {
              if (grid[this.gridX - 1][this.gridY + 1].hasSupport()) {
                diagonalSupports++
              }
            }

            // Check bottom-right
            if (this.gridX < cols - 1 && grid[this.gridX + 1][this.gridY + 1] !== null) {
              if (grid[this.gridX + 1][this.gridY + 1].hasSupport()) {
                diagonalSupports++
              }
            }

            // Need at least one diagonal support
            return diagonalSupports >= 1
          } else {
            // INVERTED GRAVITY - Support is above

            // On the top row
            if (this.gridY <= 0) return true

            // Check if there's a particle directly above
            if (grid[this.gridX][this.gridY - 1] !== null) {
              // Only consider it support if that particle itself is supported
              return grid[this.gridX][this.gridY - 1].hasSupport()
            }

            // No direct support above, check diagonal support
            let diagonalSupports = 0

            // Check top-left
            if (this.gridX > 0 && grid[this.gridX - 1][this.gridY - 1] !== null) {
              if (grid[this.gridX - 1][this.gridY - 1].hasSupport()) {
                diagonalSupports++
              }
            }

            // Check top-right
            if (this.gridX < cols - 1 && grid[this.gridX + 1][this.gridY - 1] !== null) {
              if (grid[this.gridX + 1][this.gridY - 1].hasSupport()) {
                diagonalSupports++
              }
            }

            // Need at least one diagonal support
            return diagonalSupports >= 1
          }
        }

        display() {
          p.noStroke()
          p.fill(inverted ? this.invertedColor : this.color)

          // Draw with a small margin for visual separation
          const margin = 0.5
          p.rect(
            this.gridX * this.size + margin,
            this.gridY * this.size + margin,
            this.size - margin * 2,
            this.size - margin * 2,
          )
        }
      }

      // Setup function
      p.setup = () => {
        // Create canvas to fill the container exactly
        const canvas = p.createCanvas(window.innerWidth, window.innerHeight)

        // Initialize grid
        initGrid()

        // Disable default touch behavior to prevent scrolling
        canvas.touchStarted(() => false)
        canvas.touchMoved(() => false)
        canvas.touchEnded(() => false)
      }

      // Initialize grid
      function initGrid() {
        cols = Math.floor(p.width / CELL_SIZE)
        rows = Math.floor(p.height / CELL_SIZE)

        grid = new Array(cols)
        for (let i = 0; i < cols; i++) {
          grid[i] = new Array(rows).fill(null)
        }
      }

      // Window resize handler
      p.windowResized = () => {
        // Resize canvas to match window size exactly
        p.resizeCanvas(window.innerWidth, window.innerHeight)

        // Save existing particles
        const oldParticles = [...particles]

        // Reinitialize grid
        initGrid()

        // Clear particles array
        particles = []

        // Add back particles that fit in the new grid
        for (const particle of oldParticles) {
          if (particle.gridX < cols && particle.gridY < rows) {
            grid[particle.gridX][particle.gridY] = particle
            particles.push(particle)
          }
        }
      }

      // Check stability of all particles
      function checkGlobalStability() {
        // Reset all checked flags
        for (const particle of particles) {
          particle.checked = false
        }

        if (!invertedGravity) {
          // NORMAL GRAVITY - Check from bottom to top
          for (let j = rows - 1; j >= 0; j--) {
            for (let i = 0; i < cols; i++) {
              if (grid[i][j] !== null && !grid[i][j].falling) {
                if (!grid[i][j].hasSupport()) {
                  grid[i][j].falling = true
                }
              }
            }
          }
        } else {
          // INVERTED GRAVITY - Check from top to bottom
          for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
              if (grid[i][j] !== null && !grid[i][j].falling) {
                if (!grid[i][j].hasSupport()) {
                  grid[i][j].falling = true
                }
              }
            }
          }
        }
      }

      // Simulate earthquake
      function simulateEarthquake() {
        if (!earthquakeActive) return

        // Update earthquake duration
        earthquakeDuration++
        if (earthquakeDuration >= earthquakeMaxDuration) {
          earthquakeActive = false
          earthquakeDuration = 0
          canvasShakeX = 0
          canvasShakeY = 0
          return
        }

        // Calculate shake intensity based on remaining duration
        const progress = earthquakeDuration / earthquakeMaxDuration
        const currentIntensity = earthquakeIntensity * (1 - progress * 0.5)

        // Shake the canvas
        canvasShakeX = p.random(-currentIntensity, currentIntensity)
        canvasShakeY = p.random(-currentIntensity * 0.5, currentIntensity * 0.5)

        // Destabilize particles
        if (earthquakeDuration % 5 === 0) {
          // Every 5 frames
          const shakeThreshold = 0.1 + earthquakeIntensity / 10

          // Loop through particles
          for (const particle of particles) {
            // Skip particles that are already falling
            if (particle.falling) continue

            //  {
            // Skip particles that are already falling
            if (particle.falling) continue

            // Random chance to destabilize based on intensity
            if (p.random() < shakeThreshold) {
              particle.falling = true

              // Random chance to move horizontally
              if (p.random() < 0.3) {
                const direction = p.random() < 0.5 ? -1 : 1
                const newX = particle.gridX + direction

                // Check if the new position is valid
                if (newX >= 0 && newX < cols && grid[newX][particle.gridY] === null) {
                  grid[particle.gridX][particle.gridY] = null
                  particle.gridX = newX
                  grid[newX][particle.gridY] = particle
                }
              }
            }
          }
        }
      }

      // Set move UI mode
      p.setMoveUIMode = (value: boolean) => {
        moveUIMode = value
      }

      // Draw function
      p.draw = () => {
        p.background(inverted ? 255 : 0)

        // Apply earthquake effect
        if (earthquakeActive) {
          p.push()
          p.translate(canvasShakeX, canvasShakeY)
          simulateEarthquake()
        }

        // Draw grid if enabled
        if (showGrid) {
          p.stroke(inverted ? 200 : 50)
          p.strokeWeight(0.5)

          for (let i = 0; i <= cols; i++) {
            p.line(i * CELL_SIZE, 0, i * CELL_SIZE, p.height)
          }

          for (let j = 0; j <= rows; j++) {
            p.line(0, j * CELL_SIZE, p.width, j * CELL_SIZE)
          }
        }

        // Update particles in the appropriate order based on gravity direction
        if (!invertedGravity) {
          // NORMAL GRAVITY - Update from bottom to top
          for (let j = rows - 1; j >= 0; j--) {
            for (let i = 0; i < cols; i++) {
              if (grid[i][j] !== null) {
                grid[i][j].update()
              }
            }
          }
        } else {
          // INVERTED GRAVITY - Update from top to bottom
          for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
              if (grid[i][j] !== null) {
                grid[i][j].update()
              }
            }
          }
        }

        // Periodically check global stability
        frameCount++
        if (frameCount % 10 === 0) {
          checkGlobalStability()
        }

        // Display particles
        for (const particle of particles) {
          particle.display()
        }

        // Reset translation if earthquake was active
        if (earthquakeActive) {
          p.pop()
        }

        // Update particle count
        if (onParticleCountChange) {
          onParticleCountChange(particles.length)
        }

        // Draw brush preview if mouse is over canvas and not in move UI mode
        if (!moveUIMode && p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
          p.noFill()
          p.stroke(inverted ? 0 : 255, 100)
          if (tool === "brush") {
            p.circle(p.mouseX, p.mouseY, brushSize * 2)
          } else {
            p.circle(p.mouseX, p.mouseY, brushSize * 4) // Eraser is larger
          }
        }
      }

      // Mouse/touch interaction
      p.mouseDragged = () => {
        if (moveUIMode) return false // Don't add sand when in move UI mode

        if (tool === "brush") {
          addParticlesAt(p.mouseX, p.mouseY)
        } else {
          eraseParticlesAt(p.mouseX, p.mouseY)
        }
        return false // Prevent default
      }

      p.mousePressed = () => {
        if (moveUIMode) return false // Don't add sand when in move UI mode

        if (tool === "brush") {
          addParticlesAt(p.mouseX, p.mouseY)
        } else {
          eraseParticlesAt(p.mouseX, p.mouseY)
        }
        return false // Prevent default
      }

      // Toggle grid with 'g' key
      p.keyPressed = () => {
        if (p.key === "g" || p.key === "G") {
          showGrid = !showGrid
        }
      }

      // Add particles at position
      function addParticlesAt(x: number, y: number) {
        const count = Math.floor(brushSize / 2)
        for (let i = 0; i < count; i++) {
          const offsetX = p.random(-brushSize, brushSize)
          const offsetY = p.random(-brushSize, brushSize)

          if (offsetX * offsetX + offsetY * offsetY <= brushSize * brushSize) {
            const gridX = Math.floor((x + offsetX) / CELL_SIZE)
            const gridY = Math.floor((y + offsetY) / CELL_SIZE)

            // Check if within grid bounds and cell is empty
            if (gridX >= 0 && gridX < cols && gridY >= 0 && gridY < rows && grid[gridX][gridY] === null) {
              const particle = new Particle(gridX, gridY)
              particles.push(particle)
            }
          }
        }
      }

      // Erase particles near position
      function eraseParticlesAt(x: number, y: number) {
        const eraseRadius = brushSize * 2
        const particlesToRemove = []

        // Find particles to remove
        for (let i = 0; i < particles.length; i++) {
          const particle = particles[i]
          const particleX = (particle.gridX + 0.5) * CELL_SIZE
          const particleY = (particle.gridY + 0.5) * CELL_SIZE

          const dx = particleX - x
          const dy = particleY - y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < eraseRadius) {
            particlesToRemove.push(i)

            // Clear grid cell
            grid[particle.gridX][particle.gridY] = null
          }
        }

        // Remove particles in reverse order to avoid index issues
        for (let i = particlesToRemove.length - 1; i >= 0; i--) {
          particles.splice(particlesToRemove[i], 1)
        }

        // Check stability after erasing
        checkGlobalStability()
      }

      // Reset all particles
      p.resetSand = () => {
        particles = []
        initGrid() // Reset grid
      }

      // Set tool
      p.setTool = (newTool: string) => {
        tool = newTool
      }

      // Set brush size
      p.setBrushSize = (size: number) => {
        brushSize = size
      }

      // Set inverted mode
      p.setInverted = (value: boolean) => {
        inverted = value
      }

      // Set inverted gravity
      p.setInvertedGravity = (value: boolean) => {
        // When changing gravity, make all particles start falling again
        invertedGravity = value
        for (const particle of particles) {
          particle.falling = true
        }
      }

      // Trigger earthquake
      p.triggerEarthquake = (intensity: number) => {
        earthquakeActive = true
        earthquakeIntensity = intensity
        earthquakeDuration = 0

        // Make all particles check stability
        for (const particle of particles) {
          if (!particle.falling) {
            particle.falling = p.random() < intensity / 15
          }
        }

        // Force a global stability check
        checkGlobalStability()
      }
    }

    // Create new p5 instance
    const p5Instance = new p5(sketch, containerRef.current)
    sketchRef.current = p5Instance

    // Pass the p5 instance to parent component
    if (onP5Create) {
      onP5Create(p5Instance)
    }

    // Cleanup on unmount
    return () => {
      if (sketchRef.current) {
        sketchRef.current.remove()
      }
    }
  }, [onP5Create, onParticleCountChange, moveUIMode])

  return <div ref={containerRef} className="w-full h-full" />
}
