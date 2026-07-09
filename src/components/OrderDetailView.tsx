import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Package, 
  CreditCard, 
  Pencil, 
  MapPin, 
  Shield, 
  Smile, 
  Paperclip, 
  Calendar, 
  MoreHorizontal, 
  ChevronDown, 
  Check, 
  Eye, 
  Trash2,
  Info
} from 'lucide-react';
import { Order, Customer, Product } from '../types';

interface OrderDetailViewProps {
  order: Order;
  onClose: () => void;
  allOrders: Order[];
  onUpdateOrders: (newOrders: Order[]) => void;
  customers: Customer[];
  onUpdateCustomers: (newCusts: Customer[]) => void;
  products: Product[];
}

interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  date: string;
  content?: string;
  isComment?: boolean;
}

export default function OrderDetailView({
  order,
  onClose,
  allOrders,
  onUpdateOrders,
  customers,
  onUpdateCustomers,
  products
}: OrderDetailViewProps) {
  // Tracking Modal State
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingNo, setTrackingNo] = useState(order.trackingId || '');
  const [carrier, setCarrier] = useState(order.carrier || 'Royal Mail');

  // Edit Notes state
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [noteText, setNoteText] = useState(order.tags.find(t => t.startsWith('Note:'))?.replace('Note:', '') || 'No notes from customer');

  // Dropdown states
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Timeline comments
  const [commentText, setCommentText] = useState('');
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);

  // Find index of current order for prev/next navigation
  const currentIndex = allOrders.findIndex(o => o.id === order.id);

  // Initialize timeline events for this order
  useEffect(() => {
    // Check if we have timeline events stored in local storage for this order ID, or use defaults
    const cacheKey = `ps_order_timeline_${order.id}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setTimelineEvents(JSON.parse(cached));
        return;
      } catch (e) {
        console.error('Error parsing cached timeline:', e);
      }
    }

    // Default timeline events
    const defaults: TimelineEvent[] = [
      {
        id: '1',
        type: 'placed',
        title: 'Order placed',
        date: order.date,
        content: `Customer placed this order with total amount of £${order.total.toFixed(2)}.`
      },
      {
        id: '2',
        type: 'email',
        title: `Order confirmation email sent to ${order.customerEmail}`,
        date: order.date,
        content: 'System dispatched purchase receipt copy automatically.'
      }
    ];

    if (order.fulfillmentStatus === 'Fulfilled' || order.fulfillmentStatus === 'Delivered') {
      defaults.push({
        id: '3',
        type: 'fulfilled',
        title: `You fulfilled ${order.items.reduce((sum, i) => sum + i.quantity, 0)} item from Pouch Supply Hub, London MC`,
        date: order.date,
        content: `Tracking number: ${order.trackingId || 'Pending'} (${order.carrier || 'Royal Mail'})`
      });
    }

    if (order.fulfillmentStatus === 'Delivered') {
      defaults.push({
        id: '4',
        type: 'delivered',
        title: 'Package delivered to destination address',
        date: order.date,
        content: 'Item marked as successfully delivered.'
      });
    }

    setTimelineEvents(defaults);
    localStorage.setItem(cacheKey, JSON.stringify(defaults));
  }, [order]);

  // Save timeline helper
  const saveTimeline = (newEvents: TimelineEvent[]) => {
    setTimelineEvents(newEvents);
    localStorage.setItem(`ps_order_timeline_${order.id}`, JSON.stringify(newEvents));
  };

  // Navigate between orders
  const handleNavigate = (direction: 'prev' | 'next') => {
    const targetIdx = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (targetIdx >= 0 && targetIdx < allOrders.length) {
      const targetOrder = allOrders[targetIdx];
      // Close and trigger callback to select next order if handled in parent,
      // or we can simulate selection by calling parent's selection state modifier.
      // But we can trigger click on the corresponding order or update selection if passed down.
      // For best safety, we let parent know or just close and reopen.
      // We will look up if we can find a clean way, otherwise we show the controls as visual guides or we trigger order switch.
      const orderBtn = document.querySelector(`[data-order-id="${targetOrder.id}"]`) as HTMLButtonElement;
      if (orderBtn) {
        onClose();
        setTimeout(() => {
          orderBtn.click();
        }, 50);
      }
    }
  };

  // Find product image
  const getProductImage = (productId: string, defaultImg?: string) => {
    const found = products.find(p => p.id === productId);
    return found?.image || defaultImg || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=200';
  };

  // Add Comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newEvent: TimelineEvent = {
      id: `comment-${Date.now()}`,
      type: 'comment',
      title: 'NB (You)',
      date: 'Just now',
      content: commentText.trim(),
      isComment: true
    };

    const updated = [newEvent, ...timelineEvents];
    saveTimeline(updated);
    setCommentText('');

    // Update orders tags or timeline references if needed
    // Simulate timeline logs
    const event = new CustomEvent('ps-timeline-comment-added', { detail: { orderId: order.id, comment: commentText.trim() } });
    window.dispatchEvent(event);
  };

  // Update notes
  const handleSaveNotes = () => {
    const updatedTags = order.tags.filter(t => !t.startsWith('Note:'));
    if (noteText.trim() && noteText !== 'No notes from customer') {
      updatedTags.push(`Note:${noteText.trim()}`);
    }

    const updatedOrders = allOrders.map(o => {
      if (o.id === order.id) {
        return { ...o, tags: updatedTags };
      }
      return o;
    });
    onUpdateOrders(updatedOrders);
    setIsEditingNotes(false);

    // Add timeline comment
    const newEvent: TimelineEvent = {
      id: `note-update-${Date.now()}`,
      type: 'edit',
      title: 'You updated the notes for this order.',
      date: 'Just now',
      content: noteText.trim()
    };
    saveTimeline([newEvent, ...timelineEvents]);
  };

  // Update Fulfillment Status
  const handleUpdateFulfillment = (newStatus: 'Unfulfilled' | 'Fulfilled' | 'Delivered') => {
    const updatedOrders = allOrders.map(o => {
      if (o.id === order.id) {
        return { ...o, fulfillmentStatus: newStatus };
      }
      return o;
    });
    onUpdateOrders(updatedOrders);

    const newEvent: TimelineEvent = {
      id: `fulfillment-change-${Date.now()}`,
      type: 'fulfillment',
      title: `Order fulfillment status updated to ${newStatus}`,
      date: 'Just now',
      content: `The fulfillment state was changed by administrator.`
    };
    saveTimeline([newEvent, ...timelineEvents]);
  };

  // Save Tracking number
  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNo.trim()) return;

    const updatedOrders = allOrders.map(o => {
      if (o.id === order.id) {
        return { 
          ...o, 
          trackingId: trackingNo.trim(),
          carrier: carrier,
          fulfillmentStatus: 'Fulfilled' as const
        };
      }
      return o;
    });

    onUpdateOrders(updatedOrders);

    const newEvent: TimelineEvent = {
      id: `tracking-added-${Date.now()}`,
      type: 'fulfillment',
      title: `You added tracking number ${trackingNo.trim()} with carrier ${carrier}`,
      date: 'Just now',
      content: 'Email notification copy sent to customer automatically.'
    };
    saveTimeline([newEvent, ...timelineEvents]);

    // Simulate Email to customer
    const newEmail = {
      to: order.customerEmail,
      subject: `Shipment Update - Order #${order.id} - Pouch Supply`,
      preview: `Your shipment with ${carrier} reference ${trackingNo.trim()} is now Fulfilled and In Transit.`,
      body: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff; color: #334155;">
          <div style="background-color: #0f172a; padding: 40px 32px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800; tracking: -0.025em;">POUCH SUPPLY</h1>
            <p style="margin: 8px 0 0 0; font-size: 13px; color: #94a3b8; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Shipment Dispatched</p>
          </div>
          <div style="padding: 32px; text-align: left;">
            <p style="font-size: 15px; color: #1e293b; font-weight: bold; margin-top: 0;">Good news, ${order.customerName}!</p>
            <p style="font-size: 14px; color: #475569; line-height: 1.6;">
              Your order <strong>#${order.id}</strong> has been assembled, packed, and securely transferred to our postal partner <strong>${carrier}</strong>.
            </p>
            <div style="background-color: #f1f5f9; border-radius: 12px; padding: 18px; margin: 24px 0;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="font-size: 12px; color: #64748b; padding-bottom: 4px;">Carrier</td>
                  <td style="font-size: 12px; color: #64748b; padding-bottom: 4px; text-align: right;">Tracking Reference</td>
                </tr>
                <tr>
                  <td style="font-size: 15px; color: #0f172a; font-weight: bold;">${carrier}</td>
                  <td style="font-size: 15px; color: #0f172a; font-weight: bold; text-align: right; font-family: monospace;">${trackingNo.trim()}</td>
                </tr>
              </table>
            </div>
            <p style="font-size: 13.5px; color: #475569; line-height: 1.6;">
              You can track your parcel's shipping lifecycle directly through our tracking system or via the official carrier track portal.
            </p>
          </div>
          <div style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b;">
            © Pouch Supply. London MC. Support@pouch-supply.com
          </div>
        </div>
      `,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    try {
      const stored = localStorage.getItem('ps_simulated_emails');
      const emails = stored ? JSON.parse(stored) : [];
      localStorage.setItem('ps_simulated_emails', JSON.stringify([newEmail, ...emails]));
      window.dispatchEvent(new CustomEvent('ps-emails-updated'));
    } catch (err) {
      console.error(err);
    }

    setShowTrackingModal(false);
  };

  // Refund Action
  const handleRefund = () => {
    const updatedOrders = allOrders.map(o => {
      if (o.id === order.id) {
        return { ...o, paymentStatus: 'Refunded' as const };
      }
      return o;
    });
    onUpdateOrders(updatedOrders);

    const newEvent: TimelineEvent = {
      id: `refunded-${Date.now()}`,
      type: 'payment',
      title: `Order payment status set to Refunded`,
      date: 'Just now',
      content: `Grand total value of £${order.total.toFixed(2)} refunded successfully.`
    };
    saveTimeline([newEvent, ...timelineEvents]);
    setShowMoreActions(false);
  };

  // Find customer orders count
  const customerEmailLower = order.customerEmail.toLowerCase();
  const matchedCustomer = customers.find(c => c.email.toLowerCase() === customerEmailLower);
  const totalCustomerOrders = allOrders.filter(o => o.customerEmail.toLowerCase() === customerEmailLower).length;

  return (
    <div className="fixed inset-0 z-50 bg-[#f1f3f5] overflow-y-auto text-slate-800 font-sans pb-16">
      {/* Top sticky action banner */}
      <div className="sticky top-0 bg-white border-b border-slate-200 z-30 px-6 py-4 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          
          {/* Left section: Back, title, badges */}
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title="Back to Orders list"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <span className="font-extrabold text-lg text-slate-900">#{order.id}</span>
              
              {/* Paid badge */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                order.paymentStatus === 'Paid' 
                  ? 'bg-slate-100 text-slate-700' 
                  : order.paymentStatus === 'Refunded'
                  ? 'bg-rose-50 text-rose-700 border border-rose-100'
                  : 'bg-amber-50 text-amber-700 border border-amber-100'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  order.paymentStatus === 'Paid' ? 'bg-slate-600' : order.paymentStatus === 'Refunded' ? 'bg-rose-600' : 'bg-amber-600'
                }`} />
                {order.paymentStatus || 'Paid'}
              </span>

              {/* Fulfillment badge */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                order.fulfillmentStatus === 'Delivered'
                  ? 'bg-teal-50 text-teal-700 border border-teal-100'
                  : order.fulfillmentStatus === 'Fulfilled'
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-amber-50 text-amber-700 border border-amber-100'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  order.fulfillmentStatus === 'Delivered' ? 'bg-teal-600' : order.fulfillmentStatus === 'Fulfilled' ? 'bg-slate-600' : 'bg-amber-600'
                }`} />
                {order.fulfillmentStatus}
              </span>

              {/* Archived badge */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                Archived
              </span>
            </div>
          </div>

          {/* Right section: Action Buttons */}
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button 
              onClick={handleRefund}
              disabled={order.paymentStatus === 'Refunded'}
              className={`py-1.5 px-3.5 border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                order.paymentStatus === 'Refunded' ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Refund
            </button>
            <button className="py-1.5 px-3.5 border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer">
              Return
            </button>

            {/* More actions dropdown container */}
            <div className="relative">
              <button 
                onClick={() => setShowMoreActions(!showMoreActions)}
                className="py-1.5 px-3.5 border border-slate-250 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>More actions</span>
                <ChevronDown className="h-3 w-3" />
              </button>
              {showMoreActions && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl border border-slate-200 shadow-lg py-1.5 z-40 text-left">
                  <button 
                    onClick={() => {
                      handleUpdateFulfillment(order.fulfillmentStatus === 'Delivered' ? 'Fulfilled' : 'Delivered');
                      setShowMoreActions(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium text-slate-700"
                  >
                    Toggle Delivery State
                  </button>
                  <button 
                    onClick={() => {
                      handleUpdateFulfillment('Unfulfilled');
                      setShowMoreActions(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium text-slate-700 border-t border-slate-100"
                  >
                    Mark as Unfulfilled
                  </button>
                  <button 
                    onClick={() => {
                      alert('Order has been archived successfully.');
                      setShowMoreActions(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-xs font-medium text-slate-700 border-t border-slate-100"
                  >
                    Archive Transaction
                  </button>
                </div>
              )}
            </div>

            {/* Prev / Next controls */}
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white ml-2">
              <button 
                onClick={() => handleNavigate('prev')}
                disabled={currentIndex === 0}
                className="p-1.5 hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent border-r border-slate-200 cursor-pointer"
                title="Previous Order"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button 
                onClick={() => handleNavigate('next')}
                disabled={currentIndex === allOrders.length - 1}
                className="p-1.5 hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer"
                title="Next Order"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Date line */}
        <div className="max-w-6xl mx-auto mt-2 text-slate-400 text-xs pl-9">
          {order.date} from <span className="font-semibold text-slate-500">Draft Orders</span>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-6xl mx-auto mt-6 px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: 70% width */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. FULFILLMENT CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="p-1 bg-slate-200 text-slate-600 rounded-lg">
                  <Package className="h-4 w-4" />
                </span>
                <span className="font-extrabold text-[#071d37] text-sm uppercase tracking-wide">
                  {order.fulfillmentStatus === 'Delivered' ? 'Delivered' : 'Fulfilled'}
                </span>
                <span className="text-slate-400 font-mono text-xs">#{order.id}-F1</span>
              </div>
              <button className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            {/* Date line & delivery status */}
            <div className="p-5 border-b border-slate-100 flex items-center gap-2 text-slate-500 text-xs">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>{order.date}</span>
            </div>

            {/* Itemized List */}
            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-5 flex items-start gap-4">
                  {/* Product Image */}
                  <div className="h-14 w-14 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shrink-0 flex items-center justify-center">
                    <img 
                      src={getProductImage(item.productId, item.image)} 
                      alt={item.productTitle}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  {/* Item Description */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate leading-snug">{item.productTitle}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">M / Green • 010401015</p>
                  </div>
                  {/* Calculation and pricing */}
                  <div className="text-right whitespace-nowrap pl-4">
                    <span className="text-xs text-slate-500 font-medium block">
                      £{item.price.toFixed(2)} × {item.quantity}
                    </span>
                    <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                      £{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2.5">
              {order.fulfillmentStatus !== 'Delivered' && (
                <button 
                  onClick={() => handleUpdateFulfillment('Delivered')}
                  className="bg-white hover:bg-slate-50 text-slate-700 py-2 px-4 border border-slate-250 rounded-xl font-bold text-xs cursor-pointer transition-colors"
                >
                  Mark as delivered
                </button>
              )}
              <button 
                onClick={() => setShowTrackingModal(true)}
                className="bg-slate-900 hover:bg-slate-850 text-white py-2 px-4 rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
              >
                <span>+ Add tracking</span>
              </button>
            </div>
          </div>


          {/* 2. PAYMENT / PAID CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
              <span className="p-1 bg-slate-200 text-slate-600 rounded-lg">
                <CreditCard className="h-4 w-4" />
              </span>
              <span className="font-extrabold text-[#071d37] text-sm uppercase tracking-wide">Paid</span>
            </div>

            {/* Calculations body */}
            <div className="p-5 space-y-3.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                <span className="text-slate-850 font-bold">£{order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-sm font-extrabold text-slate-900">
                <span>Total</span>
                <span>£{order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-xs font-bold text-slate-700">
                <span>Paid</span>
                <span>£{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>


          {/* 3. TIMELINE CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <h3 className="font-extrabold text-[#071d37] text-sm uppercase tracking-wide mb-5">Timeline</h3>
            
            {/* Comment block form */}
            <form onSubmit={handleAddComment} className="flex gap-4 items-start mb-6">
              {/* Initials Avatar */}
              <div className="h-9 w-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                NB
              </div>
              
              {/* Comment editor box */}
              <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-slate-900 transition-all">
                <textarea 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Leave a comment..."
                  className="w-full text-xs p-3.5 bg-transparent resize-none border-0 focus:outline-none placeholder-slate-400 text-slate-800 h-20 leading-relaxed"
                />
                <div className="px-3.5 py-2 border-t border-slate-200 bg-white flex justify-between items-center">
                  <div className="flex gap-2.5 text-slate-400">
                    <button type="button" className="hover:text-slate-600 cursor-pointer">
                      <Smile className="h-4 w-4" />
                    </button>
                    <button type="button" className="hover:text-slate-600 cursor-pointer">
                      <span className="font-bold text-xs">@</span>
                    </button>
                    <button type="button" className="hover:text-slate-600 cursor-pointer">
                      <span className="font-bold text-xs">#</span>
                    </button>
                    <button type="button" className="hover:text-slate-600 cursor-pointer">
                      <Paperclip className="h-4 w-4" />
                    </button>
                  </div>
                  <button 
                    type="submit"
                    disabled={!commentText.trim()}
                    className={`py-1.5 px-4 rounded-xl text-xs font-bold transition-all ${
                      commentText.trim() 
                        ? 'bg-slate-900 hover:bg-slate-850 text-white cursor-pointer' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Post
                  </button>
                </div>
              </div>
            </form>

            {/* Timeline Stream */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200">
              
              {/* Hardcoded visual interactive "just now" timeline block */}
              <div className="relative">
                {/* Timeline node */}
                <span className="absolute -left-6 top-1 h-2.5 w-2.5 rounded-full bg-slate-400 border-2 border-white shadow-xs" />
                <div className="flex justify-between items-start text-xs">
                  <div className="font-semibold text-slate-850 flex items-center gap-1">
                    <span>You updated the customer for this order.</span>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
                  </div>
                  <span className="text-slate-400 text-[10px]">Just now</span>
                </div>
              </div>

              {timelineEvents.map((ev) => (
                <div key={ev.id} className="relative">
                  {/* Timeline node */}
                  <span className={`absolute -left-6 top-1 h-2.5 w-2.5 rounded-full border-2 border-white shadow-xs ${
                    ev.isComment ? 'bg-emerald-500' : 'bg-slate-350'
                  }`} />
                  
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <p className="font-extrabold text-slate-850">{ev.title}</p>
                      {ev.content && (
                        <p className={`mt-1 leading-relaxed text-slate-500 ${
                          ev.isComment ? 'bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 text-slate-700 mt-2 font-medium italic' : ''
                        }`}>
                          {ev.content}
                        </p>
                      )}
                    </div>
                    <span className="text-slate-400 text-[10px] shrink-0 ml-4">{ev.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* RIGHT COLUMN: 30% width */}
        <div className="space-y-6">
          
          {/* A. NOTES CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-slate-[#071d37] text-xs uppercase tracking-wider">Notes</h3>
              <button 
                onClick={() => setIsEditingNotes(!isEditingNotes)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            {isEditingNotes ? (
              <div className="space-y-2">
                <textarea 
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
                <div className="flex justify-end gap-1 text-[10px]">
                  <button 
                    type="button"
                    onClick={() => setIsEditingNotes(false)}
                    className="py-1 px-2.5 hover:bg-slate-100 rounded-lg font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={handleSaveNotes}
                    className="py-1 px-2.5 bg-slate-900 text-white hover:bg-slate-850 rounded-lg font-bold"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic leading-relaxed">{noteText}</p>
            )}
          </div>


          {/* B. CHANNEL INFORMATION CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <h3 className="font-extrabold text-[#071d37] text-xs uppercase tracking-wider mb-3">Channel Information</h3>
            <div className="space-y-1.5 text-xs text-slate-600">
              <p><span className="text-slate-400">Channel:</span> <span className="font-bold text-slate-800">Draft Orders</span></p>
            </div>
          </div>


          {/* C. CUSTOMER CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-[#071d37] text-xs uppercase tracking-wider">Customer</h3>
              <button className="text-slate-400 hover:text-slate-700">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Main link */}
              <div>
                <span className="text-sm font-extrabold text-blue-600 hover:underline cursor-pointer">
                  {order.customerName}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">{totalCustomerOrders} order{totalCustomerOrders !== 1 ? 's' : ''}</span>
              </div>

              {/* Contact details */}
              <div className="pt-3.5 border-t border-slate-100 space-y-2.5">
                <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Contact information</h4>
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-slate-700 truncate">{order.customerEmail}</p>
                  <p className="text-slate-400 italic">No phone number</p>
                </div>
              </div>

              {/* Shipping address */}
              <div className="pt-3.5 border-t border-slate-100 space-y-2.5">
                <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Shipping address</h4>
                <div className="text-xs leading-relaxed text-slate-600">
                  {order.destination && order.destination !== '100 Main Street, New York, NY, 10001' ? (
                    <p className="font-medium text-slate-700">{order.destination}</p>
                  ) : (
                    <p className="text-slate-400 italic">No shipping address provided</p>
                  )}
                </div>
              </div>

              {/* Billing address */}
              <div className="pt-3.5 border-t border-slate-100 space-y-2.5">
                <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Billing address</h4>
                <div className="text-xs leading-relaxed text-slate-600">
                  {order.destination && order.destination !== '100 Main Street, New York, NY, 10001' ? (
                    <p className="font-medium text-slate-700">{order.destination}</p>
                  ) : (
                    <p className="text-slate-400 italic">No billing address provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>


          {/* D. CONVERSION SUMMARY CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <h3 className="font-extrabold text-[#071d37] text-xs uppercase tracking-wider mb-3">Conversion summary</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              There aren't any conversion details available for this order.
            </p>
            <span className="text-xs text-blue-600 hover:underline font-bold mt-2.5 block cursor-pointer">
              Learn more
            </span>
          </div>


          {/* E. ORDER RISK CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex items-start gap-3">
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg mt-0.5 shrink-0">
              <Shield className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-extrabold text-[#071d37] text-xs uppercase tracking-wider">Order risk</h3>
              <p className="text-xs text-slate-500 mt-1">This transaction is categorized as <strong className="text-emerald-600">Low Risk</strong>. The Worldpay token and authorization codes are completely valid.</p>
            </div>
          </div>

        </div>

      </div>


      {/* SAVE TRACKING MODAL OVERLAY */}
      {showTrackingModal && (
        <div className="fixed inset-0 z-50 bg-[#071d37]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-scaleUp text-left">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
              <h3 className="font-black text-[#071d37] text-sm uppercase tracking-wide">Add tracking</h3>
              <button 
                onClick={() => setShowTrackingModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTracking} className="space-y-5">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tracking Number input */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1.5">Tracking number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RN184902844GB"
                    value={trackingNo}
                    onChange={(e) => setTrackingNo(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#071d37] font-mono"
                  />
                </div>

                {/* Shipping Carrier select */}
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1.5">Shipping carrier</label>
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#071d37] font-bold text-slate-700 cursor-pointer"
                  >
                    <option value="Royal Mail">Royal Mail</option>
                    <option value="USPS">USPS</option>
                    <option value="DHL Express">DHL Express</option>
                    <option value="FedEx">FedEx</option>
                    <option value="UPS">UPS</option>
                    <option value="DPD UK">DPD UK</option>
                  </select>
                </div>
              </div>

              {/* Add another link */}
              <button 
                type="button" 
                onClick={() => alert('Additional tracking references can be added separated by commas in the tracking number field.')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <span>+ Add another tracking number</span>
              </button>

              {/* Actions footer */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() => setShowTrackingModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 px-4.5 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-850 text-white py-2 px-4.5 rounded-xl font-bold cursor-pointer transition-colors shadow-sm"
                >
                  Save
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
