import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Indicator {
  name: string;
  value: string;
  status: 'bullish' | 'bearish' | 'neutral';
  description: string;
}

export default function IndicatorPanel() {
  const [indicators, setIndicators] = useState<Indicator[]>([
    { name: 'FISHER-9', value: '+1.247', status: 'bullish', description: 'Fisher Transform (Length 9)' },
    { name: 'VWAP', value: '$42,851', status: 'bullish', description: 'Vol Weighted Avg Price' },
    { name: 'EMA-21', value: '$42,634', status: 'bullish', description: '21-Period EMA' },
    { name: 'EMA-50', value: '$41,892', status: 'bullish', description: '50-Period EMA' },
    { name: 'RSI-14', value: '62.4', status: 'neutral', description: 'Relative Strength Index' },
    { name: 'MACD', value: '+124', status: 'bullish', description: 'MACD Histogram' },
    { name: 'VOL', value: '1.8x', status: 'bullish', description: 'Volume vs Average' },
    { name: 'ATR', value: '$892', status: 'neutral', description: 'Avg True Range' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndicators(prev => prev.map(ind => {
        const randomChange = Math.random();
        if (randomChange > 0.7) {
          const statuses: ('bullish' | 'bearish' | 'neutral')[] = ['bullish', 'bearish', 'neutral'];
          return {
            ...ind,
            status: statuses[Math.floor(Math.random() * 3)]
          };
        }
        return ind;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border border-cyan-900/50 bg-[#0d1117]/80 backdrop-blur h-full">
      {/* Header */}
      <div className="border-b border-cyan-900/50 px-3 py-3 md:px-4 md:py-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <h3 className="text-xs md:text-sm font-bold tracking-wider text-cyan-400">
            INDICATORS
          </h3>
        </div>
        <p className="text-[10px] text-cyan-700 mt-1">Real-time market signals</p>
      </div>

      {/* Indicator List */}
      <div className="p-2 md:p-3 space-y-1.5 md:space-y-2">
        {indicators.map((ind, index) => (
          <motion.div
            key={ind.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-cyan-900/10 p-2 md:p-3 hover:bg-cyan-900/20 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{
                    backgroundColor:
                      ind.status === 'bullish'
                        ? 'rgb(16, 185, 129)'
                        : ind.status === 'bearish'
                        ? 'rgb(239, 68, 68)'
                        : 'rgb(234, 179, 8)'
                  }}
                  className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full"
                />
                <span className="text-[10px] md:text-xs font-bold text-white">
                  {ind.name}
                </span>
              </div>
              <span className={`text-xs md:text-sm font-bold tabular-nums ${
                ind.status === 'bullish'
                  ? 'text-emerald-400'
                  : ind.status === 'bearish'
                  ? 'text-red-400'
                  : 'text-amber-400'
              }`}>
                {ind.value}
              </span>
            </div>
            <p className="text-[9px] md:text-[10px] text-cyan-700 mt-1 group-hover:text-cyan-500 transition-colors">
              {ind.description}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="border-t border-cyan-900/50 p-3 md:p-4">
        <p className="text-[10px] text-cyan-700 mb-2">SIGNAL LEGEND</p>
        <div className="flex flex-wrap gap-2 md:gap-3 text-[9px] md:text-[10px]">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-emerald-400">Bullish</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-red-400">Bearish</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-amber-400">Neutral</span>
          </div>
        </div>
      </div>
    </div>
  );
}
