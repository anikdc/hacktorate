"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"

interface Position {
  x: number
  y: number
}

interface DraggableOptions {
  defaultPosition: Position
  onPositionChange?: (position: Position) => void
}

export function useDraggable(options: DraggableOptions) {
  const { defaultPosition, onPositionChange } = options

  const [position, setPosition] = useState<Position>(defaultPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Handle mouse down on draggable element
  const handleMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent | any) => {
      // Don't interfere with button clicks
      if (e.target.tagName === "BUTTON" || e.target.closest("button")) return

      e.preventDefault()
      e.stopPropagation()

      const mouseX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0)
      const mouseY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0)

      // Calculate the offset between mouse position and the center of the element
      setDragOffset({
        x: mouseX - position.x,
        y: mouseY - position.y,
      })

      setIsDragging(true)
    },
    [position],
  )

  // Handle mouse move when dragging
  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent | any) => {
      if (!isDragging) return

      e.preventDefault()

      // Get mouse position
      const mouseX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0)
      const mouseY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0)

      // Calculate new position by subtracting the offset
      const newX = mouseX - dragOffset.x
      const newY = mouseY - dragOffset.y

      // Set position
      setPosition({
        x: newX,
        y: newY,
      })

      // Call position change callback if provided
      if (onPositionChange) {
        onPositionChange({ x: newX, y: newY })
      }
    },
    [isDragging, dragOffset, onPositionChange],
  )

  // Handle mouse up to end dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Reset position to default
  const resetPosition = useCallback(() => {
    setPosition(defaultPosition)
  }, [defaultPosition])

  // Add global mouse event listeners for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent | TouchEvent) => handleMouseMove(e)
    const handleGlobalMouseUp = () => handleMouseUp()
    const handleGlobalTouchMove = (e: TouchEvent) => handleMouseMove(e)
    const handleGlobalTouchEnd = () => handleMouseUp()

    if (isDragging) {
      window.addEventListener("mousemove", handleGlobalMouseMove)
      window.addEventListener("mouseup", handleGlobalMouseUp)
      window.addEventListener("touchmove", handleGlobalTouchMove)
      window.addEventListener("touchend", handleGlobalTouchEnd)

      return () => {
        window.removeEventListener("mousemove", handleGlobalMouseMove)
        window.removeEventListener("mouseup", handleGlobalMouseUp)
        window.removeEventListener("touchmove", handleGlobalTouchMove)
        window.removeEventListener("touchend", handleGlobalTouchEnd)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Adjust position if it would be off-screen after resize
      setPosition((prev) => {
        const newX = Math.min(prev.x, window.innerWidth - 20)
        const newY = Math.min(prev.y, window.innerHeight - 20)
        return { x: newX, y: newY }
      })
    }

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return {
    position,
    isDragging,
    handleMouseDown,
    resetPosition,
  }
}
