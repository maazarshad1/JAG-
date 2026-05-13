import React, { useState } from 'react';
import { View } from './types';

export function Sidebar({ currentView, setCurrentView, onAction }: { currentView: View, setCurrentView: (v: View) => void, onAction: (action: string) => void }) {
    const [saleGroupOpen, setSaleGroupOpen] = useState(true);

    return (
        <aside id="sidebar">
            <div className="sidebar-search">
                <div className="search-box">
                    <span>Open Anything (Ctrl+F)</span>
                </div>
            </div>
            
            <nav className="sidebar-nav">
                <button 
                  className={`nav-item ${currentView === 'HOME' ? 'active' : ''} border-0 bg-transparent w-full text-left font-sans text-sm`} 
                  onClick={() => setCurrentView('HOME')}
                >
                    <i className="fa-solid fa-house"></i>
                    <span>Home</span>
                </button>
                
                <button 
                  className={`nav-item ${currentView === 'PARTIES_LIST' ? 'active' : ''} border-0 bg-transparent w-full text-left`} 
                  onClick={() => setCurrentView('PARTIES_LIST')}
                >
                    <i className="fa-solid fa-users"></i>
                    <span>Parties</span>
                </button>
                
                <button 
                  className={`nav-item ${currentView === 'ITEMS_LIST' ? 'active' : ''} border-0 bg-transparent w-full text-left`} 
                  onClick={() => setCurrentView('ITEMS_LIST')}
                >
                    <i className="fa-solid fa-box"></i>
                    <span>Items</span>
                </button>
                
                <div className="nav-group">
                    <div className="nav-item group-header" onClick={() => setSaleGroupOpen(!saleGroupOpen)}>
                        <i className="fa-solid fa-receipt"></i>
                        <span>Sale</span>
                        <i className={`fa-solid ${saleGroupOpen ? 'fa-chevron-down' : 'fa-chevron-right'} right-icon group-toggle`}></i>
                    </div>
                    {saleGroupOpen && (
                        <div className="nav-subgroup" id="group-sale">
                            <button 
                              className={`nav-subitem ${currentView === 'SALE_LIST' ? 'active' : ''} border-0 bg-transparent w-full text-left`} 
                              onClick={() => setCurrentView('SALE_LIST')}
                            >
                                <i className="fa-solid fa-file-invoice" style={{ width: '16px', marginRight: '8px' }}></i>
                                <span>Sale Invoices</span>
                                <i className="fa-solid fa-plus right-icon" onClick={(e) => { e.stopPropagation(); setCurrentView('SALE_FORM'); }}></i>
                            </button>
                            <button 
                              className={`nav-subitem ${currentView === 'ESTIMATE_LIST' ? 'active' : ''} border-0 bg-transparent w-full text-left`} 
                              onClick={() => setCurrentView('ESTIMATE_LIST')}
                            >
                                <i className="fa-solid fa-file-lines" style={{ width: '16px', marginRight: '8px' }}></i>
                                <span>Estimate/ Quotation</span>
                                <i className="fa-solid fa-plus right-icon" onClick={(e) => { e.stopPropagation(); setCurrentView('ESTIMATE_FORM'); }}></i>
                            </button>
                            <button className="nav-subitem border-0 bg-transparent w-full text-left">
                                <i className="fa-solid fa-file-circle-check" style={{ width: '16px', marginRight: '8px' }}></i>
                                <span>Proforma Invoice</span>
                            </button>
                            <button className="nav-subitem border-0 bg-transparent w-full text-left">
                                <i className="fa-solid fa-money-bill-transfer" style={{ width: '16px', marginRight: '8px' }}></i>
                                <span>Payment-In</span>
                            </button>
                            <button className="nav-subitem border-0 bg-transparent w-full text-left">
                                <i className="fa-solid fa-cart-flatbed" style={{ width: '16px', marginRight: '8px' }}></i>
                                <span>Sale Order</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="nav-group">
                    <div className="nav-item group-header">
                        <i className="fa-solid fa-cart-shopping"></i>
                        <span>Purchase & Expense</span>
                        <i className="fa-solid fa-chevron-down right-icon group-toggle"></i>
                    </div>
                    <div className="nav-subgroup">
                        <button className="nav-subitem border-0 bg-transparent w-full text-left">
                            <i className="fa-solid fa-file-invoice-dollar" style={{ width: '16px', marginRight: '8px' }}></i>
                            <span>Purchase Bills</span>
                        </button>
                        <button className="nav-subitem border-0 bg-transparent w-full text-left">
                            <i className="fa-solid fa-money-bill-trend-up" style={{ width: '16px', marginRight: '8px' }}></i>
                            <span>Payment-Out</span>
                        </button>
                        <button className="nav-subitem border-0 bg-transparent w-full text-left">
                            <i className="fa-solid fa-receipt" style={{ width: '16px', marginRight: '8px' }}></i>
                            <span>Expenses</span>
                        </button>
                    </div>
                </div>

                <div className="nav-group">
                    <div className="nav-item group-header">
                        <i className="fa-solid fa-arrow-trend-up"></i>
                        <span>Grow Your Business</span>
                        <i className="fa-solid fa-chevron-down right-icon group-toggle"></i>
                    </div>
                    <div className="nav-subgroup">
                        <button className="nav-subitem border-0 bg-transparent w-full text-left">
                            <i className="fa-solid fa-chart-pie" style={{ width: '16px', marginRight: '8px' }}></i>
                            <span>Reports</span>
                        </button>
                        <button className="nav-subitem border-0 bg-transparent w-full text-left">
                            <i className="fa-solid fa-building-columns" style={{ width: '16px', marginRight: '8px' }}></i>
                            <span>Cash & Bank</span>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="sidebar-footer">
                <div className="company-logo">M</div>
                <div className="company-name" onClick={() => setCurrentView('PROFILE_EDIT')}>My Company</div>
                <i className="fa-solid fa-settings"></i>
            </div>
        </aside>
    );
}
