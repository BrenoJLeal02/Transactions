import { createContext, useEffect, useState, ReactNode } from "react";
import {api} from "../lib/axios"
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

    async function fetchTransactions(query?: string) {
       const response = await api.get('/transactions', {
        params: {
            _sort:'createdAt',
            _order: 'desc',
            q: query,
        }
       })
        setTransactions(response.data);
        
    }

    async function createTransaction(data: CreateTransactionInput ){
        const {description, price, category, type} = data;

        const response = await api.post('/transactions', {
            description,
            category,
            price,
            type,
            createdAt: new Date(),
        })

        setTransactions(state => [response.data, ...state])
    }


    useEffect(() => {
        fetchTransactions();
    }, []);

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
