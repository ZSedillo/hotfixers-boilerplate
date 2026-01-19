"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, ShoppingCart, X } from "lucide-react";

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export function AddToCartModal({ isOpen, onClose, productName }: AddToCartModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-end p-2">
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900">Added to Cart!</h3>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            <span className="font-medium text-gray-800">{productName}</span> is now in your shopping bag.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
              <Link href="/cart">
                View Shopping Cart
              </Link>
            </Button>
            
            <Button variant="outline" onClick={onClose} className="w-full">
              Continue Shopping
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}