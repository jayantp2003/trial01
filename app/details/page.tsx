"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Calendar, Filter, ChevronDown, Search } from "lucide-react"
const axios = require("axios")

// Parse the provided category data
const categoryData = `super_category,category,sub_category,vertical
CE,Camera,Camera,Camcorders
CE,Camera,Camera,DSLR
CE,Camera,Camera,Instant Cameras
CE,Camera,Camera,Point & Shoot
CE,Camera,Camera,SportsAndAction
CE,CameraAccessory,CameraAccessory,Binoculars
CE,CameraAccessory,CameraAccessory,CameraAccessory
CE,CameraAccessory,CameraAccessory,CameraBag
CE,CameraAccessory,CameraAccessory,CameraBattery
CE,CameraAccessory,CameraAccessory,CameraBatteryCharger
CE,CameraAccessory,CameraAccessory,CameraBatteryGrip
CE,CameraAccessory,CameraAccessory,CameraEyeCup
CE,CameraAccessory,CameraAccessory,CameraFilmRolls
CE,CameraAccessory,CameraAccessory,CameraHousing
CE,CameraAccessory,CameraAccessory,CameraLEDLight
CE,CameraAccessory,CameraAccessory,CameraMicrophone
CE,CameraAccessory,CameraAccessory,CameraMount
CE,CameraAccessory,CameraAccessory,CameraRemoteControl
CE,CameraAccessory,CameraAccessory,CameraTripod
CE,CameraAccessory,CameraAccessory,ExtensionTube
CE,CameraAccessory,CameraAccessory,Filter
CE,CameraAccessory,CameraAccessory,Flash
CE,CameraAccessory,CameraAccessory,FlashShoeAdapter
CE,CameraAccessory,CameraAccessory,Lens
CE,CameraAccessory,CameraAccessory,ReflectorUmbrella
CE,CameraAccessory,CameraAccessory,Softbox
CE,CameraAccessory,CameraAccessory,Strap
CE,CameraAccessory,CameraAccessory,Teleconverter
CE,CameraAccessory,CameraAccessory,Telescope
CE,CameraAccessory,CameraStorage,CameraStorageMemoryCard
CE,EntertainmentSmall,AmplifierReceiver,AmplifierReceiver
CE,EntertainmentSmall,AudioAccessory,Microphone
CE,EntertainmentSmall,AudioAccessory,MicrophoneAccessory
CE,EntertainmentSmall,AudioMP3Player,AudioMP3Player
CE,EntertainmentSmall,HomeAudio,BoomBox
CE,EntertainmentSmall,HomeAudio,DJController
CE,EntertainmentSmall,HomeAudio,Dock
CE,EntertainmentSmall,HomeAudio,DockingStation
CE,EntertainmentSmall,HomeAudio,FMRadio
CE,EntertainmentSmall,HomeAudio,HiFiSystem
CE,EntertainmentSmall,HomeAudio,HomeAudioSpeaker
CE,EntertainmentSmall,HomeAudio,KaraokePlayer
CE,EntertainmentSmall,HomeAudio,SlingBox
CE,EntertainmentSmall,HomeAudio,SoundMixer
CE,EntertainmentSmall,HomeAudio,VoiceRecorder
CE,EntertainmentSmall,HomeTheatre,HomeTheatre
CE,EntertainmentSmall,Speaker,\\N
CE,EntertainmentSmall,Speaker,LaptopSpeaker
CE,EntertainmentSmall,Speaker,MobileSpeaker
CE,EntertainmentSmall,TVVideoSmall,RemoteControl
CE,EntertainmentSmall,TVVideoSmall,SelectorBox
CE,EntertainmentSmall,TVVideoSmall,VideoGlasses
CE,EntertainmentSmall,TVVideoSmall,VideoPlayer
CE,GameCDDVD,Game,CodeInTheBoxGame
CE,GameCDDVD,Game,PhysicalGame
CE,GameCDDVD,GameMembershipCards,GameValueCards
CE,GamingHardware,GamingAccessory,CoolingPad
CE,GamingHardware,GamingAccessory,GameControlMount
CE,GamingHardware,GamingAccessory,GamePad
CE,GamingHardware,GamingAccessory,GamingAccessoryKit
CE,GamingHardware,GamingAccessory,GamingAdapter
CE,GamingHardware,GamingAccessory,GamingChargingStation
CE,GamingHardware,GamingAccessory,GamingGun
CE,GamingHardware,GamingAccessory,GamingHeadset
CE,GamingHardware,GamingAccessory,GamingKeyboard
CE,GamingHardware,GamingAccessory,GamingMemoryCard
CE,GamingHardware,GamingAccessory,GamingMouse
CE,GamingHardware,GamingAccessory,GamingMousePad
CE,GamingHardware,GamingAccessory,GamingSpeaker
CE,GamingHardware,GamingAccessory,JoystickGamingWheel
CE,GamingHardware,GamingAccessory,MotionController
CE,GamingHardware,GamingAccessory,TVOutCableAccessory
CE,GamingHardware,GamingConsole,GamingConsole
CE,GamingHardware,GamingConsole,HandheldGamingConsole`

// Process the category data
const processedData = (() => {
  const lines = categoryData.split("\n").slice(1) // Skip header

  // Extract unique categories
  const categories = [...new Set(lines.map((line) => line.split(",")[1]))]

  // Create subcategories mapping
  const subcategories: Record<string, string[]> = {}
  categories.forEach((category) => {
    subcategories[category] = [
      ...new Set(lines.filter((line) => line.split(",")[1] === category).map((line) => line.split(",")[2])),
    ]
  })

  // Create verticals mapping
  const verticalMap: Record<string, Record<string, string[]>> = {}
  categories.forEach((category) => {
    verticalMap[category] = {}
    subcategories[category].forEach((subcategory) => {
      verticalMap[category][subcategory] = [
        ...new Set(
          lines
            .filter((line) => line.split(",")[1] === category && line.split(",")[2] === subcategory)
            .map((line) => line.split(",")[3]),
        ),
      ]
    })
  })

  return { categories, subcategories, verticalMap }
})()

// Update the MiniChart component to handle zero values properly
function MiniChart({ data }: { data: number[] }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min
  const allZero = data.every((value) => value === 0)

  return (
    <div className="w-20 h-8">
      <svg width="100%" height="100%" viewBox="0 0 70 30">
        {allZero ? (
          // Display a flat line when all values are zero
          <line x1="0" y1="25" x2="70" y2="25" stroke="#d1d5db" strokeWidth="2" />
        ) : (
          data.map((value, index) => {
            const normalizedHeight = range === 0 ? (value > 0 ? 15 : 0) : ((value - min) / range) * 20
            return (
              <rect
                key={index}
                x={index * 10}
                y={30 - normalizedHeight}
                width="8"
                height={normalizedHeight || 0}
                fill="#4f46e5"
                opacity={0.7 + index * 0.05}
                rx="1"
              />
            )
          })
        )}
      </svg>
    </div>
  )
}

export default function YearlyAnalysis() {
  // State for filters
  const [startDate, setStartDate] = useState<string>("2023-07-16")
  const [endDate, setEndDate] = useState<string>("2023-07-25")
  const [selectedCategory, setSelectedCategory] = useState<string>("Camera")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("Camera")
  const [selectedVertical, setSelectedVertical] = useState<string>("Camcorders")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [availableVerticals, setAvailableVerticals] = useState<string[]>([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)

  // Table data state
  const [tableData, setTableData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Update available subcategories based on selected category
  const availableSubcategories = processedData.subcategories[selectedCategory] || []

  // Update available verticals when category or subcategory changes
  useEffect(() => {
    if (selectedCategory && selectedSubcategory) {
      const verticals = processedData.verticalMap[selectedCategory]?.[selectedSubcategory] || []
      setAvailableVerticals(verticals)

      // If current vertical is not in the list, select the first one
      if (verticals.length > 0 && !verticals.includes(selectedVertical)) {
        setSelectedVertical(verticals[0])
      }
    }
  }, [selectedCategory, selectedSubcategory, selectedVertical])

  // Filter data based on search query
  const filteredData = tableData.filter((item) => item.fsn_id.toLowerCase().includes(searchQuery.toLowerCase()))

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  // Apply filters function
  const applyFilters = async () => {
    setIsLoading(true)
    try {
      console.log("Applying filters:", {
        category: selectedCategory,
        sub_category: selectedSubcategory,
        vertical: selectedVertical,
        start_date: startDate,
        end_date: endDate,
      })

      const response = await axios.post(
        "https://gcdata-753048278340.us-central1.run.app/get_details",
        {
          category: selectedCategory,
          sub_category: selectedSubcategory,
          vertical: selectedVertical,
          start_date: startDate,
          end_date: endDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      console.log("API Response:", response.data)

      // Transform the response data to match the table format
      const transformedData = Object.entries(response.data).map(([fsn_id, data]: [string, any]) => {
        return {
          fsn_id,
          totalSales: data.Total_sales || 0,
          units: data.total_units || 0,
          avgSLA: data.avg_sla === "NA" ? "N/A" : data.avg_sla,
          codPercentage:
            data.total_cod > 0 ? Math.round((data.total_cod / (data.total_cod + data.total_prepaid)) * 100) : 0,
          prepaidPercentage:
            data.total_prepaid > 0 ? Math.round((data.total_prepaid / (data.total_cod + data.total_prepaid)) * 100) : 0,
          last7Days: data.last_week || [0, 0, 0, 0, 0, 0, 0, 0],
        }
      })

      setTableData(transformedData)
      // Reset to first page when filters change
      setCurrentPage(1)
    } catch (error) {
      console.error("Error fetching data:", error)
      alert("Error fetching data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">Details</h1>
      </div>

      {/* Filter section */}
      <Card className="p-4 bg-white shadow-sm rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full text-sm p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Calendar className="h-4 w-4" /> End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full text-sm p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Filter className="h-4 w-4" /> Category
            </label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  const newCategory = e.target.value
                  setSelectedCategory(newCategory)
                  // Set default subcategory when category changes
                  const defaultSubcategory = processedData.subcategories[newCategory][0] || ""
                  setSelectedSubcategory(defaultSubcategory)
                }}
                className="w-full text-sm p-2 border border-gray-300 rounded appearance-none pr-8"
              >
                {processedData.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Filter className="h-4 w-4" /> Subcategory
            </label>
            <div className="relative">
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full text-sm p-2 border border-gray-300 rounded appearance-none pr-8"
              >
                {availableSubcategories.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
              <Filter className="h-4 w-4" /> Vertical
            </label>
            <div className="relative">
              <select
                value={selectedVertical}
                onChange={(e) => setSelectedVertical(e.target.value)}
                className="w-full text-sm p-2 border border-gray-300 rounded appearance-none pr-8"
              >
                {availableVerticals.map((vertical) => (
                  <option key={vertical} value={vertical}>
                    {vertical}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search by FSN ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm p-2 pl-8 border border-gray-300 rounded"
            />
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          <button
            onClick={applyFilters}
            disabled={isLoading}
            className={`text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Loading..." : "Apply Filters"}
          </button>
        </div>
      </Card>

      {/* Data table */}
      <Card className="p-4 bg-white shadow-sm rounded-lg overflow-hidden">
        <h2 className="text-base font-medium text-gray-700 mb-4">Product Performance</h2>
        {tableData.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2.5 text-left font-medium text-gray-600 border-b">FSN ID</th>
                    <th className="px-4 py-2.5 text-right font-medium text-gray-600 border-b">Total Sales</th>
                    <th className="px-4 py-2.5 text-right font-medium text-gray-600 border-b">Units</th>
                    <th className="px-4 py-2.5 text-right font-medium text-gray-600 border-b">Avg. SLA</th>
                    <th className="px-4 py-2.5 text-center font-medium text-gray-600 border-b">%COD | %Prepaid</th>
                    <th className="px-4 py-2.5 text-center font-medium text-gray-600 border-b">Last 7 Days</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-2.5 border-b border-gray-100 font-medium">{row.fsn_id}</td>
                      <td className="px-4 py-2.5 border-b border-gray-100 text-right">
                        ${row.totalSales.toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 border-b border-gray-100 text-right">{row.units.toLocaleString()}</td>
                      <td className="px-4 py-2.5 border-b border-gray-100 text-right">
                        {typeof row.avgSLA === "string" ? row.avgSLA : `${row.avgSLA} days`}
                      </td>

                      <td className="px-4 py-2.5 border-b border-gray-100">
                        <div className="flex flex-col items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                            {row.codPercentage === 0 && row.prepaidPercentage === 0 ? (
                              <div className="bg-gray-400 h-2 rounded-full w-full"></div>
                            ) : (
                              <div
                                className="bg-blue-600 h-2 rounded-l-full"
                                style={{ width: `${row.codPercentage}%` }}
                              ></div>
                            )}
                          </div>
                          <div className="flex justify-between w-full">
                            <span
                              className={`text-xs font-medium ${row.codPercentage === 0 ? "text-gray-400" : "text-blue-600"}`}
                            >
                              {row.codPercentage}%
                            </span>
                            <span
                              className={`text-xs font-medium ${row.prepaidPercentage === 0 ? "text-gray-400" : "text-green-600"}`}
                            >
                              {row.prepaidPercentage}%
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-2.5 border-b border-gray-100 flex justify-center">
                        <MiniChart data={row.last7Days} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-3">
                <span>
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} products
                </span>
                <div className="flex items-center ml-4">
                  <span className="mr-2">Rows:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value))
                      setCurrentPage(1) // Reset to first page when changing rows per page
                    }}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  className={`px-3 py-1.5 border rounded ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-50 hover:bg-gray-100"}`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                  // Show pages around current page
                  let pageNum = i + 1
                  if (currentPage > 2 && totalPages > 3) {
                    pageNum = currentPage - 1 + i
                    if (pageNum > totalPages) pageNum = totalPages - (2 - i)
                  }

                  return (
                    <button
                      key={i}
                      className={`px-3 py-1.5 border rounded ${currentPage === pageNum ? "bg-blue-50 text-blue-600 border-blue-200" : "hover:bg-gray-100"}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  )
                })}

                <button
                  className={`px-3 py-1.5 border rounded ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-50 hover:bg-gray-100"}`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="py-8 text-center text-gray-500">Click "Apply Filters" to load data</div>
        )}
      </Card>
    </div>
  )
}

