"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Search, 
  Filter, 
  ShoppingBag, 
  Smartphone, 
  Shirt, 
  Heart, 
  MoreHorizontal,
  Trash2,
  Package,
  Layers,
  ArrowRight
} from "lucide-react";

export default function PackingListPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [items, setItems] = useState([
    { id: 1, title: "Passport & Visas", category: "Essentials", packed: true },
    { id: 2, title: "Universal Adapter", category: "Electronics", packed: true },
    { id: 3, title: "Noise Cancelling Headphones", category: "Electronics", packed: false },
    { id: 4, title: "Lightweight Jacket", category: "Clothing", packed: false },
    { id: 5, title: "First Aid Kit", category: "Health", packed: false },
    { id: 6, title: "Travel Insurance Docs", category: "Essentials", packed: false },
  ]);

  const categories = [
    { name: "All", icon: <Layers size={18} /> },
    { name: "Essentials", icon: <Package size={18} /> },
    { name: "Electronics", icon: <Smartphone size={18} /> },
    { name: "Clothing", icon: <Shirt size={18} /> },
    { name: "Health", icon: <Heart size={18} /> },
  ];

  const toggleItem = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, packed: !item.packed } : item));
  };

  const filteredItems = activeCategory === "All" 
    ? items 
    : items.filter(item => item.category === activeCategory);

  const packedCount = items.filter(i => i.packed).length;
  const progress = Math.round((packedCount / items.length) * 100);

  return (
    <div className="p-10 w-full space-y-12 bg-background text-foreground transition-colors duration-300 pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-6xl font-black tracking-tight uppercase italic mb-2">Packing <span className="text-primary drop-shadow-[0_0_15px_rgba(244,63,94,0.4)]">Manifest</span></h1>
          <p className="text-muted-foreground font-medium italic">Ensure every essential is aboard for your next expedition.</p>
        </div>
        <button className="flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-[24px] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all font-black uppercase tracking-widest text-xs">
          <Plus size={20} />
          Add Item
        </button>
      </header>

      {/* Progress & Stats */}
      <section className="glass-card p-10 rounded-[48px] border-foreground/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px]" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-black uppercase italic tracking-tight">Readiness Status</h2>
            <p className="text-muted-foreground font-medium italic max-w-sm">You are {progress}% ready for your departure. Check your electronics one last time.</p>
            <div className="flex gap-4 pt-2">
              <div className="px-6 py-2 glass rounded-full text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20">
                {packedCount} Packed
              </div>
              <div className="px-6 py-2 glass rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-foreground/10">
                {items.length - packedCount} Remaining
              </div>
            </div>
          </div>
          <div className="relative w-48 h-48 flex items-center justify-center">
             <div className="absolute inset-0 rounded-full border-[12px] border-foreground/5" />
             <div className="absolute inset-0 rounded-full border-[12px] border-primary border-t-transparent border-l-transparent rotate-[-45deg] transition-all duration-1000" style={{ transform: `rotate(${(progress * 3.6) - 90}deg)` }} />
             <div className="text-center">
                <span className="text-5xl font-black italic">{progress}%</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Ready</p>
             </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all whitespace-nowrap border ${
              activeCategory === cat.name 
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
                : "glass border-foreground/10 text-muted-foreground hover:bg-foreground/5"
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </section>

      {/* Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => toggleItem(item.id)}
              className={`group glass-card p-8 rounded-[40px] border-foreground/5 cursor-pointer transition-all hover:translate-y-[-8px] ${
                item.packed ? "bg-primary/5 border-primary/20" : "hover:border-foreground/20"
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${item.packed ? "bg-primary text-white" : "bg-foreground/5 text-muted-foreground"} transition-colors`}>
                   {item.packed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </div>
                <button className="p-2 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-primary transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="space-y-1">
                <p className={`text-xs font-black uppercase tracking-widest ${item.packed ? "text-primary/60" : "text-muted-foreground"}`}>
                  {item.category}
                </p>
                <h3 className={`text-2xl font-black italic transition-all ${item.packed ? "text-primary line-through" : "text-foreground"}`}>
                  {item.title}
                </h3>
              </div>
              <div className="mt-8 flex justify-end">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${item.packed ? "bg-primary/20 text-primary" : "bg-foreground/5 text-muted-foreground opacity-0 group-hover:opacity-100"}`}>
                   <ArrowRight size={16} />
                 </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      {/* Quick Add Placeholder */}
      <section className="py-10 border-2 border-dashed border-foreground/10 rounded-[48px] flex flex-col items-center justify-center gap-4 group hover:border-primary/40 transition-all cursor-pointer">
         <div className="p-6 bg-foreground/5 rounded-full text-muted-foreground group-hover:text-primary transition-colors">
            <Plus size={32} />
         </div>
         <p className="text-muted-foreground font-black uppercase tracking-widest text-xs italic">Assemble New Item</p>
      </section>
    </div>
  );
}
