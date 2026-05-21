export const dashboardData = {
  user: {
    name: "Marko",
    avatar: "M",
    plan: "Premium",
    greeting: "Good evening",
    aerobicTrend: "improved",
  },

  readiness: {
    score: 82,
    label: "Good",
  },

  projected10k: {
    current: "48:20",
    projected: "45:50",
    confidence: "Moderate",
    trend: "Improving steadily",
    chartData: [
      { date: "May 1",  actual: 49.5 },
      { date: "May 15", actual: 48.7 },
      { date: "May 29", actual: 48.3 },
      { date: "Jun 12", actual: 48.33, projected: 48.33 },
      { date: "Jun 26", projected: 47.5 },
      { date: "Jul 10", projected: 46.8 },
      { date: "Jul 24", projected: 45.83 },
    ],
  },

  trainingLoad: {
    value: 742,
    optimalMin: 600,
    optimalMax: 800,
    max: 1000,
  },

  recovery: {
    status: "Moderate Fatigue",
    gaugePercent: 0.55,
    sleepTrend: "down",
    hrStabilityTrend: "down",
    mileageIncrease: 18,
    warning: "Consider maintaining volume for 3–4 days before another hard session.",
  },

  paceDevelopment: {
    "6 Months": [
      { month: "Feb", easy: 5.9,  threshold: 5.1,  race: 4.7  },
      { month: "Mar", easy: 5.7,  threshold: 5.0,  race: 4.6  },
      { month: "Apr", easy: 5.5,  threshold: 4.9,  race: 4.5  },
      { month: "May", easy: 5.3,  threshold: 4.85, race: 4.4  },
      { month: "Jun", easy: 5.2,  threshold: 4.8,  race: 4.28 },
      { month: "Jul", easy: 5.15, threshold: 4.75, race: 4.2  },
      { month: "Aug", easy: 5.1,  threshold: 4.7,  race: 4.1  },
      { month: "Sep", easy: 5.0,  threshold: 4.6,  race: 4.0  },
    ],
    "3 Months": [
      { month: "Apr", easy: 5.5,  threshold: 4.9,  race: 4.5  },
      { month: "May", easy: 5.3,  threshold: 4.85, race: 4.4  },
      { month: "Jun", easy: 5.2,  threshold: 4.8,  race: 4.28 },
    ],
    "12 Months": [
      { month: "Oct", easy: 6.2,  threshold: 5.4,  race: 5.0  },
      { month: "Nov", easy: 6.0,  threshold: 5.3,  race: 4.9  },
      { month: "Dec", easy: 5.8,  threshold: 5.2,  race: 4.8  },
      { month: "Jan", easy: 5.7,  threshold: 5.15, race: 4.75 },
      { month: "Feb", easy: 5.9,  threshold: 5.1,  race: 4.7  },
      { month: "Mar", easy: 5.7,  threshold: 5.0,  race: 4.6  },
      { month: "Apr", easy: 5.5,  threshold: 4.9,  race: 4.5  },
      { month: "May", easy: 5.3,  threshold: 4.85, race: 4.4  },
      { month: "Jun", easy: 5.2,  threshold: 4.8,  race: 4.28 },
      { month: "Jul", easy: 5.15, threshold: 4.75, race: 4.2  },
      { month: "Aug", easy: 5.1,  threshold: 4.7,  race: 4.1  },
      { month: "Sep", easy: 5.0,  threshold: 4.6,  race: 4.0  },
    ],
  },

  consistency: {
    percentage: 85,
    grid: [
      ["high","med","high","low","high","low","low"],
      ["med","high","high","med","low","low","low"],
      ["high","high","med","high","low","low","low"],
      ["med","high","high","high","med","low","low"],
      ["high","med","med","high","high","low","low"],
      ["high","high","high","med","high","low","low"],
      ["med","high","high","high","med","low","low"],
    ],
  },

  weeklyStats: [
    { label: "Weekly Mileage", value: "64.3", unit: "km",  change: "↑ 12%" },
    { label: "Long Run",       value: "18.2", unit: "km",  note: "Sat, Jun 8" },
    { label: "Avg Pace",       value: "5:02", unit: "/km", change: "↓ 0:06" },
    { label: "Avg HR",         value: "142",  unit: "bpm", change: "↓ 3" },
    { label: "Elevation Gain", value: "620",  unit: "m",   change: "↑ 8%" },
  ],

  insights: [
    {
      title: "Aerobic Efficiency ↑",
      description: "Your pace improved while average heart rate remained stable. Great progress!",
      confidence: "High",
      type: "success",
    },
    {
      title: "Potential Fatigue Risk",
      description: "Your cadence has slightly declined during harder sessions over the last 10 days.",
      confidence: "Moderate",
      type: "warning",
    },
    {
      title: "Performance Opportunity",
      description: "You respond well to lower-intensity volume. Adding mileage gradually may improve your 10K projection.",
      confidence: "Moderate",
      type: "info",
    },
  ],

  weeklyFocus: {
    title: "Maintain aerobic base",
    description: "Keep easy runs easy and prioritize recovery this week.",
  },

  recentActivities: [
    {
      type: "Easy Run",
      date: "Yesterday",
      distance: "10.2 km",
      pace: "5:24 /km",
      hr: "138 bpm",
    },
    {
      type: "Tempo Run",
      date: "Jun 7, 2024",
      distance: "8.1 km",
      pace: "4:28 /km",
      hr: "152 bpm",
    },
  ],
}
