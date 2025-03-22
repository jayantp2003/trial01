"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Cell,
} from "recharts"
import { ChevronLeft, ChevronRight, Calendar, Thermometer, DollarSign, ShoppingBag, PercentIcon } from "lucide-react"

import rawData from './data.json'

// Define type for the weather data entry
type WeatherData = {
  Date: string;
  "Mean Temp (°C)": number;
  "Total Rain (mm)": number;
  "Total Snow (cm)": number;
  gmv: number;
};

// Define the type for the data structure
type DataType = {
  [key: string]: {
    [key: string]: WeatherData[];
  };
};

const data = rawData as DataType;

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

// Define type for historical category discount data
type CategoryDiscount = {
  Camera: number;
  CameraAccessory: number;
  EntertainmentSmall: number;
  GameCDDVD: number;
  GamingHardware: number;
};

type HistoricalDiscounts = {
  [key: `${string}-${string}`]: CategoryDiscount;
};

// Add historical category discount data
const historicalCategoryDiscounts: HistoricalDiscounts = {
  "2023-07": {
    "Camera": 22.96,
    "CameraAccessory": 45.62,
    "EntertainmentSmall": 42.70,
    "GameCDDVD": 31.40,
    "GamingHardware": 40.94
  },
  "2023-08": {
    "Camera": 23.06,
    "CameraAccessory": 40.15,
    "EntertainmentSmall": 44.49,
    "GameCDDVD": 34.00,
    "GamingHardware": 41.73
  },
  "2023-09": {
    "Camera": 23.57,
    "CameraAccessory": 49.19,
    "EntertainmentSmall": 42.77,
    "GameCDDVD": 26.70,
    "GamingHardware": 39.84
  },
  "2023-10": {
    "Camera": 35.27,
    "CameraAccessory": 50.42,
    "EntertainmentSmall": 47.49,
    "GameCDDVD": 35.01,
    "GamingHardware": 46.73
  },
  "2023-11": {
    "Camera": 32.25,
    "CameraAccessory": 47.33,
    "EntertainmentSmall": 44.85,
    "GameCDDVD": 26.92,
    "GamingHardware": 43.02
  },
  "2023-12": {
    "Camera": 34.71,
    "CameraAccessory": 47.84,
    "EntertainmentSmall": 48.49,
    "GameCDDVD": 31.63,
    "GamingHardware": 45.21
  },
  "2024-01": {
    "Camera": 36.84,
    "CameraAccessory": 47.98,
    "EntertainmentSmall": 47.18,
    "GameCDDVD": 34.18,
    "GamingHardware": 44.30
  },
  "2024-02": {
    "Camera": 33.09,
    "CameraAccessory": 50.36,
    "EntertainmentSmall": 49.42,
    "GameCDDVD": 31.57,
    "GamingHardware": 46.80
  },
  "2024-03": {
    "Camera": 34.79,
    "CameraAccessory": 49.77,
    "EntertainmentSmall": 48.82,
    "GameCDDVD": 37.11,
    "GamingHardware": 43.34
  },
  "2024-04": {
    "Camera": 30.21,
    "CameraAccessory": 52.62,
    "EntertainmentSmall": 46.31,
    "GameCDDVD": 37.98,
    "GamingHardware": 42.22
  },
  "2024-05": {
    "Camera": 28.71,
    "CameraAccessory": 54.69,
    "EntertainmentSmall": 47.63,
    "GameCDDVD": 40.18,
    "GamingHardware": 45.71
  },
  "2024-06": {
    "Camera": 26.11,
    "CameraAccessory": 52.92,
    "EntertainmentSmall": 44.22,
    "GameCDDVD": 37.03,
    "GamingHardware": 42.13
  }
}

// Replace the generateClimateDiscountData function with this version that uses real data
const generateClimateDiscountData = () => {
  const processMonthData = (year: string, month: string) => {
    const monthData = data[year][month] || []
    return monthData.map((day: any) => ({
      day: parseInt(day.Date.split('-')[2]),
      date: day.Date,
      temp: day['Mean Temp (°C)'],
      rain: day['Total Rain (mm)'],
      snow: day['Total Snow (cm)'],
      gmv: day.gmv,
      // Calculate discount based on weather conditions
      discountPercentage: calculateDiscount(day['Mean Temp (°C)'], day['Total Rain (mm)'], day['Total Snow (cm)']),
    }))
  }

  const calculateDiscount = (temp: number, rain: number, snow: number) => {
    let discount = 5 // base discount
    
    // Temperature-based adjustments
    if (temp < 0) discount += 5
    else if (temp > 25) discount += 3
    
    // Precipitation-based adjustments
    if (rain > 20) discount += 4
    if (snow > 0) discount += 6

    return Math.min(25, discount) // cap at 25%
  }

  const calculateMonthlyMetrics = (monthData: any[]) => {
    if (!monthData.length) return null
    
    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)
    const avg = (arr: number[]) => sum(arr) / arr.length

    const totalGMV = Math.round(sum(monthData.map(d => d.gmv)))
    const avgDiscount = Math.round(avg(monthData.map(d => d.discountPercentage)) * 10) / 10
    const discountAmount = Math.round(totalGMV * (avgDiscount / 100))
    const gmvAfterDiscount = totalGMV - discountAmount
    // Estimate units sold based on average price of $50 per unit
    const estimatedUnitsSold = Math.round(gmvAfterDiscount / 50)

    return {
      month: months[parseInt(monthData[0].date.split('-')[1]) - 1],
      monthIndex: parseInt(monthData[0].date.split('-')[1]) - 1,
      meanTemp: Math.round(avg(monthData.map(d => d.temp)) * 10) / 10,
      totalRain: Math.round(sum(monthData.map(d => d.rain)) * 10) / 10,
      totalSnow: Math.round(sum(monthData.map(d => d.snow)) * 10) / 10,
      gmv: totalGMV,
      discountPercentage: avgDiscount,
      discountAmount: discountAmount,
      gmvAfterDiscount: gmvAfterDiscount,
      unitsSold: estimatedUnitsSold
    }
  }

  // Get current month's data
  const currentYear = "2024"
  const currentMonth = "3" // March
  const dailyData = processMonthData(currentYear, currentMonth)

  // Generate category discounts based on historical data
  const getMonthKey = (year: string, month: string) => {
    const paddedMonth = month.padStart(2, '0');
    return `${year}-${paddedMonth}`;
  }

  const currentMonthKey = getMonthKey("2024", currentMonth);
  const categories = ["Camera", "CameraAccessory", "EntertainmentSmall", "GameCDDVD", "GamingHardware"];
  
  const categoryData = categories.map(category => ({
    category: category,
    discountPercentage: historicalCategoryDiscounts[currentMonthKey as keyof HistoricalDiscounts]?.[category as keyof CategoryDiscount] || 0
  })).sort((a, b) => b.discountPercentage - a.discountPercentage);

  // Calculate current month's aggregated data
  const currentMonthData = calculateMonthlyMetrics(dailyData)

  return {
    monthlyData: Object.keys(data["2024"]).map(month => 
      calculateMonthlyMetrics(processMonthData("2024", month))
    ).filter(Boolean),
    currentMonthIndex: 2, // March
    currentMonthData,
    dailyData,
    categoryData,
    generateDailyData: (monthIndex: number) => {
      const month = (monthIndex + 1).toString()
      return processMonthData("2024", month)
    },
    generateCategoryData: (monthIndex: number) => {
      const monthKey = getMonthKey("2024", (monthIndex + 1).toString()) as keyof HistoricalDiscounts;
      const monthKeyData = historicalCategoryDiscounts[monthKey];
      return categories.map(category => ({
        category: category,
        discountPercentage: monthKeyData ? monthKeyData[category as keyof CategoryDiscount] : 0
      })).sort((a, b) => b.discountPercentage - a.discountPercentage);
    }
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

// KPI Card Component
const KPICard = ({
  title,
  value,
  icon,
  color,
  subtitle,
}: {
  title: string
  value: string
  icon: React.ReactNode
  color: string
  subtitle?: string
}) => {
  return (
    <Card className="p-4 bg-white shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center`}>{icon}</div>
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-xl font-bold text-gray-800 mt-1">{value}</div>
          {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
        </div>
      </div>
    </Card>
  )
}

// Update the GMV vs Discount Bar Chart to show daily data
const GmvDiscountBarChart = ({ data }: { data: any[] }) => {
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md text-xs">
          <p className="font-semibold">Day {payload[0].payload.day}</p>
          <p>GMV: ${(payload[0].value / 1000).toFixed(1)}K</p>
          <p>Discount: {payload[1].value}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-full">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Daily GMV vs Discount</h3>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} tickFormatter={(value) => (value % 5 === 0 ? value : "")} />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              tick={{ fontSize: 10 }}
              width={40}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => `${value}%`}
              domain={[0, 30]}
              tick={{ fontSize: 10 }}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar yAxisId="left" dataKey="gmv" name="GMV" fill="#3B82F6" radius={[2, 2, 0, 0]} barSize={6} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="discountPercentage"
              name="Discount %"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Update the Category-wise Discount Horizontal Bar Chart to be more concise
const CategoryDiscountBarChart = ({ data }: { data: any[] }) => {
  const barColors = ["#3B82F6", "#F59E0B", "#10B981", "#8B5CF6", "#EC4899"]

  if (!data?.length) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">No data available</p>
      </div>
    )
  }

  return (
    <>
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Category Discounts</h3>
      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 70, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis
              type="number"
              domain={[0, 60]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fontSize: 10 }}
              width={70}
            />
            <Tooltip
              formatter={(value: any) => [`${value}%`, "Discount"]}
              labelFormatter={(value) => `${value}`}
            />
            <Bar
              dataKey="discountPercentage"
              name="Discount %"
              radius={[0, 3, 3, 0]}
              barSize={10}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

// Update the Temperature vs GMV Chart to show daily data
const TemperatureGmvChart = ({ data }: { data: any[] }) => {
  return (
    <div className="h-full">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Daily Temperature vs GMV</h3>
      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} tickFormatter={(value) => (value % 5 === 0 ? value : "")} />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              tick={{ fontSize: 10 }}
              width={40}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => `${value}°`}
              domain={[-10, 40]}
              tick={{ fontSize: 10 }}
              width={25}
            />
            <Tooltip
              formatter={(value: any, name: any) => {
                if (name === "GMV") return [`$${(value / 1000).toFixed(1)}K`, name]
                if (name === "Temp") return [`${value}°C`, name]
                return [value, name]
              }}
            />
            <Bar yAxisId="left" dataKey="gmv" name="GMV" fill="#3B82F6" radius={[2, 2, 0, 0]} barSize={6} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="temp"
              name="Temp"
              stroke="#F97316"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Update the Rain vs GMV Chart to show daily data
const RainGmvChart = ({ data }: { data: any[] }) => {
  return (
    <div className="h-full">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Daily Rain vs GMV</h3>
      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} tickFormatter={(value) => (value % 5 === 0 ? value : "")} />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              tick={{ fontSize: 10 }}
              width={40}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => `${value}mm`}
              domain={[0, 30]}
              tick={{ fontSize: 10 }}
              width={30}
            />
            <Tooltip
              formatter={(value: any, name: any) => {
                if (name === "GMV") return [`$${(value / 1000).toFixed(1)}K`, name]
                if (name === "Rain") return [`${value}mm`, name]
                return [value, name]
              }}
            />
            <Bar yAxisId="left" dataKey="gmv" name="GMV" fill="#3B82F6" radius={[2, 2, 0, 0]} barSize={6} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="rain"
              name="Rain"
              stroke="#0EA5E9"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Update the Snow vs GMV Chart to show daily data
const SnowGmvChart = ({ data }: { data: any[] }) => {
  return (
    <div className="h-full">
      <h3 className="text-sm font-semibold text-gray-800 mb-2">Daily Snow vs GMV</h3>
      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10 }} tickFormatter={(value) => (value % 5 === 0 ? value : "")} />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              tick={{ fontSize: 10 }}
              width={40}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => `${value}cm`}
              domain={[0, 15]}
              tick={{ fontSize: 10 }}
              width={30}
            />
            <Tooltip
              formatter={(value: any, name: any) => {
                if (name === "GMV") return [`$${(value / 1000).toFixed(1)}K`, name]
                if (name === "Snow") return [`${value}cm`, name]
                return [value, name]
              }}
            />
            <Bar yAxisId="left" dataKey="gmv" name="GMV" fill="#3B82F6" radius={[2, 2, 0, 0]} barSize={6} />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="snow"
              name="Snow"
              stroke="#94A3B8"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Update the ClimateDiscountAnalysis component to use daily data
export default function ClimateDiscountAnalysis() {
  const [data, setData] = useState<any>(null)
  const [currentMonth, setCurrentMonth] = useState<number>(6) // March (0-indexed)
  const [currentYear, setCurrentYear] = useState<number>(2023)

  useEffect(() => {
    // Generate data on client-side to avoid hydration errors
    setData(generateClimateDiscountData())
  }, [])

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }

    // Update data for the new month
    if (data) {
      const newMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1
      setData({
        ...data,
        currentMonthIndex: newMonthIndex,
        currentMonthData: data.monthlyData[newMonthIndex],
        dailyData: data.generateDailyData(newMonthIndex),
        categoryData: data.generateCategoryData(newMonthIndex),
      })
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }

    // Update data for the new month
    if (data) {
      const newMonthIndex = currentMonth === 11 ? 0 : currentMonth + 1
      setData({
        ...data,
        currentMonthIndex: newMonthIndex,
        currentMonthData: data.monthlyData[newMonthIndex],
        dailyData: data.generateDailyData(newMonthIndex),
        categoryData: data.generateCategoryData(newMonthIndex),
      })
    }
  }

  const handleSelectMonth = (monthIndex: number, selectedYear: number) => {
    setCurrentMonth(monthIndex)
    setCurrentYear(selectedYear)

    // Update data for the selected month
    if (data) {
      setData({
        ...data,
        currentMonthIndex: monthIndex,
        currentMonthData: data.monthlyData[monthIndex],
        dailyData: data.generateDailyData(monthIndex),
        categoryData: data.generateCategoryData(monthIndex),
      })
    }
  }

  // Helper function to safely format numbers
  const formatNumber = (value: number | undefined | null, format: 'temperature' | 'currency' | 'percent' | 'units' = 'units') => {
    if (value == null) return '-'
    switch (format) {
      case 'temperature':
        return `${value.toFixed(1)}°C`
      case 'currency':
        return `$${(value / 1000).toFixed(1)}K`
      case 'percent':
        return `${value.toFixed(1)}%`
      case 'units':
        return value.toLocaleString()
      default:
        return `${value}`
    }
  }

  // Safely get data with defaults
  const safeData = {
    currentMonthData: {
      meanTemp: 0,
      gmv: 0,
      gmvAfterDiscount: 0,
      discountPercentage: 0,
      discountAmount: 0,
      unitsSold: 0,
      ...data?.currentMonthData
    },
    dailyData: data?.dailyData || [],
    categoryData: data?.categoryData || []
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  const { currentMonthData, dailyData, categoryData } = safeData

  const getTemperatureStatus = (temp: number) => {
    if (temp > 20) return "Warm"
    if (temp < 5) return "Cold"
    return "Moderate"
  }

  return (
    <div className="container mx-auto space-y-4">
      {/* Header with Month Toggler */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-gray-100 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Climate & Discount Analysis</h1>
        <MonthToggler
          month={months[currentMonth]}
          year={currentYear}
          onPrevious={handlePreviousMonth}
          onNext={handleNextMonth}
          onSelectMonth={handleSelectMonth}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard
          title="Average Temperature"
          value={formatNumber(currentMonthData.meanTemp, 'temperature')}
          icon={<Thermometer className="h-5 w-5 text-white" />}
          color="bg-orange-500"
          subtitle={getTemperatureStatus(currentMonthData.meanTemp)}
        />
        <KPICard
          title="Total Sales"
          value={formatNumber(currentMonthData.gmv, 'currency')}
          icon={<DollarSign className="h-5 w-5 text-white" />}
          color="bg-blue-500"
          subtitle={`After Discount: ${formatNumber(currentMonthData.gmvAfterDiscount, 'currency')}`}
        />
        <KPICard
          title="Average Discount"
          value={formatNumber(currentMonthData.discountPercentage, 'percent')}
          icon={<PercentIcon className="h-5 w-5 text-white" />}
          color="bg-purple-500"
          subtitle={`Discount Amount: ${formatNumber(currentMonthData.discountAmount, 'currency')}`}
        />
        <KPICard
          title="Units Sold"
          value={formatNumber(currentMonthData.unitsSold, 'units')}
          icon={<ShoppingBag className="h-5 w-5 text-white" />}
          color="bg-green-500"
          subtitle={`Avg. Price: $${currentMonthData.unitsSold ? 
            (currentMonthData.gmvAfterDiscount / currentMonthData.unitsSold).toFixed(2) : 
            '0.00'
          }`}
        />
      </div>

      {/* Two-column layout for charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Left column: GMV vs Discount and Category-wise Discount */}
        <div className="space-y-3">
          <Card className="p-3 bg-white shadow-sm rounded-xl border border-gray-100">
            <GmvDiscountBarChart data={dailyData} />
          </Card>
          <Card className="p-3 bg-white shadow-sm rounded-xl border border-gray-100">
            <CategoryDiscountBarChart data={categoryData} />
          </Card>
        </div>

        {/* Right column: Climate vs GMV charts */}
        <div className="space-y-3">
          <Card className="p-3 bg-white shadow-sm rounded-xl border border-gray-100">
            <TemperatureGmvChart data={dailyData} />
          </Card>
          <Card className="p-3 bg-white shadow-sm rounded-xl border border-gray-100">
            <RainGmvChart data={dailyData} />
          </Card>
          <Card className="p-3 bg-white shadow-sm rounded-xl border border-gray-100">
            <SnowGmvChart data={dailyData} />
          </Card>
        </div>
      </div>
    </div>
  )
}

