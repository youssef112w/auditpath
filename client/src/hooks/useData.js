import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

// Generic hook factory
function useFetch(endpoint) {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const { data: res } = await api.get(endpoint);
      setData(res);
    } catch (e) {
      setError(e.response?.data?.error || 'Error');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch, setData };
}

// ─── STATS ────────────────────────────────────────────────────
export function useStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const [statsRes, weeklyRes, heatmapRes] = await Promise.all([
        api.get('/stats'),
        api.get('/sessions/weekly'),
        api.get('/stats/heatmap'),
      ]);
      setStats({ ...statsRes.data, weekly: weeklyRes.data, heatmap: heatmapRes.data });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { stats, loading, refetch: fetch };
}

// ─── SESSIONS ─────────────────────────────────────────────────
export function useSessions() {
  const { data, loading, refetch } = useFetch('/sessions');

  const addSession = async (sessionData) => {
    const { data: res } = await api.post('/sessions', sessionData);
    await refetch();
    return res;
  };

  const deleteSession = async (id) => {
    await api.delete(`/sessions/${id}`);
    await refetch();
  };

  return { sessions: data.sessions || data, loading, addSession, deleteSession, refetch };
}

// ─── ROADMAP ──────────────────────────────────────────────────
export function useRoadmap() {
  const { data, loading, refetch } = useFetch('/roadmap');

  const toggle = async (phase, taskIndex) => {
    await api.post('/roadmap/toggle', { phase, taskIndex });
    await refetch();
  };

  // Convert array to map for easy lookup: { "1_0": true, ... }
  const progressMap = {};
  (Array.isArray(data) ? data : []).forEach(p => {
    if (p.done) progressMap[`${p.phase}_${p.taskIndex}`] = true;
  });

  return { progressMap, loading, toggle, refetch };
}

// ─── AUDITS ───────────────────────────────────────────────────
export function useAudits() {
  const { data, loading, refetch } = useFetch('/audits');

  const add    = async (d) => { await api.post('/audits', d);           await refetch(); };
  const update = async (id, d) => { await api.patch(`/audits/${id}`, d); await refetch(); };
  const remove = async (id) => { await api.delete(`/audits/${id}`);      await refetch(); };

  return { audits: data, loading, add, update, remove, refetch };
}

// ─── VULNERABILITIES ──────────────────────────────────────────
export function useVulns() {
  const { data, loading, refetch } = useFetch('/vulns');

  const add    = async (d) => { await api.post('/vulns', d);            await refetch(); };
  const remove = async (id) => { await api.delete(`/vulns/${id}`);      await refetch(); };

  return { vulns: data, loading, add, remove, refetch };
}

// ─── CHALLENGES ───────────────────────────────────────────────
export function useChallenges() {
  const { data, loading, refetch } = useFetch('/challenges');

  const add    = async (d) => { await api.post('/challenges', d);              await refetch(); };
  const toggle = async (id) => { await api.patch(`/challenges/${id}/toggle`);  await refetch(); };
  const remove = async (id) => { await api.delete(`/challenges/${id}`);        await refetch(); };

  return { challenges: data, loading, add, toggle, remove, refetch };
}

// ─── JOURNAL ──────────────────────────────────────────────────
export function useJournal() {
  const { data, loading, refetch } = useFetch('/journal');

  const add    = async (d) => { await api.post('/journal', d);            await refetch(); };
  const remove = async (id) => { await api.delete(`/journal/${id}`);      await refetch(); };

  return { entries: data, loading, add, remove, refetch };
}
