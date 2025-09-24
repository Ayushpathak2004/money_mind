import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useTransactions } from './TransactionContext';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

const BudgetContext = createContext();

// Budget service for Supabase operations
class BudgetService {
  static async getBudgets() {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading budgets:', error);
      throw error;
    }
    
    return data || [];
  }

  static async addBudget(budgetData) {
    const { data, error } = await supabase
      .from('budgets')
      .insert([{
        ...budgetData,
        user_id: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding budget:', error);
      throw error;
    }
    
    return data;
  }

  static async updateBudget(id, updateData) {
    const { data, error } = await supabase
      .from('budgets')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
    
    return data;
  }

  static async deleteBudget(id) {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  }
}

export function BudgetProvider({ children }) {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getSpendingByCategory } = useTransactions();
  const { user } = useAuth();

  // Load budgets on mount and when user changes
  useEffect(() => {
    if (!user) {
      setBudgets([]);
      setLoading(false);
      return;
    }

    const loadBudgets = async () => {
      try {
        setLoading(true);
        const loadedBudgets = await BudgetService.getBudgets();
        setBudgets(loadedBudgets);
      } catch (error) {
        console.error('Failed to load budgets:', error);
        toast({
          title: "Error",
          description: "Failed to load budgets",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadBudgets();
  }, [user]);

  const addBudget = async (budgetData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add budgets",
        variant: "destructive",
      });
      return;
    }

    try {
      const newBudget = await BudgetService.addBudget(budgetData);
      setBudgets(prev => [...prev, newBudget]);
      
      toast({
        title: "Success",
        description: "Budget added successfully",
      });
      
      return newBudget;
    } catch (error) {
      console.error('Failed to add budget:', error);
      toast({
        title: "Error", 
        description: "Failed to add budget",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateBudget = async (id, updateData) => {
    if (!user) return;
    
    try {
      const updatedBudget = await BudgetService.updateBudget(id, updateData);
      setBudgets(prev => 
        prev.map(b => b.id === id ? updatedBudget : b)
      );
      
      toast({
        title: "Success",
        description: "Budget updated successfully",
      });
      
      return updatedBudget;
    } catch (error) {
      console.error('Failed to update budget:', error);
      toast({
        title: "Error",
        description: "Failed to update budget", 
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteBudget = async (id) => {
    if (!user) return;
    
    try {
      await BudgetService.deleteBudget(id);
      setBudgets(prev => prev.filter(b => b.id !== id));
      
      toast({
        title: "Success",
        description: "Budget deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete budget:', error);
      toast({
        title: "Error",
        description: "Failed to delete budget",
        variant: "destructive", 
      });
      throw error;
    }
  };

  // Get budget categories with actual spending data
  const getBudgetCategories = () => {
    const spendingData = getSpendingByCategory('current-month');
    const spendingMap = {};
    spendingData.forEach(item => {
      spendingMap[item.name] = item.value;
    });

    return budgets.map(budget => ({
      ...budget,
      spentAmount: spendingMap[budget.category] || 0,
    }));
  };

  // Calculate budget metrics
  const getBudgetMetrics = () => {
    const budgetCategories = getBudgetCategories();
    
    const totalBudget = budgetCategories.reduce((acc, cat) => acc + parseFloat(cat.budget_limit || 0), 0);
    const totalSpent = budgetCategories.reduce((acc, cat) => acc + parseFloat(cat.spentAmount || 0), 0);
    const remainingBudget = totalBudget - totalSpent;
    const budgetUsedPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    const overBudgetCategories = budgetCategories.filter(cat => 
      parseFloat(cat.spentAmount || 0) > parseFloat(cat.budget_limit || 0)
    );
    
    const nearLimitCategories = budgetCategories.filter(cat => {
      const spent = parseFloat(cat.spentAmount || 0);
      const limit = parseFloat(cat.budget_limit || 0);
      if (limit === 0) return false;
      const percentage = (spent / limit) * 100;
      return percentage >= 80 && percentage <= 100;
    });

    return {
      totalBudget,
      totalSpent,
      remainingBudget,
      budgetUsedPercentage,
      overBudgetCategories,
      nearLimitCategories,
      budgetCategories
    };
  };

  const value = {
    budgets,
    loading,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetCategories,
    getBudgetMetrics
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudgets() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudgets must be used within a BudgetProvider');
  }
  return context;
}