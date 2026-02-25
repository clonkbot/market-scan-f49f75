import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { MarketSignal } from '../App';

interface MarketScannerProps {
  isScanning: boolean;
  signals: MarketSignal[];
}

export default function MarketScanner({ isScanning, signals }: MarketScannerProps) {
  const [rotation, setRotation] = useState(0);
  const [marketData, setMarketData] = useState({
    buyPressure: 62,
    sellPressure: 38,
    marketBias: 'BULLISH',
    volatility: 'MODERATE'
  });

  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setRotation(prev => prev + 1);

      // Update market data occasionally
      if (Math.random() > 0.8) {
        const buy = Math.floor(Math.random() * 40) + 30;
        setMarketData({
          buyPressure: buy,
          sellPressure: 100 - buy,
          marketBias: buy > 55 ? 'BULLISH' : buy < 45 ? 'BEARISH' : 'NEUTRAL',
          volatility: Math.random() > 0.7 ? 'HIGH' : Math.random() > 0.4 ? 'MODERATE' : 'LOW'
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isScanning]);

  const longSignals = signals.filter(s => s.direction === 'LONG').length;
  const shortSignals = signals.filter(s => s.direction === 'SHORT').length;
  const avgStrength = signals.length > 0
    ? Math.round(signals.reduce((acc, s) => acc + s.strength, 0) / signals.length)
    : 0;

  return (
    <div className="border border-cyan-900/50 bg-[#0d1117]/80 backdrop-blur h-full">
      {/* Header */}
      <div className="border-b border-cyan-900/50 px-3 py-3 md:px-4 md:py-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: isScanning ? rotation : 0 }}
            className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"
          />
          <h3 className="text-xs md:text-sm font-bold tracking-wider text-cyan-400">
            SCANNER
          </h3>
        </div>
        <p className="text-[10px] text-cyan-700 mt-1">
          {isScanning ? 'Analyzing market conditions...' : 'Scanner paused'}
        </p>
      </div>

      {/* Radar Animation */}
      <div className="p-4 md:p-6 flex justify-center">
        <div className="relative w-32 h-32 md:w-40 md:h-40">
          {/* Concentric circles */}
          {[1, 2, 3, 4].map((ring) => (
            <div
              key={ring}
              className="absolute inset-0 border border-cyan-900/30 rounded-full"
              style={{
                transform: `scale(${ring * 0.25})`,
                opacity: 1 - ring * 0.15
              }}
            />
          ))}

          {/* Rotating sweep */}
          {isScanning && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              <div
                className="absolute top-1/2 left-1/2 w-1/2 h-0.5 origin-left"
                style={{
                  background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.8), transparent)'
                }}
              />
            </motion.div>
          )}

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full">
            {isScanning && (
              <motion.div
                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 bg-cyan-400 rounded-full"
              />
            )}
          </div>

          {/* Signal dots */}
          {signals.slice(0, 8).map((signal, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 40 + Math.random() * 20;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={signal.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={`absolute w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${
                  signal.direction === 'LONG' ? 'bg-emerald-400' : 'bg-red-400'
                }`}
                style={{
                  top: `calc(50% + ${y}px)`,
                  left: `calc(50% + ${x}px)`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-3 pb-3 md:px-4 md:pb-4 space-y-2 md:space-y-3">
        {/* Buy/Sell Pressure */}
        <div className="bg-cyan-900/10 p-2 md:p-3">
          <div className="flex justify-between text-[10px] md:text-xs mb-2">
            <span className="text-emerald-400">BUY {marketData.buyPressure}%</span>
            <span className="text-red-400">SELL {marketData.sellPressure}%</span>
          </div>
          <div className="h-2 bg-red-500/30 relative overflow-hidden">
            <motion.div
              animate={{ width: `${marketData.buyPressure}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-emerald-500"
            />
          </div>
        </div>

        {/* Market Metrics */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-cyan-900/10 p-2 md:p-3">
            <p className="text-[10px] text-cyan-700">BIAS</p>
            <p className={`text-xs md:text-sm font-bold ${
              marketData.marketBias === 'BULLISH'
                ? 'text-emerald-400'
                : marketData.marketBias === 'BEARISH'
                ? 'text-red-400'
                : 'text-amber-400'
            }`}>
              {marketData.marketBias}
            </p>
          </div>
          <div className="bg-cyan-900/10 p-2 md:p-3">
            <p className="text-[10px] text-cyan-700">VOLATILITY</p>
            <p className={`text-xs md:text-sm font-bold ${
              marketData.volatility === 'HIGH'
                ? 'text-red-400'
                : marketData.volatility === 'MODERATE'
                ? 'text-amber-400'
                : 'text-emerald-400'
            }`}>
              {marketData.volatility}
            </p>
          </div>
        </div>

        {/* Signal Summary */}
        <div className="bg-cyan-900/10 p-2 md:p-3">
          <p className="text-[10px] text-cyan-700 mb-2">SIGNAL SUMMARY</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-base md:text-lg font-bold text-emerald-400">{longSignals}</p>
              <p className="text-[9px] md:text-[10px] text-cyan-700">LONG</p>
            </div>
            <div>
              <p className="text-base md:text-lg font-bold text-red-400">{shortSignals}</p>
              <p className="text-[9px] md:text-[10px] text-cyan-700">SHORT</p>
            </div>
            <div>
              <p className="text-base md:text-lg font-bold text-cyan-400">{avgStrength}%</p>
              <p className="text-[9px] md:text-[10px] text-cyan-700">AVG STR</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
