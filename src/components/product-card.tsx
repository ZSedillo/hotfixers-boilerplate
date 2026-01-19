"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AddToCartModal } from "@/components/add-to-cart-modal";
import { LoginModal } from "@/components/login-modal"; // <--- Import New Modal

export function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false); // <--- New State

  const handleAdd = () => {
    // 1. If not logged in -> Show Login Modal
    if (!user) {
      setShowLoginModal(true); 
      return;
    }

    // 2. If logged in -> Add to cart & Show Success Modal
    addToCart(product);
    setShowSuccessModal(true);
  };

  return (
    <>
      <Card className="overflow-hidden group flex flex-col h-full">
        {/* ... (Keep your existing card layout/image code here) ... */}
        <div className="h-48 bg-gray-200 w-full relative overflow-hidden">
          <img 
            src={product.image_url || "https://placehold.co/600x400/png"} 
            alt={product.name} 
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" 
          />
        </div>
        
        <CardContent className="p-4 flex-1">
          <h3 className="font-semibold text-lg leading-tight mb-2">{product.name}</h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-3">{product.description}</p>
          <div className="font-bold text-xl text-blue-600">${product.price}</div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 mt-auto">
          <Button onClick={handleAdd} className="w-full bg-blue-600 hover:bg-blue-700">
            Add to Cart
          </Button>
        </CardFooter>
      </Card>

      {/* Render BOTH modals (only one will show at a time) */}
      <AddToCartModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
        productName={product.name} 
      />
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
}