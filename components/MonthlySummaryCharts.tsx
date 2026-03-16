"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function MonthlySummaryCharts({ data }: { data: unknown[] }) {
    if(!data || data.length === 0) return (
        <div className="flex flex-col justify-center items-center h-64 opacity-50 bg-base-100 rounded-2xl border border-base-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
            <p>No expense data to analyze</p>
        </div>
    );
    
    // Vibrant professional colors
    const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#6B5B95', '#F7B7A3', '#9EA8D2'];

    return (
        <div className="h-64 sm:h-80 w-full bg-base-100 rounded-2xl p-4 shadow-sm border border-base-200">
            <h3 className="font-bold text-lg mb-4 text-base-content/80 text-center">Expenses by Category</h3>
            <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                        style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.1))" }}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        formatter={(value: unknown) => `₹${Number(value).toLocaleString()}`}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px' }}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
