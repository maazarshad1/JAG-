import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Monitor, Settings, Edit2, Download, Printer, Pencil, Share2, Trash2, X, Check } from 'lucide-react';
import SignaturePad from 'signature_pad';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Estimate, CompanyData } from './types';

export function InvoiceView({
  estimate,
  companyData,
  setCompanyData,
  onBack
}: {
  estimate: Estimate;
  companyData: CompanyData;
  setCompanyData: React.Dispatch<React.SetStateAction<CompanyData>>;
  onBack: () => void;
}) {
  const subtotal = estimate.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  
  const generatePDFBlob = async (): Promise<{blob: Blob, fileName: string} | null> => {
    const element = document.getElementById('invoice-paper');
    if (!element) return null;
    
    try {
      const style = document.createElement('style');
      style.innerHTML = `
        * { 
          color-scheme: light !important;
          animation: none !important;
          transition: none !important;
        }
      `;
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          clonedDoc.head.appendChild(style);
          // Sanitize oklab/oklch colors which crash html2canvas
          const allStyles = clonedDoc.querySelectorAll('style');
          allStyles.forEach(s => {
             s.innerHTML = s.innerHTML.replace(/(oklch|oklab)\([^)]+\)/g, '#000');
          });
          clonedDoc.querySelectorAll('*').forEach((el: any) => {
            if (el.style && el.style.cssText) {
                el.style.cssText = el.style.cssText.replace(/(oklch|oklab)\([^)]+\)/g, '#000');
            }
          });
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      return {
        blob: pdf.output('blob'),
        fileName: `${estimate.isSale ? 'Invoice' : 'Estimate'}_${estimate.refNo}.pdf`
      };
    } catch (error) {
      console.error('Error in PDF generation:', error);
      return null;
    }
  };

  const handleDownloadPDF = async () => {
    const result = await generatePDFBlob();
    if (result) {
      const url = URL.createObjectURL(result.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.fileName;
      link.click();
      URL.revokeObjectURL(url);
    } else {
      alert('Failed to generate PDF automatically. Please use "Print Invoice (Normal)" and select "Save as PDF" in the printer settings.');
    }
  };

  const handleShare = async (platform?: 'whatsapp' | 'email') => {
    try {
      const result = await generatePDFBlob();
      if (result) {
        const file = new File([result.blob], result.fileName, { type: 'application/pdf' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: result.fileName,
            text: `Invoice from ${companyData.name}\nInvoice No: ${estimate.refNo}`
          });
          return;
        }
      }
    } catch (err) {
      console.error('File sharing failed:', err);
    }

    // Fallback platforms
    if (platform === 'whatsapp') {
      const text = `Invoice from ${companyData.name}\nInvoice No: ${estimate.refNo}\nTotal Amount: Rs ${estimate.totalAmount}\nBalance: Rs ${estimate.balance}\n\nView here: ${window.location.href}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    } else {
      window.open(`mailto:?subject=${estimate.isSale ? 'Invoice' : 'Estimate'} ${estimate.refNo}&body=Here is your ${estimate.isSale ? 'invoice' : 'estimate'}`, '_blank');
    }
  };

  const handlePrint = (type: 'normal' | 'thermal') => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for printing');
      return;
    }

    const invoiceContent = document.getElementById('invoice-paper')?.innerHTML;
    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          // Skip cross-origin stylesheets
          return '';
        }
      })
      .join('\n');

    printWindow.document.write(`
      <html>
        <head>
          <style>
             ${styles}
             body { background: white !important; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
             #invoice-paper { 
               box-shadow: none !important; 
               border: none !important; 
               width: ${type === 'thermal' ? '72mm' : '100%'} !important; 
               max-width: ${type === 'thermal' ? '72mm' : 'none'} !important; 
               margin: 0 !important; 
               transform: none !important;
               background: white !important;
               color: black !important;
             }
             .print\\:hidden { display: none !important; }
             @page { 
               margin: 0; 
               size: ${type === 'thermal' ? '80mm auto' : 'A4'}; 
             }
             ${type === 'thermal' ? `
               * { font-size: 10px !important; }
               h2 { font-size: 14px !important; }
               h1 { font-size: 12px !important; }
               .repl-table { font-size: 9px !important; }
               td, th { padding: 4px !important; }
               .thermal-hide { display: none !important; }
             ` : ''}
          </style>
        </head>
        <body>
          <div id="invoice-paper">
            ${invoiceContent}
          </div>
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  function numberToWords(num: number): string {
    if (num === 0) return 'Zero';
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const inWords = (n: number): string => {
      if ((n = Math.floor(n)) === 0) return '';
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : ' ');
      if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + (n % 100 !== 0 ? 'and ' + inWords(n % 100) : '');
      if (n < 100000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 !== 0 ? inWords(n % 1000) : '');
      if (n < 10000000) return inWords(Math.floor(n / 100000)) + 'Lakh ' + (n % 100000 !== 0 ? inWords(n % 100000) : '');
      return inWords(Math.floor(n / 10000000)) + 'Crore ' + (n % 10000000 !== 0 ? inWords(n % 10000000) : '');
    };
    return inWords(num).trim() + ' Rupees only';
  }

  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sigPad = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (showSignatureModal && canvasRef.current && !sigPad.current) {
      sigPad.current = new SignaturePad(canvasRef.current, {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        penColor: 'rgb(0, 0, 0)'
      });
      // Handle high DPI displays
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvasRef.current.width = canvasRef.current.offsetWidth * ratio;
      canvasRef.current.height = canvasRef.current.offsetHeight * ratio;
      canvasRef.current.getContext("2d")?.scale(ratio, ratio);
      sigPad.current.clear();
    }
    if (!showSignatureModal && sigPad.current) {
      sigPad.current.off();
      sigPad.current = null;
    }
  }, [showSignatureModal]);

  const handleSignatureSave = () => {
    if (sigPad.current && !sigPad.current.isEmpty()) {
      const dataUrl = sigPad.current.toDataURL();
      const newCompanyData = { ...companyData, signature: dataUrl };
      setCompanyData(newCompanyData);
      localStorage.setItem('vyapar_company', JSON.stringify(newCompanyData));
    }
    setShowSignatureModal(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newCompanyData = { ...companyData, logo: reader.result as string };
        setCompanyData(newCompanyData);
        localStorage.setItem('vyapar_company', JSON.stringify(newCompanyData));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 bg-slate-100 overflow-y-auto relative">
      {/* Toast Notification */}
      <div className="absolute top-6 right-6 bg-white border border-slate-200 shadow-lg rounded p-4 flex items-center gap-3 z-50 animate-in fade-in slide-in-from-top-4 print:hidden">
          <div className="bg-emerald-500 rounded-full p-1 text-white"><Check size={14} /></div>
          <span className="text-sm font-medium text-slate-800">New transaction saved successfully</span>
      </div>

      <div className="max-w-[1200px] mx-auto p-4 sm:p-6 pb-20 flex flex-col gap-8">
        
        <div className="w-full">
            {/* Toolbar (Hidden on print) */}
            <div className="flex items-center justify-between mb-6 print:hidden bg-transparent">
              <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 bg-white hover:bg-slate-50 rounded shadow-sm transition-colors border border-slate-200 text-slate-600">
                  <ArrowLeft size={20} />
                </button>
                <h2 className="font-bold text-slate-800 text-xl">Preview</h2>
              </div>
              <div className="flex gap-4 items-center">
                 <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer font-medium"><input type="checkbox" className="rounded" /> Do not show invoice preview again</label>
                 <button onClick={onBack} className="text-blue-600 font-semibold hover:underline text-sm">Save & Close</button>
              </div>
            </div>

            {/* Paper Container */}
            <div id="invoice-paper" className="bg-white border border-slate-200 shadow-xl p-8 sm:p-12 print:shadow-none print:border-none print:p-0 relative min-h-[1056px] w-full max-w-[794px] mx-auto text-black font-sans leading-snug">
          <style dangerouslySetInnerHTML={{__html: `
            .repl-table th, .repl-table td { border-bottom: 1px solid #000; border-right: 1px solid #000; padding: 6px 8px; }
            .repl-table th:last-child, .repl-table td:last-child { border-right: none; }
            .repl-table th { font-weight: bold; }
          `}} />
          
          <h2 style={{ textAlign: 'center', color: '#2b3650', fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
            {estimate.isSale ? 'Tax Invoice' : 'Estimate'}
          </h2>

          <div style={{ border: '1px solid #000' }}>
            {/* Top Section */}
            <div style={{ display: 'flex', padding: '12px', borderBottom: '1px solid #000' }}>
               <div style={{ width: '80px', height: '80px', border: '1px solid #d4d4d4', marginRight: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#333', position: 'relative' }} className="group">
                  {companyData.logo ? (
                     <img src={companyData.logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                  ) : (
                     <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '24px', fontStyle: 'italic' }}>LOGO</div>
                  )}
                  <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white font-bold text-xs print:hidden">
                     <Edit2 size={16} className="mb-1" />
                     <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
               </div>
               <div style={{ flex: 1 }}>
                  <h1 style={{ margin: '0 0 6px 0', fontSize: '22px', color: '#2b3650', fontWeight: 'bold' }}>{companyData.name || 'Company Name'}</h1>
                  <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#444' }}>{companyData.address || 'Company Address'}</p>
                  <p style={{ margin: '0', fontSize: '13px', color: '#444' }}>
                     Phone: <b style={{ color: '#000' }}>{companyData.phone || '0000000000'}</b> 
                     <span style={{ marginLeft: '60px' }}>Email: <b style={{ color: '#000' }}>{companyData.email || 'email@example.com'}</b></span>
                  </p>
               </div>
            </div>

            {/* Estimate For / Details */}
            <div style={{ display: 'flex', borderBottom: '1px solid #000' }}>
               <div style={{ flex: 1, borderRight: '1px solid #000' }}>
                  <div style={{ padding: '6px 12px', borderBottom: '1px solid #000', fontSize: '13px', fontWeight: 'bold', background: '#f8fafc' }}>{estimate.isSale ? 'Invoice For:' : 'Estimate For:'}</div>
                  <div style={{ padding: '12px', fontSize: '14px', fontWeight: 'bold', minHeight: '80px', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{estimate.customerName || 'M.r'}</div>
               </div>
               <div style={{ flex: 1 }}>
                  <div style={{ padding: '6px 12px', borderBottom: '1px solid #000', fontSize: '13px', fontWeight: 'bold', background: '#f8fafc' }}>{estimate.isSale ? 'Invoice Details:' : 'Estimate Details:'}</div>
                  <div style={{ padding: '12px', fontSize: '13px', color: '#444', minHeight: '80px', lineHeight: '1.6' }}>
                    <div>No: <b style={{ color: '#000' }}>{estimate.refNo}</b></div>
                    <div>Date: <b style={{ color: '#000' }}>{estimate.date}</b></div>
                    <div>Time: <b style={{ color: '#000' }}>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</b></div>
                  </div>
               </div>
            </div>

            {/* Table */}
             <table className="repl-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', tableLayout: 'fixed', overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ width: '35px', textAlign: 'left' }}>#</th>
                  <th style={{ textAlign: 'left', width: 'auto' }}>Item name</th>
                  <th style={{ width: '65px', textAlign: 'right' }}>Quantity</th>
                  <th style={{ width: '100px', textAlign: 'right' }}>Price/<br/>Unit (₨)</th>
                  <th style={{ width: '120px', textAlign: 'right' }}>Amount(₨)</th>
                </tr>
              </thead>
              <tbody>
                {estimate.items.map((item, index) => (
                   <tr key={index}>
                     <td style={{ verticalAlign: 'top', fontWeight: 'bold' }}>{index + 1}</td>
                     <td style={{ verticalAlign: 'top', fontWeight: 'bold', color: '#333', wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'normal', paddingRight: '8px' }}>{item.name || 'Item Name'}</td>
                     <td style={{ verticalAlign: 'top', textAlign: 'right' }}>{item.quantity}</td>
                     <td style={{ verticalAlign: 'top', textAlign: 'right' }}>₨ {item.rate.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                     <td style={{ verticalAlign: 'top', textAlign: 'right' }}>₨ {((item.quantity * item.rate) || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                   </tr>
                ))}
                <tr>
                  <td></td>
                  <td style={{ fontWeight: 'bold' }}>Total</td>
                  <td style={{ fontWeight: 'bold', textAlign: 'right' }}>{estimate.items.reduce((s, i) => s + i.quantity, 0)}</td>
                  <td></td>
                  <td style={{ fontWeight: 'bold', textAlign: 'right' }}>₨ {subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                </tr>
              </tbody>
            </table>

            {/* Subtotal / Total Area */}
            <div style={{ display: 'flex', borderBottom: '1px solid #000' }}>
               <div style={{ flex: 1, borderRight: '1px solid #000' }}></div>
               <div style={{ width: '312px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #000' }}>Sub Total</td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #000', textAlign: 'center', width: '20px' }}>:</td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #000', textAlign: 'right' }}>₨ {subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #000', fontWeight: 'bold' }}>Total</td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #000', textAlign: 'center', fontWeight: 'bold' }}>:</td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #000', textAlign: 'right', fontWeight: 'bold' }}>₨ {estimate.totalAmount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} style={{ padding: '6px 8px', borderBottom: '1px solid #000', fontWeight: 'bold', background: '#f8fafc' }}>{estimate.isSale ? 'Invoice' : 'Estimate'} Amount In Words :</td>
                      </tr>
                      <tr>
                        <td colSpan={3} style={{ padding: '6px 8px', height: '40px', verticalAlign: 'top', textTransform: 'capitalize' }}>
                          {numberToWords(estimate.totalAmount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
               </div>
            </div>

            {/* Terms And Conditions */}
            <div style={{ borderBottom: '1px solid #000' }}>
               <div style={{ padding: '6px 12px', borderBottom: '1px solid #000', fontSize: '13px', fontWeight: 'bold', background: '#f8fafc' }}>Terms And Conditions:</div>
               <div style={{ padding: '8px 12px', fontSize: '13px', color: '#333', whiteSpace: 'pre-wrap' }}>
                  {companyData.terms || 'Thanks for doing business with us! Advance payment 90% After complation10%=Note This Quotation is vailid for only two days'}
               </div>
            </div>

            {/* Footer Signature Box */}
            <div style={{ display: 'flex' }}>
               <div style={{ flex: 1, borderRight: '1px solid #000' }}></div>
               <div style={{ width: '312px' }}>
                  <div style={{ padding: '6px 12px', borderBottom: '1px solid #000', fontSize: '13px', fontWeight: 'bold', background: '#f8fafc' }}>For {companyData.name || 'Jawad Aluminium and Glass Works'}:</div>
                  <div style={{ padding: '20px', textAlign: 'center', minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', position: 'relative' }}>
                     {companyData.signature ? (
                         <img src={companyData.signature} alt="Signature" style={{ maxHeight: '60px', marginBottom: '8px' }} />
                     ) : (
                         <span style={{ fontSize: '32px', fontFamily: 'cursive', color: '#444', lineHeight: '1', marginBottom: '8px' }}>f</span>
                     )}
                     <div style={{ fontSize: '13px', color: '#555' }}>Authorized Signatory</div>
                     
                     <div 
                       className="absolute inset-0 bg-indigo-600/5 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer print:hidden"
                       onClick={() => setShowSignatureModal(true)}
                     >
                       <div className="bg-indigo-600 text-white rounded-full p-2 shadow-lg">
                         <Edit2 size={16} />
                       </div>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
          
          {/* Sharing Panel: Now under the preview */}
          <div className="w-full max-w-[794px] mx-auto print:hidden mt-8">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                 <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                   <h3 className="font-bold text-slate-800 text-lg">Share & Download</h3>
                   <div className="flex gap-2">
                     <button onClick={handleDownloadPDF} className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2 transition-all active:scale-95">
                       <Download size={16} /> Download PDF
                     </button>
                   </div>
                 </div>
                 
                 <div className="p-6">
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-emerald-50 border border-slate-100 transition-colors group">
                       <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"><i className="fa-brands fa-whatsapp text-2xl"></i></div>
                       <span className="text-sm font-semibold text-slate-700 font-sans">WhatsApp</span>
                     </button>
                     
                     <button onClick={() => handleShare('email')} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-red-50 border border-slate-100 transition-colors group">
                       <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"><i className="fa-solid fa-envelope text-xl"></i></div>
                       <span className="text-sm font-semibold text-slate-700 font-sans">Gmail</span>
                     </button>

                     <button onClick={() => handlePrint('thermal')} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors group text-slate-700">
                       <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 shadow-md group-hover:scale-110 transition-transform"><Printer size={22} /></div>
                       <span className="text-sm font-semibold font-sans">Print Thermal</span>
                     </button>

                     <button onClick={() => handlePrint('normal')} className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors group text-slate-700">
                       <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 shadow-md group-hover:scale-110 transition-transform"><Monitor size={22} /></div>
                       <span className="text-sm font-semibold font-sans">Print A4</span>
                     </button>
                   </div>
                 </div>

                 <div className="p-4 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center uppercase tracking-wider font-bold">
                   Professional Invoice Management System
                 </div>
              </div>
          </div>

        </div>
      </div>

      {/* Signature Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Pencil size={18} className="text-indigo-600" /> Draw Signature</h3>
              <button onClick={() => setShowSignatureModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 bg-slate-100 flex justify-center">
              <div className="bg-white border-2 border-slate-300 rounded-xl shadow-inner relative w-full h-48 cursor-crosshair overflow-hidden group">
                <canvas ref={canvasRef} className="w-full h-full absolute inset-0 touch-none"></canvas>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => sigPad.current?.clear()} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 hover:text-slate-900 shadow-sm font-bold text-xs uppercase flex items-center gap-1">
                    <Trash2 size={14} /> Clear
                  </button>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => setShowSignatureModal(false)} className="px-5 py-2.5 font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button 
                onClick={handleSignatureSave} 
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg active:scale-95 transition-all text-sm"
              >
                Save Signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
