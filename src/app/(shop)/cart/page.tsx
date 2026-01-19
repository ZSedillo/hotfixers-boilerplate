"use client";

import { useCart } from "@/lib/cart-context";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trash2, ArrowRight, Minus, Plus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, addToCart, decrementItem, removeFromCart, cartTotal } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto py-10 px-4 max-w-6xl">
        
        {items.length === 0 ? (
          // --- EMPTY STATE ---
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border shadow-sm text-center">
            <div className="h-20 w-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="text-gray-500 mt-2 mb-8 max-w-sm">
              Looks like you haven't added anything to your cart yet. Go ahead and explore our top categories.
            </p>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-full px-8">
              <Link href="/">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          // --- CART GRID ---
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* LEFT: Cart Items List */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                <span className="text-gray-500 text-sm">{items.length} items</span>
              </div>

              {items.map((item) => (
                <div 
                  key={item.id} 
                  className="flex gap-4 sm:gap-6 bg-white p-4 sm:p-6 rounded-2xl border shadow-sm transition-all hover:shadow-md"
                >
                  {/* Image */}
                  <div className="h-24 w-24 sm:h-32 sm:w-32 bg-gray-100 rounded-xl shrink-0 overflow-hidden border">
                     <img 
                        src={item.image_url || `https://placehold.co/200?text=${item.name.charAt(0)}`} 
                        alt={item.name} 
                        className="w-full h-full object-cover mix-blend-multiply" 
                     />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">Electronics • In Stock</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Remove Item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded-full bg-gray-50">
                        <button 
                          onClick={() => decrementItem(item.id)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black disabled:opacity-30"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => addToCart(item)}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-black"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="font-bold text-xl text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-gray-400">
                            ${item.price} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: Order Summary (Sticky) */}
            <div className="lg:w-96 shrink-0">
              <div className="bg-white p-6 rounded-2xl border shadow-sm sticky top-24">
                <h3 className="font-bold text-xl mb-6">Order Summary</h3>
                
                <div className="space-y-3 text-sm text-gray-600 border-b pb-6 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Estimate</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span className="font-medium text-gray-900">${(cartTotal * 0.1).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">${(cartTotal * 1.1).toFixed(2)}</span>
                </div>

                <Button className="w-full bg-black hover:bg-gray-800 text-white rounded-full py-6 text-lg shadow-lg shadow-blue-900/10">
                  Checkout <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <ShieldCheckIcon /> Secure SSL Encryption
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

// Small helper icon
function ShieldCheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
  )
}