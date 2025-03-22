"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  ReferenceLine,
} from "recharts"
import { Card } from "@/components/ui/card"
import { BarChartIcon, LineChartIcon, PieChartIcon, Network, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import analyticsData from "./analytic_data.json"

// Define types for our data structure
interface DailyData {
  gmv: number
  mrp: number
}

interface CategoryData {
  Daywise: {
    [date: string]: DailyData
  }
}

interface AnalyticsData {
  [category: string]: CategoryData
}

// Event types and colors
const EVENT_TYPES = {
  HOLIDAY: { name: "Holiday", color: "bg-red-500" },
  SALE_DAY: { name: "Sale Day", color: "bg-blue-500" },
  PAY_DAY: { name: "Pay Day", color: "bg-green-500" },
}

type EventType = "HOLIDAY" | "SALE_DAY" | "PAY_DAY"

interface CalendarEvent {
  type: EventType
  date?: string
  isRange?: boolean
  startDate?: string
  endDate?: string
}

// Special days definition
const SPECIAL_DAYS = [
  { date: 5, type: "holiday", name: "Memorial Day" },
  { date: 12, type: "saleday", name: "Flash Sale" },
  { date: 15, type: "payday", name: "Payday" },
  { date: 25, type: "saleday", name: "Weekend Sale" },
  { date: 28, type: "payday", name: "End-Month Payday" },
]

// Month and year data
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

// Process the analytics data to create category summaries
const processAnalyticsData = (data: AnalyticsData) => {
  const categories = Object.keys(data).map((categoryName, index) => {
    const categoryData = data[categoryName]

    // Calculate total units (using GMV as a proxy for units)
    const totalGMV = Object.values(categoryData.Daywise).reduce((sum, day) => sum + day.gmv, 0)

    // Generate random percentages for customer metrics (since this data isn't in the JSON)
    const customerRepetitionRate = (20 + Math.random() * 30).toFixed(1) + "%"
    const premiumUnitPercentage = (20 + Math.random() * 30).toFixed(1) + "%"
    const massUnitPercentage = (100 - Number.parseFloat(premiumUnitPercentage)).toFixed(1) + "%"

    // Calculate total sales
    const totalSales = Object.values(categoryData.Daywise).reduce((sum, day) => sum + day.gmv, 0)
    const formattedTotalSales = `$${(totalSales / 1000).toFixed(1)}K`

    // Create customer distribution data
    const customerRepRate = Number.parseFloat(customerRepetitionRate)
    const customerDistribution = [
      { name: "New Customers", value: 100 - customerRepRate },
      { name: "Returning Customers", value: customerRepRate },
    ]

    // Create unit type distribution data
    const premiumRate = Number.parseFloat(premiumUnitPercentage)
    const unitTypeDistribution = [
      { name: "Premium Units", value: premiumRate },
      { name: "Mass Units", value: 100 - premiumRate },
    ]

    // Create daily sales data
    const dailySales = Object.entries(categoryData.Daywise)
      .map(([dateStr, dayData]) => {
        const date = new Date(dateStr)
        const day = date.getDate()

        // Check if this is a special day
        const specialDay = SPECIAL_DAYS.find((sd) => sd.date === day)
          ? {
              date: day,
              type: SPECIAL_DAYS.find((sd) => sd.date === day)?.type || "",
              name: SPECIAL_DAYS.find((sd) => sd.date === day)?.name || "",
            }
          : null

        return {
          date: day,
          gmv: Math.round(dayData.gmv),
          mrp: Math.round(dayData.mrp),
          specialDay,
        }
      })
      .sort((a, b) => a.date - b.date)

    // Create subcategories (since we don't have this data, we'll create some dummy subcategories)
    // Map the category to its actual subcategories based on the provided data
    const getCategorySubcategories = (categoryName: string) => {
      // This mapping is based on the provided CSV data
      const categoryMap: Record<string, string[]> = {
        Camera: ["Camera"],
        CameraAccessory: ["CameraAccessory", "CameraStorage"],
        EntertainmentSmall: [
          "AmplifierReceiver",
          "AudioAccessory",
          "AudioMP3Player",
          "HomeAudio",
          "HomeTheatre",
          "Speaker",
          "TVVideoSmall",
        ],
        GameCDDVD: ["Game", "GameMembershipCards"],
        GamingHardware: ["GamingAccessory", "GamingConsole"],
      }

      return categoryMap[categoryName] || []
    }

    // Get the subcategories for this category
    const subcategoryNames = getCategorySubcategories(categoryName)

    // Create subcategories based on the actual data structure
    const subcategories = subcategoryNames.map((subCatName, subIndex) => {
      // Calculate units for this subcategory (dividing total GMV by number of subcategories)
      const subUnits = Math.round(totalGMV / subcategoryNames.length / 1000)

      // Get verticals for this subcategory
      const getVerticals = (subCatName: string) => {
        // This mapping is based on the provided CSV data
        const verticalMap: Record<string, string[]> = {
          Camera: ["Camcorders", "DSLR", "Instant Cameras", "Point & Shoot", "SportsAndAction"],
          CameraAccessory: [
            "Binoculars",
            "CameraAccessory",
            "CameraBag",
            "CameraBattery",
            "CameraBatteryCharger",
            "CameraBatteryGrip",
            "CameraEyeCup",
            "CameraFilmRolls",
            "CameraHousing",
            "CameraLEDLight",
            "CameraMicrophone",
            "CameraMount",
            "CameraRemoteControl",
            "CameraTripod",
            "ExtensionTube",
            "Filter",
            "Flash",
            "FlashShoeAdapter",
            "Lens",
            "ReflectorUmbrella",
            "Softbox",
            "Strap",
            "Teleconverter",
            "Telescope",
          ],
          CameraStorage: ["CameraStorageMemoryCard"],
          AmplifierReceiver: ["AmplifierReceiver"],
          AudioAccessory: ["Microphone", "MicrophoneAccessory"],
          AudioMP3Player: ["AudioMP3Player"],
          HomeAudio: [
            "BoomBox",
            "DJController",
            "Dock",
            "DockingStation",
            "FMRadio",
            "HiFiSystem",
            "HomeAudioSpeaker",
            "KaraokePlayer",
            "SlingBox",
            "SoundMixer",
            "VoiceRecorder",
          ],
          HomeTheatre: ["HomeTheatre"],
          Speaker: ["LaptopSpeaker", "MobileSpeaker"],
          TVVideoSmall: ["RemoteControl", "SelectorBox", "VideoGlasses", "VideoPlayer"],
          Game: ["CodeInTheBoxGame", "PhysicalGame"],
          GameMembershipCards: ["GameValueCards"],
          GamingAccessory: [
            "CoolingPad",
            "GameControlMount",
            "GamePad",
            "GamingAccessoryKit",
            "GamingAdapter",
            "GamingChargingStation",
            "GamingGun",
            "GamingHeadset",
            "GamingKeyboard",
            "GamingMemoryCard",
            "GamingMouse",
            "GamingMousePad",
            "GamingSpeaker",
            "JoystickGamingWheel",
            "MotionController",
            "TVOutCableAccessory",
          ],
          GamingConsole: ["GamingConsole", "HandheldGamingConsole"],
        }

        return verticalMap[subCatName] || []
      }

      const verticalNames = getVerticals(subCatName)

      // Create verticals with distributed units
      const verticals = verticalNames.map((vertName, vertIndex) => {
        // Distribute units evenly among verticals
        const vertUnits = Math.round((subUnits / verticalNames.length) * (1 + (Math.random() * 0.4 - 0.2)))
        return {
          name: vertName,
          units: vertUnits,
        }
      })

      return {
        id: subIndex + 1,
        name: subCatName,
        units: subUnits,
        verticals:
          verticals.length > 0
            ? verticals
            : [
                { name: "Default", units: Math.round(subUnits * 0.6) },
                { name: "Other", units: Math.round(subUnits * 0.4) },
              ],
      }
    })

    return {
      id: index + 1,
      name: categoryName,
      units: Math.round(totalGMV / 1000), // Divide by 1000 to make the numbers more manageable
      totalSales: formattedTotalSales,
      customerRepetitionRate,
      premiumUnitPercentage,
      massUnitPercentage,
      customerDistribution,
      unitTypeDistribution,
      dailySales,
      subcategories,
    }
  })

  return {
    categories,
    specialDays: SPECIAL_DAYS,
  }
}

// Horizontal Bar Chart Component
const HorizontalBarChart = ({
  data,
  selectedCategoryId,
  onSelectCategory,
}: {
  data: any[]
  selectedCategoryId: number
  onSelectCategory: (id: number) => void
}) => {
  // Transform data for the chart
  const chartData = data.map((category) => ({
    name: category.name,
    units: category.units,
    id: category.id,
    fill: selectedCategoryId === category.id ? "#3B82F6" : "#93C5FD", // Vibrant blue vs lighter blue
  }))

  return (
    <div className="h-full">
      <div className="flex items-center mb-4">
        <BarChartIcon className="w-5 h-5 mr-2 text-purple-500" />
        <h3 className="text-base font-semibold text-gray-800">Units Sold by Category</h3>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid horizontal strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => [`${value} units`, "Units Sold"]} labelFormatter={(value) => `${value}`} />
            <Bar dataKey="units" radius={[0, 4, 4, 0]} onClick={(data) => onSelectCategory(data.id)} cursor="pointer">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Line Chart Component
const SalesLineChart = ({
  data,
  specialDays,
}: {
  data: { date: number; gmv: number; mrp: number; specialDay: any }[]
  specialDays: { date: number; type: string; name: string }[]
}) => {
  // Custom tooltip to show special days
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dayData = data.find((d) => d.date === label)
      const specialDay = dayData?.specialDay

      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="text-sm font-medium">Day {label}</p>
          {specialDay && (
            <p
              className="text-xs font-medium mt-1"
              style={{
                color:
                  specialDay.type === "holiday" ? "#F56565" : specialDay.type === "saleday" ? "#3B82F6" : "#10B981",
              }}
            >
              {specialDay.name}
            </p>
          )}
          <div className="mt-2">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-xs" style={{ color: entry.color }}>
                {entry.name}: ${(entry.value / 1000).toFixed(1)}K
              </p>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-full">
      <div className="flex items-center mb-4">
        <LineChartIcon className="w-5 h-5 mr-2 text-blue-500" />
        <h3 className="text-base font-semibold text-gray-800">Daily Sales (GMV vs MRP)</h3>
      </div>

      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(value) => `${value}`} ticks={[1, 5, 10, 15, 20, 25, 30]} />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="gmv"
              name="GMV"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="mrp"
              name="MRP"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />

            {/* Special day reference lines using Recharts ReferenceLine */}
            {specialDays.map((day, index) => (
              <ReferenceLine
                key={index}
                x={day.date}
                stroke={day.type === "holiday" ? "#F56565" : day.type === "saleday" ? "#3B82F6" : "#10B981"}
                strokeDasharray="4 3"
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Special days legend */}
      <div className="flex flex-wrap justify-center mt-2 text-xs gap-4 bg-gray-50 py-3 rounded-md border border-gray-200">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-sm mr-1"></div>
          <span className="text-gray-700 font-medium">Holiday</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-sm mr-1"></div>
          <span className="text-gray-700 font-medium">Sale Day</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
          <span className="text-gray-700 font-medium">Payday</span>
        </div>
      </div>
    </div>
  )
}

// Pie Chart Component
const PieChartComponent = ({
  data,
  title,
  icon,
}: {
  data: { name: string; value: number }[]
  title: string
  icon: React.ReactNode
}) => {
  // Colors for the pie chart
  const COLORS = ["#3B82F6", "#EF4444"] // Blue, Red

  // Custom tooltip to show exact values
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
          <p className="text-sm font-semibold">{payload[0].name}</p>
          <p className="text-xs font-medium">
            <span className="font-bold">{payload[0].value.toFixed(1)}%</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-full">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="text-sm font-semibold text-gray-800 ml-2">{title}</h3>
      </div>

      <div className="h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Linkage Graph Component
const LinkageGraph = ({ data }: { data: any[] }) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null)

  // Find the selected subcategory data
  const selectedSubcategoryData = data.find((s) => s.id === selectedSubcategory)

  // Colors for the bar chart
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

  return (
    <div className="h-full">
      <div className="flex items-center mb-4">
        <Network className="w-5 h-5 mr-2 text-green-500" />
        <h3 className="text-base font-semibold text-gray-800">Subcategory Linkage</h3>
      </div>
      <div className="flex h-[calc(100%-2rem)]">
        <div className="w-1/2 pr-3 overflow-y-auto max-h-full">
          {data.map((subcategory) => (
            <div
              key={subcategory.id}
              className={`mb-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedSubcategory === subcategory.id
                  ? "bg-green-50 border-green-200 shadow-sm"
                  : "hover:bg-gray-50 border-gray-200"
              }`}
              onClick={() => setSelectedSubcategory(subcategory.id)}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`font-medium text-sm ${selectedSubcategory === subcategory.id ? "text-green-700" : "text-gray-700"}`}
                >
                  {subcategory.name}
                </span>
                <span
                  className={`text-xs ${selectedSubcategory === subcategory.id ? "text-green-600" : "text-gray-500"}`}
                >
                  {subcategory.units} units
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="w-1/2 pl-3 border-l border-gray-200">
          {selectedSubcategory ? (
            <div>
              <h4 className="text-sm font-medium mb-3 text-gray-700">{selectedSubcategoryData?.name} Verticals</h4>

              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={selectedSubcategoryData?.verticals.sort((a: any, b: any) => b.units - a.units)}
                    layout="vertical"
                  >
                    <CartesianGrid horizontal strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value) => [`${value} units`, "Units"]}
                      labelFormatter={(value) => `${value}`}
                    />
                    <Bar dataKey="units" radius={[0, 4, 4, 0]}>
                      {selectedSubcategoryData?.verticals.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-lg">
              Select a subcategory to view verticals
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Month Toggler Component
const MonthToggler = ({
  month,
  year,
  onPrevious,
  onNext,
  onSelectMonth,
}: {
  month: string
  year: number
  onPrevious: () => void
  onNext: () => void
  onSelectMonth: (month: number, year: number) => void
}) => {
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [tempYear, setTempYear] = useState(year)
  const monthPickerRef = useRef<HTMLDivElement>(null)

  // Close the month picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthPickerRef.current && !monthPickerRef.current.contains(event.target as Node)) {
        setShowMonthPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleYearChange = (change: number) => {
    setTempYear((prev) => prev + change)
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
        <button
          onClick={onPrevious}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>

        <button
          onClick={() => setShowMonthPicker(true)}
          className="flex items-center text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md px-2 py-1 transition-colors"
        >
          <Calendar className="h-4 w-4 mr-2 text-purple-500" />
          {month} {year}
        </button>

        <button
          onClick={onNext}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Month Picker Dropdown */}
      {showMonthPicker && (
        <div
          ref={monthPickerRef}
          className="absolute right-0 top-12 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-64"
        >
          <div className="flex justify-between items-center mb-3">
            <button onClick={() => handleYearChange(-1)} className="p-1 hover:bg-gray-100 rounded-full">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-medium">{tempYear}</span>
            <button onClick={() => handleYearChange(1)} className="p-1 hover:bg-gray-100 rounded-full">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {months.map((monthName, index) => (
              <button
                key={monthName}
                onClick={() => {
                  onSelectMonth(index, tempYear)
                  setShowMonthPicker(false)
                }}
                className={`text-sm p-2 rounded-md transition-colors ${
                  month === monthName && year === tempYear
                    ? "bg-purple-100 text-purple-700 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                {monthName.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Function to filter data for a specific month and year
const filterDataForMonth = (data: AnalyticsData, month: number, year: number) => {
  const processedData = { ...data }

  // For each category, filter the daywise data to only include the selected month and year
  Object.keys(processedData).forEach((category) => {
    const categoryData = processedData[category]
    const filteredDaywise: { [key: string]: DailyData } = {}

    Object.entries(categoryData.Daywise).forEach(([dateStr, dayData]) => {
      const date = new Date(dateStr)
      if (date.getMonth() === month && date.getFullYear() === year) {
        filteredDaywise[dateStr] = dayData
      }
    })

    categoryData.Daywise = filteredDaywise
  })

  return processedData
}

// Main component
export default function MonthlyAnalysis() {
  const [data, setData] = useState<any>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1) // Default to first category
  const [currentMonth, setCurrentMonth] = useState<number>(6) // July (0-indexed)
  const [currentYear, setCurrentYear] = useState<number>(2023)

  useEffect(() => {
    // Filter the data for the selected month and year
    const filteredData = filterDataForMonth(analyticsData as unknown as AnalyticsData, currentMonth, currentYear)

    // Process the filtered data
    const processedData = processAnalyticsData(filteredData)

    setData(processedData)

    // If there are no categories for this month/year, reset to the first available month with data
    if (processedData.categories.length === 0) {
      // Find the first month with data
      const allDates = Object.keys(analyticsData.Camera.Daywise)
      if (allDates.length > 0) {
        const firstDate = new Date(allDates[0])
        setCurrentMonth(firstDate.getMonth())
        setCurrentYear(firstDate.getFullYear())
      }
    } else if (selectedCategoryId > processedData.categories.length) {
      // If the selected category is no longer available, select the first one
      setSelectedCategoryId(1)
    }
  }, [currentMonth, currentYear, selectedCategoryId])

  const handleSelectCategory = (categoryId: number) => {
    setSelectedCategoryId(categoryId)
  }

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Add the handleSelectMonth function here where it has access to state setters
  const handleSelectMonth = (monthIndex: number, selectedYear: number) => {
    setCurrentMonth(monthIndex)
    setCurrentYear(selectedYear)
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  // Get the selected category data
  const selectedCategory = data.categories.find((cat: any) => cat.id === selectedCategoryId) || data.categories[0]

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">Category Analysis</h1>
        <MonthToggler
          month={months[currentMonth]}
          year={currentYear}
          onPrevious={handlePreviousMonth}
          onNext={handleNextMonth}
          onSelectMonth={handleSelectMonth}
        />
      </div>

      {/* Top row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Left: Horizontal Bar Chart */}
        <Card className="p-5 bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
          <HorizontalBarChart
            data={data.categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleSelectCategory}
          />
        </Card>

        {/* Top Right: Line Chart */}
        <Card className="p-5 bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
          <SalesLineChart data={selectedCategory?.dailySales || []} specialDays={data.specialDays} />
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bottom Left: Summary Cards and Pie Charts */}
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-white shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <div className="text-sm text-gray-500">Total Sales</div>
              </div>
              <div className="text-xl font-bold text-gray-800 mt-1">{selectedCategory.totalSales}</div>
            </Card>

            <Card className="p-4 bg-white shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <div className="text-sm text-gray-500">Customer Repetition Rate</div>
              </div>
              <div className="text-xl font-bold text-gray-800 mt-1">{selectedCategory.customerRepetitionRate}</div>
            </Card>

            <Card className="p-4 bg-white shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <div className="text-sm text-gray-500">% Premium Units</div>
              </div>
              <div className="text-xl font-bold text-gray-800 mt-1">{selectedCategory.premiumUnitPercentage}</div>
            </Card>

            <Card className="p-4 bg-white shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-1">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                <div className="text-sm text-gray-500">% Mass Units</div>
              </div>
              <div className="text-xl font-bold text-gray-800 mt-1">{selectedCategory.massUnitPercentage}</div>
            </Card>
          </div>

          {/* Pie Charts */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-white shadow-sm rounded-xl border border-gray-100">
              <PieChartComponent
                data={selectedCategory.customerDistribution}
                title="Customer Distribution"
                icon={<PieChartIcon className="w-4 h-4 text-blue-500" />}
              />
            </Card>

            <Card className="p-4 bg-white shadow-sm rounded-xl border border-gray-100">
              <PieChartComponent
                data={selectedCategory.unitTypeDistribution}
                title="Unit Type Distribution"
                icon={<PieChartIcon className="w-4 h-4 text-red-500" />}
              />
            </Card>
          </div>
        </div>

        {/* Bottom Right: Linkage Graph */}
        <Card className="p-5 bg-white shadow-sm rounded-xl  border border-gray-100">
          <LinkageGraph data={selectedCategory.subcategories} />
        </Card>
      </div>
    </div>
  )
}

