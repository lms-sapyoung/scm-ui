import React from "react";

export interface Project {
  id: string;
  name: string;
}

interface ProjectSelectorProps {
  projects?: Project[];
  value: string;
  onChange: (id: string) => void;
}

export function ProjectSelector({ projects = [], value, onChange }: ProjectSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1">프로젝트</label>
      <select
        className="border rounded-full px-3 py-1 text-sm bg-gray-50 focus:bg-white border-gray-200 focus:border-primary w-full min-w-0"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {projects.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
    </div>
  );
} 