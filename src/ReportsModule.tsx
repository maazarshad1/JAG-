import React from 'react';
import { Estimate, Party, InventoryItem } from './types';
import { FileBarChart, Users, Package, AlertTriangle, TrendingUp } from 'lucide-react';

export function ReportsModule({ sales, parties, items, onNavigate, onExportExcel }: { sales: Estimate[], parties: Party[], items: InventoryItem[], onNavigate?: (view: any) => void, onExportExcel?: () => void }) {
    const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalPartiesBalance = parties.reduce((sum, p) => sum + (p.balance || 0), 0);
    const totalItems = items.length;
    const stockValue = items.reduce((sum, i) => sum + (i.stock * i.price), 0);
    const lowStockItems = items.filter(i => i.stock <= (i.minStock || 0));

    return (
        <div className="p-6 bg-slate-50 min-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Business Reports</h2>
                    <p className="text-slate-500 text-sm">Detailed analysis and performance overview</p>
                </div>
                <button 
                    onClick={onExportExcel}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
                >
                    <FileBarChart size={18} />
                    Download Full Report (Excel)
                </button>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 text-indigo-600 mb-4">
                        <TrendingUp size={20} />
                        <span className="text-sm font-semibold uppercase tracking-wider">Total Sales</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">
                        Rs {totalSales.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                    </div>
                    <p className="text-slate-500 text-xs">Total revenue accumulated from all transactions</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 text-emerald-600 mb-4">
                        <Users size={20} />
                        <span className="text-sm font-semibold uppercase tracking-wider">Total Receivable</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">
                        Rs {totalPartiesBalance.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                    </div>
                    <p className="text-slate-500 text-xs">From {parties.filter(p => p.balance > 0).length} outstanding parties</p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 text-blue-600 mb-4">
                        <Package size={20} />
                        <span className="text-sm font-semibold uppercase tracking-wider">Stock Valuation</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">
                        Rs {stockValue.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                    </div>
                    <p className="text-slate-500 text-xs">Current value across {totalItems} unique items</p>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Detailed Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-800">Recent Transaction History</h3>
                        <button 
                            onClick={() => onNavigate?.('SALE_LIST')} 
                            className="text-xs text-indigo-600 font-semibold hover:underline"
                        >
                            View Sales Ledger
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Customer/Party</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {sales.slice(-10).reverse().map(sale => (
                                    <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-600">{sale.date}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{sale.customerName}</td>
                                        <td className="px-6 py-4 text-sm text-right font-bold text-slate-900">
                                            Rs {sale.totalAmount.toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                ))}
                                {sales.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">
                                            No transaction records found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Critical Stock Alerts */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex items-center gap-2">
                        <AlertTriangle className="text-red-500" size={20} />
                        <h3 className="font-bold text-slate-800">Critical Stock Alerts</h3>
                        <span className="ml-auto bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            {lowStockItems.length} NEEDS ATTENTION
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2">
                        {lowStockItems.length > 0 ? (
                            <div className="grid grid-cols-1 gap-1">
                                {lowStockItems.map(item => (
                                    <div key={item.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors border-l-4 border-transparent hover:border-red-400">
                                        <div>
                                            <div className="text-sm font-bold text-slate-900">{item.name}</div>
                                            <div className="text-xs text-slate-500">Current Stock: <span className="font-bold text-red-600">{item.stock}</span> {item.unit}</div>
                                        </div>
                                        <button 
                                            onClick={() => onNavigate?.('ITEMS_LIST')}
                                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded flex items-center gap-1 transition-colors"
                                        >
                                            Restock
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center py-20 text-slate-400">
                                <Package size={48} className="mb-4 opacity-20" />
                                <span className="text-sm font-medium">Inventory is healthy</span>
                                <span className="text-xs">All items are above threshold levels</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
