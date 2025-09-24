// Analytics.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, TrendingDown, TrendingUp, DollarSign, PieChart } from "lucide-react";
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Pie } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useTransactions } from "@/contexts/TransactionContext";
import { useState } from "react";


const chartConfig = {
  income: { label: "Income", color: "hsl(var(--success))" },
  expenses: { label: "Expenses", color: "hsl(var(--destructive))" },
  savings: { label: "Savings", color: "hsl(var(--primary))" },
  amount: { label: "Amount", color: "hsl(var(--accent))" },
};

export default function Analytics() {
  const { transactions, getFinancialMetrics, getSpendingByCategory } = useTransactions();
  const [dateRange, setDateRange] = useState("30days");
  
  // Filter transactions based on date range
  const getFilteredTransactions = () => {
    const now = new Date();
    let startDate = new Date();
    
    switch(dateRange) {
      case "7days":
        startDate = new Date();
        startDate.setDate(now.getDate() - 7);
        break;
      case "30days":
        startDate = new Date();
        startDate.setDate(now.getDate() - 30);
        break;
      case "thismonth":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = new Date();
        startDate.setDate(now.getDate() - 30);
    }
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      return transactionDate >= startDate && transactionDate <= today;
    });
  };

  const filteredTransactions = getFilteredTransactions();
  
  // Calculate metrics from filtered transactions
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    
  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
  
  // Get expense breakdown with colors from filtered transactions
  const getSpendingByCategoryFiltered = () => {
    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    const categoryTotals = {};
    
    expenseTransactions.forEach(transaction => {
      const category = transaction.category || 'Other';
      const amount = parseFloat(transaction.amount || 0);
      if (categoryTotals[category]) {
        categoryTotals[category] += amount;
      } else {
        categoryTotals[category] = amount;
      }
    });
    
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: Math.round(value)
    }));
  };
  
  const expenseData = getSpendingByCategoryFiltered().map((item, index) => ({
    ...item,
    color: [
      "hsl(var(--primary))",
      "hsl(var(--accent))", 
      "hsl(var(--success))",
      "hsl(var(--warning))",
      "hsl(var(--destructive))",
      "hsl(var(--muted-foreground))"
    ][index % 6]
  }));

  // Generate monthly trend from filtered transactions
  const getMonthlyTrend = () => {
    const months = [];
    const now = new Date();
    
    // Get last 6 months or appropriate range based on filter
    const monthsToShow = dateRange === "7days" ? 1 : dateRange === "thismonth" ? 1 : 6;
    
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(now.getMonth() - i);
      const monthName = date.toLocaleDateString('en', { month: 'short' });
      
      const monthTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === date.getMonth() && 
               transactionDate.getFullYear() === date.getFullYear();
      });
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      
      months.push({
        month: monthName,
        income,
        expenses,
        savings: income - expenses
      });
    }
    
    return months;
  };
  
  const monthlyTrend = getMonthlyTrend();

  // Generate weekly spending data from actual transactions  
  const getWeeklySpendingData = () => {
    const weeks = [];
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // Calculate weeks in current month
    const weekCount = Math.ceil(endOfMonth.getDate() / 7);
    
    for (let week = 1; week <= weekCount; week++) {
      const weekStart = new Date(startOfMonth);
      weekStart.setDate((week - 1) * 7 + 1);
      const weekEnd = new Date(startOfMonth);
      weekEnd.setDate(Math.min(week * 7, endOfMonth.getDate()));
      
      const weekTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= weekStart && 
               transactionDate <= weekEnd && 
               t.type === 'expense';
      });
      
      const weekTotal = weekTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      
      weeks.push({
        week: `Week ${week}`,
        amount: Math.round(weekTotal)
      });
    }
    
    return weeks;
  };

  const weeklySpending = getWeeklySpendingData();

  // Export functionality
  const exportAnalyticsData = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Total Income', totalIncome.toFixed(2)],
      ['Total Expenses', totalExpenses.toFixed(2)],
      ['Net Savings', totalSavings.toFixed(2)],
      ['Savings Rate', `${savingsRate.toFixed(1)}%`],
      [''],
      ['Monthly Trend', ''],
      ['Month', 'Income', 'Expenses', 'Savings'],
      ...monthlyTrend.map(m => [m.month, m.income.toFixed(2), m.expenses.toFixed(2), m.savings.toFixed(2)]),
      [''],
      ['Expense Breakdown', ''],
      ['Category', 'Amount'],
      ...expenseData.map(e => [e.name, e.value.toFixed(2)])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into your spending patterns</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="thismonth">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportAnalyticsData}>Export Report</Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">${totalIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+8.2%</span> vs last period
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-destructive">+3.1%</span> vs last period
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${totalSavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-success">+12.8%</span> vs last period
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <PieChart className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{savingsRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              of total income saved
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown Pie Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Spending by category for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[300px]">
              <RechartsPieChart width={400} height={300}>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-md">
                          <p className="font-medium">{data.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${data.value.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RechartsPieChart>
            </ChartContainer>
            
            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {expenseData.length === 0 ? (
                <p className="col-span-2 text-center text-muted-foreground py-4">
                  No expense data available
                </p>
              ) : (
                expenseData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate">{item.name}</span>
                    <span className="text-muted-foreground ml-auto">${item.value.toFixed(0)}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Income vs Expenses Trend */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Income vs Expenses Trend</CardTitle>
            <CardDescription>Monthly comparison over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="income" 
                    stroke="var(--color-income)" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="expenses" 
                    stroke="var(--color-expenses)" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="savings" 
                    stroke="var(--color-savings)" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Spending Pattern */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Weekly Spending Pattern</CardTitle>
          <CardDescription>Your spending habits throughout the month</CardDescription>
        </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklySpending} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="amount" 
                    fill="var(--color-amount)" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
      </Card>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-success" />
              Top Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
              <p className="text-sm font-medium text-success">Savings Increased</p>
              <p className="text-xs text-muted-foreground mt-1">
                Your savings rate improved by 12.8% compared to last month
              </p>
            </div>
            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20">
              <p className="text-sm font-medium text-warning">High Food Spending</p>
              <p className="text-xs text-muted-foreground mt-1">
                Food expenses are 23% higher than your average
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm font-medium text-primary">Best Week</p>
              <p className="text-xs text-muted-foreground mt-1">
                Week 1 had your lowest spending at $520
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Monthly Goals</CardTitle>
            <CardDescription>Track your financial objectives</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Save $2,000</span>
                <span className="text-success">$1,400 / $2,000</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: "70%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Reduce Food Spending</span>
                <span className="text-warning">$1,250 / $1,000</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-warning h-2 rounded-full" style={{ width: "125%" }}></div>
              </div>
              <p className="text-xs text-warning">Over budget by $250</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Emergency Fund</span>
                <span className="text-primary">$8,500 / $10,000</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}