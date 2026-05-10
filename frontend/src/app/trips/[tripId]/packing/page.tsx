"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Filter,
  Package,
  Umbrella,
  Shirt,
  Smartphone
} from "lucide-react";

export default function PackingPage() {
  const [items, setItems] = useState([
    { id: 1, title: "Passport & Documents", category: "Essentials", packed: true },
    { id: 2, title: "Swimming Suits", category: "Clothing", packed: false },
    { id: 3, title: "Sunscreen SPF 50", category: "Toiletries", packed: false },
    { id: 4, title: "Underwater Camera", category: "Electronics", packed: true },
    { id: 5, title: "Beach Towel", category: "Essentials", packed: false },
    { id: 6, title: "Snorkeling Mask", category: "Electronics", packed: false },
  ]);

  const togglePacked = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, packed: !item.packed } : item));
  };

  const categories = ["All", "Essentials", "Clothing", "Electronics", "Toiletries"];

  return (
    <div className="p-10 w-full">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Packing List</h1>
          <p className="text-muted-foreground">Don't forget anything for your Maldives trip.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all font-bold">
          <Plus size={20} />
          Add Item
        </button>
      </header>

      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button 
            key={cat}
            className={`px-6 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              cat === "All" ? "bg-primary text-white" : "glass border-white/10 text-muted-foreground hover:bg-white/5"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Packing Stats */}
        <div className="glass-card p-6 rounded-3xl border-white/10 h-fit">
          <h3 className="font-bold mb-6 flex items-center gap-2">
            <Package size={20} className="text-primary" />
            Packing Progress
          </h3>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-muted-foreground">Overall</span>
            <span className="text-sm font-bold">{Math.round((items.filter(i => i.packed).length / items.length) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-8">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(items.filter(i => i.packed).length / items.length) * 100}%` }}
              className="h-full bg-primary"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <StatBox label="Packed" value={items.filter(i => i.packed).length} color="text-teal-400" />
            <StatBox label="Remaining" value={items.filter(i => !i.packed).length} color="text-orange-400" />
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {items.map((item) => (
            <motion.div 
              key={item.id}
              layout
              className={`flex items-center justify-between p-4 rounded-2xl glass border border-white/5 transition-all ${
                item.packed ? "opacity-50" : "hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => togglePacked(item.id)}
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    item.packed ? "bg-primary border-primary" : "border-white/10"
                  }`}
                >
                  {item.packed && <CheckCircle2 size={16} className="text-white" />}
                </button>
                <div>
                  <h4 className={`font-medium text-sm ${item.packed ? "line-through" : ""}`}>{item.title}</h4>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{item.category}</span>
                </div>
              </div>
              <button className="p-2 text-muted-foreground hover:text-red-400 transition-colors">
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="glass p-4 rounded-2xl border-white/5">
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
