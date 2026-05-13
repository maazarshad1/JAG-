import React from 'react';
import { Estimate, Party, InventoryItem } from './types';

export function DashboardModule({ sales, parties, items, onNavigate }: { sales: Estimate[], parties: Party[], items: InventoryItem[], onNavigate?: (view: any) => void }) {
    const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalPartiesBalance = parties.reduce((sum, p) => sum + (p.balance || 0), 0);
    const totalItems = items.length;
    const stockValue = items.reduce((sum, i) => sum + (i.stock * i.price), 0);

    return (
        <div style={{ padding: '24px', backgroundColor: '#f3f4f6', height: '100%', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', margin: 0 }}>Business Overview</h2>
                <button 
                    onClick={() => onNavigate?.('PROFILE_EDIT')}
                    style={{ padding: '8px 16px', background: '#fff', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', fontWeight: 500, color: '#4b5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <i className="fa-solid fa-building"></i> Edit Company
                </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Total Sales (This Month)</div>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>Rs {totalSales.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
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
            </div>
        </div>
    );
}
