// Budget.jsx
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import AddBudgetModal from "@/components/modals/AddBudgetModal";
import { useBudgets } from "@/contexts/BudgetContext";
import { 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Target,
  DollarSign
} from "lucide-react";

const getCategoryColor = (index) => {
  const colors = [
    "bg-primary",
    "bg-accent", 
    "bg-success",
    "bg-warning",
    "bg-destructive",
    "bg-muted-foreground"
  ];
  return colors[index % colors.length];
};

export default function Budget() {
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const { addBudget, updateBudget, deleteBudget, getBudgetMetrics, loading } = useBudgets();

  const {
    totalBudget,
    totalSpent,
    remainingBudget,
    budgetUsedPercentage,
    overBudgetCategories,
    nearLimitCategories,
    budgetCategories
  } = getBudgetMetrics();

  const handleEditBudget = (budget) => {
    setEditingBudget(budget);
    setShowBudgetModal(true);
  };

  const handleCreateBudget = () => {
    setEditingBudget(null);
    setShowBudgetModal(true);
  };

  const handleSaveBudget = async (budgetData, budgetId = null) => {
    if (budgetId) {
      await updateBudget(budgetId, budgetData);
    } else {
      await addBudget(budgetData);
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      await deleteBudget(budgetId);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Budget Management</h1>
          <p className="text-muted-foreground">Set spending limits and track your progress</p>
        </div>
        <Button onClick={handleCreateBudget} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Budget
        </Button>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Monthly allocation</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">${totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {budgetUsedPercentage.toFixed(1)}% of budget used
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">${remainingBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Available to spend
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Over Budget</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{overBudgetCategories.length}</div>
            <p className="text-xs text-muted-foreground">
              Categories exceed limit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(overBudgetCategories.length > 0 || nearLimitCategories.length > 0) && (
        <div className="space-y-4">
          {overBudgetCategories.length > 0 && (
            <Card className="shadow-card border-destructive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  Over Budget Alert
                </CardTitle>
                <CardDescription>
                  The following categories have exceeded their budget limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {overBudgetCategories.map(category => (
                    <div key={category.id} className="flex items-center justify-between p-2 rounded-lg bg-destructive/10">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-destructive">
                        ${category.spentAmount} / ${category.budgetAmount} 
                        (+${category.spentAmount - category.budgetAmount})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {nearLimitCategories.length > 0 && (
            <Card className="shadow-card border-warning">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <TrendingDown className="h-5 w-5" />
                  Budget Warning
                </CardTitle>
                <CardDescription>
                  These categories are approaching their budget limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {nearLimitCategories.map(category => {
                    const percentage = ((category.spentAmount / category.budgetAmount) * 100).toFixed(0);
                    return (
                      <div key={category.id} className="flex items-center justify-between p-2 rounded-lg bg-warning/10">
                        <span className="font-medium">{category.name}</span>
                        <span className="text-warning">
                          {percentage}% used (${category.spentAmount} / ${category.budgetAmount})
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Budget Categories */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Budget Categories</CardTitle>
          <CardDescription>Manage your spending limits by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {budgetCategories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No budgets created yet</p>
                <p className="text-sm">Click "Add Budget" to get started</p>
              </div>
            ) : (
              budgetCategories.map((category, index) => {
                const spent = parseFloat(category.spentAmount || 0);
                const budget = parseFloat(category.budget_limit || 0);
                const percentage = budget > 0 ? (spent / budget) * 100 : 0;
                const isOverBudget = percentage > 100;
                const isNearLimit = percentage >= 80 && percentage <= 100;

                return (
                  <div key={category.id} className="space-y-3 p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${getCategoryColor(index)}`} />
                        <div>
                          <h3 className="font-medium">{category.category}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(category.start_date).toLocaleDateString()} - {new Date(category.end_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isOverBudget && (
                          <Badge variant="destructive" className="text-xs">Over Budget</Badge>
                        )}
                        {isNearLimit && (
                          <Badge variant="secondary" className="text-xs">Near Limit</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditBudget(category)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleDeleteBudget(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          ${spent.toLocaleString()} spent
                        </span>
                        <span className="text-muted-foreground">
                          ${budget.toLocaleString()} budget
                        </span>
                      </div>
                      <Progress
                        value={Math.min(percentage, 100)}
                        className={`h-2 ${isOverBudget ? 'bg-destructive/20' : ''}`}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{percentage.toFixed(0)}% used</span>
                        <span>
                          ${Math.max(0, budget - spent).toLocaleString()} remaining
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Budget Modal */}
      <AddBudgetModal 
        open={showBudgetModal} 
        onOpenChange={setShowBudgetModal}
        editingBudget={editingBudget}
        onSave={handleSaveBudget}
      />
    </div>
  );
}