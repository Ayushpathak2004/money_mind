import { useState } from "react";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping", 
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Other"
];

export default function AddBudgetModal({ open, onOpenChange, editingBudget = null, onSave }) {
  const [formData, setFormData] = useState({
    category: editingBudget?.category || "",
    budget_limit: editingBudget?.budget_limit || "",
    start_date: editingBudget?.start_date || new Date().toISOString().split('T')[0],
    end_date: editingBudget?.end_date || (() => {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      return date.toISOString().split('T')[0];
    })()
  });

  // Update form data when editingBudget changes
  useState(() => {
    if (editingBudget) {
      setFormData({
        category: editingBudget.category || "",
        budget_limit: editingBudget.budget_limit || "",
        start_date: editingBudget.start_date || new Date().toISOString().split('T')[0],
        end_date: editingBudget.end_date || (() => {
          const date = new Date();
          date.setMonth(date.getMonth() + 1);
          return date.toISOString().split('T')[0];
        })()
      });
    }
  }, [editingBudget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBudget) {
        await onSave(editingBudget.id, formData);
      } else {
        await onSave(formData);
      }
      
      // Reset form
      setFormData({
        category: "",
        budget_limit: "",
        start_date: new Date().toISOString().split('T')[0],
        end_date: (() => {
          const date = new Date();
          date.setMonth(date.getMonth() + 1);
          return date.toISOString().split('T')[0];
        })()
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingBudget ? 'Edit Budget' : 'Add New Budget'}
          </DialogTitle>
          <DialogDescription>
            Set spending limits for your expense categories
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
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
            <div className="grid gap-2">
              <Label htmlFor="budget_limit">Budget Limit</Label>
              <Input
                id="budget_limit"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.budget_limit}
                onChange={(e) => handleInputChange("budget_limit", e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange("start_date", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange("end_date", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingBudget ? 'Save Changes' : 'Save Budget'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}