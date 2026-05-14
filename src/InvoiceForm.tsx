import React, { useState, useEffect } from 'react';
import { Party, InventoryItem, Item, Estimate } from './types';
import { UNIT_SUGGESTIONS } from './constants';

export function InvoiceForm({ 
  parties, 
  inventoryItems, 
  isSale = true,
  onSave, 
  onCancel,
  initialData 
}: { 
  parties: Party[], 
  inventoryItems: InventoryItem[],
  isSale?: boolean,
  onSave: (estimate: Estimate) => void, 
  onCancel: () => void,
  initialData?: Estimate
}) {
  const [customerName, setCustomerName] = useState(initialData?.customerName || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [refNo, setRefNo] = useState(initialData?.refNo || (isSale ? 'SALE-001' : 'EST-001'));
  const [status, setStatus] = useState<'Open'|'Closed'>(initialData?.status as any || 'Open');
  const [items, setItems] = useState<Item[]>(initialData?.items || []);
  const [receivedAmount, setReceivedAmount] = useState(initialData?.receivedAmount || 0);
  const [paymentType, setPaymentType] = useState(initialData?.paymentType || 'Cash');

  const selectedParty = parties.find(p => p.name.toLowerCase() === customerName.toLowerCase());
  
  const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const balance = totalAmount - receivedAmount;

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), name: '', quantity: 1, rate: 0, unit: 'pcs', tax: 0, discount: 0 }]);
  };

  const updateItem = (index: number, field: keyof Item, value: string | number) => {
    const newItems = [...items];
    if (field === 'name') {
       const invItem = inventoryItems.find(i => i.name === value);
       if (invItem) {
          newItems[index] = { ...newItems[index], name: invItem.name, rate: invItem.price };
       } else {
          newItems[index] = { ...newItems[index], name: value as string };
       }
    } else {
       newItems[index] = { ...newItems[index], [field]: value } as Item;
    }
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedParty = parties.find(p => p.name === customerName);
    onSave({
      id: initialData?.id || Date.now().toString(),
      customerName,
      partyId: selectedParty?.id || '',
      date,
      refNo: refNo as any,
      status,
      items,
      totalAmount,
      receivedAmount,
      balance,
      isSale,
      paymentType: paymentType as any,
      discountValue: initialData?.discountValue || 0,
      discountType: initialData?.discountType || 'fixed',
      taxType: initialData?.taxType || 'none',
      description: initialData?.description || ''
    });
  };

  return (
    <div style={{ flex: 1, backgroundColor: '#f3f4f6', overflowY: 'auto' }}>
      <div style={{ padding: '16px 24px', backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>{initialData ? 'Edit' : 'Add'} {isSale ? 'Sale' : 'Estimate'}</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" onClick={onCancel} className="btn-secondary" style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #e5e7eb', backgroundColor: '#fff', cursor: 'pointer' }}>Cancel</button>
          <button type="submit" onClick={handleSubmit} className="btn-primary" style={{ padding: '8px 24px', borderRadius: '4px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer' }}>Save</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px', padding: '24px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Customer Name</label>
            <input 
              list="parties-list"
              value={customerName} 
              onChange={e => setCustomerName(e.target.value)}
              className="input-field" 
              style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px' }}
            />
            <datalist id="parties-list">
              {parties.map(p => <option key={p.id} value={p.name}>{`#${p.customerRefNo || 'N/A'} - Bal: ${p.balance}`}</option>)}
            </datalist>
            {selectedParty && (
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                Ref: #{selectedParty.customerRefNo || 'N/A'} | Balance: Rs {selectedParty.balance.toLocaleString()}
              </div>
            )}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)}
              className="input-field" 
              style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Invoice No.</label>
            <input 
              value={refNo} 
              readOnly
              className="input-field" 
              style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', backgroundColor: '#f9fafb' }}
            />
          </div>
          {!isSale && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>Status</label>
              <select 
                value={status} 
                onChange={e => setStatus(e.target.value as any)}
                className="input-field" 
                style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', backgroundColor: '#fff' }}
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          )}
        </div>

        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: '32px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '13px' }}>#</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, fontSize: '13px' }}>Item</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: '13px' }}>Qty</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: '13px' }}>Unit</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: '13px' }}>Price/Unit</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, fontSize: '13px' }}>Amount</th>
                <th style={{ padding: '12px 16px', width: '50px' }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>{index + 1}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <input 
                      list="items-list"
                      value={item.name} 
                      onChange={e => updateItem(index, 'name', e.target.value)}
                      style={{ width: '100%', padding: '6px', border: '1px solid #e5e7eb', borderRadius: '4px' }}
                    />
                    <datalist id="items-list">
                      {inventoryItems.map(i => <option key={i.id} value={i.name} />)}
                    </datalist>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <input 
                      type="number" 
                      value={item.quantity} 
                      onChange={e => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      style={{ width: '80px', padding: '6px', border: '1px solid #e5e7eb', borderRadius: '4px', textAlign: 'right' }}
                    />
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <select 
                      value={item.unit} 
                      onChange={e => updateItem(index, 'unit', e.target.value)}
                      style={{ width: '80px', padding: '6px', border: '1px solid #e5e7eb', borderRadius: '4px', textAlign: 'center' }}
                    >
                      {UNIT_SUGGESTIONS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <input 
                      type="number" 
                      value={item.rate} 
                      onChange={e => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                      style={{ width: '120px', padding: '6px', border: '1px solid #e5e7eb', borderRadius: '4px', textAlign: 'right' }}
                    />
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 500 }}>
                    Rs {(item.quantity * item.rate).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button type="button" onClick={() => removeItem(index)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '16px' }}>
            <button type="button" onClick={addItem} style={{ border: '1px dashed #3b82f6', color: '#3b82f6', padding: '6px 16px', borderRadius: '4px', cursor: 'pointer', background: '#eff6ff' }}>Add Item</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '12px' }}>Payment Type</label>
            <div style={{ display: 'flex', gap: '16px' }}>
               <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <input type="radio" checked={paymentType === 'Cash'} onChange={() => setPaymentType('Cash')} /> Cash
               </label>
               <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <input type="radio" checked={paymentType === 'Cheque'} onChange={() => setPaymentType('Cheque')} /> Cheque
               </label>
               <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <input type="radio" checked={paymentType === 'Online'} onChange={() => setPaymentType('Online')} /> Online
               </label>
            </div>
          </div>
          <div style={{ padding: '24px', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: '#6b7280' }}>Total Amount</span>
              <span style={{ fontWeight: 'bold' }}>Rs {totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
            </div>
            {(isSale || status === 'Closed') && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ color: '#6b7280' }}>Received Amount</span>
                  <input 
                    type="number" 
                    value={receivedAmount} 
                    onChange={e => setReceivedAmount(parseFloat(e.target.value) || 0)}
                    style={{ width: '100px', padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: '4px', textAlign: 'right' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                  <span style={{ fontWeight: 'bold' }}>Balance Due</span>
                  <span style={{ fontWeight: 'bold', color: '#ef4444' }}>Rs {balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
