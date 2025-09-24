import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransactions } from "@/contexts/TransactionContext";
import { DollarSign } from "lucide-react";

export default function AddTransactionModal({ open, onOpenChange, editingTransaction = null }) {
  const { addTransaction, updateTransaction, categories, paymentMethods } = useTransactions();
  
  const [formData, setFormData] = useState({
    type: editingTransaction?.type || "expense",
    amount: editingTransaction?.amount || "",
    category: editingTransaction?.category || "",
    description: editingTransaction?.description || "",
    date: editingTransaction?.date || new Date().toISOString().split('T')[0],
    payment_method: editingTransaction?.payment_method || ""
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.description.trim() || !formData.amount || !formData.category || !formData.payment_method) {
      return;
    }

    setLoading(true);
    try {
      const transactionData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description.trim(),
        date: formData.date,
        payment_method: formData.payment_method
      };

      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, transactionData);
      } else {
        await addTransaction(transactionData);
      }

      // Reset form
      setFormData({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
        payment_method: ""
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Transaction error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Format amount for display
  const formatAmount = (value) => {
    if (!value) return "";
    const number = parseFloat(value.toString().replace(/[^0-9.-]/g, ''));
    return isNaN(number) ? "" : number.toString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
          </DialogTitle>
          <DialogDescription>
            {editingTransaction ? 'Update transaction details' : 'Enter details for the new transaction'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Transaction Type Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="space-y-0.5">
                <Label className="text-base font-medium">Transaction Type</Label>
                <div className="text-sm text-muted-foreground">
                  {formData.type === 'income' ? 'Money coming in' : 'Money going out'}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Label className={formData.type === 'expense' ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                  Expense
                </Label>
                <Switch
                  checked={formData.type === 'income'}
                  onCheckedChange={(checked) => handleInputChange("type", checked ? "income" : "expense")}
                />
                <Label className={formData.type === 'income' ? 'text-success font-medium' : 'text-muted-foreground'}>
                  Income
                </Label>
              </div>
            </div>

            {/* Amount */}
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="pl-10 text-right text-lg font-semibold"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", formatAmount(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Enter transaction description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
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

              {/* Payment Method */}
              <div className="grid gap-2">
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select value={formData.payment_method} onValueChange={(value) => handleInputChange("payment_method", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date */}
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingTransaction ? 'Update Transaction' : 'Add Transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}