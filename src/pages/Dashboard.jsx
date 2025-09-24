// Dashboard.jsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Receipt,
  PieChart
} from "lucide-react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTransactions } from "@/contexts/TransactionContext";
import { useBudgets } from "@/contexts/BudgetContext";
import { useState } from "react";
import heroImage from "@/assets/dashboard-hero.jpg";
import AddTransactionModal from "@/components/modals/AddTransactionModal";
import UploadReceiptModal from "@/components/modals/UploadReceiptModal";

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--success))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--destructive))",
  },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { transactions, getFinancialMetrics, getSpendingByCategory } = useTransactions();
  const { getBudgetMetrics } = useBudgets();
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  
  const metrics = getFinancialMetrics();
  const { totalIncome, totalExpenses, netSavings, savingsRate } = metrics;
  const budgetMetrics = getBudgetMetrics();
  const { budgetCategories, budgetUsedPercentage, totalBudget, totalSpent } = budgetMetrics;
  
  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5).map(t => ({
    id: t.id,
    description: t.description,
    amount: t.type === 'income' ? t.amount : -t.amount,
    category: t.category,
    date: new Date(t.date).toLocaleDateString(),
    type: t.type
  }));

  // Generate monthly data from actual transactions (last 6 months)
  const generateMonthlyData = () => {
    const monthlyData = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      const monthNum = date.getMonth();
      
      const monthTransactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === monthNum && 
               transactionDate.getFullYear() === year;
      });
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      
      monthlyData.push({
        month,
        income: Math.round(income),
        expenses: Math.round(expenses)
      });
    }
    
    return monthlyData;
  };

  const monthlyData = generateMonthlyData();

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-primary text-white">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroImage} 
            alt="Financial Dashboard" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative p-8 space-y-4">
          <h1 className="text-4xl font-bold">Welcome back, {user?.email?.split('@')[0] || 'User'}!</h1>
          <p className="text-lg opacity-90">Here's your financial overview for this month</p>
          <div className="flex gap-4 pt-4">
            <Button variant="secondary" className="gap-2" onClick={() => setShowTransactionModal(true)}>
              <Plus className="h-4 w-4" />
              Add Transaction
            </Button>
            <Button variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10" onClick={() => setShowReceiptModal(true)}>
              <Receipt className="h-4 w-4" />
              Upload Receipt
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">${totalIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This month's income
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This month's expenses
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netSavings >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${netSavings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Savings rate: {savingsRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
            <PieChart className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${budgetUsedPercentage > 90 ? 'text-destructive' : budgetUsedPercentage > 75 ? 'text-warning' : 'text-accent'}`}>
              {budgetUsedPercentage}%
            </div>
            <p className="text-xs text-muted-foreground">
              ${totalSpent.toLocaleString()} of ${totalBudget.toLocaleString()} budget
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>Monthly comparison for the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Budget Progress */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>Current month spending by category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgetCategories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No budgets set yet.</p>
                <p className="text-sm">Create budgets to track your spending!</p>
              </div>
            ) : (
              budgetCategories.map((budget) => {
                const spent = parseFloat(budget.spentAmount || 0);
                const limit = parseFloat(budget.budget_limit || 0);
                const percentage = limit > 0 ? (spent / limit) * 100 : 0;
                const isOverBudget = percentage > 100;
                
                return (
                  <div key={budget.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{budget.category}</span>
                      <span className={isOverBudget ? "text-destructive" : "text-muted-foreground"}>
                        ${spent.toFixed(0)} / ${limit.toFixed(0)}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className="h-2"
                    />
                    {isOverBudget && (
                      <p className="text-xs text-destructive">
                        Over budget by ${(spent - limit).toFixed(0)}
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your most recent spending activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No transactions yet.</p>
                <p className="text-sm">Add your first transaction to see it here!</p>
              </div>
            ) : (
              recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      transaction.amount > 0 ? "bg-success/20" : "bg-destructive/20"
                    }`}>
                      {transaction.amount > 0 ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.category} • {transaction.date}</p>
                    </div>
                  </div>
                  <div className={`text-lg font-semibold ${
                    transaction.amount > 0 ? "text-success" : "text-destructive"
                  }`}>
                    {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <AddTransactionModal 
        open={showTransactionModal} 
        onOpenChange={setShowTransactionModal} 
      />
      <UploadReceiptModal 
        open={showReceiptModal} 
        onOpenChange={setShowReceiptModal} 
      />
    </div>
  );
}