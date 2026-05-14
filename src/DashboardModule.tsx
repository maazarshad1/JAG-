import React from 'react';
import { Estimate, Party, InventoryItem, View } from './types';

interface DashboardModuleProps {
    sales: Estimate[];
    parties: Party[];
    items: InventoryItem[];
    onNavigate?: (view: View) => void;
    onExportExcel?: () => void;
    onEditSale?: (sale: Estimate) => void;
    onDeleteSale?: (id: string) => void;
    onViewSale?: (sale: Estimate) => void;
}

export function DashboardModule({ sales, onNavigate, onEditSale, onDeleteSale, onViewSale }: DashboardModuleProps) {
    const sortedSales = [...sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Transactions Ledger</h2>
                    <p className="text-sm text-slate-500">Detailed history of all sales and estimates</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => onNavigate?.('REPORTS')}
                        className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors"
                    >
                        <i className="fa-solid fa-chart-line text-emerald-500"></i>
                        Reports
                    </button>
                    <button 
                        onClick={() => onNavigate?.('SALE_FORM')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
                    >
                        <i className="fa-solid fa-plus text-xs"></i>
                        New Transaction
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Invoice No</th>
                                <th className="px-6 py-4">Party Name</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {sortedSales.map(sale => {
                                const isFullyPaid = (sale.receivedAmount || 0) >= sale.totalAmount;
                                const isCredit = sale.paymentType === 'Credit' || (!sale.receivedAmount && sale.totalAmount > 0);
                                
                                return (
                                    <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                                            {new Date(sale.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                                            {sale.refNo || '---'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                                            {sale.customerName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${sale.isSale ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {sale.isSale ? 'Sale' : 'Estimate'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-0.5">
                                                <span className={`text-[11px] font-bold ${isFullyPaid ? 'text-emerald-600' : isCredit ? 'text-red-600' : 'text-blue-600'}`}>
                                                    {isFullyPaid ? 'Fully Paid' : isCredit ? 'Credit' : 'Partial'}
                                                </span>
                                                {sale.paymentType && (
                                                    <span className="text-[10px] text-slate-400">{sale.paymentType}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-900">
                                            Rs {sale.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onViewSale?.(sale); }}
                                                    title="Print/PDF"
                                                    className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                                                >
                                                    <i className="fa-solid fa-print"></i>
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onEditSale?.(sale); }}
                                                    title="Edit"
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                                                >
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onDeleteSale?.(sale.id); }}
                                                    title="Delete"
                                                    className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                                                >
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {sales.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                                <i className="fa-solid fa-file-invoice text-xl"></i>
                                            </div>
                                            <div className="text-slate-400 font-medium">No transactions found</div>
                                            <button 
                                                onClick={() => onNavigate?.('SALE_FORM')}
                                                className="text-indigo-600 text-sm font-bold hover:underline"
                                            >
                                                Create your first sale
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

