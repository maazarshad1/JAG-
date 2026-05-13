import React, { useState } from 'react';
import { Estimate, InventoryItem } from './types';
import { Settings, Share2, Plus, Minus, Trash2, Calendar, GripVertical, Search } from 'lucide-react';

export function InvoiceForm({ isSale, onSave, onCancel, initialData, parties = [] }: { isSale: boolean, onSave: (inv: Estimate, print: boolean) => void, onCancel: () => void, initialData?: Estimate, parties?: any[] }) {
    const defaultRows = [{ id: '1', name: '', qty: 1, unit: 'PCS', price: 0 }];
    const mapItemsToRows = (items: any[]) => {
        return items.map((item, idx) => ({
            id: Date.now().toString() + idx,
            name: item.name,
            qty: item.quantity,
            unit: item.unit || 'PCS',
            price: item.rate
        }));
    };
    const [rows, setRows] = useState(initialData && initialData.items && initialData.items.length > 0 ? mapItemsToRows(initialData.items) : defaultRows);
    const [party, setParty] = useState(initialData ? initialData.customerName : '');
    const [showPartySuggestions, setShowPartySuggestions] = useState(false);
    const filteredParties = parties.filter(p => p.name.toLowerCase().includes(party.toLowerCase()) && party !== '').slice(0, 5);

    const [invoiceNo, setInvoiceNo] = useState(initialData && initialData.isSale === isSale ? Number(initialData.refNo) : 1);
    const [date, setDate] = useState(initialData ? initialData.date : new Date().toISOString().split('T')[0]);
    const [discountValue, setDiscountValue] = useState(0);
    const [discountPercent, setDiscountPercent] = useState(0);

    const addRow = () => setRows([...rows, { id: Date.now().toString(), name: '', qty: 1, unit: 'PCS', price: 0 }]);
    
    const updateRow = (index: number, field: string, value: any) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
        setRows(newRows);
    };

    const removeRow = (index: number) => {
        if (rows.length === 1) return;
        setRows(rows.filter((_, i) => i !== index));
    };

    const subTotal = rows.reduce((sum, r) => sum + ((r.qty || 0) * (r.price || 0)), 0);
    const total = subTotal - discountValue;

    const handleDiscountPercentChange = (val: number) => {
        setDiscountPercent(val);
        setDiscountValue((val / 100) * subTotal);
    };

    const handleDiscountValueChange = (val: number) => {
        setDiscountValue(val);
        if (subTotal > 0) setDiscountPercent((val / subTotal) * 100);
    };

    const handleSave = (print: boolean) => {
        onSave({
            id: Date.now().toString(),
            refNo: invoiceNo,
            date,
            customerName: party || 'Walk-in Customer',
            partyId: party, 
            items: rows.map((r, i) => ({
                id: i.toString(),
                name: r.name,
                quantity: r.qty,
                unit: r.unit,
                rate: r.price,
                tax: 0,
                discount: 0
            })),
            status: isSale ? 'CLOSED' : 'Open',
            discountValue: discountValue,
            discountType: 'fixed',
            taxType: 'none',
            description: '',
            totalAmount: total,
            balance: total,
            isSale
        }, print);
    };

    return (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: '#f8fafc', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
            <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', height: '40px', fontSize: '13px', color: '#4b5563', padding: '0 20px', gap: '24px' }}>
                <span style={{ cursor: 'pointer', hover: { color: '#111827' } }}>Company</span>
                <span style={{ cursor: 'pointer', hover: { color: '#111827' } }}>Help</span>
                <span style={{ cursor: 'pointer', hover: { color: '#111827' } }}>Versions</span>
                <span style={{ cursor: 'pointer', hover: { color: '#111827' } }}>Shortcuts</span>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <button onClick={onCancel} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px' }}><i className="fa-solid fa-arrow-left"></i></button>
                            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827' }}>{isSale ? 'Sale Invoice' : 'Estimate/Quotation'}</h2>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <Settings size={20} className="text-gray-500 cursor-pointer" />
                        </div>
                    </div>

                    <div style={{ padding: '24px', flex: 1 }}>
                        <div style={{ display: 'flex', gap: '48px', marginBottom: '32px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Party <span style={{ color: '#ef4444' }}>*</span></label>
                                <div style={{ position: 'relative' }}>
                                    <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                                    <input 
                                        type="text" 
                                        style={{ width: '100%', padding: '10px 36px 10px 36px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }} 
                                        placeholder="Search by Name/Phone *" 
                                        value={party} 
                                        onChange={e => {
                                            setParty(e.target.value);
                                            setShowPartySuggestions(true);
                                        }}
                                        onFocus={() => setShowPartySuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowPartySuggestions(false), 200)}
                                    />
                                    <div style={{ position: 'absolute', right: '12px', top: '10px', color: '#111827', pointerEvents: 'none' }}>
                                        <i className="fa-solid fa-chevron-down" style={{ fontSize: '12px' }}></i>
                                    </div>
                                    {showPartySuggestions && filteredParties.length > 0 && (
                                        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#fff', border: '1px solid #d1d5db', borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px', borderTop: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', zIndex: 10, maxHeight: '200px', overflowY: 'auto' }}>
                                            {filteredParties.map((p, i) => (
                                                <div 
                                                    key={i} 
                                                    style={{ padding: '10px 12px', fontSize: '14px', cursor: 'pointer', borderTop: '1px solid #f3f4f6' }}
                                                    className="hover:bg-slate-50"
                                                    onClick={() => {
                                                        setParty(p.name);
                                                        setShowPartySuggestions(false);
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <span style={{ fontWeight: 500, color: '#374151' }}>{p.name}</span>
                                                        <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>BAL: {p.balance?.toLocaleString('en-IN')}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {party && (
                                    <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', fontWeight: 700 }}>
                                        BAL: {parties.find(p => p.name.toLowerCase() === party.toLowerCase())?.balance?.toLocaleString('en-IN') || '0.00'}
                                    </div>
                                )}
                            </div>
                            <div style={{ flex: 1, display: 'flex', gap: '24px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Ref No</label>
                                    <input 
                                        type="number" 
                                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none' }} 
                                        value={invoiceNo} 
                                        onChange={e => setInvoiceNo(Number(e.target.value))} 
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Invoice Date</label>
                                    <div style={{ position: 'relative' }}>
                                        <Calendar size={16} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                                        <input 
                                            type="date" 
                                            style={{ width: '100%', padding: '10px 36px 10px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', outline: 'none', appearance: 'none' }} 
                                            value={date} 
                                            onChange={e => setDate(e.target.value)} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', marginBottom: '24px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                        <th style={{ width: '40px', padding: '12px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>#</th>
                                        <th style={{ padding: '12px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>ITEM</th>
                                        <th style={{ width: '100px', padding: '12px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>QTY</th>
                                        <th style={{ width: '140px', padding: '12px', fontSize: '12px', fontWeight: 600, color: '#6b7280' }}>UNIT</th>
                                        <th style={{ width: '150px', padding: '12px', fontSize: '12px', fontWeight: 600, color: '#6b7280', textAlign: 'right' }}>PRICE/UNIT</th>
                                        <th style={{ width: '150px', padding: '12px', fontSize: '12px', fontWeight: 600, color: '#6b7280', textAlign: 'right' }}>AMOUNT</th>
                                        <th style={{ width: '40px', padding: '12px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((row, idx) => (
                                        <tr key={row.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                            <td style={{ padding: '12px', color: '#9ca3af', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <GripVertical size={14} className="cursor-grab text-gray-400" />
                                                    {idx + 1}
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <input type="text" placeholder="Item Name" value={row.name} onChange={e => updateRow(idx, 'name', e.target.value)} style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px' }} />
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <input type="number" placeholder="1" value={row.qty} onChange={e => updateRow(idx, 'qty', Number(e.target.value))} style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px' }} />
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <select value={row.unit} onChange={e => updateRow(idx, 'unit', e.target.value)} style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', backgroundColor: 'transparent', cursor: 'pointer' }}>
                                                    <option value="PCS">PCS</option>
                                                    <option value="KG">KG</option>
                                                    <option value="BOX">BOX</option>
                                                    <option value="LTR">LTR</option>
                                                    <option value="MTR">MTR</option>
                                                    <option value="NOS">NOS</option>
                                                    <option value="QUINTAL">QUINTAL (QTL)</option>
                                                    <option value="ROLLS">ROLLS (ROL)</option>
                                                    <option value="SQ. FEET">SQ. FEET (SQF)</option>
                                                    <option value="SQ. METERS">SQ. METERS (SQM)</option>
                                                    <option value="TABLETS">TABLETS (TBS)</option>
                                                </select>
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'right' }}>
                                                <input type="number" placeholder="0" value={row.price} onChange={e => updateRow(idx, 'price', Number(e.target.value))} style={{ width: '100%', border: 'none', outline: 'none', fontSize: '14px', textAlign: 'right' }} />
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'right', fontWeight: 500 }}>
                                                {((row.qty || 0) * (row.price || 0)).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                                            </td>
                                            <td style={{ padding: '12px', textAlign: 'center' }}>
                                                <Trash2 size={16} className="text-gray-400 cursor-pointer hover:text-red-500" onClick={() => removeRow(idx)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ padding: '12px', backgroundColor: '#f9fafb', display: 'flex', gap: '16px' }}>
                                <button onClick={addRow} style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Plus size={16} /> ADD ROW
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Plus size={16} /> ADD DESCRIPTION
                                </button>
                                <button style={{ background: 'transparent', border: 'none', color: '#3b82f6', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Plus size={16} /> ADD IMAGE
                                </button>
                            </div>

                            <div style={{ width: '400px', backgroundColor: '#f9fafb', borderRadius: '8px', padding: '20px', border: '1px solid #e5e7eb' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px' }}>
                                    <span style={{ fontWeight: 500, color: '#374151' }}>SUBTOTAL</span>
                                    <span>Rs {subTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>Discount</span>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <div style={{ position: 'relative', width: '80px' }}>
                                            <input type="number" style={{ width: '100%', padding: '6px 24px 6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'right', outline: 'none' }} value={discountPercent} onChange={e => handleDiscountPercentChange(Number(e.target.value))} />
                                            <span style={{ position: 'absolute', right: '8px', top: '8px', color: '#9ca3af', fontSize: '12px' }}>%</span>
                                        </div>
                                        <div style={{ position: 'relative', width: '100px' }}>
                                            <span style={{ position: 'absolute', left: '8px', top: '8px', color: '#9ca3af', fontSize: '12px' }}>Rs</span>
                                            <input type="number" style={{ width: '100%', padding: '6px 8px 6px 28px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'right', outline: 'none' }} value={discountValue} onChange={e => handleDiscountValueChange(Number(e.target.value))} />
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>Tax</span>
                                    <select style={{ width: '188px', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', outline: 'none' }}>
                                        <option>NONE</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500, color: '#374151', cursor: 'pointer' }}>
                                        <input type="checkbox" defaultChecked /> Round Off
                                    </label>
                                    <input type="number" defaultValue="0" style={{ width: '80px', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'right', outline: 'none' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 700, fontSize: '18px', color: '#111827' }}>Total</span>
                                    <span style={{ fontWeight: 700, fontSize: '24px', color: '#111827' }}>Rs {total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: '#fff', borderTop: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', justifyContent: 'flex-end', gap: '16px', alignItems: 'center' }}>
                <button style={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', padding: '10px 20px', borderRadius: '4px', fontWeight: 600, color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    Share <i className="fa-solid fa-chevron-down" style={{ fontSize: '10px' }}></i>
                </button>
                <button onClick={() => handleSave(true)} style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '10px 32px', borderRadius: '4px', fontWeight: 600, cursor: 'pointer' }}>
                    Save
                </button>
            </div>
        </div>
    );
}
