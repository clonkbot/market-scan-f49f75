import { motion } from 'framer-motion';
import type { MarketSignal } from '../App';

interface SignalCardProps {
  signal: MarketSignal;
  index: number;
}

export default function SignalCard({ signal, index }: SignalCardProps) {
  const isLong = signal.direction === 'LONG';

  const formatNumber = (num: number, decimals = 2) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `${(vol / 1000000).toFixed(2)}M`;
    if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`;
    return vol.toString();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`border-b border-cyan-900/30 p-3 md:p-4 hover:bg-cyan-500/5 transition-colors group ${
        isLong ? 'border-l-2 border-l-emerald-500' : 'border-l-2 border-l-red-500'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
        {/* Symbol & Direction */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className={`px-2 py-1 text-[10px] md:text-xs font-bold tracking-wider ${
            isLong
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
              : 'bg-red-500/20 text-red-400 border border-red-500/50'
          }`}>
            {signal.direction}
          </div>
          <div>
            <p className="text-sm md:text-base font-bold text-white tracking-wide">
              {signal.symbol}
            </p>
            <p className="text-[10px] md:text-xs text-cyan-700">
              {signal.timestamp.toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Price & Change */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="text-right">
            <p className="text-[10px] text-cyan-700">PRICE</p>
            <p className="text-sm md:text-base font-bold tabular-nums">${formatNumber(signal.price)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-cyan-700">CHANGE</p>
            <p className={`text-sm md:text-base font-bold tabular-nums ${
              signal.change >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {signal.change >= 0 ? '+' : ''}{signal.change.toFixed(2)}%
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-cyan-700">VOL</p>
            <p className="text-sm md:text-base tabular-nums">{formatVolume(signal.volume)}</p>
          </div>
        </div>

        {/* Strength Meter */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-16 md:w-20 h-2 bg-cyan-900/30 relative overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${signal.strength}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`h-full ${
                signal.strength >= 80
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                  : signal.strength >= 60
                  ? 'bg-gradient-to-r from-cyan-500 to-cyan-400'
                  : 'bg-gradient-to-r from-amber-500 to-amber-400'
              }`}
            />
          </div>
          <span className="text-xs md:text-sm font-bold tabular-nums w-8 md:w-10 text-right">
            {signal.strength}%
          </span>
        </div>
      </div>

      {/* Indicators Row */}
      <div className="mt-3 grid grid-cols-3 gap-2 md:gap-4 text-[10px] md:text-xs">
        <div className="bg-cyan-900/20 px-2 py-1.5 md:px-3 md:py-2">
          <span className="text-cyan-600">FISHER</span>
          <span className={`ml-1 md:ml-2 font-bold tabular-nums ${
            signal.fisher > 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {signal.fisher > 0 ? '+' : ''}{signal.fisher.toFixed(3)}
          </span>
        </div>
        <div className="bg-cyan-900/20 px-2 py-1.5 md:px-3 md:py-2">
          <span className="text-cyan-600">VWAP</span>
          <span className={`ml-1 md:ml-2 font-bold tabular-nums ${
            signal.price > signal.vwap ? 'text-emerald-400' : 'text-red-400'
          }`}>
            ${formatNumber(signal.vwap)}
          </span>
        </div>
        <div className="bg-cyan-900/20 px-2 py-1.5 md:px-3 md:py-2">
          <span className="text-cyan-600">EMA</span>
          <span className={`ml-1 md:ml-2 font-bold tabular-nums ${
            signal.price > signal.ema ? 'text-emerald-400' : 'text-red-400'
          }`}>
            ${formatNumber(signal.ema)}
          </span>
        </div>
      </div>

      {/* Confirmations */}
      <div className="mt-2 md:mt-3 flex flex-wrap gap-1.5 md:gap-2">
        {signal.confirmations.map((conf, i) => (
          <span
            key={i}
            className="px-2 py-0.5 md:py-1 text-[9px] md:text-[10px] tracking-wide bg-cyan-500/10 text-cyan-500 border border-cyan-500/30"
          >
            ✓ {conf}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
