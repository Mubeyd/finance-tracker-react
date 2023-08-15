export interface IItem {
    id: number;
    description: string;
    type: 'income' | 'expense';
    amount: number;
    createdAt: Date;
    currency: ICurrency;
    amountInUSD: number;
  }


  export interface ICurrency {
    code: string;
    name: string;
    symbol: string;
    valueInUSD: number;
  }