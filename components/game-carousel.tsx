"use client"

import { useState } from "react"
import Link from "next/link"

const games = [
  {
    id: 1,
    title: "Minecraft",
    imageUrl: "/placeholder.svg?height=300&width=400",
    price: "$29.99",
    type: "Base Game",
  },
  {
    id: 2,
    title: "Fortnite",
    imageUrl: "/placeholder.svg?height=300&width=400",
    price: "Free",
    type: "Base Game",
  },
  {
    id: 3,
    title: "Valorant",
    imageUrl: "/placeholder.svg?height=300&width=400",
    price: "Free",
    type: "Base Game",
  },
  {
    id: 4,
    title: "Call of Duty",
    imageUrl: "/placeholder.svg?height=300&width=400",
    price: "$59.99",
    type: "Base Game",
  },
  {
    id: 5,
    title: "GTA V",
    imageUrl: "/placeholder.svg?height=300&width=400",
    price: "$29.99",
    type: "Base Game",
  },
  {
    id: 6,
    title: "Apex Legends",
    imageUrl: "/placeholder.svg?height=300&width=400",
    price: "Free",
    type: "Base Game",
  },
  {
    id: 7,
    title: "League of Legends",
    imageUrl: "/placeholder.svg?height=300&width=400",
    price: "Free",
    type: "Base Game",
  },
  {
    id: 8,
    title: "Overwatch 2",
    imageUrl: "/placeholder.svg?height=300&width=400",
    price: "Free",
    type: "Base Game",
  },
]

export default function GameCarousel() {
  const [startIndex, setStartIndex] = useState(0)
  const itemsPerPage = 4

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - itemsPerPage))
  }

  const handleNext = () => {
    setStartIndex((prev) => Math.min(games.length - itemsPerPage, prev + itemsPerPage))
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {games.slice(startIndex, startIndex + itemsPerPage).map((game) => (
          <Link href={game.title === "Minecraft" ? "/games/minecraft" : "#"} key={game.id}>
            <div className="group">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={game.imageUrl || "/placeholder.svg"}
                  alt={game.title}
                  className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 p-3 bg-black/50 backdrop-blur-sm">
                  <span className="text-sm">{game.type}</span>
                </div>
              </div>
              <div className="mt-2">
                <h3 className="font-semibold">{game.title}</h3>
                <p className="text-gray-300">{game.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
