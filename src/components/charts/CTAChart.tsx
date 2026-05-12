import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CTAChartProps {
  data: any[];
}

const COLORS = ['#FF6B00', '#1A1A2E', '#94A3B8', '#F1F5F9'];

export default function CTAChart({ data }: CTAChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={8}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={4} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: '1px solid #F1F5F9', 
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
              fontSize: '12px',
              fontFamily: 'Inter'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            iconType="circle" 
            formatter={(value) => <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
