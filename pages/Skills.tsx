import React from 'react';
import { MOCK_SKILLS } from '../constants';
import { SkillRadar } from '../components/SkillRadar';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const SkillsPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-foreground">Skill Growth</h2>
        <p className="text-muted-foreground mt-1">Visualize your technical and soft skill evolution.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-foreground mb-6 self-start w-full">Skill Radar</h3>
            <SkillRadar skills={MOCK_SKILLS} />
            <p className="text-xs text-muted-foreground mt-6 text-center">
                Generated from GitHub activity and self-assessments.
            </p>
        </div>

        <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Deltas</h3>
                <div className="space-y-4">
                    {MOCK_SKILLS.sort((a,b) => b.growth - a.growth).map((skill) => (
                        <div key={skill.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${
                                    skill.category === 'Language' ? 'bg-blue-500/20 text-blue-400' :
                                    skill.category === 'Framework' ? 'bg-purple-500/20 text-purple-400' :
                                    'bg-orange-500/20 text-orange-400'
                                }`}>
                                    {skill.name.substring(0,2)}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">{skill.name}</p>
                                    <p className="text-xs text-muted-foreground">{skill.category}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-right">
                                    <p className="text-sm font-bold text-foreground">{skill.level}/100</p>
                                    <p className={`text-xs flex items-center justify-end gap-1 ${
                                        skill.growth > 0 ? 'text-green-500' : skill.growth < 0 ? 'text-red-500' : 'text-gray-500'
                                    }`}>
                                        {skill.growth > 0 ? <TrendingUp size={12}/> : skill.growth < 0 ? <TrendingDown size={12}/> : <Minus size={12}/>}
                                        {skill.growth > 0 ? '+' : ''}{skill.growth}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
