import { createContext, useEffect, useState, ReactNode } from "react";

interface Transactions {
    id: number;
    description: string;
    type: 'income' | 'outcome';
    price: number;
    category: string;
    createdAt: string;
}

interface TransactionContextType {
    transactions: Transactions[];
}

const TransactionsContext = createContext({} as TransactionContextType);
export default TransactionsContext;

export function TransactionsProvider({ children }: { children: ReactNode }) { 
    const [transactions, setTransactions] = useState<Transactions[]>([]);

    async function loadTransactions() {
        const response = await fetch('http://localhost:3000/transactions');
        const data = await response.json();
        setTransactions(data);
    }

    useEffect(() => {
        loadTransactions();
    }, []);

    return (
        <TransactionsContext.Provider value={{ transactions }}>
            {children}
        </TransactionsContext.Provider>
    );
}
