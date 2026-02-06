import React, { useState } from 'react';
import { Project, ProjectStatus } from '../types';
import { getProjects } from '../services/storage';
import { Layers, Circle, CheckCircle2, Clock, PauseCircle, PlayCircle, MoreHorizontal } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const [projects] = useState<Project[]>(getProjects());

  const getStatusColor = (status: ProjectStatus) => {
    switch(status) {
        case ProjectStatus.IDEA: return 'bg-yellow-500/20 text-yellow-500';
        case ProjectStatus.IN_PROGRESS: return 'bg-blue-500/20 text-blue-500';
        case ProjectStatus.SHIPPED: return 'bg-green-500/20 text-green-500';
        case ProjectStatus.PAUSED: return 'bg-gray-500/20 text-gray-500';
        default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <header className="flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-bold text-foreground">Projects</h2>
           <p className="text-muted-foreground mt-1">Track the lifecycle of your ideas.</p>
        </div>
        <button className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            New Project
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {projects.map((project) => (
            <div key={project.id} className="bg-card border border-border rounded-xl p-6 relative overflow-hidden group hover:border-border/80 transition-all">
                 <div className="flex flex-col md:flex-row gap-6">
                    {/* Project Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                             <h3 className="text-xl font-bold text-foreground">{project.name}</h3>
                             <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getStatusColor(project.status)}`}>
                                {project.status}
                             </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4 max-w-xl">{project.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            {project.technologies.map(tech => (
                                <span key={tech} className="text-xs bg-muted text-foreground px-2 py-1 rounded border border-border">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center gap-6 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>Started {new Date(project.startDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Layers size={14} />
                                <span>{project.milestones.filter(m => m.completed).length} / {project.milestones.length} Milestones</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline / Milestones Visual */}
                    <div className="md:w-1/3 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6 flex flex-col justify-center">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Timeline</h4>
                        <div className="space-y-4 relative">
                            {/* Vertical line connecting milestones */}
                            <div className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-border z-0"></div>
                            
                            {project.milestones.map((milestone) => (
                                <div key={milestone.id} className="relative z-10 flex items-center gap-3">
                                    {milestone.completed ? (
                                        <CheckCircle2 className="text-green-500 bg-card" size={20} />
                                    ) : (
                                        <Circle className="text-muted-foreground bg-card" size={20} />
                                    )}
                                    <span className={`text-sm ${milestone.completed ? 'text-foreground line-through opacity-70' : 'text-foreground'}`}>
                                        {milestone.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                 </div>

                 {/* Quick Actions (Hover) */}
                 <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-muted rounded text-muted-foreground hover:text-foreground">
                        <MoreHorizontal size={20} />
                    </button>
                 </div>
            </div>
        ))}
      </div>
    </div>
  );
};
