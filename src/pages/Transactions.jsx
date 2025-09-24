//Transactions.jsx
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddTransactionModal from "@/components/modals/AddTransactionModal";
import { useTransactions } from "@/contexts/TransactionContext";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  TrendingUp, 
  TrendingDown,
  Edit,
  Trash2,
  Receipt
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Transactions() {
  const { transactions, deleteTransaction, categories, paymentMethods } = useTransactions();
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  // Convert transactions to display format
  const displayTransactions = transactions.map(t => ({
    id: t.id,
    description: t.description,
    amount: t.type === 'income' ? t.amount : -t.amount,
    category: t.category,
    date: t.date,
    type: t.type,
    account: t.paymentMethod,
    status: "completed"
  }));

  const filteredTransactions = displayTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || transaction.category === selectedCategory;
    const matchesType = selectedType === "all" || transaction.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleCreateTransaction = () => {
    setEditingTransaction(null);
    setShowTransactionModal(true);
  };

  const handleDeleteTransaction = async (id) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error("Failed to delete transaction:", error);
      }
    }
  };

  const exportTransactions = () => {
    const csvData = [
      ['Date', 'Description', 'Category', 'Type', 'Amount', 'Payment Method'],
      ...filteredTransactions.map(t => [
        new Date(t.date).toLocaleDateString(),
        t.description,
        t.category,
        t.type,
        Math.abs(t.amount).toFixed(2),
        t.account
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status) => {
    const variants = {
      completed: "success",
      pending: "warning",
      failed: "destructive"
    };
    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    // ✅ Wrap the whole page in a centered, fixed-width container
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">Track and manage your financial transactions</p>
        </div>
        <Button onClick={handleCreateTransaction} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search transactions..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2" onClick={exportTransactions}>
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transactions found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No transactions found</p>
                <p className="text-sm">
                  {searchTerm || selectedCategory !== "all" || selectedType !== "all" 
                    ? "Try adjusting your filters or search term" 
                    : "Add your first transaction to get started"
                  }
                </p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      transaction.type === "income" ? "bg-success/20" : "bg-destructive/20"
                    }`}>
                      {transaction.type === "income" ? (
                        <TrendingUp className="h-5 w-5 text-success" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{transaction.category}</span>
                        <span>•</span>
                        <span>{transaction.account}</span>
                        <span>•</span>
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(transaction.status)}
                    <div className={`text-lg font-semibold text-right ${
                      transaction.type === "income" ? "text-success" : "text-destructive"
                    }`}>
                      {transaction.type === "income" ? "+" : "-"}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditTransaction(transaction)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:text-destructive"
                        onClick={() => handleDeleteTransaction(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Modal */}
      <AddTransactionModal 
        open={showTransactionModal} 
        onOpenChange={setShowTransactionModal}
        editingTransaction={editingTransaction}
      />
    </div>
  );
}
