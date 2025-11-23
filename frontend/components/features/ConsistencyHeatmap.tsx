'use client';

import React, { useEffect, useState } from 'react';
import { BASE_URL } from '@/config';
import Loading from '@/components/ui/Loading';

interface HeatmapData {
  date: string;
  count: number;
}

export default function ConsistencyHeatmap() {
  const [data, setData] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${BASE_URL}habits/heatmap`, {
          credentials: 'include',
        });
        if (res.ok) {
          const rawData: HeatmapData[] = await res.json();
          const map: Record<string, number> = {};
          rawData.forEach(item => {
            map[item.date] = item.count;
          });
          setData(map);
        }
      } catch (error) {
        console.error('Error fetching heatmap data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate last 365 days
  const generateCalendar = () => {
    const today = new Date();
    const days = [];
    // Start from 365 days ago
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    return days;
  };

  const days = generateCalendar();

  const getColor = (count: number) => {
    if (!count) return 'bg-gray-900/50 border-gray-800';
    if (count === 1) return 'bg-cyan-900/60 border-cyan-800';
    if (count <= 3) return 'bg-cyan-700/60 border-cyan-600';
    if (count <= 5) return 'bg-cyan-500/60 border-cyan-400';
    return 'bg-green-400 border-green-300 shadow-[0_0_10px_rgba(74,222,128,0.5)]';
  };

  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center bg-black/60 border border-cyan-500/20 rounded-xl backdrop-blur-sm">
        <Loading text="LOADING_NEURAL_MAP..." size="sm" />
      </div>
    );
  }

  return (
    <div className="bg-black/60 border border-cyan-500/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-0 mb-4">
        <h2 className="text-lg sm:text-xl font-mono text-cyan-300">
          <span className="text-green-400">▦</span> CONSISTENCY_MATRIX
        </h2>
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-mono text-gray-500">
          <span className="text-[10px] sm:text-xs">LESS</span>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gray-900/50 border border-gray-800 rounded-sm"></div>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-cyan-900/60 border border-cyan-800 rounded-sm"></div>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-cyan-500/60 border border-cyan-400 rounded-sm"></div>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 border border-green-300 rounded-sm"></div>
          <span className="text-[10px] sm:text-xs">MORE</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
        <div className="flex gap-0.5 sm:gap-1 min-w-max">
          {/* We need to group by weeks for the vertical layout typical of GitHub */}
          {Array.from({ length: 53 }).map((_, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-0.5 sm:gap-1">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                // Calculate index in the flat array
                // This is a simplified approximation to fill the grid
                // A robust implementation would align dates to days of week
                const dataIndex = weekIndex * 7 + dayIndex;
                const date = days[dataIndex];
                
                if (!date) return null;

                const dateStr = date.toISOString().split('T')[0];
                const count = data[dateStr] || 0;

                // Determine tooltip position based on row index
                // Top 2 rows: show tooltip below
                // Bottom 5 rows: show tooltip above
                const tooltipPosition = dayIndex < 2 ? 'top-full mt-2' : 'bottom-full mb-2';

                return (
                  <div
                    key={dateStr}
                    className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-sm border ${getColor(count)} transition-all hover:scale-125 relative group z-0 hover:z-10`}
                  >
                    {/* Tooltip */}
                    <div className={`absolute ${tooltipPosition} left-1/2 -translate-x-1/2 hidden group-hover:block z-50 whitespace-nowrap pointer-events-none`}>
                      <div className="bg-black border border-cyan-500/50 text-cyan-300 text-[10px] sm:text-xs px-2 py-1 rounded font-mono shadow-lg">
                        {dateStr}: {count} completions
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
