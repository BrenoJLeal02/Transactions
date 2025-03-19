import { useEffect, useState, ReactNode, useCallback } from "react";
import {api} from "../lib/axios"
import { createContext } from "use-context-selector";

interface Transactions {
    id: number;
    description: string;
    type: 'income' | 'outcome';
    price: number;
    category: string;
    createdAt: string;
}
interface CreateTransactionInput{
    description: string;
    category: string;
    price:number;
    type: 'income' | 'outcome';

}

interface TransactionContextType {
    transactions: Transactions[];
    fetchTransactions: (query?: string) => Promise<void>
    createTransaction: (data: CreateTransactionInput) => Promise<void>

}


const TransactionsContext = createContext({} as TransactionContextType);
export default TransactionsContext;

export function TransactionsProvider({ children }: { children: ReactNode }) { 
    const [transactions, setTransactions] = useState<Transactions[]>([]);

    const fetchTransactions = useCallback(
        async (query?: string) => {
       const response = await api.get('/transactions', {
        params: {
            _sort:'createdAt',
            _order: 'desc',
            q: query,
        }
       })
        setTransactions(response.data);
        
        }, []
    )

    const createTransaction = useCallback(
        async (data: CreateTransactionInput ) => {
            const {description, price, category, type} = data;
    
            const response = await api.post('/transactions', {
                description,
                category,
                price,
                type,
                createdAt: new Date(),
            })
    
            setTransactions(state => [response.data, ...state])
        }, 
        [],
    )
    


    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    return (
        <TransactionsContext.Provider value={{ 
            transactions,
            fetchTransactions,
            createTransaction
            }}>
            {children}
        </TransactionsContext.Provider>
    );
}
