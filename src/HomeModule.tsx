import React from 'react';
import { Estimate } from './types';

export function HomeModule({ sales, onAddSale }: { sales: Estimate[], onAddSale: () => void }) {
    const totalSales = sales.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const received = sales.reduce((sum, inv) => sum + (inv.receivedAmount || 0), 0);
    const balance = sales.reduce((sum, inv) => sum + inv.balance, 0);

    return (
        <>
            <div className="module-header">
                <h2 className="module-title">Sale Invoices <i className="fa-solid fa-chevron-down" style={{ fontSize: '12px', marginLeft: '8px' }}></i></h2>
                <button className="btn btn-primary-red" onClick={onAddSale}><i className="fa-solid fa-plus"></i> Add Sale</button>
            </div>
            
            <div className="filters-bar">
                <span>Filter by :</span>
                <select className="filter-dropdown">
                    <option>This Month</option>
                </select>
                <div className="filter-dropdown">
                    <i className="fa-regular fa-calendar"></i> 01/05/2026 To 31/05/2026
                </div>
                <select className="filter-dropdown">
                    <option>All Firms</option>
                </select>
            </div>

            <div className="summary-cards">
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="card-title">Total Sales Amount</div>
                            <div className="card-amount">Rs {totalSales.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                        </div>
                        <div style={{ background: '#e0f2fe', color: '#3b82f6', padding: '4px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>
                            100% <i className="fa-solid fa-arrow-trend-up"></i><br />
                            <span style={{ fontSize: '8px', fontWeight: 'normal', color: '#6b7280' }}>vs last month</span>
                        </div>
                    </div>
                    <div className="card-footer">
                        <span>Received: <b>Rs {received.toLocaleString('en-IN')}</b></span>
                        <span>|</span>
                        <span>Balance: <b>Rs {balance.toLocaleString('en-IN')}</b></span>
                    </div>
                </div>
            </div>

            <div className="table-container">
                <div className="table-header-row">
                    <h3 style={{ fontSize: '16px', fontWeight: 500 }}>Transactions</h3>
                    <div style={{ display: 'flex', gap: '16px', color: '#6b7280' }}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <i className="fa-solid fa-chart-simple"></i>
                        <i className="fa-solid fa-file-excel text-green"></i>
                        <i className="fa-solid fa-print"></i>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Date <i className="fa-solid fa-filter" style={{ fontSize: '10px', marginLeft: '4px' }}></i></th>
                            <th>Invoice ... <i className="fa-solid fa-filter" style={{ fontSize: '10px', marginLeft: '4px' }}></i></th>
                            <th>Party Name <i className="fa-solid fa-filter" style={{ fontSize: '10px', marginLeft: '4px' }}></i></th>
                            <th>Transa... <i className="fa-solid fa-filter" style={{ fontSize: '10px', marginLeft: '4px' }}></i></th>
                            <th>Payme... <i className="fa-solid fa-filter" style={{ fontSize: '10px', marginLeft: '4px' }}></i></th>
                            <th>Amount <i className="fa-solid fa-filter" style={{ fontSize: '10px', marginLeft: '4px' }}></i></th>
                            <th>Balance <i className="fa-solid fa-filter" style={{ fontSize: '10px', marginLeft: '4px' }}></i></th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sales.map((inv) => (
                            <tr key={inv.id}>
                                <td>{inv.date}</td>
                                <td>{inv.refNo}</td>
                                <td>{inv.customerName}</td>
                                <td>Sale</td>
                                <td>{inv.paymentType || 'Cash'}</td>
                                <td>Rs {inv.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                <td>Rs {inv.balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                                <td style={{ color: '#6b7280', fontSize: '16px', display: 'flex', gap: '12px' }}>
                                    <i className="fa-solid fa-print cursor-pointer"></i>
                                    <i className="fa-solid fa-share-nodes cursor-pointer"></i>
                                    <i className="fa-solid fa-ellipsis-vertical cursor-pointer"></i>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
