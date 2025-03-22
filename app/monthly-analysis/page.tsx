"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Sector,
  RadialBarChart,
  RadialBar,
} from "recharts"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  LineChartIcon,
  ShoppingBag,
  CreditCard,
} from "lucide-react"

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

// Real monthly data
const monthlyData = {
  "7": {
    "NPS SCORE": 54.6,
    "STOCK VALUE": 1177,
    TV: 0.2,
    Digital: 2.5,
    Sponsorship: 7.4,
    "Content Marketing": 0.0,
    "Online Marketing": 1.3,
    Affiliates: 0.5,
    SEM: 5.0,
    Radio: 0.0,
    Other: 0.0,
    EntertainmentSmall: 83060635.87,
    CameraAccessory: 17284785,
    GamingHardware: 17521671.86,
    GameCDDVD: 10654010,
    Camera: 45680333,
    avg_gmv: 1285.4,
    units_sold: 9134,
    avg_discount: 42.25,
    saleday_impact: 7.33,
  },
  "8": {
    "NPS SCORE": 60.0,
    "STOCK VALUE": 1206,
    TV: 0.0,
    Digital: 1.3,
    Sponsorship: 1.1,
    "Content Marketing": 0.0,
    "Online Marketing": 0.1,
    Affiliates: 0.1,
    SEM: 2.5,
    Radio: 0.0,
    Other: 0.0,
    EntertainmentSmall: 255566,
    CameraAccessory: 42278,
    GamingHardware: 38648,
    GameCDDVD: 1805,
    Camera: 61550,
    avg_gmv: 1945.54,
    units_sold: 21,
    avg_discount: 41.71,
    saleday_impact: 0.0,
  },
  "9": {
    "NPS SCORE": 55.8,
    "STOCK VALUE": 1189,
    TV: 1.2,
    Digital: 3.5,
    Sponsorship: 5.4,
    "Content Marketing": 1.0,
    "Online Marketing": 2.3,
    Affiliates: 1.5,
    SEM: 4.0,
    Radio: 1.0,
    Other: 2.0,
    EntertainmentSmall: 85060635.87,
    CameraAccessory: 18284785,
    GamingHardware: 16521671.86,
    GameCDDVD: 11654010,
    Camera: 44680333,
    avg_gmv: 2796.42,
    units_sold: 19381,
    avg_discount: 41.72,
    saleday_impact: 0.0,
  },
  "10": {
    "NPS SCORE": 52.3,
    "STOCK VALUE": 1150,
    TV: 2.2,
    Digital: 2.5,
    Sponsorship: 6.4,
    "Content Marketing": 0.5,
    "Online Marketing": 1.8,
    Affiliates: 1.0,
    SEM: 4.5,
    Radio: 0.5,
    Other: 1.0,
    EntertainmentSmall: 82060635.87,
    CameraAccessory: 16284785,
    GamingHardware: 18521671.86,
    GameCDDVD: 9654010,
    Camera: 46680333,
    avg_gmv: 1282.0,
    units_sold: 20053,
    avg_discount: 51.9,
    saleday_impact: 43.23,
  },
  "11": {
    "NPS SCORE": 53.5,
    "STOCK VALUE": 1165,
    TV: 1.7,
    Digital: 3.0,
    Sponsorship: 5.9,
    "Content Marketing": 0.8,
    "Online Marketing": 2.0,
    Affiliates: 1.2,
    SEM: 4.2,
    Radio: 0.8,
    Other: 1.5,
    EntertainmentSmall: 83560635.87,
    CameraAccessory: 17784785,
    GamingHardware: 17021671.86,
    GameCDDVD: 10154010,
    Camera: 45180333,
    avg_gmv: 1401.68,
    units_sold: 9960,
    avg_discount: 43.1,
    saleday_impact: 28.49,
  },
  "12": {
    "NPS SCORE": 54.0,
    "STOCK VALUE": 1171,
    TV: 1.9,
    Digital: 2.8,
    Sponsorship: 6.1,
    "Content Marketing": 0.7,
    "Online Marketing": 1.9,
    Affiliates: 1.3,
    SEM: 4.3,
    Radio: 0.7,
    Other: 1.7,
    EntertainmentSmall: 84060635.87,
    CameraAccessory: 17984785,
    GamingHardware: 17521671.86,
    GameCDDVD: 10404010,
    Camera: 45430333,
    avg_gmv: 1467.5,
    units_sold: 10173,
    avg_discount: 39.28,
    saleday_impact: 34.21,
  },
  "1": {
    "NPS SCORE": 47.1,
    "STOCK VALUE": 1052,
    TV: 4.4,
    Digital: 0.5,
    Sponsorship: 4.2,
    "Content Marketing": 0.9,
    "Online Marketing": 22.9,
    Affiliates: 7.4,
    SEM: 4.2,
    Radio: 2.7,
    Other: 27.1,
    EntertainmentSmall: 109285599.4,
    CameraAccessory: 26387431,
    GamingHardware: 47699361.55,
    GameCDDVD: 16884873.8,
    Camera: 18693802,
    avg_gmv: 1450.02,
    units_sold: 9916,
    avg_discount: 38.66,
    saleday_impact: 18.46,
  },
  "2": {
    "NPS SCORE": 50.5,
    "STOCK VALUE": 1112,
    TV: 3.1,
    Digital: 1.7,
    Sponsorship: 5.2,
    "Content Marketing": 0.8,
    "Online Marketing": 12.4,
    Affiliates: 4.4,
    SEM: 4.3,
    Radio: 1.7,
    Other: 14.4,
    EntertainmentSmall: 96673115.64,
    CameraAccessory: 22186108,
    GamingHardware: 32610616.71,
    GameCDDVD: 13769441.9,
    Camera: 32187067.5,
    avg_gmv: 1016.87,
    units_sold: 12554,
    avg_discount: 44.04,
    saleday_impact: 21.5,
  },
  "3": {
    "NPS SCORE": 51.8,
    "STOCK VALUE": 1142,
    TV: 2.5,
    Digital: 2.1,
    Sponsorship: 5.7,
    "Content Marketing": 0.85,
    "Online Marketing": 7.2,
    Affiliates: 2.9,
    SEM: 4.25,
    Radio: 1.2,
    Other: 8.4,
    EntertainmentSmall: 90366875.74,
    CameraAccessory: 19785769.5,
    GamingHardware: 25154989.13,
    GameCDDVD: 12327157.85,
    Camera: 25440434.75,
    avg_gmv: 1243.72,
    units_sold: 13129,
    avg_discount: 44.47,
    saleday_impact: 15.84,
  },
  "4": {
    "NPS SCORE": 53.0,
    "STOCK VALUE": 1160,
    TV: 2.0,
    Digital: 2.4,
    Sponsorship: 6.0,
    "Content Marketing": 0.9,
    "Online Marketing": 4.8,
    Affiliates: 2.2,
    SEM: 4.2,
    Radio: 0.9,
    Other: 5.6,
    EntertainmentSmall: 87213755.79,
    CameraAccessory: 18585600.75,
    GamingHardware: 21427175.34,
    GameCDDVD: 11606015.83,
    Camera: 22067118.38,
    avg_gmv: 1482.59,
    units_sold: 13256,
    avg_discount: 38.96,
    saleday_impact: 0.0,
  },
  "5": {
    "NPS SCORE": 53.8,
    "STOCK VALUE": 1169,
    TV: 1.8,
    Digital: 2.6,
    Sponsorship: 6.2,
    "Content Marketing": 0.95,
    "Online Marketing": 3.6,
    Affiliates: 1.8,
    SEM: 4.15,
    Radio: 0.8,
    Other: 4.2,
    EntertainmentSmall: 85637195.81,
    CameraAccessory: 17985516.38,
    GamingHardware: 19563268.45,
    GameCDDVD: 11245444.82,
    Camera: 20380460.19,
    avg_gmv: 1441.4,
    units_sold: 16220,
    avg_discount: 37.67,
    saleday_impact: 18.44,
  },
  "6": {
    "NPS SCORE": 54.2,
    "STOCK VALUE": 1173,
    TV: 1.6,
    Digital: 2.7,
    Sponsorship: 6.3,
    "Content Marketing": 1.0,
    "Online Marketing": 3.0,
    Affiliates: 1.6,
    SEM: 4.1,
    Radio: 0.7,
    Other: 3.5,
    EntertainmentSmall: 84848915.82,
    CameraAccessory: 17685474.19,
    GamingHardware: 18631315.01,
    GameCDDVD: 11064659.31,
    Camera: 19537131.1,
    avg_gmv: 1529.42,
    units_sold: 14114,
    avg_discount: 41.97,
    saleday_impact: 0.0,
  },
} as const

const generateMonthlyData = (month: number) => {
  const monthKey = month.toString() as keyof typeof monthlyData
  const currentMonthData = monthlyData[monthKey]
  if (!currentMonthData) return null

  // Calculate total monthly GMV
  const totalMonthlyGMV =
    currentMonthData.EntertainmentSmall +
    currentMonthData.CameraAccessory +
    currentMonthData.GamingHardware +
    currentMonthData.GameCDDVD +
    currentMonthData.Camera

  const avgDailyGMV = totalMonthlyGMV / 30

  // Generate daily sales based on the monthly total
  const dailySales = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1
    const gmvBase = avgDailyGMV * (0.8 + Math.random() * 0.4) // ±20% variation
    const mrpBase = gmvBase * 1.2 // 20% markup

    return {
      date: day,
      gmv: Math.round(gmvBase),
      mrp: Math.round(mrpBase),
      specialDay: [5, 12, 15, 25, 28].includes(day)
        ? {
            date: day,
            type: day === 5 ? "holiday" : day === 15 || day === 28 ? "payday" : "saleday",
            name:
              day === 5
                ? "Memorial Day"
                : day === 12
                  ? "Flash Sale"
                  : day === 15
                    ? "Payday"
                    : day === 25
                      ? "Weekend Sale"
                      : "End-Month Payday",
          }
        : null,
    }
  })

  // Format media investment data
  const mediaInvestment = [
    { name: "TV", value: currentMonthData.TV, amount: `$${currentMonthData.TV}K` },
    { name: "Digital", value: currentMonthData.Digital, amount: `$${currentMonthData.Digital}K` },
    { name: "Sponsorship", value: currentMonthData.Sponsorship, amount: `$${currentMonthData.Sponsorship}K` },
    {
      name: "Content Marketing",
      value: currentMonthData["Content Marketing"],
      amount: `$${currentMonthData["Content Marketing"]}K`,
    },
    {
      name: "Online Marketing",
      value: currentMonthData["Online Marketing"],
      amount: `$${currentMonthData["Online Marketing"]}K`,
    },
    { name: "Affiliates", value: currentMonthData.Affiliates, amount: `$${currentMonthData.Affiliates}K` },
    { name: "SEM", value: currentMonthData.SEM, amount: `$${currentMonthData.SEM}K` },
    { name: "Radio", value: currentMonthData.Radio, amount: `$${currentMonthData.Radio}K` },
    { name: "Other", value: currentMonthData.Other, amount: `$${currentMonthData.Other}K` },
  ].filter((item) => item.value > 0)

  // Format category GMV data
  const categoryGMV = [
    {
      name: "Entertainment",
      value: Math.round((currentMonthData.EntertainmentSmall / totalMonthlyGMV) * 100),
      amount: `$${(currentMonthData.EntertainmentSmall / 1000000).toFixed(1)}M`,
    },
    {
      name: "Camera Acc.",
      value: Math.round((currentMonthData.CameraAccessory / totalMonthlyGMV) * 100),
      amount: `$${(currentMonthData.CameraAccessory / 1000000).toFixed(1)}M`,
    },
    {
      name: "Gaming HW",
      value: Math.round((currentMonthData.GamingHardware / totalMonthlyGMV) * 100),
      amount: `$${(currentMonthData.GamingHardware / 1000000).toFixed(1)}M`,
    },
    {
      name: "Games",
      value: Math.round((currentMonthData.GameCDDVD / totalMonthlyGMV) * 100),
      amount: `$${(currentMonthData.GameCDDVD / 1000000).toFixed(1)}M`,
    },
    {
      name: "Cameras",
      value: Math.round((currentMonthData.Camera / totalMonthlyGMV) * 100),
      amount: `$${(currentMonthData.Camera / 1000000).toFixed(1)}M`,
    },
  ]

  const totalMediaSpend = Object.entries(currentMonthData)
    .filter(([key]) =>
      [
        "TV",
        "Digital",
        "Sponsorship",
        "Content Marketing",
        "Online Marketing",
        "Affiliates",
        "SEM",
        "Radio",
        "Other",
      ].includes(key),
    )
    .reduce((sum, [_, value]) => sum + value, 0)

  return {
    dailySales,
    kpiData: {
      totalSales: `$${(totalMonthlyGMV / 1000000).toFixed(1)}M`,
      customerRepetitionRate: "32.5%",
      averageOrderValue: `$${Math.round(avgDailyGMV / 100)}`,
      conversionRate: "3.8%",
      returnRate: "5.2%",
    },
    npsScore: currentMonthData["NPS SCORE"],
    stockValue: {
      value: currentMonthData["STOCK VALUE"],
      max: 1500, // Add max value for scaling
    },
    mediaInvestment,
    totalMediaInvestment: `$${totalMediaSpend.toFixed(1)}K`,
    categoryGMV,
    totalGMV: `$${(totalMonthlyGMV / 1000000).toFixed(1)}M`,
    specialDays: [
      { date: 5, type: "holiday", name: "Memorial Day" },
      { date: 12, type: "saleday", name: "Flash Sale" },
      { date: 15, type: "payday", name: "Payday" },
      { date: 25, type: "saleday", name: "Weekend Sale" },
      { date: 28, type: "payday", name: "End-Month Payday" },
    ],
  }
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

// Sales Line Chart Component
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

  // Get color for special day reference lines
  const getSpecialDayColor = (type: string) => {
    return type === "holiday" ? "#F56565" : type === "saleday" ? "#3B82F6" : "#10B981"
  }

  return (
    <div className="w-full">
      <div className="flex items-center mb-4">
        <LineChartIcon className="w-5 h-5 mr-2 text-blue-500" />
        <h3 className="text-base font-semibold text-gray-800">Monthly Sales (GMV vs MRP)</h3>
      </div>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 30 }} style={{ cursor: "pointer" }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(value) => `${value}`} ticks={[1, 5, 10, 15, 20, 25, 30]} />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "#94A3B8", strokeWidth: 1, strokeDasharray: "5 5" }}
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />

            <Line
              type="monotone"
              dataKey="gmv"
              name="GMV"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ stroke: "#3B82F6", strokeWidth: 2, r: 1 }}
              activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 1, fill: "#3B82F6" }}
            />
            <Line
              type="monotone"
              dataKey="mrp"
              name="MRP"
              stroke="#F56565"
              strokeWidth={2}
              dot={{ stroke: "#F56565", strokeWidth: 2, r: 1 }}
              activeDot={{ r: 6, stroke: "#F56565", strokeWidth: 1, fill: "#F56565" }}
            />

            {/* Special day reference lines */}
            {specialDays.map((day, index) => (
              <ReferenceLine
                key={index}
                x={day.date}
                stroke={getSpecialDayColor(day.type)}
                strokeDasharray="4 3"
                label={{
                  value: day.type.charAt(0).toUpperCase(),
                  position: "top",
                  fill: getSpecialDayColor(day.type),
                  fontSize: 10,
                  fontWeight: "bold",
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Special days legend */}
      <div className="flex flex-wrap justify-center mt-2 text-xs gap-4 bg-gray-50 py-2 rounded-md">
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

// KPI Card Component
const KPICard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: string
  icon: React.ReactNode
  color: string
}) => {
  return (
    <Card className="p-4 bg-white shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>{icon}</div>
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-xl font-bold text-gray-800 mt-1">{value}</div>
        </div>
      </div>
    </Card>
  )
}

// Radial Chart Component (replacing Speedometer)
const RadialChart = ({
  value,
  title,
  color,
}: {
  value: number | { value: number; max: number }
  title: string
  color: string
}) => {
  // Calculate the percentage value based on whether a max value is provided
  const maxValue = typeof value === 'object' ? value.max : 100;
  const actualValue = typeof value === 'object' ? value.value : value;
  const percentage = (actualValue / maxValue) * 100;

  // Create data for the radial bar
  const data = [
    {
      name: "Score",
      value: percentage,
      fill: color,
      actualValue: actualValue,
    },
  ]

  return (
    <div className="h-full">
      <h3 className="text-base font-semibold text-gray-800 mb-2">{title}</h3>
      <div className="flex flex-col items-center justify-center h-[150px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            barSize={10}
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar
              background={{ fill: "#E2E8F0" }}
              dataKey="value"
              cornerRadius={10}
              label={{
                position: "center",
                fill: "#1E293B",
                fontSize: 24,
                fontWeight: "bold",
                formatter: (value: any) => `${Math.round(data[0].actualValue)}`,
              }}
            />

            {/* Min-Max labels */}
            <text x="15%" y="65%" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#64748B">
              0
            </text>
            <text x="85%" y="65%" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#64748B">
              {maxValue}
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Hollow Pie Chart Component using Recharts
const HollowPieChart = ({
  data,
  totalValue,
  title,
}: {
  data: { name: string; value: number; amount: string }[]
  totalValue: string
  title: string
}) => {
  // Colors for the pie chart
  const COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#8B5CF6", "#EC4899", "#06B6D4", "#F97316", "#6366F1"]

  // State for active segment
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  // Handle mouse enter
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  // Handle mouse leave
  const onPieLeave = () => {
    setActiveIndex(null)
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="text-sm font-semibold">{payload[0].name}</p>
          <p className="text-xs font-medium mt-1">
            <span className="font-bold">{payload[0].payload.amount}</span>
          </p>
          <p className="text-xs">{payload[0].value}% of total</p>
        </div>
      )
    }
    return null
  }

  // Custom active shape
  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props

    return (
      <g>
        <text x={cx} y={cy - 15} dy={8} textAnchor="middle" fill="#64748B" fontSize={12}>
          {payload.name}
        </text>
        <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="#1E293B" fontSize={14} fontWeight="bold">
          {payload.amount}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    )
  }

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <div className="text-sm font-bold text-gray-800">Total: {totalValue}</div>
      </div>
      <div className="flex flex-col items-center">
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex !== null ? activeIndex : undefined}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="70%"
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                cursor="pointer"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={activeIndex === index ? 2 : 1}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />

              {activeIndex === null && (
                <>
                  <text
                    x="50%"
                    y="45%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs"
                    fill="#64748B"
                  >
                    Total
                  </text>
                  <text
                    x="50%"
                    y="55%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-base font-bold"
                    fill="#1E293B"
                  >
                    {totalValue}
                  </text>
                </>
              )}
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Interactive Legend */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-xs w-full">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center p-1 rounded-md cursor-pointer hover:bg-gray-50"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              style={{
                backgroundColor: activeIndex === index ? "#F1F5F9" : "transparent",
                fontWeight: activeIndex === index ? "bold" : "normal",
              }}
            >
              <div className="w-3 h-3 mr-1 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              <span className="text-gray-700 truncate">
                {item.name} ({item.amount})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function MonthlyAnalysis() {
  const [data, setData] = useState<any>(null)
  const [currentMonth, setCurrentMonth] = useState<number>(3) // March (0-indexed)
  const [currentYear, setCurrentYear] = useState<number>(2023)

  useEffect(() => {
    // Generate data on client-side to avoid hydration errors
    setData(generateMonthlyData(currentMonth))
  }, [currentMonth])

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

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      {/* Header with Month Toggler */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-gray-100 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Monthly Analysis</h1>
        <MonthToggler
          month={months[currentMonth]}
          year={currentYear}
          onPrevious={handlePreviousMonth}
          onNext={handleNextMonth}
          onSelectMonth={handleSelectMonth}
        />
      </div>

      {/* Full-width Monthly Sales Chart */}
      <Card className="p-4 md:p-5 bg-white shadow-sm rounded-xl overflow-hidden border border-gray-100">
        <SalesLineChart data={data.dailySales} specialDays={data.specialDays} />
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KPICard
          title="Average GMV"
          value="$2,695"
          icon={<DollarSign className="h-5 w-5 text-white" />}
          color="bg-blue-500"
        />
        <KPICard
          title="Annual Units Sold"
          value="1.64M"
          icon={<TrendingUp className="h-5 w-5 text-white" />}
          color="bg-green-500"
        />
        <KPICard
          title="Avg. Discount"
          value="41.2%"
          icon={<ShoppingBag className="h-5 w-5 text-white" />}
          color="bg-purple-500"
        />
        <KPICard
          title="Sale Day Impact"
          value="22.9%"
          icon={<CreditCard className="h-5 w-5 text-white" />}
          color="bg-orange-500"
        />
        <KPICard
          title="Annual Repetition Rate"
          value="13.5%"
          icon={<Users className="h-5 w-5 text-white" />}
          color="bg-red-500"
        />
      </div>

      {/* Three-column layout for specialized visualizations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Column 1: Radial Charts (replacing Speedometer) */}
        <div className="space-y-4 md:space-y-6">
          <Card className="p-4 md:p-5 bg-white shadow-sm rounded-xl border border-gray-100 h-[200px]">
            <RadialChart value={data.npsScore} title="NPS Score" color="#3B82F6" />
          </Card>
          <Card className="p-4 md:p-5 bg-white shadow-sm rounded-xl border border-gray-100 h-[200px]">
            <RadialChart value={data.stockValue} title="Stock Value" color="#10B981" />
          </Card>
        </div>

        {/* Column 2: Hollow Pie Chart for Media Investment */}
        <Card className="p-4 md:p-5 bg-white shadow-sm rounded-xl border border-gray-100 h-auto md:h-[420px] overflow-hidden">
          <HollowPieChart data={data.mediaInvestment} totalValue={data.totalMediaInvestment} title="Media Investment" />
        </Card>

        {/* Column 3: Category GMV Chart */}
        <Card className="p-4 md:p-5 bg-white shadow-sm rounded-xl border border-gray-100 h-auto md:h-[420px] overflow-hidden">
          <HollowPieChart data={data.categoryGMV} totalValue={data.totalGMV} title="Category GMV" />
        </Card>
      </div>
    </div>
  )
}

