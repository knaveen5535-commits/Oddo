"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  CheckCircle2,
  Circle,
  Plus,
  Search,
  ShoppingBag,
  Smartphone,
  Shirt,
  Heart,
  MoreHorizontal,
  Layers,
  Package,
  Trash2,
} from "lucide-react";

export default function PackingListPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState([
    { id: 1, title: "Passport & Visas", category: "Essentials", packed: true },
    { id: 2, title: "Universal Adapter", category: "Electronics", packed: true },
    { id: 3, title: "Noise Cancelling Headphones", category: "Electronics", packed: false },
    { id: 4, title: "Lightweight Jacket", category: "Clothing", packed: false },
    { id: 5, title: "First Aid Kit", category: "Health", packed: false },
    { id: 6, title: "Travel Insurance Docs", category: "Essentials", packed: false },
  ]);

  const categories = [
    { name: "All", icon: <Layers size={15} /> },
    { name: "Essentials", icon: <Package size={15} /> },
    { name: "Electronics", icon: <Smartphone size={15} /> },
    { name: "Clothing", icon: <Shirt size={15} /> },
    { name: "Health", icon: <Heart size={15} /> },
  ];

  const toggleItem = (id: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item)));
  };

  const filteredItems = items.filter((item) => {
    const matchCategory = activeCategory === "All" || item.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || item.title.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  const packedCount = items.filter((i) => i.packed).length;
  const progress = items.length ? Math.round((packedCount / items.length) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="page-header">
        <div>
          <h1 className="page-title">Packing List</h1>
          <p className="page-subtitle">Ensure every essential is aboard for your next trip.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} />
          Add item
        </button>
      </div>

      {/* Progress */}
      <section className="card card-pad relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-lg font-semibold text-foreground mb-1">Readiness status</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              You are {progress}% ready for departure. {packedCount} of {items.length} items packed.
            </p>
            <div className="flex gap-2 mt-4 justify-center md:justify-start">
              <span className="badge badge-success">{packedCount} packed</span>
              <span className="badge badge-neutral">{items.length - packedCount} remaining</span>
            </div>
          </div>
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-8 border-muted" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(var(--primary) ${progress * 3.6}deg, transparent 0deg)`,
                WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 14px), black calc(100% - 14px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 14px), black calc(100% - 14px))",
              }}
            />
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground tracking-tight">{progress}%</div>
              <div className="text-xs text-muted-foreground">Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="relative flex-1 lg:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            className="input pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`btn flex-none ${activeCategory === cat.name ? "btn-primary" : "btn-outline"}`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.97, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => toggleItem(item.id)}
                className={`card card-pad cursor-pointer transition-colors group ${
                  item.packed ? "border-success/40 bg-success/5" : "card-hover"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      item.packed ? "bg-success text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.packed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="icon-btn w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-danger/10 hover:text-danger"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="icon-btn w-8 h-8"
                      aria-label="More"
                    >
                      <MoreHorizontal size={15} />
                    </button>
                  </div>
                </div>
                <p className="text-xs font-medium text-muted-foreground mb-1">{item.category}</p>
                <h3
                  className={`font-semibold leading-snug transition-colors ${
                    item.packed ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {item.title}
                </h3>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="card empty-state">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <ShoppingBag size={26} className="text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">No items found</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {searchQuery
              ? "Nothing matches your search."
              : "Your packing list is empty. Add items to get started."}
          </p>
          {!searchQuery && (
            <button className="btn btn-primary mt-6">
              <Plus size={16} />
              Add your first item
            </button>
          )}
        </div>
      )}
    </div>
  );
}
