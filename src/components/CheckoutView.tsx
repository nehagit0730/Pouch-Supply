import React, { useState, useEffect } from 'react';
import { CartItem, Discount, Customer, Order } from '../types';
import { 
  ShieldCheck, ArrowLeft, CreditCard, Lock, Terminal, 
  CheckCircle, AlertTriangle, AlertCircle, RefreshCw, Send, HelpCircle, Truck, ShoppingCart
} from 'lucide-react';
import SubscriptionIcon from './SubscriptionIcon';

interface CheckoutViewProps {
  cartItems: CartItem[];
  discountApplied: Discount | null;
  totalAmount: number;
  loggedInCustomer: Customer | null;
  onNavigate: (tab: string) => void;
  onCompleteCheckout: (paymentDetails: {
    orderId: string;
    customerName: string;
    customerEmail: string;
    address: string;
    total: number;
    discountApplied: Discount | null;
    items: { productId: string; productTitle: string; price: number; quantity: number; image?: string; }[];
    worldpayTxId: string;
    worldpayAuthCode: string;
    cardBrand: string;
  }) => void;
}

export default function CheckoutView({
  cartItems,
  discountApplied,
  totalAmount,
  loggedInCustomer,
  onNavigate,
  onCompleteCheckout
}: CheckoutViewProps) {
  // Shipping info state
  const [fullName, setFullName] = useState(loggedInCustomer?.name || '');
  const [email, setEmail] = useState(loggedInCustomer?.email || '');
  const [addressLine, setAddressLine] = useState(
    loggedInCustomer?.addresses && loggedInCustomer.addresses[0] ? loggedInCustomer.addresses[0] : ''
  );
  const [city, setCity] = useState('London');
  const [postcode, setPostcode] = useState('EC1A 1BB');
  const [country, setCountry] = useState('United Kingdom');
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'priority'>('priority');

  // Worldpay Card State
  const [cardHolder, setCardHolder] = useState(loggedInCustomer?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Sandbox simulation settings
  const [simulationMode, setSimulationMode] = useState<'SUCCESS' | 'DECLINED' | '3DS_REQUIRED' | 'GATEWAY_ERROR'>('SUCCESS');
  const [showLogs, setShowLogs] = useState(true);
  const [apiLogs, setApiLogs] = useState<{ timestamp: string; type: 'REQUEST' | 'RESPONSE' | 'ERROR'; payload: any }[]>([]);

  // Payment execution states
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccessData, setPaymentSuccessData] = useState<any | null>(null);

  // 3D Secure dialog state
  const [show3dsModal, setShow3dsModal] = useState(false);
  const [threeDsTxId, setThreeDsTxId] = useState('');
  const [threeDsOtp, setThreeDsOtp] = useState('');
  const [threeDsError, setThreeDsError] = useState<string | null>(null);

  // Auto-fill customer details when they change
  useEffect(() => {
    if (loggedInCustomer) {
      setFullName(loggedInCustomer.name);
      setEmail(loggedInCustomer.email);
      setCardHolder(loggedInCustomer.name);
      if (loggedInCustomer.addresses && loggedInCustomer.addresses[0]) {
        setAddressLine(loggedInCustomer.addresses[0]);
      }
    }
  }, [loggedInCustomer]);

  // Detected card type
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return { name: 'Visa', color: 'from-blue-600 to-indigo-800', logo: '💳 Visa' };
    if (clean.startsWith('5')) return { name: 'Mastercard', color: 'from-orange-500 to-red-600', logo: '💳 Mastercard' };
    if (clean.startsWith('3')) return { name: 'American Express', color: 'from-teal-600 to-emerald-800', logo: '💳 AMEX' };
    if (clean.startsWith('6')) return { name: 'Maestro', color: 'from-blue-500 to-cyan-600', logo: '💳 Maestro' };
    return { name: 'Worldpay Core', color: 'from-slate-700 to-slate-900', logo: '💳 Card' };
  };

  const currentCardBrand = getCardBrand(cardNumber);

  // Format card number with spacing (#### #### #### ####)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.substring(0, 16);
    
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  // Format expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.substring(0, 4);
    
    if (value.length >= 2) {
      const month = parseInt(value.substring(0, 2), 10);
      const safeMonth = Math.min(Math.max(month, 1), 12).toString().padStart(2, '0');
      const year = value.substring(2);
      setExpiry(`${safeMonth}/${year}`);
    } else {
      setExpiry(value);
    }
  };

  // Add a log helper
  const addLog = (type: 'REQUEST' | 'RESPONSE' | 'ERROR', payload: any) => {
    setApiLogs(prev => [
      {
        timestamp: new Date().toLocaleTimeString(),
        type,
        payload
      },
      ...prev
    ]);
  };

  // Subtotal details
  const deliveryCost = deliverySpeed === 'priority' ? (totalAmount >= 40 ? 0 : 4.99) : 0;
  const finalTotal = totalAmount + deliveryCost;

  // Process secure Worldpay request
  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !addressLine) {
      setPaymentError('Please fill in your shipping and contact information.');
      return;
    }
    if (!cardNumber || cardNumber.length < 15 || !expiry || expiry.length < 5 || !cvv || cvv.length < 3) {
      setPaymentError('Please enter valid card details.');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    const requestPayload = {
      cardHolderName: cardHolder,
      cardNumber: cardNumber,
      expiry: expiry,
      cvv: cvv,
      amount: finalTotal.toFixed(2),
      currency: 'GBP',
      simulationMode: simulationMode
    };

    addLog('REQUEST', {
      endpoint: '/api/worldpay/process',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        ...requestPayload,
        cardNumber: cardNumber.substring(0, 4) + ' **** **** ' + cardNumber.slice(-4),
        cvv: '***'
      }
    });

    try {
      const response = await fetch('/api/worldpay/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        addLog('ERROR', {
          statusCode: response.status,
          error: responseData.error || 'Authorization Failed',
          message: responseData.message || 'Gateway reported failure'
        });
        throw new Error(responseData.message || responseData.error || 'Payment gateway connection error');
      }

      addLog('RESPONSE', responseData);

      if (responseData.paymentStatus === '3DS_REQUIRED') {
        // Trigger simulated 3D Secure modal
        setThreeDsTxId(responseData.transactionId);
        setShow3dsModal(true);
        setIsProcessing(false);
      } else if (responseData.paymentStatus === 'AUTHORISED') {
        // Payment authorized successfully!
        setPaymentSuccessData(responseData);
        setIsProcessing(false);

        // Place the official order
        const orderId = `CT${Math.floor(Math.random() * 90000 + 10000)}`;
        onCompleteCheckout({
          orderId,
          customerName: fullName,
          customerEmail: email,
          address: `${addressLine}, ${city}, ${postcode}, ${country}`,
          total: finalTotal,
          discountApplied,
          items: cartItems.map(item => ({
            productId: item.productId,
            productTitle: item.productTitle,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          worldpayTxId: responseData.transactionId,
          worldpayAuthCode: responseData.authCode,
          cardBrand: responseData.cardBrand
        });
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Payment processing failed. Please select a different simulation parameter.');
      setIsProcessing(false);
    }
  };

  // Process 3DS validation code
  const handleVerify3ds = async () => {
    if (!threeDsOtp.trim()) return;

    setIsProcessing(true);
    setThreeDsError(null);

    const requestPayload = {
      cardHolderName: cardHolder,
      cardNumber: cardNumber,
      expiry: expiry,
      cvv: cvv,
      amount: finalTotal.toFixed(2),
      currency: 'GBP',
      simulationMode: 'SUCCESS', // Verify completes transaction
      threeDSecureOTP: threeDsOtp
    };

    addLog('REQUEST', {
      endpoint: '/api/worldpay/process',
      method: 'POST',
      notes: 'Completing 3D Secure challenge',
      body: {
        transactionId: threeDsTxId,
        otp: '****'
      }
    });

    try {
      const response = await fetch('/api/worldpay/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        addLog('ERROR', {
          statusCode: response.status,
          error: responseData.error || '3DS Verification Failed',
          message: responseData.message || 'The OTP code is invalid'
        });
        throw new Error(responseData.message || 'Verification rejected.');
      }

      addLog('RESPONSE', responseData);

      // Payment authorized!
      setPaymentSuccessData(responseData);
      setShow3dsModal(false);
      setIsProcessing(false);

      // Place order
      const orderId = `CT${Math.floor(Math.random() * 90000 + 10000)}`;
      onCompleteCheckout({
        orderId,
        customerName: fullName,
        customerEmail: email,
        address: `${addressLine}, ${city}, ${postcode}, ${country}`,
        total: finalTotal,
        discountApplied,
        items: cartItems.map(item => ({
          productId: item.productId,
          productTitle: item.productTitle,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        worldpayTxId: responseData.transactionId,
        worldpayAuthCode: responseData.authCode,
        cardBrand: responseData.cardBrand
      });

    } catch (err: any) {
      setThreeDsError(err.message || 'Authentication declined. Passcode hints: 1234');
      setIsProcessing(false);
    }
  };

  // If order was successfully completed
  if (paymentSuccessData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-2xl text-center space-y-6 relative overflow-hidden">
          {/* Subtle branding background element */}
          <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-50 rounded-full blur-3xl opacity-60 -z-10" />
          
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 mx-auto">
            <CheckCircle className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold py-1 px-3.5 rounded-full uppercase tracking-wider inline-block">
              Payment Secured by Worldpay
            </span>
            <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tight">Order Placed Successfully!</h1>
            <p className="text-slate-500 max-w-lg mx-auto text-xs leading-relaxed">
              Thank you for shopping with us! Your nicotine pouches are being packed and dispatched directly from our UK-licensed laboratory pouch facility.
            </p>
          </div>

          {/* Receipt Card */}
          <div className="bg-slate-50 border border-slate-150/70 rounded-2xl p-6 text-left max-w-lg mx-auto space-y-4">
            <div className="flex justify-between border-b border-slate-200 pb-3 text-xs">
              <span className="text-slate-400 font-bold">Worldpay Ref Code:</span>
              <span className="font-mono font-bold text-slate-800 uppercase">{paymentSuccessData.transactionId}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-3 text-xs">
              <span className="text-slate-400 font-bold">Authorization Pin:</span>
              <span className="font-mono font-bold text-slate-800">{paymentSuccessData.authCode}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-3 text-xs">
              <span className="text-slate-400 font-bold">Payment Method:</span>
              <span className="font-semibold text-slate-800">{paymentSuccessData.cardBrand} (Sandbox Network)</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-3 text-xs">
              <span className="text-slate-400 font-bold">Risk Assessment Score:</span>
              <span className="font-black text-indigo-600">{paymentSuccessData.riskScore} / 100 (Safe)</span>
            </div>
            <div className="flex justify-between pt-1 text-sm font-black">
              <span className="text-slate-800 uppercase">Amount Transacted:</span>
              <span className="text-slate-950">£{paymentSuccessData.amount.toFixed(2)} GBP</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
            <button
              onClick={() => onNavigate('frontend-home')}
              className="w-full bg-slate-900 border-slate-900 text-white hover:bg-slate-850 py-3.5 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-colors cursor-pointer shadow-md"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => {
                // Open Customer profile at order logs tab
                onNavigate('frontend-account');
              }}
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3.5 px-6 rounded-xl text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
            >
              View Order History
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header back navigation */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => onNavigate('frontend-shop')}
          className="flex items-center gap-2 text-xs font-black text-slate-500 hover:text-slate-850 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Catalog Shop
        </button>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
          <ShieldCheck className="h-4 w-4 text-emerald-500" /> Secure SSL Sandbox Environment
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Order forms */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Shipping Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Truck className="h-4 w-4 text-indigo-600" /> 1. Shipping Address & Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Recipient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alexander Sterling"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (!cardHolder) setCardHolder(e.target.value);
                  }}
                  className="w-full text-xs p-3 border border-slate-250 bg-slate-50/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Contact Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. alex@example.co.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-250 bg-slate-50/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600 font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Street Address</label>
              <input
                type="text"
                required
                placeholder="e.g. 100 Clifton Street, Floor 2"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                className="w-full text-xs p-3 border border-slate-250 bg-slate-50/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600 font-semibold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Town / City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-250 bg-slate-50/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Postcode / Zip</label>
                <input
                  type="text"
                  required
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-250 bg-slate-50/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600 font-semibold uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-250 bg-slate-50/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600 font-bold text-slate-700 bg-white"
                >
                  <option value="United Kingdom">United Kingdom (UK)</option>
                  <option value="Ireland">Ireland</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                </select>
              </div>
            </div>

            {/* Delivery Speeds */}
            <div className="pt-2">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">Delivery Method</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div 
                  onClick={() => setDeliverySpeed('standard')}
                  className={`border rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                    deliverySpeed === 'standard' 
                      ? 'border-slate-800 bg-slate-50 ring-1 ring-slate-800' 
                      : 'border-slate-200 bg-white hover:border-slate-350'
                  }`}
                >
                  <div className="text-left">
                    <span className="font-extrabold text-xs block text-slate-800">Standard Pouch Mail</span>
                    <span className="text-[10px] text-slate-400">Arrives in 3-5 business days</span>
                  </div>
                  <span className="font-black text-xs text-slate-800">FREE</span>
                </div>

                <div 
                  onClick={() => setDeliverySpeed('priority')}
                  className={`border rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                    deliverySpeed === 'priority' 
                      ? 'border-slate-800 bg-slate-50 ring-1 ring-slate-800' 
                      : 'border-slate-200 bg-white hover:border-slate-350'
                  }`}
                >
                  <div className="text-left">
                    <span className="font-extrabold text-xs block text-slate-800">Worldpay Priority Tracked</span>
                    <span className="text-[10px] text-slate-400">Guaranteed 24-48h dispatched</span>
                  </div>
                  <span className="font-black text-xs text-indigo-600">
                    {totalAmount >= 40 ? 'FREE' : '£4.99'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Gateway Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-indigo-600" /> 2. Worldpay Secure Gateway Payment
              </h3>
              
              {/* Simulation selector */}
              <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100/50 rounded-lg p-1">
                <span className="text-[9px] font-extrabold text-indigo-700 uppercase tracking-widest pl-2 pr-1">Simulator Outcome:</span>
                <select
                  value={simulationMode}
                  onChange={(e) => setSimulationMode(e.target.value as any)}
                  className="text-[10px] font-bold text-indigo-800 bg-white border border-indigo-200/50 rounded px-2 py-1 focus:outline-none"
                >
                  <option value="SUCCESS">Approved (Auth Code)</option>
                  <option value="3DS_REQUIRED">Verify (Simulated 3DS)</option>
                  <option value="DECLINED">Declined Card (Insuff funds)</option>
                  <option value="GATEWAY_ERROR">Gateway Error (Timeout)</option>
                </select>
              </div>
            </div>

            {/* Simulated Interactive Card Preview */}
            <div className="flex justify-center py-2">
              <div className={`w-full max-w-sm h-48 rounded-2xl bg-gradient-to-br ${currentCardBrand.color} p-5 text-white flex flex-col justify-between shadow-xl relative overflow-hidden transition-all duration-500`}>
                {/* Glossmorphic specular reflections */}
                <div className="absolute top-0 right-0 h-40 w-48 bg-white/5 rounded-full blur-2xl transform translate-x-12 -translate-y-12" />
                <div className="absolute -bottom-10 left-12 h-32 w-32 bg-black/10 rounded-full blur-xl" />

                {/* Top strip */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black tracking-widest uppercase text-white/60">WORLD PAY TEST</span>
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[9px] font-bold text-emerald-400 font-mono tracking-widest uppercase">SANDBOX</span>
                    </div>
                  </div>
                  <span className="text-sm font-black font-mono bg-white/10 px-2.5 py-1 rounded-md backdrop-blur-md uppercase tracking-wider">
                    {currentCardBrand.logo}
                  </span>
                </div>

                {/* Micro chip image / graphic */}
                <div className="h-8 w-11 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 rounded-md border border-amber-600/30 flex flex-col justify-between p-1.5 opacity-85">
                  <div className="grid grid-cols-3 gap-0.5 h-full opacity-60">
                    <div className="border-r border-b border-black/20"></div>
                    <div className="border-r border-b border-black/20"></div>
                    <div className="border-b border-black/20"></div>
                    <div className="border-r border-black/20"></div>
                    <div className="border-r border-black/20"></div>
                    <div className=""></div>
                  </div>
                </div>

                {/* Card Number */}
                <div className="text-base sm:text-lg font-bold font-mono tracking-widest text-white text-center drop-shadow-md">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>

                {/* Card footer details */}
                <div className="flex justify-between items-end text-[10px] uppercase font-mono">
                  <div className="space-y-0.5 max-w-[200px] truncate text-left">
                    <span className="text-white/50 text-[7px] block">CARDHOLDER NAME</span>
                    <span className="font-extrabold tracking-wider">{cardHolder || 'ALEXANDER STERLING'}</span>
                  </div>

                  <div className="flex gap-4">
                    <div className="space-y-0.5 text-right">
                      <span className="text-white/50 text-[7px] block">EXPIRES</span>
                      <span className="font-extrabold tracking-wider">{expiry || 'MM/YY'}</span>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <span className="text-white/50 text-[7px] block">CVV</span>
                      <span className="font-extrabold tracking-wider">{cvv || '•••'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sandbox hint text */}
            <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-[10px] text-slate-500 font-bold space-y-1">
              <span className="text-slate-800 uppercase block tracking-wider font-extrabold">💡 Sandbox Testing Credentials:</span>
              <p>You can use standard sandbox dummy credentials to test transactions.</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 font-mono text-indigo-700">
                <span>Card Number: <strong className="text-slate-800">4444 3333 2222 1111</strong> (or any)</span>
                <span>CVV: <strong className="text-slate-800">123</strong></span>
                <span>Expiry: <strong className="text-slate-800">12/28</strong></span>
              </div>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handlePay} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Cardholder Name</label>
                <input
                  type="text"
                  required
                  placeholder="As written on card"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-250 bg-slate-50/30 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-600 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="4444 3333 2222 1111"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full text-xs p-3 border border-slate-250 bg-slate-50/30 rounded-xl pl-10 focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono font-bold"
                  />
                  <CreditCard className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Expiry Date</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={handleExpiryChange}
                    className="w-full text-xs p-3 border border-slate-250 bg-slate-50/30 rounded-xl text-center focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Card Security Code (CVV)</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    placeholder="e.g. 123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full text-xs p-3 border border-slate-250 bg-slate-50/30 rounded-xl text-center focus:outline-none focus:ring-1 focus:ring-indigo-600 font-mono font-bold"
                  />
                </div>
              </div>

              {paymentError && (
                <div className="flex gap-2 items-center bg-red-50 border border-red-150 p-3.5 rounded-xl text-xs font-bold text-red-650">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>{paymentError}</span>
                </div>
              )}

              {/* Secure Payment Trigger */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-300 text-white font-bold py-4 px-6 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                    <span>Processing Worldpay Gateway Auth...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 text-emerald-400" />
                    <span>Authorize Payment of £{finalTotal.toFixed(2)} GBP</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Secure developer terminal logs */}
          {showLogs && (
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-450 border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Terminal className="h-4 w-4" />
                  <span className="font-extrabold text-[10px] tracking-wider uppercase">Worldpay Real-time Dev API Logs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-500">LISTENING</span>
                  <button 
                    onClick={() => setApiLogs([])}
                    className="text-[9px] underline text-slate-450 hover:text-white cursor-pointer ml-2"
                  >
                    Clear console
                  </button>
                </div>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                {apiLogs.length === 0 ? (
                  <p className="text-slate-600 text-[10px] italic py-2">
                    &gt; Console silent. Submit a payment to inspect outbound gateway HTTP POST request &amp; JSON response telemetry stream...
                  </p>
                ) : (
                  apiLogs.map((log, i) => (
                    <div key={i} className="space-y-1 border-l-2 pl-3.5 border-slate-700/60">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className={`font-extrabold ${
                          log.type === 'REQUEST' ? 'text-blue-400' : log.type === 'RESPONSE' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          [{log.type}] {log.type === 'REQUEST' ? '➔ HTTP POST' : '✔ RESPONSE'}
                        </span>
                        <span className="text-slate-600 font-semibold">{log.timestamp}</span>
                      </div>
                      <pre className="text-[10px] text-slate-300 overflow-x-auto bg-slate-900/60 p-2 rounded-lg scrollbar-none font-mono">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Order summary basket review */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 sticky top-6">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-indigo-600" /> Order Summary Basket
            </h3>

            {/* Product items list */}
            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-2">
              {cartItems.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center gap-3.5 text-xs">
                  {item.productId && (item.productId.startsWith('sub-pack-') || item.productId.includes('sub-pack')) ? (
                    <SubscriptionIcon planName={item.productTitle} className="!w-12 !h-12 rounded-lg" />
                  ) : (
                    <img
                      src={item.image}
                      alt={item.productTitle}
                      className="w-12 h-12 object-cover rounded-lg bg-slate-50 border border-slate-100"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-slate-800 truncate text-[11px]">{item.productTitle}</h4>
                    <p className="text-slate-400 text-[10px] font-bold">Qty: {item.quantity} × £{item.price.toFixed(2)}</p>
                  </div>
                  <span className="font-black text-slate-800 text-[11px]">£{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Calculations review */}
            <div className="space-y-2 border-t border-slate-100 pt-3 text-xs leading-normal font-semibold">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal items</span>
                <span className="text-slate-800">£{totalAmount.toFixed(2)}</span>
              </div>

              {discountApplied && (
                <div className="flex justify-between text-emerald-600">
                  <span>Promo applied ({discountApplied.title})</span>
                  <span>-£{(totalAmount >= 40 ? totalAmount - totalAmount : 5).toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500">
                <span>Delivery postage ({deliverySpeed === 'priority' ? 'Priority Express' : 'Standard Mail'})</span>
                <span>{deliveryCost === 0 ? 'FREE' : `£${deliveryCost.toFixed(2)}`}</span>
              </div>

              <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-150">
                <span>Total amount to pay</span>
                <span className="text-base text-indigo-700">£{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Verified badge */}
            <div className="border-t border-slate-100 pt-3.5 flex justify-center gap-4 text-slate-400 font-bold text-[9px] uppercase tracking-wider">
              <span className="flex items-center gap-1"><Lock className="h-3 w-3 text-emerald-500" /> SSL Encrypted</span>
              <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-indigo-500" /> Worldpay Verified</span>
            </div>
          </div>

        </div>

      </div>

      {/* 3D SECURE (3DS) OVERLAY MODAL */}
      {show3dsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-slate-800 rounded-2xl max-w-md w-full p-6 text-center space-y-6 shadow-2xl relative">
            
            {/* Worldpay Verified Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="text-left">
                <span className="text-[10px] font-black tracking-widest uppercase text-indigo-600 block leading-none">Worldpay Gateway</span>
                <span className="text-[9px] font-bold text-slate-450">Verified by Visa / Mastercard ID Check</span>
              </div>
              <span className="bg-slate-100 text-slate-800 font-black px-2 py-0.5 rounded text-[8px] uppercase tracking-widest">TEST SECURE</span>
            </div>

            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600">
              <ShieldCheck className="h-7 w-7" />
            </div>

            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-slate-900 uppercase">3D Secure Card Verification</h4>
              <p className="text-[10.5px] text-slate-500 font-bold leading-relaxed">
                Please enter the One-Time Passcode (OTP) sent to the cardholder's mobile device ending in **83 to approve the card authorisation.
              </p>
            </div>

            {/* Quick credentials details table */}
            <div className="bg-slate-50 rounded-xl p-3 text-left text-[10px] space-y-1.5 font-semibold text-slate-600">
              <div className="flex justify-between">
                <span>Merchant:</span>
                <span className="font-bold text-slate-800">POUCH SUPPLY CO.</span>
              </div>
              <div className="flex justify-between">
                <span>Total Charge:</span>
                <span className="font-bold text-slate-800">£{finalTotal.toFixed(2)} GBP</span>
              </div>
              <div className="flex justify-between">
                <span>Secure Session ID:</span>
                <span className="font-mono text-slate-500">{threeDsTxId}</span>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 block">Enter One-Time Passcode</label>
                <input
                  type="text"
                  required
                  placeholder="Enter 1234 to authorize"
                  value={threeDsOtp}
                  onChange={(e) => setThreeDsOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center text-sm p-3 border border-slate-250 bg-slate-50/50 rounded-xl font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-600 placeholder:text-slate-300"
                />
              </div>

              {threeDsError && (
                <div className="flex gap-2 items-center text-[10px] font-bold text-red-650 bg-red-50 p-2.5 rounded-lg border border-red-150">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{threeDsError}</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShow3dsModal(false);
                    setPaymentError('3DS Authentication cancelled by client.');
                  }}
                  className="w-1/2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
                >
                  Cancel Auth
                </button>
                <button
                  type="button"
                  onClick={handleVerify3ds}
                  disabled={isProcessing}
                  className="w-1/2 bg-slate-900 hover:bg-black text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Submit Code</span>
                  )}
                </button>
              </div>

              <div className="pt-2 text-[9px] text-slate-400 font-bold leading-normal">
                🔐 Worldpay Sandbox Security verification check simulation.
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
