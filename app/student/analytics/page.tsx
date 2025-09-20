"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, Target, Award } from "lucide-react"
import Link from "next/link"

const monthlyData = [
  { month: "Sep", attendance: 78, target: 85 },
  { month: "Oct", attendance: 82, target: 85 },
  { month: "Nov", attendance: 85, target: 85 },
  { month: "Dec", attendance: 88, target: 85 },
  { month: "Jan", attendance: 86, target: 85 },
]

const subjectData = [
  { subject: "Mathematics", present: 22, absent: 3, percentage: 88 },
  { subject: "Physics", present: 18, absent: 2, percentage: 90 },
  { subject: "Computer Science", present: 20, absent: 4, percentage: 83 },
]

const weeklyPattern = [
  { day: "Mon", attendance: 95 },
  { day: "Tue", attendance: 88 },
  { day: "Wed", attendance: 92 },
  { day: "Thu", attendance: 85 },
  { day: "Fri", attendance: 78 },
]

const attendanceDistribution = [
  { name: "Present", value: 86, color: "#8b5cf6" },
  { name: "Absent", value: 10, color: "#ef4444" },
  { name: "Late", value: 4, color: "#f59e0b" },
]

export default function StudentAnalytics() {
  const currentAttendance = 86
  const targetAttendance = 85
  const trend = currentAttendance >= targetAttendance ? "up" : "down"
  const trendColor = trend === "up" ? "text-green-600" : "text-red-600"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/student">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Your Analytics</h1>
            </div>
            <Badge variant="outline" className="border-primary-foreground text-primary-foreground">
              Current Semester
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
              {trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{currentAttendance}%</div>
              <p className={`text-xs ${trendColor}`}>
                {trend === "up" ? "+" : ""}
                {currentAttendance - targetAttendance}% from target
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classes Attended</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">60</div>
              <p className="text-xs text-muted-foreground">Out of 70 total classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Subject</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">Physics</div>
              <p className="text-xs text-muted-foreground">90% attendance rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Target Progress</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">101%</div>
              <p className="text-xs text-green-600">Target achieved!</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Attendance Trend</CardTitle>
              <CardDescription>Your attendance progress over the last 5 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[70, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                    name="Your Attendance"
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#ef4444"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 3 }}
                    name="Target (85%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Subject Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Subject-wise Performance</CardTitle>
              <CardDescription>Attendance breakdown by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="present" fill="#8b5cf6" name="Present" />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Weekly Pattern */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Pattern</CardTitle>
              <CardDescription>Your attendance by day of the week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyPattern}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[70, 100]} />
                  <Tooltip />
                  <Bar dataKey="attendance" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Attendance Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Distribution</CardTitle>
              <CardDescription>Overall status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={attendanceDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {attendanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Subject Analysis */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Subject Analysis</CardTitle>
            <CardDescription>Detailed breakdown of your performance in each subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {subjectData.map((subject, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{subject.subject}</h4>
                    <Badge
                      variant={subject.percentage >= 85 ? "default" : "secondary"}
                      className={subject.percentage >= 85 ? "bg-green-500" : ""}
                    >
                      {subject.percentage}%
                    </Badge>
                  </div>
                  <Progress value={subject.percentage} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{subject.present} classes attended</span>
                    <span>{subject.absent} classes missed</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights and Recommendations */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Insights & Recommendations</CardTitle>
            <CardDescription>Personalized suggestions to improve your attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Great Progress!</h4>
                  <p className="text-sm text-green-700">
                    You've exceeded your target attendance rate. Keep up the excellent work!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Friday Focus</h4>
                  <p className="text-sm text-blue-700">
                    Your Friday attendance is lower (78%). Consider scheduling important activities on other days.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <Target className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800">Computer Science Improvement</h4>
                  <p className="text-sm text-orange-700">
                    Focus on Computer Science classes to bring your attendance above 85%.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
