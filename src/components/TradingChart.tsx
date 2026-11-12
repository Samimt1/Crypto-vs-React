import{useEffect,useRef,useState}from'react';
import{createChart,ColorType,CandlestickSeries}from'lightweight-charts';
export default function TradingChart({symbol}:{symbol:string}){
 const ref=useRef<HTMLDivElement>(null);
 const[interval,setIntervalValue]=useState('1h');const[error,setError]=useState('');
 useEffect(()=>{if(!ref.current)return;setError('');
 const chart=createChart(ref.current,{width:ref.current.clientWidth,height:380,layout:{background:{type:ColorType.Solid,color:'#111b2d'},textColor:'#aab9cd'},grid:{vertLines:{color:'#1b2940'},horzLines:{color:'#1b2940'}}});
 const candle=chart.addSeries(CandlestickSeries,{upColor:'#18b58c',downColor:'#f36b7b',borderVisible:false,wickUpColor:'#18b58c',wickDownColor:'#f36b7b'});
 const controller=new AbortController();
 fetch('https://data-api.binance.vision/api/v3/klines?symbol='+symbol+'&interval='+interval+'&limit=180',{signal:controller.signal})
 .then(r=>{if(!r.ok)throw Error('Unavailable');return r.json()})
 .then((rows:unknown[][])=>{candle.setData(rows.map(r=>({time:Math.floor(Number(r[0])/1000) as never,open:Number(r[1]),high:Number(r[2]),low:Number(r[3]),close:Number(r[4])})));chart.timeScale().fitContent();})
 .catch(e=>{if(e.name!=='AbortError')setError('Chart feed is temporarily unavailable.')});
 const observer=new ResizeObserver(()=>{if(ref.current)chart.applyOptions({width:ref.current.clientWidth})});observer.observe(ref.current);
 return()=>{controller.abort();observer.disconnect();chart.remove()};
 },[symbol,interval]);
 return <section className="panel"><div className="panel-title"><h3>Price chart</h3><div className="intervals">{['15m','1h','4h','1d'].map(i=><button className={interval===i?'selected':''} key={i} onClick={()=>setIntervalValue(i)}>{i}</button>)}</div></div><div ref={ref}/>{error&&<p className="error">{error}</p>}</section>;
}
