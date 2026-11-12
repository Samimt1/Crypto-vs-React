import {useEffect,useRef,useState} from 'react';
import {createChart,ColorType,CandlestickSeries,HistogramSeries} from 'lightweight-charts';
import {BarChart3} from 'lucide-react';
export default function TradingChart({symbol}:{symbol:string}){
 const ref=useRef<HTMLDivElement>(null);
 const[interval,setIntervalValue]=useState('1h');
 const[error,setError]=useState('');
 useEffect(()=>{if(!ref.current)return;setError('');
 const chart=createChart(ref.current,{width:ref.current.clientWidth,height:410,layout:{background:{type:ColorType.Solid,color:'#111a2b'},textColor:'#8298b4',fontFamily:'DM Sans, system-ui, sans-serif'},grid:{vertLines:{color:'#1c293e'},horzLines:{color:'#1c293e'}},rightPriceScale:{borderColor:'#2c3b53'},timeScale:{borderColor:'#2c3b53',timeVisible:true},crosshair:{mode:1}});
 const candle=chart.addSeries(CandlestickSeries,{upColor:'#22cba3',downColor:'#f16c86',borderVisible:false,wickUpColor:'#22cba3',wickDownColor:'#f16c86'});
 const volume=chart.addSeries(HistogramSeries,{priceFormat:{type:'volume'},priceScaleId:'volume',lastValueVisible:false,priceLineVisible:false});
 chart.priceScale('volume').applyOptions({scaleMargins:{top:0.82,bottom:0}});
 const controller=new AbortController();
 fetch('https://data-api.binance.vision/api/v3/klines?symbol='+symbol+'&interval='+interval+'&limit=180',{signal:controller.signal})
 .then(r=>{if(!r.ok)throw Error('Unavailable');return r.json()})
 .then((rows:unknown[][])=>{if(controller.signal.aborted)return;const bars=rows.map(r=>({time:Math.floor(Number(r[0])/1000) as never,open:Number(r[1]),high:Number(r[2]),low:Number(r[3]),close:Number(r[4])}));candle.setData(bars);volume.setData(rows.map((r,i)=>({time:bars[i].time,value:Number(r[5]),color:bars[i].close>=bars[i].open?'#1f927b66':'#c94c6966'})));chart.timeScale().fitContent()})
 .catch((e:Error)=>{if(e.name!=='AbortError')setError('Chart data could not be loaded. Please try again later.')});
 const observer=new ResizeObserver(()=>{if(ref.current)chart.applyOptions({width:ref.current.clientWidth})});observer.observe(ref.current);
 return()=>{controller.abort();observer.disconnect();chart.remove()}
 },[symbol,interval]);
 return <section className="panel chart-panel"><div className="panel-heading"><div><span className="overline">MARKET ANALYSIS</span><h3><BarChart3 size={16} style={{verticalAlign:'middle',marginRight:8}}/>Price chart</h3></div><div className="chart-intervals">{['15m','1h','4h','1d'].map(i=><button key={i} className={interval===i?'selected':''} onClick={()=>setIntervalValue(i)}>{i}</button>)}</div></div><div className="chart-host" ref={ref}/>{error&&<p className="feedback error" role="alert">{error}</p>}<div className="chart-hint">Candlesticks and volume · Binance public market data</div></section>
}
