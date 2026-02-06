import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Skill } from '../types';

interface SkillRadarProps {
  skills: Skill[];
}

export const SkillRadar: React.FC<SkillRadarProps> = ({ skills }) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skills}>
          <PolarGrid stroke="#27272a" />
          <PolarAngleAxis dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Skill Level"
            dataKey="level"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="#3b82f6"
            fillOpacity={0.4}
          />
           <Tooltip 
            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#3b82f6' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};