"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, LineChart, PieChart, Wallet, Info, Cloud } from "lucide-react"
import { useState } from "react"

// Navigation items configuration
const navItems = [
  {
    path: "/yearly-analysis",
    name: "Yearly Analysis",
    icon: BarChart3,
    color: "from-blue-600 to-blue-400",
  },
  {
    path: "/climate-discount-analysis",
    name: "Climate Discount",
    icon: Cloud,
    color: "from-yellow-600 to-yellow-400",
  },
  {
    path: "/monthly-analysis",
    name: "Monthly Analysis",
    icon: LineChart,
    color: "from-purple-600 to-purple-400",
  },
  {
    path: "/category-analysis",
    name: "Categories",
    icon: PieChart,
    color: "from-green-600 to-green-400",
  },
  {
    path: "/investments",
    name: "Investments",
    icon: Wallet,
    color: "from-orange-600 to-orange-400",
  },
  {
    path: "/details",
    name: "Details",
    icon: Info,
    color: "from-red-600 to-red-400",
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <aside className="w-16 h-full bg-white border-r border-gray-200 shadow-sm flex flex-col">
      {/* Navigation buttons - equally spaced */}
      <div className="flex-1 flex flex-col justify-evenly py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          const Icon = item.icon
          const isHovered = hoveredItem === item.path

          return (
            <div key={item.path} className="relative flex justify-center">
              <Link
                href={item.path}
                className="relative"
                aria-label={item.name}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? `bg-gradient-to-br ${item.color} text-white`
                      : "bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                {/* Tooltip that appears on hover */}
                {isHovered && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-50 shadow-lg">
                    {item.name}
                    <div className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 border-[6px] border-transparent border-r-gray-800"></div>
                  </div>
                )}
              </Link>
            </div>
          )
        })}
      </div>
    </aside>
  )
}

