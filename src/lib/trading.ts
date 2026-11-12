export type Asset='USDT'|'BTC'|'ETH'|'SOL'|'BNB';
export type Side='BUY'|'SELL';
export type OrderType='MARKET'|'LIMIT';
export type Order={id:string;symbol:string;side:Side;type:OrderType;quantity:number;price:number;status:'OPEN'|'FILLED'|'CANCELED';at:string};
export type Wallet={balances:Record<Asset,number>;orders:Order[]};
export const SYMBOLS=['BTCUSDT','ETHUSDT','SOLUSDT','BNBUSDT'] as const;
export const initialWallet:Wallet={balances:{USDT:10000,BTC:0,ETH:0,SOL:0,BNB:0},orders:[]};
export const baseAsset=(symbol:string)=>symbol.replace('USDT','') as Asset;
const round=(n:number)=>Number(n.toFixed(10));
export const feeRate=0.001;
export function available(w:Wallet,asset:Asset){
  const locked=w.orders.filter(o=>o.status==='OPEN').reduce((v,o)=>v+(asset==='USDT'&&o.side==='BUY'?o.quantity*o.price*(1+feeRate):asset===baseAsset(o.symbol)&&o.side==='SELL'?o.quantity:0),0);
  return Math.max(0,round(w.balances[asset]-locked));
}
export function placeOrder(w:Wallet,o:Order,marketPrice:number):Wallet{
  if(!SYMBOLS.some(s=>s===o.symbol)||!Number.isFinite(o.quantity)||o.quantity<=0||!Number.isFinite(o.price)||o.price<=0||!Number.isFinite(marketPrice)||marketPrice<=0)throw Error('Invalid price or quantity.');
  const asset=baseAsset(o.symbol);
  if(o.side==='BUY'&&available(w,'USDT')+1e-8<o.quantity*o.price*(1+feeRate))throw Error('Insufficient available USDT.');
  if(o.side==='SELL'&&available(w,asset)+1e-8<o.quantity)throw Error('Insufficient available '+asset+'.');
  const fill=o.type==='MARKET'||(o.side==='BUY'?marketPrice<=o.price:marketPrice>=o.price);
  const executionPrice=o.type==='MARKET'?marketPrice:o.price;
  const order={...o,price:executionPrice,status:fill?'FILLED' as const:'OPEN' as const};
  const balances={...w.balances};
  if(fill){const total=o.quantity*executionPrice;
    if(o.side==='BUY'){balances.USDT=round(balances.USDT-total*(1+feeRate));balances[asset]=round(balances[asset]+o.quantity);}
    else{balances[asset]=round(balances[asset]-o.quantity);balances.USDT=round(balances.USDT+total*(1-feeRate));}
  }
  return{balances,orders:[order,...w.orders]};
}
export const cancelOrder=(w:Wallet,id:string):Wallet=>({...w,orders:w.orders.map(o=>o.id===id&&o.status==='OPEN'?{...o,status:'CANCELED'}:o)});
export function settle(w:Wallet,symbol:string,marketPrice:number):Wallet{
  if(!marketPrice||!Number.isFinite(marketPrice))return w;
  const balances={...w.balances};
  const orders=w.orders.map(o=>{if(o.status!=='OPEN'||o.symbol!==symbol||(o.side==='BUY'&&marketPrice>o.price)||(o.side==='SELL'&&marketPrice<o.price))return o;
    const asset=baseAsset(symbol),total=o.quantity*o.price;
    if(o.side==='BUY'){balances.USDT=round(balances.USDT-total*(1+feeRate));balances[asset]=round(balances[asset]+o.quantity);}
    else{balances[asset]=round(balances[asset]-o.quantity);balances.USDT=round(balances.USDT+total*(1-feeRate));}
    return{...o,status:'FILLED' as const};
  });
  return{balances,orders};
}
export function loadWallet():Wallet{try{const obj=JSON.parse(localStorage.getItem('cryptox-paper-v1')||'null');if(obj&&obj.balances&&Array.isArray(obj.orders)&&Object.keys(initialWallet.balances).every(k=>Number.isFinite(obj.balances[k])))return obj as Wallet;}catch{}return initialWallet;}
