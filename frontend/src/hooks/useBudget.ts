"use client";

import { useState, useEffect, useCallback } from 'react';

interface BudgetData {
  tripId: string;
  hotelCost: number;
  foodCost: number;
  activityCost: number;
  transportCost: number;
  miscellaneousCost: number;
  totalCost: number;
  averagePerDay: number;
  status: 'Low' | 'Moderate' | 'Expensive';
  updatedAt: string;
}

export function useBudget(tripId: string | null) {
  const [budget, setBudget] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBudget = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/budget/${tripId}`);
      const result = await response.json();
      if (result.success) {
        setBudget(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Failed to connect to budget server");
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  const recalculateBudget = async (tripData: any) => {
    if (!tripId) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/budget/${tripId}/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData)
      });
      const result = await response.json();
      if (result.success) {
        setBudget(result.data);
      }
    } catch (err) {
      console.error("Recalculate error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  return { budget, loading, error, refresh: fetchBudget, recalculate: recalculateBudget };
}
