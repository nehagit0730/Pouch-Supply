import React, { useState } from 'react';
import { Customer, Product, Order } from '../types';
import { User, LogIn, Heart, PlusCircle, Trash2, MapPin, Package, ShoppingBag, Eye, X } from 'lucide-react';

interface CustomerAccountProps {
  customers: Customer[];
  loggedInCustomer: Customer | null;
  onLogin: (customer: Customer) => void;
  onLogout: () => void;
  onUpdateWishlist: (productId: string, action: 'add' | 'remove') => void;
  allProducts: Product[];
  orders: Order[];
  onAddAddress: (address: string) => void;
  onRemoveAddress: (index: number) => void;
}

export default function CustomerAccount({
  customers,
  loggedInCustomer,
  onLogin,
  onLogout,
  onUpdateWishlist,
  allProducts,
  orders,
  onAddAddress,
  onRemoveAddress
}: CustomerAccountProps) {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMsg('Please enter an email.');
      return;
    }
    // Simple look up, dynamic login based on exist or new
    let found = customers.find(c => c.email.toLowerCase() === emailInput.toLowerCase().trim());
    if (!found) {
      // Create a new mock account
      const mockName = emailInput.split('@')[0];
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        name: mockName.charAt(0).toUpperCase() + mockName.slice(1),
        email: emailInput.toLowerCase().trim(),
        subscriptionStatus: 'Not subscribed',
        location: 'United States',
        ordersCount: 0,
        amountSpent: 0,
        addresses: ['100 Main Street, New York, NY, 10001'],
        wishlist: []
      };
      // For instant response, simulate adding them in
      onLogin(newCust);
      setErrorMsg('');
    } else {
      onLogin(found);
      setErrorMsg('');
    }
  };

  const myOrders = loggedInCustomer 
    ? orders.filter(o => o.customerEmail.toLowerCase() === loggedInCustomer.email.toLowerCase()) 
    : [];

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    onAddAddress(newAddress.trim());
    setNewAddress('');
    setShowAddressModal(false);
  };

  // If not logged in, show Login Screen
  if (!loggedInCustomer) {
    return (
      <div id="login-container" className="max-w-md mx-auto my-12 p-8 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full">
            <User className="h-8 w-8" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">Customer Login</h2>
        <p className="text-slate-500 text-sm text-center mb-6">
          Sign in to view your orders, manage shipping addresses, and access your personal wishlist.
        </p>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Email Address / Account Name
            </label>
            <input
              id="cust-login-email"
              type="email"
              placeholder="kayla.canty@yahoo.com (Demo User)"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full text-sm border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              id="cust-login-pass"
              type="password"
              placeholder="••••••••"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full text-sm border border-slate-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-500 font-medium">{errorMsg}</p>
          )}

          <button
            id="cust-login-btn"
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            <LogIn className="h-4 w-4" /> Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center bg-slate-50 p-4 rounded-lg">
          <p className="text-xs text-slate-500 mb-2 font-medium">Quick Sign-in suggestions (from active customers):</p>
          <div className="flex flex-wrap justify-center gap-2">
            {customers.slice(0, 3).map((cust) => (
              <button
                key={cust.id}
                onClick={() => {
                  setEmailInput(cust.email);
                  setPasswordInput('password123');
                }}
                className="text-xs hover:border-slate-400 bg-white border border-slate-200 text-slate-700 py-1 px-2.5 rounded-md font-medium cursor-pointer"
              >
                {cust.name} ({cust.email.split('@')[0]})
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Logged-in view
  return (
    <div id="account-page-wrapper" className="max-w-6xl mx-auto px-4 py-8">
      {/* Account welcome header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 text-white p-6 md:p-8 rounded-2xl mb-8">
        <div>
          <span className="text-xs text-indigo-300 font-semibold uppercase tracking-wider">Welcome back</span>
          <h1 className="text-2xl md:text-3xl font-bold mt-1 text-white">{loggedInCustomer.name}</h1>
          <p className="text-slate-400 text-sm mt-1">{loggedInCustomer.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs bg-slate-800 border border-slate-700 text-slate-300 py-1 px-3 rounded-full">
            Plan: {loggedInCustomer.subscriptionStatus}
          </div>
          <button
            id="cust-logout-btn"
            onClick={onLogout}
            className="text-xs bg-red-950/40 hover:bg-red-900/50 text-red-300 font-medium py-2 px-4 rounded-full border border-red-800/40 cursor-pointer transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Wishlist Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
              My Wishlist ({loggedInCustomer.wishlist.length})
            </h2>

            {loggedInCustomer.wishlist.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                <p className="text-sm text-slate-400">Your wishlist is currently empty.</p>
                <p className="text-xs text-slate-400 mt-1">Explore our product catalog and click the heart icon on your favorite items.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {loggedInCustomer.wishlist.map(wId => {
                  const prod = allProducts.find(p => p.id === wId);
                  if (!prod) return null;
                  return (
                    <div key={prod.id} className="flex gap-3 bg-slate-50 border border-slate-200/60 p-3 rounded-lg relative hover:shadow-sm transition-all">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-16 h-16 object-cover rounded-md bg-white border border-slate-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">{prod.vendor}</span>
                        <h4 className="text-xs font-semibold text-slate-700 truncate mb-1">{prod.title}</h4>
                        <p className="text-xs font-bold text-slate-900">£{prod.price.toFixed(2)}</p>
                        
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => onUpdateWishlist(prod.id, 'remove')}
                            className="text-[10px] text-red-500 hover:text-red-700 font-medium flex items-center gap-1 bg-white hover:bg-red-50/50 py-1 px-1.5 rounded border border-slate-200 shadow-xs cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Orders Column */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-indigo-600" />
              Order History ({myOrders.length})
            </h2>

            {myOrders.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-lg">
                <p className="text-sm text-slate-400">You haven't placed any orders yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.map(order => (
                  <div key={order.id} className="border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800">{order.id}</span>
                        <span className={`text-[10px] font-semibold py-0.5 px-2 rounded-full uppercase tracking-wider ${
                          order.fulfillmentStatus === 'Fulfilled' || order.fulfillmentStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {order.fulfillmentStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{order.date} • {order.items.reduce((acc, i) => acc + i.quantity, 0)} pouch canisters</p>
                      <p className="text-xs text-slate-700">Destination: <span className="font-medium">{order.destination}</span></p>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <span className="text-sm font-extrabold text-slate-900">£{order.total.toFixed(2)}</span>
                      <button
                        onClick={() => setSelectedOrderDetails(order)}
                        className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 py-1.5 px-3 rounded-lg text-slate-600 hover:text-slate-900 font-medium mt-1 flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="h-3 w-3" /> View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Addresses list and defaults */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                Shipping Addresses
              </h3>
              <button
                onClick={() => setShowAddressModal(true)}
                className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Add
              </button>
            </div>

            {loggedInCustomer.addresses.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No addresses saved. Add one above.</p>
            ) : (
              <div className="space-y-3">
                {loggedInCustomer.addresses.map((addr, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-lg relative group">
                    <span className="absolute top-2.5 right-2.5 bg-slate-200 text-slate-600 text-[9px] font-bold py-0.5 px-2 rounded-md">
                      {idx === 0 ? 'Primary' : 'Secondary'}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium pr-14">{addr}</p>
                    {idx > 0 && (
                      <button
                        onClick={() => onRemoveAddress(idx)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium mt-2 flex items-center gap-0.5 cursor-pointer"
                      >
                        Delete Address
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick shop instructions banner */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
            <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <ShoppingBag className="h-3.5 w-3.5" />
              Easy Subscription
            </h4>
            <p className="text-xs text-indigo-700 leading-relaxed">
              Subscribing is easy and saves you 15% on any customized pack. Check our **Subscribe builder** to configure your next pack.
            </p>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-xl border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Order Details: {selectedOrderDetails.id}</h3>
                <p className="text-xs text-slate-400">{selectedOrderDetails.date}</p>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Customer info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <span className="font-semibold text-slate-400 uppercase tracking-widest text-[9px] block mb-1">Customer info</span>
                  <p className="font-bold text-slate-700">{selectedOrderDetails.customerName}</p>
                  <p className="text-slate-500">{selectedOrderDetails.customerEmail}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <span className="font-semibold text-slate-400 uppercase tracking-widest text-[9px] block mb-1">Delivery destination</span>
                  <p className="font-medium text-slate-700 leading-relaxed">{selectedOrderDetails.destination}</p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Items list</h4>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
                  {selectedOrderDetails.items.map((item, id) => {
                    // find a valid product image or fallback
                    const mainImage = allProducts.find(p => p.id === item.productId)?.image || item.image || '';
                    return (
                      <div key={id} className="flex gap-3 items-center justify-between p-3 bg-white text-xs">
                        <div className="flex gap-2 items-center min-w-0">
                          {mainImage && (
                            <img src={mainImage} className="w-10 h-10 object-cover rounded bg-slate-50" alt="" referrerPolicy="no-referrer" />
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-700 truncate">{item.productTitle}</p>
                            <p className="text-slate-400 text-[11px]">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold text-slate-800">£{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Shipping ({selectedOrderDetails.deliveryMethod})</span>
                  <span className="font-medium text-slate-700">Free</span>
                </div>
                <div className="flex justify-between text-slate-800 text-sm font-extrabold pt-2 border-t border-slate-100">
                  <span>Total amount</span>
                  <span>£{selectedOrderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save address modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-lg border border-slate-200">
            <h3 className="font-bold text-slate-800 text-sm mb-3">Add Custom Shipping Address</h3>
            <form onSubmit={handleAddAddressSubmit} className="space-y-4">
              <input
                id="address-modal-input"
                type="text"
                placeholder="Apartment, Street Name, City, Zip, US"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 py-1.5 px-3 rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-3 rounded-lg font-medium cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
