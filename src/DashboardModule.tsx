import React from 'react';
import { Estimate, Party, InventoryItem } from './types';

export function DashboardModule({ sales, parties, items }: { sales: Estimate[], parties: Party[], items: InventoryItem[] }) {
    const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalPartiesBalance = parties.reduce((sum, p) => sum + (p.balance || 0), 0);
    const totalItems = items.length;
    const stockValue = items.reduce((sum, i) => sum + (i.stock * i.price), 0);

    return (
        <div style={{ padding: '24px', backgroundColor: '#f3f4f6', height: '100%', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', marginBottom: '20px' }}>Business Overview</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Sales (This Month)</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>Rs {totalSales.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                    <div style={{ marginTop: '12px', fontSize: '12px', color: '#10b981' }}>
                        <i className="fa-solid fa-arrow-trend-up"></i> 12% vs last month
                    </div>
                </div>
                
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Receivable</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>Rs {totalPartiesBalance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                    <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
                        From {parties.filter(p => p.balance > 0).length} parties
                    </div>
                </div>

                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Stock Value</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>Rs {stockValue.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                    <div style={{ marginTop: '12px', fontSize: '12px', color: '#6b7280' }}>
                        Across {totalItems} items
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Recent Transactions</h3>
                        <button style={{ fontSize: '13px', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}>View All</button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>Date</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>Party</th>
                                <th style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280', textAlign: 'right' }}>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.slice(-5).reverse().map(sale => (
                                <tr key={sale.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>{sale.date}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>{sale.customerName}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', textAlign: 'right', fontWeight: 500 }}>Rs {sale.totalAmount.toLocaleString('en-IN')}</td>
                                </tr>
                            ))}
                            {sales.length === 0 && (
                                <tr><td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>No recent transactions</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Cash & Bank</h3>
                    </div>
                    <div style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="fa-solid fa-money-bill-wave" style={{ color: '#10b981' }}></i>
                                <span style={{ fontSize: '14px' }}>Cash in Hand</span>
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: 600 }}>Rs 0.00</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="fa-solid fa-building-columns" style={{ color: '#3b82f6' }}></i>
                                <span style={{ fontSize: '14px' }}>Bank Accounts</span>
                            </div>
                            <span style={{ fontSize: '14px', fontWeight: 600 }}>Rs 0.00</span>
                        </div>
                        <button style={{ width: '100%', marginTop: '20px', padding: '8px', borderRadius: '4px', border: '1px solid #3b82f6', color: '#3b82f6', background: '#eff6ff', fontSize: '13px', cursor: 'pointer' }}>
                            Add Bank Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
