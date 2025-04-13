"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"

interface SandGameState {
  brushSize: number
  tool: "brush" | "eraser"
  particleCount: number
  inverted: boolean
  invertedGravity: boolean
  disasterIntensity: number
  showDisasterControls: boolean
  isCollapsed: boolean
}

interface SandGameActions {
  setBrushSize: (size: number) => void
  setTool: (tool: "brush" | "eraser") => void
  setParticleCount: (count: number) => void
  toggleInverted: () => void
  toggleGravity: () => void
  setDisasterIntensity: (intensity: number) => void
  toggleDisasterControls: (e: React.MouseEvent) => void
  toggleCollapsed: (e: React.MouseEvent) => void
  handleReset: () => void
  resetUI: () => void
}

export function useSandGame(p5Instance: any | null) {
  // State
  const [brushSize, setBrushSize] = useState(10)
  const [tool, setTool] = useState<"brush" | "eraser">("brush")
  const [particleCount, setParticleCount] = useState(0)
  const [inverted, setInverted] = useState(false)
  const [invertedGravity, setInvertedGravity] = useState(false)
  const [disasterIntensity, setDisasterIntensity] = useState(5)
  const [showDisasterControls, setShowDisasterControls] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Update tool in p5 sketch
  useEffect(() => {
    if (p5Instance) {
      p5Instance.setTool(tool)
    }
  }, [tool, p5Instance])

  // Update brush size in p5 sketch
  useEffect(() => {
    if (p5Instance) {
      p5Instance.setBrushSize(brushSize)
    }
  }, [brushSize, p5Instance])

  // Reset all particles
  const handleReset = useCallback(() => {
    if (p5Instance) {
      p5Instance.resetSand()
    }
  }, [p5Instance])

  // Toggle inverted colors
  const toggleInverted = useCallback(() => {
    setInverted((prev) => {
      const newValue = !prev
      if (p5Instance) {
        p5Instance.setInverted(newValue)
      }
      return newValue
    })
  }, [p5Instance])

  // Toggle inverted gravity
  const toggleGravity = useCallback(() => {
    setInvertedGravity((prev) => {
      const newValue = !prev
      if (p5Instance) {
        p5Instance.setInvertedGravity(newValue)
      }
      return newValue
    })
  }, [p5Instance])

  // Trigger earthquake
  const triggerEarthquake = useCallback(() => {
    if (p5Instance) {
      p5Instance.triggerEarthquake(disasterIntensity)
    }
  }, [p5Instance, disasterIntensity])

  // Toggle collapsed state
  const toggleCollapsed = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setIsCollapsed((prev) => !prev)
  }, [])

  // Toggle disaster controls
  const toggleDisasterControls = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDisasterControls((prev) => !prev)
  }, [])

  // Reset UI to default state
  const resetUI = useCallback(() => {
    setIsCollapsed(false)
    setShowDisasterControls(false)

    // Reset toggles
    if (inverted) {
      setInverted(false)
      if (p5Instance) {
        p5Instance.setInverted(false)
      }
    }

    if (invertedGravity) {
      setInvertedGravity(false)
      if (p5Instance) {
        p5Instance.setInvertedGravity(false)
      }
    }

    // Reset tool to brush
    setTool("brush")
    if (p5Instance) {
      p5Instance.setTool("brush")
    }

    // Reset brush size
    setBrushSize(10)
    if (p5Instance) {
      p5Instance.setBrushSize(10)
    }
  }, [p5Instance, inverted, invertedGravity])

  return {
    // State
    state: {
      brushSize,
      tool,
      particleCount,
      inverted,
      invertedGravity,
      disasterIntensity,
      showDisasterControls,
      isCollapsed,
    },
    // Actions
    actions: {
      setBrushSize,
      setTool,
      setParticleCount,
      toggleInverted,
      toggleGravity,
      setDisasterIntensity,
      toggleDisasterControls,
      toggleCollapsed,
      handleReset,
      resetUI,
      triggerEarthquake,
    },
  }
}
