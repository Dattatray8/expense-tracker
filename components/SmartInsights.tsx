"use client";
import React from 'react';
import { Lightbulb, AlertTriangle, Trophy, TrendingUp } from 'lucide-react';

interface SummaryData {
    baseIncome: number;
    totalIncome: number;
    totalExpense: number;
    remainingBalance: number;
    expensesByCategory: {name: string, value: number}[];
}

export default function SmartInsights({ summary }: { summary: SummaryData | null }) {
    if (!summary) return null;

    const insights = [];
    const spendRatio = summary.totalIncome > 0 ? (summary.totalExpense / summary.totalIncome) * 100 : 0;
    
    // Insight 1: Spending Velocity
    if (spendRatio > 90) {
        insights.push({
            type: 'danger',
            icon: <AlertTriangle size={20} className="text-error" />,
            title: 'Critical Spending',
            text: `You have spent ${spendRatio.toFixed(1)}% of your available funds. Consider curbing non-essential expenses immediately.`
        });
    } else if (spendRatio > 75) {
        insights.push({
            type: 'warning',
            icon: <AlertTriangle size={20} className="text-warning" />,
            title: 'High Spending',
            text: `You have spent over 75% of your income. Keep an eye on your remaining balance.`
        });
    } else if (spendRatio > 0 && spendRatio < 40) {
        insights.push({
            type: 'success',
            icon: <Trophy size={20} className="text-success" />,
            title: 'Great Saver!',
            text: `You are saving over 60% of your income this month. Excellent financial discipline!`
        });
    }

    // Insight 2: Top Category Warning
    if (summary.expensesByCategory && summary.expensesByCategory.length > 0) {
        // Sort descending
        const sortedCategories = [...summary.expensesByCategory].sort((a, b) => b.value - a.value);
        const topCategory = sortedCategories[0];
        
        if (summary.totalExpense > 0 && (topCategory.value / summary.totalExpense) > 0.5) {
            insights.push({
                type: 'info',
                icon: <TrendingUp size={20} className="text-info" />,
                title: 'Category Heavy',
                text: `Over 50% of your expenses (₹${topCategory.value.toLocaleString()}) are going towards "${topCategory.name}".`
            });
        }
    }

    // Default Neutral Insight
    if (insights.length === 0) {
        insights.push({
            type: 'neutral',
            icon: <Lightbulb size={20} className="text-primary" />,
            title: 'On Track',
            text: 'Your spending is currently balanced and steady. Keep logging your transactions to get more insights!'
        });
    }

    return (
        <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-base-200">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-base-200">
                <Lightbulb className="text-primary" size={24} />
                <h3 className="font-bold text-lg text-base-content/90">Smart AI Insights</h3>
            </div>
            
            <div className="flex flex-col gap-4">
                {insights.map((insight, idx) => (
                    <div key={idx} className="flex gap-4 items-start p-3 rounded-xl bg-base-200/50 hover:bg-base-200 transition-colors">
                        <div className="p-2 bg-base-100 rounded-full shadow-sm mt-1 shrink-0">
                            {insight.icon}
                        </div>
                        <div>
                            <h4 className="font-bold text-sm mb-1">{insight.title}</h4>
                            <p className="text-sm opacity-80 leading-snug">{insight.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
