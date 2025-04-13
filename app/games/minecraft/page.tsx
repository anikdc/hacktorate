import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Download, Heart, Play, Share2 } from "lucide-react"
import SandGame from "@/components/sand-game"

export default function MinecraftPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between p-4 bg-[#202020]">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold">
            CUBE GAMES
          </Link>
          <Link href="/store" className="hover:text-gray-300">
            Store
          </Link>
          <Link href="/library" className="hover:text-gray-300">
            Library
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="text-white">
            Sign In
          </Button>
          <Button className="bg-[#0074E4] hover:bg-[#0066CC]">Download</Button>
        </div>
      </nav>

      {/* Game Header */}
      <div className="relative">
        {/* Video Trailer */}
        <div className="w-full h-[500px] bg-black relative">
          <video
            className="w-full h-full object-cover opacity-70"
            poster="/placeholder.svg?height=600&width=1200"
            autoPlay
            muted
            loop
          >
            <source src="#" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>

          {/* Game Info Overlay */}
          <div className="absolute bottom-0 left-0 p-8 w-full">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Minecraft</h1>
                  <p className="text-gray-300 mb-4 max-w-2xl">
                    Build, explore, and survive in a blocky world of endless possibilities.
                  </p>
                  <div className="flex items-center space-x-4">
                    <Button className="bg-[#0074E4] hover:bg-[#0066CC]">
                      <Play className="h-4 w-4 mr-2" />
                      Play Now
                    </Button>
                    <Button variant="outline">
                      <Heart className="h-4 w-4 mr-2" />
                      Add to Wishlist
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="text-2xl font-bold">$29.99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <div className="flex space-x-8">
            <TabButton active>Overview</TabButton>
            <TabButton>Features</TabButton>
            <TabButton>System Requirements</TabButton>
          </div>
        </div>

        {/* Game Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">About Minecraft</h2>
            <p className="text-gray-300 mb-6">
              Minecraft is a game about placing blocks and going on adventures. Explore randomly generated worlds and
              build amazing things from the simplest of homes to the grandest of castles. Play in Creative Mode with
              unlimited resources or mine deep into the world in Survival Mode, crafting weapons and armor to fend off
              dangerous mobs.
            </p>

            <h2 className="text-2xl font-bold mb-4">Key Features</h2>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>Unlimited world to explore and build in</li>
              <li>Multiple game modes: Survival, Creative, Adventure, and Spectator</li>
              <li>Craft tools, armor, and weapons to survive</li>
              <li>Build structures from simple houses to complex redstone mechanisms</li>
              <li>Play with friends in multiplayer mode</li>
              <li>Regular updates with new content and features</li>
            </ul>

            <h2 className="text-2xl font-bold mb-4">Real-Time Sand Painter</h2>
            <p className="text-gray-300 mb-4">
              Try out our interactive sand physics simulator inspired by Minecraft's sand blocks!
            </p>

            {/* Sand Game Component */}
            <div className="w-full h-[500px] bg-black rounded-lg overflow-hidden mb-8">
              <SandGame />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#202020] rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Game Info</h3>

              <div className="space-y-4">
                <InfoItem label="Developer" value="Mojang Studios" />
                <InfoItem label="Publisher" value="Mojang Studios" />
                <InfoItem label="Release Date" value="November 18, 2011" />
                <InfoItem label="Platform" value="PC, Console, Mobile" />
                <InfoItem label="Genre" value="Sandbox, Survival" />
                <InfoItem label="Age Rating" value="E10+" />
              </div>

              <div className="mt-6">
                <Button className="w-full bg-[#0074E4] hover:bg-[#0066CC]">
                  <Download className="h-4 w-4 mr-2" />
                  Download Now
                </Button>
              </div>
            </div>

            <div className="bg-[#202020] rounded-lg p-6 mt-6">
              <h3 className="text-xl font-bold mb-4">Similar Games</h3>

              <div className="space-y-4">
                <SimilarGameItem title="Terraria" imageUrl="/placeholder.svg?height=100&width=200" price="$9.99" />
                <SimilarGameItem title="Roblox" imageUrl="/placeholder.svg?height=100&width=200" price="Free" />
                <SimilarGameItem
                  title="Stardew Valley"
                  imageUrl="/placeholder.svg?height=100&width=200"
                  price="$14.99"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#202020] py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">Cube Games</h3>
              <p className="text-gray-400 max-w-md">
                The best destination for digital games with exclusive deals and a curated selection of titles.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Resources</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Help
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Connect</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white">
                      Twitter
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Discord
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white">
                      Facebook
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>© 2023 Cube Games. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function TabButton({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <button className={`pb-4 px-2 font-medium relative ${active ? "text-white" : "text-gray-400 hover:text-white"}`}>
      {children}
      {active && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#0074E4]"></div>}
    </button>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-gray-400">{label}:</span>
      <span className="ml-2 text-white">{value}</span>
    </div>
  )
}

function SimilarGameItem({ title, imageUrl, price }: { title: string; imageUrl: string; price: string }) {
  return (
    <div className="flex items-center space-x-3">
      <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-16 h-16 object-cover rounded" />
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-400">{price}</p>
      </div>
    </div>
  )
}
