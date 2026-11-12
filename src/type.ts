export interface Conversion {
    id : number;
    date : string; //not date object because of JSON serialization 
    from : string;
    to : string;
    amount : number;
    result : number;
    
}
export interface AppState {
    from : string;
    to : string;
    amount : string; //to check the empty case
    history : Conversion[];
    filter : string | null;
    status : 'loading' | 'ready';
}