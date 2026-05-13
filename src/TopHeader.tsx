import React from 'react';

export function TopHeader({ title, onAction }: { title: string, onAction: (action: string) => void }) {
    return (
        <header id="top-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', height: '56px', background: '#fff', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
            <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="business-indicator" style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent-red)', borderRadius: '50%' }}></div>
                <input type="text" className="business-name-input" value={title} readOnly placeholder="Enter Business Name" style={{ border: 'none', fontSize: '16px', color: '#111827', outline: 'none', width: '250px', fontWeight: 600 }} />
            </div>
            <div className="header-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#6b7280' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <i className="fa-brands fa-whatsapp" style={{ color: '#25D366', fontSize: '16px' }}></i>
                    <span style={{ fontWeight: 500 }}>WhatsApp Chat Support (+971) 501 759 794</span>
                </div>
                <span style={{ fontSize: '10px', color: '#9ca3af' }}>Get Instant Online Support</span>
            </div>
            <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button className="btn btn-primary-red" onClick={() => onAction('ADD_SALE')} style={{ padding: '6px 16px', fontSize: '13px', background: 'var(--accent-red)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}><i className="fa-solid fa-plus"></i> Add Sale</button>
                <button className="btn btn-purchase-light" style={{ background: '#DBEAFE', color: '#3B82F6', padding: '6px 16px', fontSize: '13px', fontWeight: 500, border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><i className="fa-solid fa-plus"></i> Add Purchase</button>
                <button className="btn btn-icon" onClick={() => onAction('PROFILE_EDIT')} style={{ background: 'transparent', border: 'none', color: '#6b7280', fontSize: '16px', cursor: 'pointer' }}><i className="fa-solid fa-gear"></i></button>
                <button className="btn btn-icon" style={{ background: 'transparent', border: 'none', color: '#6b7280', fontSize: '16px', cursor: 'pointer' }}><i className="fa-solid fa-ellipsis-vertical"></i></button>
            </div>
        </header>
    );
}
