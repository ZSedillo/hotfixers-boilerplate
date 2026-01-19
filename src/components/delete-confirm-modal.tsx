"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function DeleteConfirmModal({ productId, productName }: { productId: string, productName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const supabase = createClient();
    
    const { error } = await supabase.from("products").delete().eq("id", productId);
    
    if (!error) {
      setIsOpen(false);
      router.refresh();
    }
    setIsDeleting(false);
  };

  return (
    <>
      <Button 
        size="sm" 
        variant="ghost" 
        className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors" 
        onClick={() => setIsOpen(true)}
      >
        <Trash2 size={18} />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          {/* MODAL CARD: Changed rounded-2xl to rounded-lg for a cleaner, less curvy look */}
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm mx-auto overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b bg-slate-50">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Confirm Action</span>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-slate-200 text-slate-400 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 mb-4 border border-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 leading-tight">Delete Product?</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed px-2">
                Are you sure you want to remove <span className="font-semibold text-slate-800">"{productName}"</span>? This action is permanent.
              </p>

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-md h-10 border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-100 transition-colors" 
                  onClick={() => setIsOpen(false)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                {/* DELETE BUTTON: Explicitly forced bg-red-600 and hover:bg-red-700 */}
                <Button 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-md h-10 text-xs font-bold shadow-sm transition-colors border-none" 
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}