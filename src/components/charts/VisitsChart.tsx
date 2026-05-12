import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface VisitsChartProps {
  data: any[];
}

export default function VisitsChart({ data }: VisitsChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }} 
          />
          <Tooltip 
            cursor={{ fill: '#F8FAFC' }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid #F1F5F9', 
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
              fontSize: '12px',
              fontFamily: 'Inter'
            }}
          />
          <Bar dataKey="visits" fill="#FF6B00" radius={[6, 6, 0, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
