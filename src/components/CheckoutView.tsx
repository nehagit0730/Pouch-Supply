import React, { useState, useEffect } from 'react';
import { CartItem, Discount, Customer, Order } from '../types';
import { 
  ShieldCheck, ArrowLeft, CreditCard, Lock, Terminal, 
  CheckCircle, AlertTriangle, AlertCircle, RefreshCw, Send, HelpCircle, Truck, ShoppingCart,
  Camera, QrCode, UserCheck, Smartphone, Upload, Activity, Check, X
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
    storeCreditApplied?: number;
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
  const [applyStoreCredit, setApplyStoreCredit] = useState(false);
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
  const [paymentMethod, setPaymentMethod] = useState<'hosted' | 'direct'>('hosted');
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

  // Yoti Age Verification States
  const [yotiVerified, setYotiVerified] = useState<boolean>(() => {
    return sessionStorage.getItem('yoti_verified') === 'true';
  });
  const [yotiVerifyingDetails, setYotiVerifyingDetails] = useState<{
    method: 'ESTIMATION' | 'APP' | 'DOC';
    timestamp: string;
    token: string;
    estimatedAge?: number;
    docType?: string;
    name?: string;
  } | null>(() => {
    const saved = sessionStorage.getItem('yoti_details');
    return saved ? JSON.parse(saved) : null;
  });
  const [yotiActiveMethod, setYotiActiveMethod] = useState<'ESTIMATION' | 'APP' | 'DOC' | null>(null);
  const [yotiStep, setYotiStep] = useState<'select' | 'scanning' | 'details_extracted' | 'success'>('select');
  const [yotiSelfieFile, setYotiSelfieFile] = useState<string | null>(null);
  const [yotiDocFile, setYotiDocFile] = useState<string | null>(null);
  const [yotiDocType, setYotiDocType] = useState<'Passport' | 'Driving License' | 'Citizen Card'>('Passport');
  const [yotiScanningProgress, setYotiScanningProgress] = useState<number>(0);
  const [yotiAgeEstimate, setYotiAgeEstimate] = useState<number>(23);
  const [yotiExtractedName, setYotiExtractedName] = useState<string>('');
  const [yotiLocalStream, setYotiLocalStream] = useState<MediaStream | null>(null);

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

  // --- Yoti Age Verification Simulations ---

  // Camera integration for Facial Age Estimation
  useEffect(() => {
    if (yotiActiveMethod === 'ESTIMATION' && yotiStep === 'scanning') {
      let activeStream: MediaStream | null = null;
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(stream => {
          setYotiLocalStream(stream);
          activeStream = stream;
        })
        .catch(err => {
          console.warn("Camera hardware not available, using high-fidelity face mesh scan simulation:", err);
        });

      // Animate progress bar from 0 to 100
      setYotiScanningProgress(0);
      const interval = setInterval(() => {
        setYotiScanningProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // After scanning, transit to detail extraction approval screen
            setTimeout(() => {
              setYotiStep('details_extracted');
            }, 600);
            return 100;
          }
          return prev + 4;
        });
      }, 100);

      return () => {
        clearInterval(interval);
        if (activeStream) {
          activeStream.getTracks().forEach(track => track.stop());
        }
        setYotiLocalStream(null);
      };
    }
  }, [yotiActiveMethod, yotiStep]);

  // QR Code / Yoti App Verification simulation progress
  useEffect(() => {
    if (yotiActiveMethod === 'APP' && yotiStep === 'scanning') {
      setYotiScanningProgress(0);
      const interval = setInterval(() => {
        setYotiScanningProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 150);

      return () => clearInterval(interval);
    }
  }, [yotiActiveMethod, yotiStep]);

  // Document Scan Verification simulation progress
  useEffect(() => {
    if (yotiActiveMethod === 'DOC' && yotiStep === 'scanning') {
      setYotiScanningProgress(0);
      const interval = setInterval(() => {
        setYotiScanningProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setYotiExtractedName(fullName || 'Alexander Sterling');
              setYotiStep('details_extracted');
            }, 500);
            return 100;
          }
          return prev + 6;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [yotiActiveMethod, yotiStep]);

  // Handle finalize and save Yoti verification to session
  const handleConfirmYotiVerification = (estimatedAge: number, method: 'ESTIMATION' | 'APP' | 'DOC', optionalName?: string) => {
    const token = `yoti_v2_f${Math.floor(100000 + Math.random() * 900000)}_${method.toLowerCase()}`;
    const verificationObj = {
      method,
      timestamp: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString('en-GB'),
      token,
      estimatedAge,
      docType: method === 'DOC' ? yotiDocType : undefined,
      name: method === 'DOC' ? (optionalName || yotiExtractedName || fullName || 'Verified Pouch Client') : (fullName || 'Verified Pouch Client')
    };

    setYotiVerifyingDetails(verificationObj);
    setYotiVerified(true);
    setYotiStep('success');

    sessionStorage.setItem('yoti_verified', 'true');
    sessionStorage.setItem('yoti_details', JSON.stringify(verificationObj));
    
    // Also sync verification state with loggedInCustomer if they exist
    if (loggedInCustomer) {
      // Dispatch custom event to notify App.tsx if needed
      const event = new CustomEvent('yoti-status-updated', { detail: { verified: true, details: verificationObj } });
      window.dispatchEvent(event);
    }
  };

  // Reset/Reset verification (for simulation & admin clarity)
  const handleResetYotiVerification = () => {
    setYotiVerified(false);
    setYotiVerifyingDetails(null);
    setYotiActiveMethod(null);
    setYotiStep('select');
    setYotiScanningProgress(0);
    setYotiSelfieFile(null);
    setYotiDocFile(null);

    sessionStorage.removeItem('yoti_verified');
    sessionStorage.removeItem('yoti_details');

    const event = new CustomEvent('yoti-status-updated', { detail: { verified: false, details: null } });
    window.dispatchEvent(event);
  };

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
  const deliveryCost = discountApplied?.type === 'Free shipping' ? 0 : (deliverySpeed === 'priority' ? (totalAmount >= 40 ? 0 : 4.99) : 0);
  const finalTotal = totalAmount + deliveryCost;
  const storeCreditAvailable = loggedInCustomer?.storeCredit || 0;
  const storeCreditApplied = applyStoreCredit ? Math.min(storeCreditAvailable, finalTotal) : 0;
  const finalTotalToPay = Math.max(0, finalTotal - storeCreditApplied);

  // Process secure Worldpay request
  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !addressLine) {
      setPaymentError('Please fill in your shipping and contact information.');
      return;
    }

    if (!yotiVerified) {
      setPaymentError('Age Verification Required: Under tobacco & nicotine regulation, you must verify you are 18+ via Yoti before completing your order.');
      // Smooth scroll to Yoti block
      const element = document.getElementById('yoti-verification-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (finalTotalToPay === 0) {
      setIsProcessing(true);
      setPaymentError(null);
      setTimeout(() => {
        setIsProcessing(false);
        const generatedOrderId = `PS${Math.floor(Math.random() * 90000 + 10000)}`;
        const successData = {
          orderId: generatedOrderId,
          customerName: fullName,
          customerEmail: email,
          address: `${addressLine}, ${city}, ${postcode}, ${country}`,
          total: 0,
          discountApplied: discountApplied,
          items: cartItems.map(item => ({
            productId: item.productId,
            productTitle: item.productTitle,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          worldpayTxId: `WP-CREDIT-${Math.floor(Math.random() * 100000000)}`,
          worldpayAuthCode: 'CREDIT-AUTH',
          cardBrand: 'Store Credit',
          storeCreditApplied: storeCreditApplied
        };
        onCompleteCheckout(successData);
        setPaymentSuccessData(successData);
      }, 1000);
      return;
    }

    if (paymentMethod === 'hosted') {
      setIsProcessing(true);
      setPaymentError(null);

      // Generate a clean Order ID before creating the session
      const generatedOrderId = `PS${Math.floor(Math.random() * 90000 + 10000)}`;

      const requestPayload = {
        orderId: generatedOrderId,
        amount: finalTotalToPay.toFixed(2),
        currency: 'GBP',
        customerName: fullName,
        customerEmail: email,
        destination: `${addressLine}, ${city}, ${postcode}, ${country}`,
        cartItems: cartItems.map(item => ({
          productId: item.productId,
          productTitle: item.productTitle,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        }))
      };

      addLog('REQUEST', {
        endpoint: '/api/worldpay/session',
        method: 'POST',
        body: requestPayload
      });

      try {
        const response = await fetch('/api/worldpay/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestPayload)
        });

        const responseData = await response.json();

        if (!response.ok) {
          addLog('ERROR', {
            statusCode: response.status,
            error: responseData.error || 'Session Init Failed',
            message: 'Could not establish Worldpay Hosted Payment Session'
          });
          throw new Error(responseData.error || 'Failed to initialize session');
        }

        addLog('RESPONSE', responseData);

        // Successfully generated payment session! Now redirect to Worldpay hosted checkout
        setIsProcessing(false);
        
        // Perform SPA-friendly browser redirection to the payment gateway simulator
        if (responseData.redirectUrl) {
          window.history.pushState({}, '', responseData.redirectUrl);
          // Dispatch popstate event to trigger route transition in main App.tsx
          window.dispatchEvent(new Event('popstate'));
        }
      } catch (err: any) {
        setPaymentError(err.message || 'Payment session initialization failed.');
        setIsProcessing(false);
      }
      return;
    }

    // Direct card integration method
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
      amount: finalTotalToPay.toFixed(2),
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
        const orderId = `PS${Math.floor(Math.random() * 90000 + 10000)}`;
        onCompleteCheckout({
          orderId,
          customerName: fullName,
          customerEmail: email,
          address: `${addressLine}, ${city}, ${postcode}, ${country}`,
          total: finalTotalToPay,
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
          cardBrand: responseData.cardBrand,
          storeCreditApplied: storeCreditApplied
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
      amount: finalTotalToPay.toFixed(2),
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
      const orderId = `PS${Math.floor(Math.random() * 90000 + 10000)}`;
      onCompleteCheckout({
        orderId,
        customerName: fullName,
        customerEmail: email,
        address: `${addressLine}, ${city}, ${postcode}, ${country}`,
        total: finalTotalToPay,
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
        cardBrand: responseData.cardBrand,
        storeCreditApplied: storeCreditApplied
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

          {/* Yoti Age Verification Section */}
          <div id="yoti-verification-section" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <UserCheck className="h-4.5 w-4.5 text-indigo-600" /> 1.5. Yoti 18+ Age Verification
                </h3>
                <p className="text-slate-400 text-[10.5px] font-bold mt-1 leading-normal">
                  Under tobacco & nicotine regulation, you must verify you are 18+ before completing your order.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-1.5 bg-[#dfa047]/10 text-[#dfa047] border border-[#dfa047]/20 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                🛡️ Yoti Official
              </div>
            </div>

            {yotiVerified && yotiVerifyingDetails ? (
              /* Verification Success State */
              <div className="bg-emerald-50/40 border-2 border-emerald-500/30 p-5 rounded-2xl space-y-4 relative overflow-hidden">
                <div className="absolute right-[-10px] top-[-10px] w-14 h-14 bg-emerald-100/40 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-emerald-600" />
                </div>
                
                <div className="flex items-start gap-3.5">
                  <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800">Age Verified Successfully</h4>
                    <p className="text-[11px] text-slate-500 leading-normal font-bold">
                      Your identity and age (18+) have been securely validated via Yoti and locked to this checkout session.
                    </p>
                  </div>
                </div>

                {/* Verification Metadata table */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-white border border-emerald-100 rounded-xl p-3.5 text-[10px] font-semibold text-slate-600">
                  <div className="space-y-1">
                    <p className="text-slate-400 text-[8px] uppercase font-black">Method Used</p>
                    <p className="font-extrabold text-slate-800 flex items-center gap-1">
                      {yotiVerifyingDetails.method === 'ESTIMATION' ? 'Facial Age Estimation Scan' : yotiVerifyingDetails.method === 'APP' ? 'Yoti Smartphone App Sync' : 'ID Document Verification'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 text-[8px] uppercase font-black">Verified Client Name</p>
                    <p className="font-extrabold text-slate-800">{yotiVerifyingDetails.name || fullName || 'Verified Pouch Client'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 text-[8px] uppercase font-black">Verification Token</p>
                    <p className="font-mono text-indigo-600 text-[9px] select-all truncate">{yotiVerifyingDetails.token}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400 text-[8px] uppercase font-black">Timestamp</p>
                    <p className="font-extrabold text-slate-800">{yotiVerifyingDetails.timestamp}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-1">
                  <p className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5 shrink-0" /> Verified 18+ compliant under UK Tobacco Regulation.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetYotiVerification}
                    className="text-[9.5px] text-red-600 hover:text-red-700 font-black uppercase hover:underline bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    Reset & Re-Verify
                  </button>
                </div>
              </div>
            ) : (
              /* Pending Verification state */
              <div className="space-y-4">
                
                {yotiActiveMethod === null && (
                  /* Main verification type selection cards */
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    
                    {/* Method 1: Face Scan */}
                    <button
                      type="button"
                      onClick={() => {
                        setYotiActiveMethod('ESTIMATION');
                        setYotiStep('scanning');
                      }}
                      className="text-left border border-slate-200 hover:border-indigo-400 hover:shadow-md rounded-xl p-4 transition-all bg-slate-50/20 flex flex-col justify-between gap-3 group cursor-pointer"
                    >
                      <div className="space-y-2">
                        <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg inline-block group-hover:bg-indigo-100 transition-colors">
                          <Camera className="h-4.5 w-4.5" />
                        </span>
                        <div>
                          <h4 className="text-[11.5px] font-black uppercase tracking-wider text-slate-900">1. Face Selfie Scan</h4>
                          <p className="text-[10.5px] text-slate-500 font-medium leading-normal pt-1">
                            Use your webcam for an instant 3-second age estimation selfie check.
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-indigo-600 font-black uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Start selfie scan <span className="text-xs">➔</span>
                      </span>
                    </button>

                    {/* Method 2: Yoti App */}
                    <button
                      type="button"
                      onClick={() => {
                        setYotiActiveMethod('APP');
                        setYotiStep('scanning');
                      }}
                      className="text-left border border-slate-200 hover:border-indigo-400 hover:shadow-md rounded-xl p-4 transition-all bg-slate-50/20 flex flex-col justify-between gap-3 group cursor-pointer"
                    >
                      <div className="space-y-2">
                        <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg inline-block group-hover:bg-indigo-100 transition-colors">
                          <QrCode className="h-4.5 w-4.5" />
                        </span>
                        <div>
                          <h4 className="text-[11.5px] font-black uppercase tracking-wider text-slate-900">2. Yoti Mobile App</h4>
                          <p className="text-[10.5px] text-slate-500 font-medium leading-normal pt-1">
                            Scan a QR code using your Yoti app to share verified age details instantly.
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-indigo-600 font-black uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Scan QR code <span className="text-xs">➔</span>
                      </span>
                    </button>

                    {/* Method 3: Doc Upload */}
                    <button
                      type="button"
                      onClick={() => {
                        setYotiActiveMethod('DOC');
                        setYotiStep('select'); // Let user select document type first
                      }}
                      className="text-left border border-slate-200 hover:border-indigo-400 hover:shadow-md rounded-xl p-4 transition-all bg-slate-50/20 flex flex-col justify-between gap-3 group cursor-pointer"
                    >
                      <div className="space-y-2">
                        <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg inline-block group-hover:bg-indigo-100 transition-colors">
                          <Upload className="h-4.5 w-4.5" />
                        </span>
                        <div>
                          <h4 className="text-[11.5px] font-black uppercase tracking-wider text-slate-900">3. Identity Document</h4>
                          <p className="text-[10.5px] text-slate-500 font-medium leading-normal pt-1">
                            Upload your Passport, Driving License, or ID Card for OCR scanning.
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-indigo-600 font-black uppercase tracking-wider group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Upload ID document <span className="text-xs">➔</span>
                      </span>
                    </button>

                  </div>
                )}

                {/* ACTIVE VERIFICATION WORKFLOW DISPLAY */}
                {yotiActiveMethod !== null && (
                  <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/40 space-y-4">
                    
                    {/* Active Header with Go Back */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                        <span className="text-[10px] font-black uppercase text-indigo-800 tracking-wider">
                          {yotiActiveMethod === 'ESTIMATION' && 'Facial Age Estimation'}
                          {yotiActiveMethod === 'APP' && 'Yoti App QR Verification'}
                          {yotiActiveMethod === 'DOC' && 'ID Document Upload Verification'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetYotiVerification}
                        className="text-[9.5px] text-slate-500 hover:text-slate-800 font-black uppercase flex items-center gap-1 cursor-pointer hover:underline"
                      >
                        ✕ Cancel & Choose Other
                      </button>
                    </div>

                    {/* METHOD 1: FACIAL AGE ESTIMATION DETAILS */}
                    {yotiActiveMethod === 'ESTIMATION' && (
                      <div className="space-y-4">
                        {yotiStep === 'scanning' && (
                          <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
                            
                            {/* Webcam/Scanner Box */}
                            <div className="relative w-48 h-48 rounded-full border-4 border-dashed border-indigo-500/80 overflow-hidden bg-slate-900 flex items-center justify-center shadow-inner">
                              
                              {/* Video live feedback or animated face placeholder */}
                              {yotiLocalStream ? (
                                <video
                                  ref={video => { if (video && yotiLocalStream) { video.srcObject = yotiLocalStream; } }}
                                  autoPlay
                                  playsInline
                                  muted
                                  className="absolute inset-0 w-full h-full object-cover rounded-full"
                                />
                              ) : (
                                <div className="text-slate-500 text-center space-y-2">
                                  <Camera className="h-10 w-10 mx-auto text-slate-400 animate-pulse" />
                                  <span className="text-[9px] font-bold block uppercase text-slate-400 px-3">Initializing Camera...</span>
                                </div>
                              )}

                              {/* Scanning visual overlay bar */}
                              <div className="absolute inset-x-0 h-1.5 bg-indigo-400 opacity-75 shadow-[0_0_8px_rgba(129,140,248,0.8)] animate-[bounce_2s_infinite]" style={{ top: `${yotiScanningProgress}%` }} />
                              
                              {/* Scan targets */}
                              <div className="absolute inset-8 border border-white/20 rounded-full pointer-events-none border-dashed" />
                            </div>

                            <div className="space-y-1">
                              <p className="text-xs font-black uppercase text-slate-800">Yoti Facial Analyzer Scan in progress...</p>
                              <p className="text-[10px] text-slate-400 font-semibold leading-normal max-w-sm">
                                Please look directly into your camera. Yoti is checking biometric age markers. No images are recorded or saved.
                              </p>
                            </div>

                            {/* Progress bar container */}
                            <div className="w-full max-w-xs space-y-1.5">
                              <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-slate-500">
                                <span>Scanning Face Mesh</span>
                                <span>{yotiScanningProgress}%</span>
                              </div>
                              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-indigo-600 h-full transition-all duration-100" style={{ width: `${yotiScanningProgress}%` }} />
                              </div>
                            </div>
                          </div>
                        )}

                        {yotiStep === 'details_extracted' && (
                          <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-3.5 text-center">
                            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100 text-emerald-700">
                              <UserCheck className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                              <h5 className="text-xs font-black uppercase tracking-wide text-indigo-900">Estimation Complete</h5>
                              <p className="text-[11px] text-slate-600 font-bold max-w-sm mx-auto">
                                The biometric scan successfully verified your age. You are estimated to be <strong className="text-slate-900 font-black">{yotiAgeEstimate} Years Old</strong> (Age 18+ Threshold Passed).
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleConfirmYotiVerification(yotiAgeEstimate, 'ESTIMATION')}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl cursor-pointer shadow-sm transition-colors"
                            >
                              Confirm & Approve Verification
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* METHOD 2: YOTI APP VERIFICATION */}
                    {yotiActiveMethod === 'APP' && (
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row items-center gap-5 p-4">
                          
                          {/* Pixelated mock QR code */}
                          <div className="bg-white p-3 border border-slate-200 rounded-xl shrink-0 shadow-sm relative">
                            <div className="w-28 h-28 grid grid-cols-4 gap-1.5 opacity-85">
                              {Array.from({ length: 16 }).map((_, i) => {
                                const isCorner = i === 0 || i === 3 || i === 12 || i === 15;
                                return (
                                  <div
                                    key={i}
                                    className={`rounded ${
                                      isCorner 
                                        ? 'bg-slate-900 border-4 border-slate-350' 
                                        : Math.random() > 0.4 ? 'bg-slate-900' : 'bg-slate-100'
                                    }`}
                                  />
                                );
                              })}
                            </div>
                            {/* Scanning indicator */}
                            <div className="absolute inset-x-2 h-0.5 bg-indigo-500 opacity-60 animate-bounce" style={{ top: '50%' }} />
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="space-y-1.5 text-left">
                              <h5 className="text-xs font-black uppercase text-slate-900">1. Scan QR Code on your Phone</h5>
                              <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                                Open the Yoti app on your mobile device, press the "Scan QR" button, and aim your camera at this QR code.
                              </p>
                            </div>

                            <div className="space-y-2 bg-slate-100 p-3 rounded-lg text-left">
                              <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 uppercase">
                                <span>Awaiting smartphone handshake...</span>
                                <span>{yotiScanningProgress}%</span>
                              </div>
                              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-indigo-600 h-full transition-all duration-150" style={{ width: `${yotiScanningProgress}%` }} />
                              </div>
                            </div>

                            <div className="pt-1 text-left flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleConfirmYotiVerification(25, 'APP')}
                                className="bg-slate-900 hover:bg-black text-white font-black text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-lg cursor-pointer transition-colors"
                              >
                                Simulate App Consent Approve
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* METHOD 3: IDENTITY DOCUMENT UPLOAD */}
                    {yotiActiveMethod === 'DOC' && (
                      <div className="space-y-4">
                        {yotiStep === 'select' && (
                          <div className="space-y-4">
                            <div className="space-y-1.5">
                              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Select Identity Document Type</label>
                              <div className="grid grid-cols-3 gap-2.5">
                                {(['Passport', 'Driving License', 'Citizen Card'] as const).map((doc) => (
                                  <button
                                    type="button"
                                    key={doc}
                                    onClick={() => setYotiDocType(doc)}
                                    className={`py-2 px-3 text-[10px] font-bold uppercase border rounded-lg transition-all ${
                                      yotiDocType === doc 
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-black' 
                                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                    }`}
                                  >
                                    {doc === 'Passport' ? '✈️ ' : doc === 'Driving License' ? '🚗 ' : '🆔 '} {doc}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-slate-250 bg-white hover:bg-slate-50 rounded-xl p-6 text-center space-y-3 transition-colors relative cursor-pointer">
                              <Upload className="h-7 w-7 text-slate-400 mx-auto" />
                              <div className="space-y-1">
                                <p className="text-xs font-black text-slate-800 uppercase">Upload or Drag Front of your {yotiDocType}</p>
                                <p className="text-[9.5px] text-slate-400 font-semibold">Supports PNG, JPG, PDF up to 8MB. Must clearly show name and date of birth.</p>
                              </div>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  setYotiStep('scanning');
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase px-4 py-2 rounded-lg transition-colors cursor-pointer inline-block"
                              >
                                Simulate ID Scan & Upload
                              </button>
                            </div>
                          </div>
                        )}

                        {yotiStep === 'scanning' && (
                          <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center">
                            <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
                            <div className="space-y-1">
                              <p className="text-xs font-black uppercase text-slate-800">Yoti OCR Document Scanning...</p>
                              <p className="text-[10px] text-slate-400 font-semibold leading-normal max-w-sm">
                                Verifying security watermarks and extracting birth details from your {yotiDocType}.
                              </p>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full max-w-xs space-y-1.5">
                              <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-slate-500">
                                <span>Scanning {yotiDocType}</span>
                                <span>{yotiScanningProgress}%</span>
                              </div>
                              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-indigo-600 h-full transition-all duration-100" style={{ width: `${yotiScanningProgress}%` }} />
                              </div>
                            </div>
                          </div>
                        )}

                        {yotiStep === 'details_extracted' && (
                          <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3.5">
                            <div className="flex items-center gap-3">
                              <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
                                <UserCheck className="h-4 w-4" />
                              </span>
                              <div>
                                <h5 className="text-[11px] font-black uppercase text-slate-900">Extracted Document Data</h5>
                                <p className="text-[9.5px] text-slate-400 font-semibold">Please review and confirm to proceed.</p>
                              </div>
                            </div>

                            <div className="space-y-3 border-t border-slate-100 pt-3">
                              <div className="space-y-1">
                                <label className="text-[8.5px] font-black uppercase tracking-wider text-slate-400 block">Extracted Full Name</label>
                                <input
                                  type="text"
                                  value={yotiExtractedName}
                                  onChange={(e) => setYotiExtractedName(e.target.value)}
                                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg font-bold bg-slate-50/50"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-3.5 text-[10px] font-semibold text-slate-600">
                                <div className="space-y-0.5">
                                  <p className="text-slate-400 text-[8px] uppercase font-black">Document Type</p>
                                  <p className="font-extrabold text-slate-800">{yotiDocType}</p>
                                </div>
                                <div className="space-y-0.5">
                                  <p className="text-slate-400 text-[8px] uppercase font-black">Age Status</p>
                                  <p className="font-black text-emerald-600 uppercase flex items-center gap-1">✓ Over 18 Verified</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-3 pt-1 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setYotiStep('select');
                                }}
                                className="w-1/2 text-[10px] border border-slate-200 hover:bg-slate-50 text-slate-500 font-black uppercase py-2 rounded-lg transition-colors cursor-pointer"
                              >
                                Scan Different ID
                              </button>
                              <button
                                type="button"
                                onClick={() => handleConfirmYotiVerification(28, 'DOC', yotiExtractedName)}
                                className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase py-2 rounded-lg transition-colors cursor-pointer text-center"
                              >
                                Approve & Save Data
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )}

              </div>
            )}
          </div>

          {/* Payment Gateway Form */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-indigo-600" /> 2. Worldpay Secure Gateway Payment
              </h3>
              
              {/* Simulation selector (only relevant for direct or simulation mode testing) */}
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

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setPaymentMethod('hosted')}
                className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  paymentMethod === 'hosted'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🔒 Hosted Redirect (Safe)
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('direct')}
                className={`py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  paymentMethod === 'direct'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                💳 Direct Card (Inline)
              </button>
            </div>

            {paymentMethod === 'hosted' ? (
              /* HOSTED CHECOUT GRAPHIC */
              <div className="border border-indigo-100 bg-indigo-50/40 rounded-2xl p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shadow-inner">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-850">Worldpay Hosted Checkout</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed max-w-md mx-auto">
                    You will be securely redirected to the official Worldpay Sandbox Payment Gateway to finalize your transaction. Your card details are processed entirely in Worldpay's isolated vault (PCI-DSS Compliant).
                  </p>
                </div>
                <div className="flex justify-center gap-6 text-[10px] text-slate-400 font-extrabold uppercase">
                  <span>✓ 256-bit SSL</span>
                  <span>✓ 3D Secure 2.0</span>
                  <span>✓ PCI Level 1</span>
                </div>
              </div>
            ) : (
              /* DIRECT CARD FORM PARTS */
              <>
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
              </>
            )}

            {/* Form Inputs */}
            <form onSubmit={handlePay} className="space-y-4">
              {paymentMethod === 'direct' && finalTotalToPay > 0 && (
                <>
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
                </>
              )}

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
                    <span>Processing Secure Gateway Auth...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 text-emerald-400" />
                    <span>
                      {finalTotalToPay === 0
                        ? `Complete Order using Store Credit (£0.00 to Pay)`
                        : paymentMethod === 'hosted'
                          ? `Redirect to Worldpay Checkout (£${finalTotalToPay.toFixed(2)})`
                          : `Authorize Payment of £${finalTotalToPay.toFixed(2)} GBP`}
                    </span>
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
                    <h4 className="font-extrabold text-slate-800 text-[11px]">{item.productTitle}</h4>
                    <p className="text-slate-400 text-[10px] font-bold">Qty: {item.quantity} × £{item.price.toFixed(2)}</p>
                  </div>
                  <span className="font-black text-slate-800 text-[11px]">£{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Store Credit application checkbox */}
            {loggedInCustomer && loggedInCustomer.storeCredit !== undefined && loggedInCustomer.storeCredit > 0 && (
              <div className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-2xl text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      id="apply-store-credit-checkout"
                      checked={applyStoreCredit}
                      onChange={(e) => setApplyStoreCredit(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4.5 w-4.5 cursor-pointer"
                    />
                    <label htmlFor="apply-store-credit-checkout" className="font-extrabold text-[#071d37] cursor-pointer select-none">
                      Apply Store Credit (£{loggedInCustomer.storeCredit.toFixed(2)} Available)
                    </label>
                  </div>
                </div>
                {applyStoreCredit && (
                  <p className="text-[10.5px] text-emerald-700 mt-2 font-medium leading-relaxed">
                    Applying £{Math.min(loggedInCustomer.storeCredit, finalTotal).toFixed(2)} Store Credit deduction to order total.
                  </p>
                )}
              </div>
            )}

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

              {applyStoreCredit && storeCreditApplied > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Store Credit Applied</span>
                  <span>-£{storeCreditApplied.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-150">
                <span>Total amount to pay</span>
                <span className="text-base text-indigo-700 font-black">£{finalTotalToPay.toFixed(2)}</span>
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
