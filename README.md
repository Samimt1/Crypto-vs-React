# CryptoX — React Spot Exchange

## Live deployment
https://crypto-vs-react-samimt1s-projects.vercel.app

Responsive React + TypeScript **paper-trading** application with public market data, spot market/limit order simulations, wallet, price charts and order history.

> **Demo only:** No real funds, real order execution, deposits, withdrawals or custodial accounts. Browser storage is not secure accounting, and the demo price feed can be delayed or unavailable.

## Interface redesign — v2.0

- Modern dark dashboard with sidebar navigation and responsive mobile menu
- Overview cards for portfolio value, available funds, open orders, and assets
- Interactive markets table with search, favorites, and quick trade actions
- Upgraded candlestick chart with volume bars and interval selection
- Spot order form with buy/sell controls and 25% / 50% / 75% / 100% quantity shortcuts
- Improved wallet, order status filtering, cancel buttons, and virtual account reset

## Start

Requires Node.js 20.19+ (or 22.12+) and npm.

```bash
npm install
npm run dev
```

Open http://localhost:5173. Build with `npm run build`.

## Features

- BTC/USDT, ETH/USDT, SOL/USDT, BNB/USDT markets
- Binance public market-data REST API (10-second polling) and candlestick charts
- Virtual 10,000 USDT starting wallet, localStorage persistence
- Market buy/sell, limit buy/sell, open orders, cancellations
- 0.1% simulated trading fee and reserved balances
- Responsive trade, markets, wallet, orders screens

## Important limitations

Limit orders are filled using observed ticker snapshots at the limit price, not matched to a real order book. There is no backend, user authentication, real wallet, order matching engine, liquidity model, partial fills, or settlement ledger. All balances are local and may be reset or manipulated. This code is **not suitable for real-money trading**.

A production exchange requires a secure backend, transactional immutable ledger, decimal precision, authentication and 2FA, compliance/licensing, custody integration, order matching and independent security audits.

## Source

- `src/App.tsx` — pages, market polling, forms
- `src/lib/trading.ts` — virtual order logic
- `src/components/TradingChart.tsx` — candles
- `src/style.css` — responsive dark styling
