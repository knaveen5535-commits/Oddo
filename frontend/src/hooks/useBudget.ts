"use client";

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

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
      const response = await api.get(`/budget/${tripId}`);
      if (response.data.success) {
        setBudget(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to connect to budget server");
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  const recalculateBudget = async (tripData: any) => {
    if (!tripId) return;
    setLoading(true);
    try {
      const response = await api.post(`/budget/${tripId}/calculate`, tripData);
      if (response.data.success) {
        setBudget(response.data.data);
      }
    } catch (err) {
      console.error("Recalculate error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) {
      fetchBudget();
    }
  }, [tripId, fetchBudget]);

  return { budget, loading, error, refresh: fetchBudget, recalculate: recalculateBudget };
}
