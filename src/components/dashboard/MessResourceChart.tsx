import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';
import { DollarSign, Zap, Droplets, TrendingDown, Calendar } from 'lucide-react';
import Card from '../common/Card';

const MONTHLY_DATA = [
  { month: 'Oct', messBill: 3400, electricity: 320, water: 150 },
  { month: 'Nov', messBill: 3650, electricity: 380, water: 160 },
  { month: 'Dec', messBill: 3200, electricity: 290, water: 140 },
  { month: 'Jan', messBill: 3800, electricity: 410, water: 175 },
  { month: 'Feb', messBill: 3500, electricity: 340, water: 155 },
  { month: 'Mar', messBill: 3300, electricity: 310, water: 145 },
];

export const MessResourceChart: React.FC = () => {
  const [metric, setMetric] = useState<'mess' | 'resource'>('mess');

  return (
    <Card className="p-6 transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#996E7D]" />
            <h3 className="font-heading text-lg font-bold text-[#1A1A1A]">
              Monthly Mess & Resource Usage
            </h3>
          </div>
          <p className="font-body text-xs text-[#666666]">
            Track room resource consumption and monthly mess bill patterns
          </p>
        </div>

        {/* Toggle Pills */}
        <div className="flex items-center gap-1.5 bg-[#FAF8F2] p-1 rounded-full border border-[#E7E4DF] self-start sm:self-auto">
          <button
            onClick={() => setMetric('mess')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              metric === 'mess'
                ? 'bg-[#996E7D] text-white shadow-xs'
                : 'text-[#666666] hover:text-[#1A1A1A]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Mess Bills
          </button>

          <button
            onClick={() => setMetric('resource')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              metric === 'resource'
                ? 'bg-[#2A5C8A] text-white shadow-xs'
                : 'text-[#666666] hover:text-[#1A1A1A]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Electricity & Water
          </button>
        </div>
      </div>

      {/* Quick Summary Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 p-3 bg-[#FAF8F2] rounded-[14px] border border-[#E7E4DF]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#F5EFF2] text-[#996E7D]">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#8E8E93] block">Current Mess Bill</span>
            <span className="text-xs font-extrabold text-[#1A1A1A]">₹3,300</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#EBF3FA] text-[#2A5C8A]">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#8E8E93] block">Electricity Usage</span>
            <span className="text-xs font-extrabold text-[#1A1A1A]">310 kWh</span>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#FFF8E1] text-[#D97706]">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#8E8E93] block">Water Allocation</span>
            <span className="text-xs font-extrabold text-[#1A1A1A]">145 Units</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {metric === 'mess' ? (
            <BarChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E4DF" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666666' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#666666' }} />
              <Tooltip
                formatter={(value: any) => [`₹${value}`, 'Mess Bill']}
                contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="messBill" fill="#996E7D" radius={[6, 6, 0, 0]} name="Mess Bill (₹)" />
            </BarChart>
          ) : (
            <AreaChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E4DF" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666666' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#666666' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1A1A1A', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="electricity" stroke="#2A5C8A" fill="#2A5C8A" fillOpacity={0.2} name="Electricity (kWh)" />
              <Area type="monotone" dataKey="water" stroke="#F4B400" fill="#F4B400" fillOpacity={0.2} name="Water (Units)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-3 border-t border-[#E7E4DF] flex items-center justify-between text-xs text-[#8E8E93]">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-[#996E7D]" />
          Updated for March 2026 Cycle
        </span>
        <span className="text-[#2E7D32] font-semibold flex items-center gap-1">
          <TrendingDown className="w-3.5 h-3.5" />
          5.7% bill reduction vs Feb
        </span>
      </div>
    </Card>
  );
};

export default MessResourceChart;
