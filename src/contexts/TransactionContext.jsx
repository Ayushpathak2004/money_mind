import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

const TransactionContext = createContext();

// Default categories and payment methods
export const TRANSACTION_CATEGORIES = [
  'Food & Dining',
  'Transportation', 
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Income',
  'Investment',
  'Other'
];

export const PAYMENT_METHODS = [
  'Cash',
  'Credit Card', 
  'Debit Card',
  'Bank Transfer'
];

// Transaction service for Supabase operations
class TransactionService {
  static async getTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error loading transactions:', error);
      throw error;
    }
    
    return data || [];
  }

  static async addTransaction(transactionData) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        ...transactionData,
        user_id: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
    
    return data;
  }

  static async updateTransaction(id, updateData) {
    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating transaction:', error);
      throw error;
    }
    
    return data;
  }

  static async deleteTransaction(id) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }
}

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load transactions on mount and when user changes
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const loadTransactions = async () => {
      try {
        setLoading(true);
        const loadedTransactions = await TransactionService.getTransactions();
        setTransactions(loadedTransactions);
      } catch (error) {
        console.error('Failed to load transactions:', error);
        toast({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [user]);

  const addTransactionLocal = (transactionData) => {
    const newTransaction = {
      id: `local-${Date.now()}`,
      ...transactionData,
    };
    setTransactions(prev => [newTransaction, ...prev]);
    toast({ title: "Added locally", description: "This transaction isn't saved to the cloud." });
    return newTransaction;
  };

  const addTransaction = async (transactionData) => {
    if (!user) {
      // Fallback to local (no auth setup)
      return addTransactionLocal(transactionData);
    }

    try {
      const newTransaction = await TransactionService.addTransaction(transactionData);
      setTransactions(prev => [newTransaction, ...prev]);
      
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
      
      return newTransaction;
    } catch (error) {
      console.error('Failed to add transaction:', error);
      toast({
        title: "Error", 
        description: "Failed to add transaction",
        variant: "destructive",
      });
      // Also keep UX flowing by adding locally as a best-effort
      return addTransactionLocal(transactionData);
    }
  };

  const updateTransaction = async (id, updateData) => {
    if (!user) return;
    
    try {
      const updatedTransaction = await TransactionService.updateTransaction(id, updateData);
      setTransactions(prev => 
        prev.map(t => t.id === id ? updatedTransaction : t)
      );
      
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
      
      return updatedTransaction;
    } catch (error) {
      console.error('Failed to update transaction:', error);
      toast({
        title: "Error",
        description: "Failed to update transaction", 
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteTransaction = async (id) => {
    if (!user) return;
    
    try {
      await TransactionService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive", 
      });
      throw error;
    }
  };

  // Calculate financial metrics
  const getFinancialMetrics = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    });

    const income = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
      
    const expenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const netSavings = income - expenses;
    const savingsRate = income > 0 ? (netSavings / income) * 100 : 0;

    return {
      totalIncome: income,
      totalExpenses: expenses, 
      netSavings,
      savingsRate
    };
  };

  // Get spending by category
  const getSpendingByCategory = (timeframe = 'current-month') => {
    let filteredTransactions = transactions.filter(t => t.type === 'expense');
    
    if (timeframe === 'current-month') {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      filteredTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth && 
               transactionDate.getFullYear() === currentYear;
      });
    }

    const categorySpending = {};
    filteredTransactions.forEach(transaction => {
      const category = transaction.category || 'Other';
      categorySpending[category] = (categorySpending[category] || 0) + parseFloat(transaction.amount || 0);
    });

    return Object.entries(categorySpending).map(([name, value]) => ({
      name,
      value
    }));
  };

  const value = {
    transactions,
    loading,
    addTransaction,
    addTransactionLocal,
    updateTransaction,
    deleteTransaction,
    getFinancialMetrics,
    getSpendingByCategory,
    categories: TRANSACTION_CATEGORIES,
    paymentMethods: PAYMENT_METHODS
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
