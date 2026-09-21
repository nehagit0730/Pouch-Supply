import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, CreditCard, Lock, RefreshCw, AlertTriangle, 
  CheckCircle, XCircle, ArrowLeft, Send, ShoppingBag, Truck, Smartphone, Building2
} from 'lucide-react';
import { Order } from '../types';

// ==========================================
// 1. RAZORPAY SECURE GATEWAY SIMULATOR
// ==========================================
interface RazorpayGatewaySimulatorProps {
  onReturnToShop: () => void;
}

export function RazorpayGatewaySimulator({ onReturnToShop }: RazorpayGatewaySimulatorProps) {
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('0.00');
  const [razorpayOrderId, setRazorpayOrderId] = useState('');
  
  // Payment methods supported by Razorpay
  const [activeMethod, setActiveMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  
  // Card inputs
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  // UPI inputs
  const [upiId, setUpiId] = useState('');

  // Simulation settings
  const [simulationMode, setSimulationMode] = useState<'SUCCESS' | 'DECLINED' | 'GATEWAY_ERROR'>('SUCCESS');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOrderId(params.get('orderId') || `PS${Math.floor(Math.random() * 90000 + 10000)}`);
    setAmount(params.get('amount') || '29.99');
    setRazorpayOrderId(params.get('razorpayOrderId') || `order_${Math.random().toString(36).substring(2, 11)}`);
  }, []);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 16) val = val.substring(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.substring(0, 4);
    if (val.length >= 2) {
      setExpiry(`${val.substring(0, 2)}/${val.substring(2)}`);
    } else {
      setExpiry(val);
    }
  };

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeMethod === 'card') {
      if (!cardHolder.trim() || !cardNumber || cardNumber.replace(/\s/g, '').length < 15 || !expiry || !cvv || cvv.length < 3) {
        setPaymentError('Please enter valid credit or debit card fields.');
        return;
      }
    } else if (activeMethod === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        setPaymentError('Please enter a valid UPI VPA address (e.g. user@okhdfcbank).');
        return;
      }
    }

    setIsProcessing(true);
    setPaymentError(null);

    const payload = {
      orderId,
      amount,
      currency: 'GBP',
      method: activeMethod,
      cardHolderName: cardHolder,
      cardNumber: cardNumber.replace(/\s/g, ''),
      upiId: upiId,
      simulationMode
    };

    try {
      const response = await fetch('/api/razorpay/process-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Razorpay gateway authorization failed.');
      }

      if (data.paymentStatus === 'AUTHORISED') {
        setTimeout(() => {
          setIsProcessing(false);
          window.history.pushState({}, '', `/payment/success?orderId=${orderId}&amount=${amount}&paymentId=${data.transactionId}`);
          window.dispatchEvent(new Event('popstate'));
        }, 1000);
      } else {
        setTimeout(() => {
          setIsProcessing(false);
          window.history.pushState({}, '', `/payment/failed?orderId=${orderId}&reason=Payment declined by issuing bank or network`);
          window.dispatchEvent(new Event('popstate'));
        }, 1000);
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Razorpay gateway communication error.');
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    window.history.pushState({}, '', `/payment/cancelled?orderId=${orderId}`);
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <div className="max-w-xl mx-auto my-12 bg-slate-900 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden relative font-sans">
      
      {/* Razorpay Signature Blue Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-700 py-4 px-6 flex justify-between items-center border-b border-blue-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/10 px-2 py-0.5 rounded-lg border border-white/20">
            <span className="text-sm font-black tracking-wider text-white font-mono">Razorpay</span>
          </div>
          <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
            Standard Checkout
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/90">
          <ShieldCheck className="h-4 w-4 text-sky-300 animate-pulse" /> 256-bit SSL Vault
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        
        {/* Merchant & Order details */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:justify-between gap-3 text-xs">
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] block uppercase tracking-wider font-extrabold">MERCHANT NAME</span>
            <span className="font-extrabold text-slate-200">Pouch Supply UK Ltd</span>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500 text-[10px] block uppercase tracking-wider font-extrabold">ORDER REFERENCE</span>
            <span className="font-mono text-slate-300 font-bold">{orderId}</span>
          </div>
          <div className="space-y-1 sm:text-right">
            <span className="text-slate-500 text-[10px] block uppercase tracking-wider font-extrabold">AMOUNT DUE</span>
            <span className="font-black text-sky-400 text-sm">£{amount} GBP</span>
          </div>
        </div>

        {/* Simulator controls */}
        <div className="bg-slate-850/50 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">Razorpay Sandbox Simulator</span>
            <span className="text-[9px] font-semibold text-emerald-400">● TEST ENVIRONMENT</span>
          </div>
          <p className="text-[10px] text-slate-400">Select test payment outcome for simulated processing:</p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { id: 'SUCCESS', label: '✓ Approved' },
              { id: 'DECLINED', label: '✗ Decline Card' },
              { id: 'GATEWAY_ERROR', label: '⚠️ Timeout Error' }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSimulationMode(item.id as any)}
                className={`py-1.5 text-[10px] font-extrabold rounded-lg transition-all border ${
                  simulationMode === item.id 
                    ? 'bg-sky-600/30 text-sky-300 border-sky-500 shadow-xs' 
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Razorpay Method Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveMethod('card')}
            className={`py-2 text-[11px] font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeMethod === 'card'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" /> Card
          </button>
          <button
            type="button"
            onClick={() => setActiveMethod('upi')}
            className={`py-2 text-[11px] font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeMethod === 'upi'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" /> UPI / QR
          </button>
          <button
            type="button"
            onClick={() => setActiveMethod('netbanking')}
            className={`py-2 text-[11px] font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeMethod === 'netbanking'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="h-3.5 w-3.5" /> NetBanking
          </button>
        </div>

        {/* Payment Form */}
        <form onSubmit={handlePaySubmit} className="space-y-4">
          {activeMethod === 'card' && (
            <>
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Cardholder Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ALEXANDER STERLING"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  className="w-full text-xs font-mono p-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-sky-500 text-white font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="4444 3333 2222 1111"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full text-xs font-mono p-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-sky-500 text-white font-bold pl-10"
                  />
                  <CreditCard className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    required
                    placeholder="12/28"
                    value={expiry}
                    onChange={handleExpiryChange}
                    className="w-full text-xs font-mono p-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-sky-500 text-white font-bold text-center"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">CVV</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs font-mono p-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-sky-500 text-white font-bold text-center"
                  />
                </div>
              </div>
            </>
          )}

          {activeMethod === 'upi' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. mobile@okhdfcbank or user@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full text-xs font-mono p-3 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-sky-500 text-white font-bold"
                />
              </div>
              <div className="flex gap-2 text-[10px] text-slate-400">
                <span className="px-2 py-1 bg-slate-800 rounded">Google Pay</span>
                <span className="px-2 py-1 bg-slate-800 rounded">PhonePe</span>
                <span className="px-2 py-1 bg-slate-800 rounded">Paytm</span>
                <span className="px-2 py-1 bg-slate-800 rounded">BHIM UPI</span>
              </div>
            </div>
          )}

          {activeMethod === 'netbanking' && (
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Select Your Bank</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['Barclays UK', 'HSBC UK', 'NatWest', 'Lloyds Bank', 'Santander', 'Revolut'].map((bank, i) => (
                  <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg hover:border-sky-500 cursor-pointer font-bold text-[11px] text-slate-300">
                    {bank}
                  </div>
                ))}
              </div>
            </div>
          )}

          {paymentError && (
            <div className="bg-red-950/40 border border-red-800/60 rounded-xl p-3 text-[11px] text-red-300 font-bold flex items-center gap-2">
              <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-red-400" />
              <span>{paymentError}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isProcessing}
              className="py-3.5 bg-slate-800 hover:bg-slate-750 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50 text-slate-300"
            >
              Cancel Payment
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 text-white shadow-lg disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4.5 w-4.5 animate-spin" /> Authorising via Razorpay...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Pay £{amount} GBP Securely
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-[9.5px] text-slate-500 leading-normal">
            By completing this checkout, you authorize Razorpay payment services. Card data is securely vaulted using industry-standard PCI-DSS Level 1 compliance.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. PAYMENT SUCCESS RECEIPT SCREEN
// ==========================================
interface PaymentSuccessScreenProps {
  onReturnToShop: () => void;
}

export function PaymentSuccessScreen({ onReturnToShop }: PaymentSuccessScreenProps) {
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('0.00');
  const [paymentId, setPaymentId] = useState('');
  const [order, setOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const parsedOrderId = params.get('orderId') || 'PS-TEMP';
    const parsedAmount = params.get('amount') || '0.00';
    const parsedPaymentId = params.get('paymentId') || `pay_${Math.random().toString(36).substring(2, 12)}`;
    setOrderId(parsedOrderId);
    setAmount(parsedAmount);
    setPaymentId(parsedPaymentId);

    // Fetch order details
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders`);
        if (res.ok) {
          const list: Order[] = await res.json();
          const found = list.find(o => o.id === parsedOrderId);
          if (found) {
            setOrder(found);
          }
        }
      } catch (err) {
        console.warn('Could not fetch order details receipt:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, []);

  return (
    <div className="max-w-xl mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-6 font-sans">
      <div className="mx-auto w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
        <CheckCircle className="h-10 w-10 text-emerald-500 animate-bounce" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">Payment Completed Successfully!</h2>
        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
          Your payment was authorized via Razorpay, and your order has been received. A detailed transaction receipt has been dispatched to your email address.
        </p>
      </div>

      {/* Real receipt breakdown */}
      <div className="border border-slate-150 bg-slate-50 rounded-2xl p-5 text-left text-xs divide-y divide-slate-200/60 space-y-3.5">
        <div className="pb-3 grid grid-cols-2 gap-2">
          <div>
            <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider block">Order ID Reference</span>
            <strong className="text-slate-800 text-sm font-mono">{orderId}</strong>
          </div>
          <div className="text-right">
            <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider block">Payment Provider</span>
            <span className="text-blue-600 font-black text-xs uppercase tracking-widest block font-mono">Razorpay Secure</span>
          </div>
        </div>

        <div className="py-3.5 space-y-2">
          <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider block">Razorpay Payment ID</span>
          <span className="font-mono text-slate-700 font-bold block">{order?.razorpayPaymentId || paymentId}</span>
        </div>

        <div className="py-3.5 space-y-2">
          <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider block">Fulfillment Delivery Method</span>
          <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-150 shadow-3xs">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-slate-600" />
              <div>
                <span className="font-extrabold text-slate-850 block text-[11px]">Priority Courier Dispense</span>
                <span className="text-[9px] text-slate-400 block font-bold">Estimated Delivery: 2-3 Business Days</span>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 py-1 px-2.5 rounded-md">
              Handoff pending
            </span>
          </div>
        </div>

        {order && order.items && (
          <div className="py-3.5 space-y-2">
            <span className="text-slate-400 font-extrabold text-[9px] uppercase tracking-wider block">Items Purchased ({order.items.length})</span>
            <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1">
              {order.items.map((item: any, i: number) => (
                <div key={i} className="flex justify-between text-[11px] font-bold text-slate-700">
                  <span className="truncate max-w-[280px]">{item.productTitle} <span className="text-slate-400 font-normal">x{item.quantity}</span></span>
                  <span>£{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-3 flex justify-between items-center">
          <span className="font-black text-slate-850 uppercase text-[10px] tracking-wider">Total Paid Securely</span>
          <span className="text-lg font-black text-slate-900">£{amount || (order ? order.total.toFixed(2) : '29.99')}</span>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3.5 text-[11px] text-emerald-700 font-bold flex items-center justify-center gap-2">
        <Send className="h-4 w-4 shrink-0" />
        <span>Confirmation Email Sent to Support & Customer Mailbox!</span>
      </div>

      <button
        onClick={onReturnToShop}
        className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
      >
        <ShoppingBag className="h-4 w-4" /> Continue Catalog Shopping
      </button>
    </div>
  );
}

// ==========================================
// 3. PAYMENT FAILED / DECLINED SCREEN
// ==========================================
interface PaymentFailedScreenProps {
  onReturnToCheckout: () => void;
}

export function PaymentFailedScreen({ onReturnToCheckout }: PaymentFailedScreenProps) {
  const [reason, setReason] = useState('Payment declined by issuer or network');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setReason(params.get('reason') || 'Payment authorization failed or timed out.');
  }, []);

  return (
    <div className="max-w-xl mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-6 font-sans">
      <div className="mx-auto w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center shadow-inner">
        <XCircle className="h-10 w-10 text-red-500" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">Payment Authorization Failed</h2>
        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
          Razorpay could not complete your transaction. No charges have been billed to your payment method.
        </p>
      </div>

      {/* Reason Box */}
      <div className="border border-red-100 bg-red-50/50 rounded-2xl p-5 text-left text-xs space-y-1">
        <span className="text-red-800 uppercase text-[9px] font-black tracking-widest block">Error Reported by Gateway:</span>
        <p className="font-extrabold text-slate-800 text-[11.5px] leading-relaxed">{reason}</p>
        <p className="text-[10px] text-slate-500 leading-relaxed pt-1">
          Suggestions: Check that your payment details are valid, check you have sufficient account funds, or toggle the "Approved" simulator setting to try again.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={() => {
            window.history.pushState({}, '', '/pages/checkout');
            window.dispatchEvent(new Event('popstate'));
          }}
          className="flex-1 py-4 border border-slate-250 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4 text-slate-500" /> Change payment details
        </button>
        <button
          onClick={() => {
            const params = new URLSearchParams(window.location.search);
            const orderId = params.get('orderId') || '';
            const amount = '29.99'; // Default fallback
            window.history.pushState({}, '', `/payment/razorpay-gateway?orderId=${orderId}&amount=${amount}`);
            window.dispatchEvent(new Event('popstate'));
          }}
          className="flex-1 py-4 bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest rounded-xl transition cursor-pointer shadow-md"
        >
          Retry on Razorpay Simulator
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 4. PAYMENT CANCELLED SCREEN
// ==========================================
interface PaymentCancelledScreenProps {
  onReturnToCheckout: () => void;
}

export function PaymentCancelledScreen({ onReturnToCheckout }: PaymentCancelledScreenProps) {
  return (
    <div className="max-w-xl mx-auto my-12 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm text-center space-y-6 font-sans">
      <div className="mx-auto w-16 h-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center shadow-inner">
        <AlertTriangle className="h-9 w-9 text-slate-500" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">Checkout Cancelled</h2>
        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
          The secure transaction was cancelled. Your cart items have been saved so you can finish whenever you are ready.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <button
          onClick={() => {
            window.history.pushState({}, '', '/collections/all');
            window.dispatchEvent(new Event('popstate'));
          }}
          className="py-4 border border-slate-250 hover:bg-slate-50 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
        >
          Browse Products
        </button>
        <button
          onClick={() => {
            window.history.pushState({}, '', '/pages/checkout');
            window.dispatchEvent(new Event('popstate'));
          }}
          className="py-4 bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
        >
          Return to Checkout View
        </button>
      </div>
    </div>
  );
}
