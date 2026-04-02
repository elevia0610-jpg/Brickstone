import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  properties as fallbackProperties,
  projects as fallbackProjects,
  type Property,
  type Project,
} from "@/lib/data";

export function usePublicProperties() {
  return useQuery({
    queryKey: ["properties", "public"],
    queryFn: async () => {
      const { data } = await api.get<Property[]>("/api/properties");
      return data;
    },
    retry: 1,
  });
}

export function usePublicProjects() {
  return useQuery({
    queryKey: ["projects", "public"],
    queryFn: async () => {
      const { data } = await api.get<Project[]>("/api/projects");
      return data;
    },
    retry: 1,
  });
}

/** Prefer API; on failure fall back to bundled demo data so the marketing site still loads. */
export function useResolvedProperties() {
  const q = usePublicProperties();
  const properties =
    q.data ?? (q.isError ? fallbackProperties : []);
  const usingFallback = q.isError && !q.data;
  return { ...q, properties, usingFallback };
}

export function useResolvedProjects() {
  const q = usePublicProjects();
  const projects = q.data ?? (q.isError ? fallbackProjects : []);
  const usingFallback = q.isError && !q.data;
  return { ...q, projects, usingFallback };
}
