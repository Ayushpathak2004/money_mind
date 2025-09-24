// -- Create transactions table with user-specific data
// CREATE TABLE public.transactions (
//   id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
//   user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
//   type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
//   amount DECIMAL(10,2) NOT NULL,
//   category TEXT NOT NULL,
//   description TEXT,
//   date DATE NOT NULL,
//   payment_method TEXT,
//   created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
//   updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
// );

// -- Create budgets table with user-specific data
// CREATE TABLE public.budgets (
//   id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
//   user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
//   category TEXT NOT NULL,
//   budget_limit DECIMAL(10,2) NOT NULL,
//   start_date DATE NOT NULL,
//   end_date DATE NOT NULL,
//   created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
//   updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
//   UNIQUE(user_id, category)
// );

// -- Enable Row Level Security
// ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
// ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

// -- Create RLS policies for transactions
// CREATE POLICY "Users can view their own transactions" 
// ON public.transactions 
// FOR SELECT 
// USING (auth.uid() = user_id);

// CREATE POLICY "Users can create their own transactions" 
// ON public.transactions 
// FOR INSERT 
// WITH CHECK (auth.uid() = user_id);

// CREATE POLICY "Users can update their own transactions" 
// ON public.transactions 
// FOR UPDATE 
// USING (auth.uid() = user_id);

// CREATE POLICY "Users can delete their own transactions" 
// ON public.transactions 
// FOR DELETE 
// USING (auth.uid() = user_id);

// -- Create RLS policies for budgets
// CREATE POLICY "Users can view their own budgets" 
// ON public.budgets 
// FOR SELECT 
// USING (auth.uid() = user_id);

// CREATE POLICY "Users can create their own budgets" 
// ON public.budgets 
// FOR INSERT 
// WITH CHECK (auth.uid() = user_id);

// CREATE POLICY "Users can update their own budgets" 
// ON public.budgets 
// FOR UPDATE 
// USING (auth.uid() = user_id);

// CREATE POLICY "Users can delete their own budgets" 
// ON public.budgets 
// FOR DELETE 
// USING (auth.uid() = user_id);

// -- Create function to update timestamps
// CREATE OR REPLACE FUNCTION public.update_updated_at_column()
// RETURNS TRIGGER AS $$
// BEGIN
//   NEW.updated_at = now();
//   RETURN NEW;
// END;
// $$ LANGUAGE plpgsql SET search_path = public;

// -- Create triggers for automatic timestamp updates
// CREATE TRIGGER update_transactions_updated_at
//   BEFORE UPDATE ON public.transactions
//   FOR EACH ROW
//   EXECUTE FUNCTION public.update_updated_at_column();

// CREATE TRIGGER update_budgets_updated_at
//   BEFORE UPDATE ON public.budgets
//   FOR EACH ROW
//   EXECUTE FUNCTION public.update_updated_at_column();