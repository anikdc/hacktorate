"use client";
import { useRef, useEffect } from "react";
import p5 from "p5";

export default function ConwayBackground() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bgRef.current) return;
    
    const sketch = (p: p5) => {
      // Calculate grid dimensions based on screen size
      let cols = 60; // Increased column count for better screen coverage
      let rows = 40; // Keep original row count
      let grid: number[][] = [];
      // We'll load the Minecraft block image
      let blockImg: p5.Image;
      
      // Preload runs before setup, so we can fetch the block image
      p.preload = () => {
        // Make sure you have `public/minecraft_block.jpg`
        blockImg = p.loadImage("/minecraft_block.jpg");
      };
      
      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight).parent(bgRef.current!);
        p.frameRate(3);
        
        // Initialize random grid
        for (let x = 0; x < cols; x++) {
          grid[x] = [];
          for (let y = 0; y < rows; y++) {
            grid[x][y] = p.floor(p.random(2)); // 0 or 1
          }
        }
      };
      
      p.draw = () => {
        p.background(0);
        
        // Use width divided by columns to ensure full width coverage
        const cellWidth = p.width / cols;
        const cellHeight = p.height / rows;
        
        // No need for explicit centering with full coverage
        const offsetX = 0;
        const offsetY = 0;
        
        // Draw each living cell
        for (let x = 0; x < cols; x++) {
          for (let y = 0; y < rows; y++) {
            if (grid[x][y] === 1) {
              // Draw blocks to fill entire screen
              p.image(
                blockImg,
                x * cellWidth,
                y * cellHeight,
                cellWidth,
                cellHeight
              );
            }
          }
        }
        
        // Compute next generation
        grid = nextGeneration(grid);
      };
      
      function nextGeneration(oldGrid: number[][]) {
        let newG = oldGrid.map((row) => [...row]);
        for (let x = 0; x < cols; x++) {
          for (let y = 0; y < rows; y++) {
            const neighbors = countNeighbors(oldGrid, x, y);
            if (oldGrid[x][y] === 0 && neighbors === 3) {
              newG[x][y] = 1; // Birth
            } else if (
              oldGrid[x][y] === 1 &&
              (neighbors < 2 || neighbors > 3)
            ) {
              newG[x][y] = 0; // Death
            }
          }
        }
        return newG;
      }
      
      function countNeighbors(g: number[][], x: number, y: number) {
        let sum = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            let col = (x + i + cols) % cols;
            let row = (y + j + rows) % rows;
            sum += g[col][row];
          }
        }
        sum -= g[x][y];
        return sum;
      }
      
      // Handle window resize
      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };
    
    const instance = new p5(sketch);
    return () => {
      instance.remove();
    };
  }, []);
  
  return (
    <div
      ref={bgRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
}