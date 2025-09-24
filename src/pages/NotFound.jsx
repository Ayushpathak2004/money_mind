// Transactions.jsx
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const transactions = [
  {
    id: "1",
    description: "Grocery Shopping",
    amount: -85.99,
    category: "Food & Dining",
    date: "2024-01-15",
    type: "expense",
    account: "Credit Card",
    status: "completed"
  },
  {
    id: "2",
    description: "Salary Deposit",
    amount: 2500.00,
    category: "Income",
    date: "2024-01-14", 
    type: "income",
    account: "Checking",
    status: "completed"
  },
  {
    id: "3",
    description: "Electric Bill",
    amount: -120.50,
    category: "Bills & Utilities",
    date: "2024-01-13",
    type: "expense",
    account: "Checking",
    status: "completed"
  },
  {
    id: "4",
    description: "Coffee Shop",
    amount: -12.75,
    category: "Food & Dining",
    date: "2024-01-12",
    type: "expense",
    account: "Credit Card",
    status: "completed"
  },
  {
    id: "5",
    description: "Freelance Work",
    amount: 800.00,
    category: "Income",
    date: "2024-01-11",
    type: "income",
    account: "Savings",
    status: "pending"
  },
  {
    id: "6",
    description: "Amazon Purchase",
    amount: -45.99,
    category: "Shopping",
    date: "2024-01-10",
    type: "expense",
    account: "Credit Card",
    status: "completed"
  },
  {
    id: "7",
    description: "Gas Station",
    amount: -38.75,
    category: "Transportation",
    date: "2024-01-09",
    type: "expense",
    account: "Credit Card",
    status: "completed"
  },
  {
    id: "8",
    description: "Investment Dividend",
    amount: 120.25,
    category: "Investment",
    date: "2024-01-08",
    type: "income",
    account: "Investment",
    status: "completed"
  }
];

const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Income",
  "Investment",
  "Other"
];

const accounts = [
  "Checking",
  "Savings",
  "Credit Card",
  "Investment",
  "Cash"
];

export default function Transactions() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || transaction.category === selectedCategory;
    const matchesType = selectedType === "all" || transaction.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleCreateTransaction = () => {
    setEditingTransaction(null);
    setIsDialogOpen(true);
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
              <Button variant="outline" className="gap-2">
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
            {filteredTransactions.map((transaction) => (
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
            </DialogTitle>
            <DialogDescription>
              {editingTransaction ? 'Update transaction details' : 'Enter details for the new transaction'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Enter description"
                defaultValue={editingTransaction?.description}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                defaultValue={editingTransaction?.amount ? Math.abs(editingTransaction.amount) : ""}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select defaultValue={editingTransaction?.type || "expense"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select defaultValue={editingTransaction?.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="account">Account</Label>
                <Select defaultValue={editingTransaction?.account}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(account => (
                      <SelectItem key={account} value={account}>{account}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  defaultValue={editingTransaction?.date || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="receipt">Receipt (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input id="receipt" type="file" className="flex-1" />
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Receipt className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>
              {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}