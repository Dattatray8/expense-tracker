"use client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function DailyTrendChart({ data }: { data: any[] }) {
    if(!data || data.length === 0) return (
        <div className="flex flex-col justify-center items-center h-64 opacity-50 bg-base-100 rounded-2xl border border-base-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            <p>No trend data available for this month</p>
        </div>
    );

    return (
        <div className="h-80 w-full bg-base-100 rounded-2xl p-4 shadow-sm border border-base-200 flex flex-col">
            <h3 className="font-bold text-lg mb-4 text-base-content/80 text-center">Daily Spending Trends</h3>
            <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#4ADE80" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FB7185" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#FB7185" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                        <XAxis 
                            dataKey="day" 
                            tick={{fontSize: 12, fill: 'currentColor'}}
                            tickMargin={10}
                            axisLine={false}
                            tickLine={false}
                            opacity={0.6}
                            tickFormatter={(value) => `${value}`}
                        />
                        <YAxis 
                            tick={{fontSize: 12, fill: 'currentColor'}} 
                            axisLine={false}
                            tickLine={false}
                            opacity={0.6}
                            tickFormatter={(value) => `₹${value > 1000 ? (value/1000).toFixed(0) + 'k' : value}`}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            formatter={(value: any, name: string) => [`₹${Number(value).toLocaleString()}`, name.charAt(0).toUpperCase() + name.slice(1)]}
                            labelFormatter={(label) => `Day ${label}`}
                        />
                        <Legend verticalAlign="top" height={36}/>
                        <Area type="monotone" dataKey="income" stroke="#4ADE80" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} />
                        <Area type="monotone" dataKey="expense" stroke="#FB7185" fillOpacity={1} fill="url(#colorExpense)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
