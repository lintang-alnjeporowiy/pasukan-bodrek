'use client';

import { useState, useCallback, useEffect } from "react";
import { Route, RouteCreate, RouteUpdate } from "@/types/route";
import { routeService } from "@/services/route.service";

export function useRoutes(projectId: string | null) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoutes = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await routeService.getRoutesByProject(projectId);
      setRoutes(data);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat Rute");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  const createRoute = async (data: RouteCreate): Promise<Route> => {
    if (!projectId) throw new Error("ID Proyek tidak valid");
    const newRoute = await routeService.createRoute(projectId, data);
    await fetchRoutes();
    return newRoute;
  };

  const updateRoute = async (routeId: string, data: RouteUpdate): Promise<Route> => {
    const updated = await routeService.updateRoute(routeId, data);
    await fetchRoutes();
    return updated;
  };

  const deleteRoute = async (routeId: string): Promise<void> => {
    await routeService.deleteRoute(routeId);
    await fetchRoutes();
  };

  return {
    routes,
    loading,
    error,
    refreshRoutes: fetchRoutes,
    createRoute,
    updateRoute,
    deleteRoute,
  };
}
