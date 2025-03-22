"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Plus, DollarSign, TrendingUp, X, ChevronLeft, ChevronRight } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isWithinInterval,
} from "date-fns"

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

// Investment streams
const INVESTMENT_STREAMS = [
  { id: "TV", name: "TV Advertising", description: "Television commercials and sponsorships" },
  { id: "Digital", name: "Digital Advertising", description: "Online display and video ads" },
  { id: "Sponsorship", name: "Sponsorships", description: "Event and content sponsorships" },
  { id: "ContentMarketing", name: "Content Marketing", description: "Blog posts, videos, infographics" },
  { id: "OnlineMarketing", name: "Online Marketing", description: "Social media and email campaigns" },
  { id: "Affiliates", name: "Affiliate Marketing", description: "Commission-based partnerships" },
  { id: "SEM", name: "Search Engine Marketing", description: "Google Ads, Bing Ads" },
  { id: "Other", name: "Other Channels", description: "PR, events, and miscellaneous" },
]

// Request and response interfaces
interface InvestmentRequest {
  month: number
  holiday: string[]
  salesday: string[]
}

interface InvestmentResponse {
  TV: number
  Digital: number
  Sponsorship: number
  ContentMarketing: number
  OnlineMarketing: number
  Affiliates: number
  SEM: number
  Other: number
}

// Calendar component
const CalendarDisplay = ({
  currentDate,
  events,
  onPrevMonth,
  onNextMonth,
}: {
  currentDate: Date
  events: CalendarEvent[]
  onPrevMonth: () => void
  onNextMonth: () => void
}) => {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get day names for header
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  // Check if a date has events
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      if (event.isRange && event.startDate && event.endDate) {
        return isWithinInterval(date, {
          start: new Date(event.startDate),
          end: new Date(event.endDate),
        })
      } else if (event.date) {
        return isSameDay(date, new Date(event.date))
      }
      return false
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
        <button
          onClick={onPrevMonth}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>

        <h2 className="text-lg font-semibold text-gray-800">{format(currentDate, "MMMM yyyy")}</h2>

        <button
          onClick={onNextMonth}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="p-4">
        {/* Day names header */}
        <div className="grid grid-cols-7 mb-3">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`empty-start-${i}`} className="h-12 rounded-md"></div>
          ))}

          {days.map((day) => {
            const dayEvents = getEventsForDate(day)
            const hasEvents = dayEvents.length > 0

            return (
              <div
                key={day.toString()}
                className={`h-12 rounded-md flex flex-col items-center justify-center relative border ${
                  !isSameMonth(day, currentDate)
                    ? "text-gray-300 border-transparent"
                    : hasEvents
                      ? "border-gray-200 bg-gray-50"
                      : "border-gray-100 hover:bg-gray-50"
                }`}
              >
                <span className={`text-sm ${hasEvents ? "font-medium" : ""}`}>{format(day, "d")}</span>

                {hasEvents && (
                  <div className="flex mt-1 space-x-1">
                    {dayEvents.map((event, i) => (
                      <div
                        key={`event-${i}`}
                        className={`w-2 h-2 rounded-full ${EVENT_TYPES[event.type].color}`}
                        title={EVENT_TYPES[event.type].name}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {Array.from({ length: 6 - monthEnd.getDay() }).map((_, i) => (
            <div key={`empty-end-${i}`} className="h-12 rounded-md"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Add Event Modal
const AddEventModal = ({
  isOpen,
  onClose,
  onAddEvent,
}: {
  isOpen: boolean
  onClose: () => void
  onAddEvent: (event: CalendarEvent) => void
}) => {
  const [eventType, setEventType] = useState<EventType>("HOLIDAY")
  const [isRange, setIsRange] = useState(false)
  const [date, setDate] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newEvent: CalendarEvent = isRange
      ? { type: eventType, isRange, startDate, endDate }
      : { type: eventType, isRange, date }

    onAddEvent(newEvent)
    onClose()

    // Reset form
    setEventType("HOLIDAY")
    setIsRange(false)
    setDate("")
    setStartDate("")
    setEndDate("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Add Event</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(EVENT_TYPES).map(([key, { name, color }]) => (
                  <label
                    key={key}
                    className={`flex items-center p-3 rounded-md border cursor-pointer transition-colors ${
                      eventType === (key as EventType)
                        ? `${color.replace("bg-", "border-")} bg-opacity-10 ${color.replace("bg-", "bg-")}`
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="eventType"
                      value={key}
                      checked={eventType === (key as EventType)}
                      onChange={() => setEventType(key as EventType)}
                      className="sr-only"
                    />
                    <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
                    <span className="text-sm">{name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Type</label>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="dateType"
                    checked={!isRange}
                    onChange={() => setIsRange(false)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Single Day</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="dateType"
                    checked={isRange}
                    onChange={() => setIsRange(true)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Date Range</span>
                </label>
              </div>
            </div>

            {/* Date Selection */}
            {!isRange ? (
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700"
              >
                Add Event
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// Investment Slider
const InvestmentSlider = ({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
          <DollarSign className="h-5 w-5 text-green-600" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">Investment Amount</h2>
      </div>

      <div className="space-y-6">
        <div className="flex justify-center">
          <span className="text-3xl font-bold text-gray-800">${value.toFixed(2)}</span>
        </div>

        <input
          type="range"
          min="1000"
          max="100000"
          step="100"
          value={value}
          onChange={(e) => onChange(Number.parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
        />

        <div className="flex justify-between text-xs text-gray-500 font-medium">
          <span>$1,000</span>
          <span>$100,000</span>
        </div>
      </div>
    </div>
  )
}

// Add Event Button Card
const AddEventCard = ({ onClick }: { onClick: () => void }) => {
  return (
    <Card
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-73 flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
          <Plus className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-800">Add Event</h3>
          <p className="text-xs text-gray-500">Schedule holidays, sale days, and paydays</p>
        </div>
      </div>
    </Card>
  )
}

// Predict Distribution Button
const PredictButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center px-4 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
    >
      <TrendingUp className="h-6 w-6 mr-3" />
      <span className="text-lg font-medium">Predict Distribution</span>
    </button>
  )
}

// Event Legend Card
const EventLegendCard = () => {
  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Event Legend</h3>
      <div className="flex flex-wrap gap-4">
        {Object.entries(EVENT_TYPES).map(([key, { name, color }]) => (
          <div key={key} className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
            <span className="text-sm text-gray-600">{name}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

// Investment Distribution Card
const DistributionCard = ({
  stream,
  percentage,
  isHighest,
  investmentAmount,
}: {
  stream: { id: string; name: string; description: string }
  percentage: number
  isHighest: boolean
  investmentAmount: number
}) => {
  return (
    <Card
      className={`p-5 border ${isHighest ? "border-green-300 bg-green-50" : "border-gray-100"} rounded-xl transition-all hover:shadow-md h-full`}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`font-semibold text-base ${isHighest ? "text-green-700" : "text-gray-700"}`}>{stream.name}</h3>
          <span className={`text-xl font-bold ${isHighest ? "text-green-600" : "text-gray-800"}`}>
            {percentage.toFixed(2)}%
          </span>
        </div>

        <p className="text-xs text-gray-500 mb-4 flex-grow">{stream.description}</p>

        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className={`h-2.5 rounded-full ${isHighest ? "bg-green-500" : "bg-blue-400"}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="mt-2 text-xs text-right">
          <span className={isHighest ? "text-green-600 font-medium" : "text-gray-500"}>
            ${((investmentAmount * percentage) / 100).toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  )
}

// Function to calculate investment distribution based on request data
// const calculateDistribution = (request: InvestmentRequest): InvestmentResponse => {
//   // This is where you would implement your actual distribution algorithm
//   // For this example, we'll create a simple algorithm based on the month and events

//   // Base distribution - will be adjusted based on inputs
//   const baseDistribution = {
//     TV: 0.2,
//     Digital: 0.25,
//     Sponsorship: 0.15,
//     ContentMarketing: 0.1,
//     OnlineMarketing: 0.1,
//     Affiliates: 0.08,
//     SEM: 0.07,
//     Other: 0.05,
//   }

//   // Adjust based on month (seasonal factors)
//   const monthFactor = (request.month % 12) / 12 // 0-1 value based on month

//   // Adjust based on number of holidays
//   const holidayFactor = request.holiday.length * 0.02

//   // Adjust based on number of sales days
//   const salesFactor = request.salesday.length * 0.03

//   // Apply adjustments (this is a simplified example)
//   const result: InvestmentResponse = {
//     TV: Math.min(0.9, baseDistribution.TV + monthFactor * 0.1 - salesFactor * 0.05),
//     Digital: Math.min(0.9, baseDistribution.Digital + salesFactor * 0.1),
//     Sponsorship: Math.min(0.9, baseDistribution.Sponsorship + holidayFactor * 0.1),
//     ContentMarketing: Math.min(0.9, baseDistribution.ContentMarketing + monthFactor * 0.05 + holidayFactor * 0.02),
//     OnlineMarketing: Math.min(0.9, baseDistribution.OnlineMarketing + salesFactor * 0.08),
//     Affiliates: Math.min(0.9, baseDistribution.Affiliates + salesFactor * 0.03),
//     SEM: Math.min(0.9, baseDistribution.SEM + salesFactor * 0.04),
//     Other: Math.min(0.9, baseDistribution.Other + holidayFactor * 0.01),
//   }

//   return result
// }

export default function InvestmentPlanner() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [investmentAmount, setInvestmentAmount] = useState(10000)
  const [distribution, setDistribution] = useState<{ id: string; percentage: number }[]>([])
  const [isPredicted, setIsPredicted] = useState(false)
  const [requestData, setRequestData] = useState<InvestmentRequest>({
    month: new Date().getMonth() + 1, // 1-12 for months
    holiday: [],
    salesday: [],
  })

  // Update request data when events or month changes
  useEffect(() => {
    const month = currentDate.getMonth() + 1 // 1-12 for months

    // Extract holidays and sales days from events
    const holidays: string[] = []
    const salesDays: string[] = []

    events.forEach((event) => {
      const dateStr = event.date || ""
      if (event.type === "HOLIDAY" && dateStr) {
        holidays.push(dateStr)
      } else if (event.type === "SALE_DAY" && dateStr) {
        salesDays.push(dateStr)
      }

      // Handle date ranges
      if (event.isRange && event.startDate && event.endDate) {
        const start = new Date(event.startDate)
        const end = new Date(event.endDate)
        const days = eachDayOfInterval({ start, end })

        days.forEach((day) => {
          const dayStr = format(day, "yyyy-MM-dd")
          if (event.type === "HOLIDAY") {
            holidays.push(dayStr)
          } else if (event.type === "SALE_DAY") {
            salesDays.push(dayStr)
          }
        })
      }
    })

    setRequestData({
      month,
      holiday: holidays,
      salesday: salesDays,
    })
  }, [events, currentDate])

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleAddEvent = (event: CalendarEvent) => {
    setEvents([...events, event])
  }

  const predictDistribution = async () => {
    try {
      // Make API call to get distribution
      const response = await fetch("https://gcdata-753048278340.us-central1.run.app/calculate_month_investment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()

      // Convert to percentage format for display
      const newDistribution = Object.entries(data).map(([id, value]) => ({
        id,
        percentage: (value as number) * 100, // Convert to percentage
      }))

      setDistribution(newDistribution)
      setIsPredicted(true)
    } catch (error) {
      console.error("Failed to predict distribution:", error)
      // You could add error state handling here
    }
  }

  // Find the highest percentage for highlighting
  const highestPercentage = isPredicted ? Math.max(...distribution.map((item) => item.percentage)) : 0

  // Completely reorganized layout based on user requirements
  return (
    <div className="space-y-4 pb-6 max-w-8xl mx-auto">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">Investment Planner</h1>

        {/* Display current request data */}
        <div className="text-sm text-gray-600">
          Month: {requestData.month}, Holidays: {requestData.holiday.length}, Sales Days: {requestData.salesday.length}
        </div>
      </div>

      {/* Main content area with reorganized layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left side: Controls column */}
        <div className="space-y-4">
          {/* Add Event Card */}
          <AddEventCard onClick={() => setIsModalOpen(true)} />

          {/* Investment Slider */}
          <InvestmentSlider value={investmentAmount} onChange={setInvestmentAmount} />

          {/* Predict Distribution Button */}
          <PredictButton onClick={predictDistribution} />
        </div>

        {/* Right side: Calendar and Legend */}
        <div className="md:col-span-2 space-y-4">
          {/* Calendar in the right corner */}
          <CalendarDisplay
            currentDate={currentDate}
            events={events}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />

          {/* Event Legend below calendar */}
          <EventLegendCard />
        </div>
      </div>

      {/* Distribution Results - Full width */}
      {isPredicted && (
        <div className="mt-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recommended Investment Distribution</h2>
            <div className="text-sm font-medium bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
              Total: ${investmentAmount.toFixed(2)}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {INVESTMENT_STREAMS.map((stream) => {
              const streamData = distribution.find((item) => item.id === stream.id)
              const percentage = streamData ? streamData.percentage : 0
              const isHighest = percentage === highestPercentage

              return (
                <DistributionCard
                  key={stream.id}
                  stream={stream}
                  percentage={percentage}
                  isHighest={isHighest}
                  investmentAmount={investmentAmount}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      <AddEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddEvent={handleAddEvent} />
    </div>
  )
}

