import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MarketScanner from './components/MarketScanner';
import SignalCard from './components/SignalCard';
import IndicatorPanel from './components/IndicatorPanel';
import ScanlineOverlay from './components/ScanlineOverlay';

export interface MarketSignal {
  id: string;
  symbol: string;
  direction: 'LONG' | 'SHORT';
  strength: number;
  price: number;
  change: number;
  fisher: number;
  vwap: number;
  ema: number;
  volume: number;
  timestamp: Date;
  confirmations: string[];
}

const SYMBOLS = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'AAPL', 'TSLA', 'NVDA', 'SPY', 'QQQ', 'AMZN', 'GOOGL', 'META', 'MSFT'];

function generateSignal(): MarketSignal {
  const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
  const direction = Math.random() > 0.5 ? 'LONG' : 'SHORT';
  const strength = Math.floor(Math.random() * 40) + 60;
  const price = Math.random() * 50000 + 100;
  const change = (Math.random() - 0.5) * 10;
  const fisher = (Math.random() - 0.5) * 4;
  const vwap = price * (1 + (Math.random() - 0.5) * 0.02);
  const ema = price * (1 + (Math.random() - 0.5) * 0.015);
  const volume = Math.floor(Math.random() * 10000000) + 100000;

  const allConfirmations = [
    'Fisher Crossover',
    'Price > VWAP',
    'Price < VWAP',
    'EMA Alignment',
    'Volume Spike',
    'RSI Divergence',
    'MACD Signal',
    'Support Test',
    'Resistance Break',
    'Momentum Shift'
  ];

  const confirmations = allConfirmations
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.floor(Math.random() * 3) + 2);

  return {
    id: Math.random().toString(36).substring(7),
    symbol,
    direction,
    strength,
    price,
    change,
    fisher,
    vwap,
    ema,
    volume,
    timestamp: new Date(),
    confirmations
  };
}

function App() {
  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'LONG' | 'SHORT'>('ALL');
  const [scanCount, setScanCount] = useState(0);

  const addSignal = useCallback(() => {
    const newSignal = generateSignal();
    setSignals(prev => [newSignal, ...prev].slice(0, 20));
    setScanCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (!isScanning) return;

    // Initial signals
    const initialSignals = Array.from({ length: 5 }, generateSignal);
    setSignals(initialSignals);
    setScanCount(5);

    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        addSignal();
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isScanning, addSignal]);

  const filteredSignals = signals.filter(s =>
    filter === 'ALL' || s.direction === filter
  );

  const longCount = signals.filter(s => s.direction === 'LONG').length;
  const shortCount = signals.filter(s => s.direction === 'SHORT').length;

  return (
    <div className="min-h-screen bg-[#0a0e14] text-[#c5d1de] font-mono relative overflow-x-hidden">
      <ScanlineOverlay />

      {/* Gradient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-cyan-900/50 bg-[#0a0e14]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-cyan-400 rotate-45 flex items-center justify-center">
                  <div className="w-4 h-4 md:w-5 md:h-5 bg-cyan-400 -rotate-45" />
                </div>
                {isScanning && (
                  <motion.div
                    className="absolute inset-0 border-2 border-cyan-400 rotate-45"
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-wider text-cyan-400">
                  MARKET<span className="text-emerald-400">SCAN</span>
                </h1>
                <p className="text-[10px] md:text-xs text-cyan-700 tracking-widest">
                  REAL-TIME SIGNAL DETECTION
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4 md:gap-6"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-cyan-700">SCAN COUNT</p>
                <p className="text-lg md:text-xl font-bold text-cyan-400 tabular-nums">
                  {scanCount.toString().padStart(5, '0')}
                </p>
              </div>
              <button
                onClick={() => setIsScanning(!isScanning)}
                className={`px-4 py-2 md:px-6 md:py-3 border-2 text-xs md:text-sm tracking-wider transition-all duration-300 min-h-[44px] ${
                  isScanning
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
                    : 'border-red-500 text-red-400 bg-red-500/10 hover:bg-red-500/20'
                }`}
              >
                {isScanning ? '◉ SCANNING' : '◯ PAUSED'}
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">

          {/* Left Panel - Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <IndicatorPanel />
          </motion.div>

          {/* Center Panel - Signal Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="border border-cyan-900/50 bg-[#0d1117]/80 backdrop-blur">
              {/* Filter Tabs */}
              <div className="flex border-b border-cyan-900/50">
                {(['ALL', 'LONG', 'SHORT'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex-1 py-3 md:py-4 text-xs md:text-sm tracking-wider transition-all min-h-[44px] ${
                      filter === f
                        ? f === 'LONG'
                          ? 'bg-emerald-500/20 text-emerald-400 border-b-2 border-emerald-400'
                          : f === 'SHORT'
                          ? 'bg-red-500/20 text-red-400 border-b-2 border-red-400'
                          : 'bg-cyan-500/20 text-cyan-400 border-b-2 border-cyan-400'
                        : 'text-cyan-700 hover:text-cyan-500 hover:bg-cyan-500/5'
                    }`}
                  >
                    {f} {f === 'ALL' ? `(${signals.length})` : f === 'LONG' ? `(${longCount})` : `(${shortCount})`}
                  </button>
                ))}
              </div>

              {/* Signal List */}
              <div className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {filteredSignals.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-8 md:p-12 text-center text-cyan-700"
                    >
                      <p className="text-sm">NO SIGNALS DETECTED</p>
                      <p className="text-xs mt-2">Waiting for market conditions...</p>
                    </motion.div>
                  ) : (
                    filteredSignals.map((signal, index) => (
                      <SignalCard key={signal.id} signal={signal} index={index} />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Scanner Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <MarketScanner isScanning={isScanning} signals={signals} />
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-900/30 mt-8 md:mt-12">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <p className="text-center text-[10px] md:text-xs text-cyan-800/60 tracking-wider">
            Requested by <span className="text-cyan-700/80">@Quincy</span> · Built by <span className="text-cyan-700/80">@clonkbot</span>
          </p>
        </div>
      </footer>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(6, 182, 212, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </div>
  );
}

export default App;
