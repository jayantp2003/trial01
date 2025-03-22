"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts"
import { DollarSign, TrendingUp, CreditCard, ShoppingBag, Users } from "lucide-react"

// Generate yearly analysis data
const generateYearlyData = () => {
  // Payment type data
  const paymentTypeData = [
    { name: "COD", value: 2300000000, percentage: 58.56, color: "#3B82F6" },
    { name: "Prepaid", value: 1670000000, percentage: 41.43, color: "#4338CA" },
  ]

  // Product type data
  const productTypeData = [
    { name: "Luxury", value: 2050000000, percentage: 50.76, color: "#3B82F6" },
    { name: "Mass Market", value: 1990000000, percentage: 49.24, color: "#4338CA" },
  ]

  // Monthly GMV data
  const monthlyGMVData = [
    { month: "2023 7", name: "Jul 2023", value: 156679763.87, percentage: 5.689288452, color: "#3B82F6" },
    { month: "2023 8", name: "Aug 2023", value: 399847, percentage:0.01451907294, color: "#4338CA" },
    { month: "2023 9", name: "Sep 2023", value: 299008687.50, percentage: 10.85747534, color: "#4F46E5" },
    { month: "2023 10", name: "Oct 2023", value: 286431919.51, percentage: 10.40079313, color: "#6366F1" },
    { month: "2023 11", name: "Nov 2023", value: 185419099.08, percentage: 6.732858878, color: "#818CF8" },
    { month: "2023 12", name: "Dec 2023", value: 255786287, percentage: 9.28800205, color: "#A5B4FC" },
    { month: "2024 1", name: "Jan 2024", value: 218951067.75, percentage: 7.950457357, color: "#0EA5E9" },
    { month: "2024 2", name: "Feb 2024", value: 192068497.17, percentage: 6.974308973, color: "#38BDF8" },
    { month: "2024 3", name: "Mar 2024", value: 236475627.73, percentage: 8.58680167, color: "#7DD3FC" },
    { month: "2024 4", name: "Apr 2024", value: 207355745.36, percentage: 7.529412979, color: "#10B981" },
    { month: "2024 5", name: "May 2024", value: 409453186, percentage: 14.86788866, color: "#34D399" },
    { month: "2024 6", name: "Jun 2024", value: 305913320.95, percentage: 11.10819343, color: "#6EE7B7" },
  ]

  // Monthly GMV by product type
  const monthlyGMVByProductType = [
    {
      month: "2023-7",
      name: "Jul 2023",
      luxury: 102679275.1,
      mass_market: 71527560.6
    },
    {
      month: "2023-8",
      name: "Aug 2023",
      luxury: 219383,
      mass_market: 196713
    },
    {
      month: "2023-9",
      name: "Sep 2023",
      luxury: 254031790,
      mass_market: 167728897.5
    },
    {
      month: "2023-10",
      name: "Oct 2023",
      luxury: 197078113.3,
      mass_market: 305649806.2
    },
    {
      month: "2023-11",
      name: "Nov 2023",
      luxury: 173964570.3,
      mass_market: 157422401.7
    },
    {
      month: "2023-12",
      name: "Dec 2023",
      luxury: 207094027.6,
      mass_market: 228726232.8
    },
    {
      month: "2024-1",
      name: "Jan 2024",
      luxury: 167491590.1,
      mass_market: 219701477.6
    },
    {
      month: "2024-2",
      name: "Feb 2024",
      luxury: 157086377.1,
      mass_market: 174480672.4
    },
    {
      month: "2024-3",
      name: "Mar 2024",
      luxury: 190004638.3,
      mass_market: 213998462.5
    },
    {
      month: "2024-4",
      name: "Apr 2024",
      luxury: 179691804.4,
      mass_market: 160011759
    },
    {
      month: "2024-5",
      name: "May 2024",
      luxury: 241752061,
      mass_market: 167701125.2
    },
    {
      month: "2024-6",
      name: "Jun 2024",
      luxury: 182083850.8,
      mass_market: 123829470.1
    },
    {
      month: "2024-7",
      name: "Jul 2024",
      luxury: 849951,
      mass_market: 880992
    }
]


  // KPI data
  const kpiData = {
    totalGMV: "4.0B",
    yearOverYearGrowth: "+24.5%",
    averageOrderValue: "1,245",
    conversionRate: "3.8%",
    activeCustomers: "1.2M",
  }

  return {
    paymentTypeData,
    productTypeData,
    monthlyGMVData,
    monthlyGMVByProductType,
    kpiData,
  }
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

// Payment Type Pie Chart
const PaymentTypePieChart = ({ data }: { data: any[] }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props

    return (
      <g>
        <text x={cx} y={cy} textAnchor="middle" fill="#374151" fontSize={14} fontWeight="bold">
          {payload.name}
        </text>
        <text x={cx} y={cy + 20} textAnchor="middle" fill="#1F2937" fontSize={12}>
          {`₹${(value / 1000000000).toFixed(1)}bn`}
        </text>
        <text x={cx} y={cy + 35} textAnchor="middle" fill="#6B7280" fontSize={11}>
          {`(${payload.percentage}%)`}
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
      </g>
    )
  }

  // Custom label component for the pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    const RADIAN = Math.PI / 180
    const radius = outerRadius * 1.2
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    const item = data[index]

    return (
      <g>
        <text
          x={x}
          y={y}
          fill="#374151"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          fontSize={12}
          fontWeight="500"
        >
          {item.name}
        </text>
        <text
          x={x}
          y={y + 15}
          fill="#6B7280"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          fontSize={11}
        >
          ₹{(item.value / 1000000000).toFixed(1)}bn
        </text>
        <text
          x={x}
          y={y + 30}
          fill="#9CA3AF"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          fontSize={10}
        >
          ({item.percentage}%)
        </text>
      </g>
    )
  }

  return (
    <div className="h-full">
      <h3 className="text-base font-semibold text-gray-800 mb-2">Total GMV by Type of Payment</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex !== null ? activeIndex : undefined}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              cursor="pointer"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Product Type Donut Chart
const ProductTypeDonutChart = ({ data }: { data: any[] }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props

    return (
      <g>
        <text x={cx} y={cy - 5} dy={8} textAnchor="middle" fill="#374151" fontSize={14} fontWeight="bold">
          {payload.name}
        </text>
        <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="#1F2937" fontSize={12}>
          {`₹${(value / 1000000000).toFixed(1)}bn (${payload.percentage}%)`}
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
      </g>
    )
  }

  // Custom label component for the donut chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    const RADIAN = Math.PI / 180
    const radius = outerRadius * 1.2
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    const item = data[index]

    return (
      <g>
        <text
          x={x}
          y={y}
          fill="#374151"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          fontSize={12}
          fontWeight="500"
        >
          {item.name}
        </text>
        <text
          x={x}
          y={y + 15}
          fill="#6B7280"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          fontSize={11}
        >
          ₹{(item.value / 1000000000).toFixed(1)}bn
        </text>
        <text
          x={x}
          y={y + 30}
          fill="#9CA3AF"
          textAnchor={x > cx ? "start" : "end"}
          dominantBaseline="central"
          fontSize={10}
        >
          ({item.percentage}%)
        </text>
      </g>
    )
  }

  return (
    <div className="h-full">
      <h3 className="text-base font-semibold text-gray-800 mb-2">Total GMV by Product Type</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex !== null ? activeIndex : undefined}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              cursor="pointer"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {activeIndex === null && (
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={12}
                fontWeight="bold"
                fill="#374151"
              >
                product_type
              </text>
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Monthly GMV by Product Type Bar Chart
const MonthlyGMVByProductTypeChart = ({ data }: { data: any[] }) => {
  return (
    <div className="h-full">
      <h3 className="text-base font-semibold text-gray-800 mb-2">Total GMV vs Month by Product Type</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={y}
                  dy={16}
                  textAnchor="end"
                  fill="#666"
                  fontSize={10}
                  transform={`rotate(-45, ${x}, ${y})`}
                >
                  {payload.value}
                </text>
              )}
              height={70}
              tickMargin={25}
            />
            <YAxis tickFormatter={(value) => `₹${(value / 1000000000).toFixed(1)}bn`} tick={{ fontSize: 10 }} />
            <Tooltip
              formatter={(value: any) => [`₹${(value / 1000000000).toFixed(2)}bn`, ""]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => (value === "luxury" ? "Luxury" : "Mass Market")}
            />
            <Bar dataKey="luxury" name="luxury" fill="#3B82F6" radius={[2, 2, 0, 0]} barSize={20} />
            <Bar dataKey="mass_market" name="mass_market" fill="#4338CA" radius={[2, 2, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// Monthly GMV Donut Chart with Total GMV in top right
const MonthlyGMVDonutChart = ({ data, totalGMV }: { data: any[]; totalGMV: string }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, value } = props

    return (
      <g>
        <text x={cx} y={cy - 5} dy={8} textAnchor="middle" fill="#374151" fontSize={14} fontWeight="bold">
          {payload.month}
        </text>
        <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill="#1F2937" fontSize={12}>
          {`₹${(value / 1000000).toFixed(0)}M (${payload.percentage}%)`}
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
      </g>
    )
  }

  return (
    <div className="h-full relative">
      {/* Total GMV in top right corner */}
      <div className="absolute top-0 right-0 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center">
        <DollarSign className="h-4 w-4 text-blue-600 mr-1" />
        <div>
          <div className="text-xs text-blue-600 font-medium">Total GMV</div>
          <div className="text-sm font-bold text-blue-700">{totalGMV}</div>
        </div>
      </div>

      <h3 className="text-base font-semibold text-gray-800 mb-2">Total GMV by Year and Month</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex !== null ? activeIndex : undefined}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              cursor="pointer"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {activeIndex === null && (
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={14}
                fontWeight="bold"
                fill="#374151"
              >
                Year Month
              </text>
            )}
            {data.map((entry, index) => {
              // Calculate position for the label
              const RADIAN = Math.PI / 180
              // Fix the bug in the midAngle calculation
              const startAngle =
                index === 0 ? 0 : data.slice(0, index).reduce((acc, curr) => acc + (curr.percentage / 100) * 360, 0)
              const sliceAngle = (entry.percentage / 100) * 360
              const midAngle = startAngle + sliceAngle / 2

              const radius = 120
              const x = 100 + radius * Math.cos(-midAngle * RADIAN)
              const y = 100 + radius * Math.sin(-midAngle * RADIAN)

              // Only show labels for selected months to avoid overcrowding
              if (index % 3 !== 0 && index !== 0) return null

              return (
                <text
                  key={`text-${index}`}
                  x={`${x}%`}
                  y={`${y}%`}
                  textAnchor={x > 100 ? "start" : "end"}
                  dominantBaseline="middle"
                  fill="#374151"
                  fontSize={10}
                >
                  {entry.month}
                  <tspan x={`${x}%`} y={`${y + 12}%`} fontSize={9} fill="#6B7280">
                    ₹{(entry.value / 1000000).toFixed(0)}M
                  </tspan>
                </text>
              )
            })}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default function YearlyAnalysis() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    // Generate data on client-side to avoid hydration errors
    setData(generateYearlyData())
  }, [])

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  const { paymentTypeData, productTypeData, monthlyGMVData, monthlyGMVByProductType, kpiData } = data

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">Yearly GMV Analysis</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KPICard
          title="Average GMV"
          value="2695"
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
          title="Annual Repitition Rate"
          value="13.5%"
          icon={<Users className="h-5 w-5 text-white" />}
          color="bg-red-500"
        />
      </div>

      {/* Charts - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 bg-white shadow-sm rounded-xl border border-gray-100">
          <PaymentTypePieChart data={paymentTypeData} />
        </Card>
        <Card className="p-4 bg-white shadow-sm rounded-xl border border-gray-100">
          <ProductTypeDonutChart data={productTypeData} />
        </Card>
      </div>

      {/* Charts - Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 bg-white shadow-sm rounded-xl border border-gray-100">
          <MonthlyGMVByProductTypeChart data={monthlyGMVByProductType} />
        </Card>
        <Card className="p-4 bg-white shadow-sm rounded-xl border border-gray-100">
          <MonthlyGMVDonutChart data={monthlyGMVData} totalGMV={kpiData.totalGMV} />
        </Card>
      </div>
    </div>
  )
}

