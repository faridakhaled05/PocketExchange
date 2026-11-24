import type { Currency } from './rates'

export interface Conversion {
    id : number;
    date : string; //not date object because of JSON serialization 
    from : Currency;
    to : Currency;
    amount : number;
    result : number;
    
}

export type Status = 'loading' | 'ready';
export type { Currency }