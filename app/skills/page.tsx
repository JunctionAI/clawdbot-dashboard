'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingScreen, LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import { SkillCard } from '@/components/skills/SkillCard';
import { SkillDetailModal } from '@/components/skills/SkillDetailModal';
import { ActiveSkillsBar } from '@/components/skills/ActiveSkillsBar';
import { SkillCategoryFilter } from '@/components/skills/SkillCategoryFilter';
import { SKILLS, SKILL_BUNDLES, UserSkill, Skill, CATEGORY_LABELS } from '@/components/skills/types';
import { ZapIcon, SearchIcon } from '@/components/ui/icons';

export default function SkillsPage() {
  // State
  const [skills, setSkills] = useState<Skill[]>(SKILLS);
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { addToast } = useToast();

  // Load user skills on mount
  useEffect(() => {
    const loadUserSkills = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call - replace with actual endpoint
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // TODO: Replace with actual API call
        // const response = await fetch('/api/skills/user');
        // if (!response.ok) throw new Error('Failed to load skills');
        // const data = await response.json();
        
        // Demo data - user has Gmail enabled
        setUserSkills([
          { skillId: 'gmail', active: true, activatedAt: '2024-01-15', isTrialing: false },
          { skillId: 'calendar', active: true, activatedAt: '2024-01-15', trialEndsAt: '2024-02-15', isTrialing: true },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load skills');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserSkills();
  }, []);

  // Handle skill toggle
  const handleToggleSkill = useCallback(async (skillId: string, active: boolean): Promise<void> => {
    // Simulate API call
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate occasional failure for testing
        if (Math.random() < 0.1) {
          reject(new Error('Network error. Please try again.'));
        } else {
          resolve(undefined);
        }
      }, 1500);
    });
    
    // Update local state optimistically
    setUserSkills(prev => {
      const existing = prev.find(us => us.skillId === skillId);
      if (existing) {
        return prev.map(us => 
          us.skillId === skillId ? { ...us, active } : us
        );
      } else {
        return [...prev, { 
          skillId, 
          active, 
          activatedAt: new Date().toISOString(),
          isTrialing: true,
          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        }];
      }
    });
    
    const skill = skills.find(s => s.id === skillId);
    addToast({
      type: 'success',
      title: active ? 'Skill Enabled!' : 'Skill Disabled',
      message: active 
        ? `${skill?.name} has been enabled with a 7-day free trial.`
        : `${skill?.name} has been disabled.`,
    });
  }, [skills, addToast]);

  // Handle viewing skill details
  const handleViewDetails = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsModalOpen(true);
  };

  // Filter skills
  const filteredSkills = skills.filter(skill => {
    const matchesCategory = !selectedCategory || skill.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get skill counts by category
  const skillCounts: Record<string, number> = {};
  skills.forEach(s => {
    skillCounts[s.category] = (skillCounts[s.category] || 0) + 1;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-10 bg-gray-700 rounded w-48 mb-4" />
            <div className="h-4 bg-gray-700 rounded w-96" />
          </div>
          
          {/* Active skills bar skeleton */}
          <div className="mb-8 p-4 bg-gray-800/30 rounded-xl animate-pulse">
            <div className="h-16 bg-gray-700 rounded" />
          </div>
          
          {/* Cards skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorState
            title="Failed to Load Skills"
            message={error}
            onRetry={() => window.location.reload()}
          />
          <div className="mt-6 text-center">
            <a 
              href="/dashboard" 
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <ZapIcon className="w-8 h-8 text-purple-400" />
                Skills Marketplace
              </h1>
              <p className="text-gray-400">
                Unlock powerful capabilities for your AI assistant
              </p>
            </div>
            <a href="/dashboard">
              <Button variant="ghost">← Dashboard</Button>
            </a>
          </div>
          
          {/* Search bar */}
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </motion.header>

        {/* Active Skills Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <ActiveSkillsBar
            skills={skills}
            userSkills={userSkills}
            onSkillClick={handleViewDetails}
          />
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <SkillCategoryFilter
            selectedCategory={(selectedCategory || 'all') as 'all' | 'productivity' | 'automation' | 'communication' | 'ai' | 'data'}
            onCategoryChange={(cat) => setSelectedCategory(cat === 'all' ? null : cat as string)}
            skillCounts={skillCounts}
          />
        </motion.div>

        {/* Skills Grid */}
        {filteredSkills.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill, i) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                userSkill={userSkills.find(us => us.skillId === skill.id)}
                onToggle={handleToggleSkill}
                onViewDetails={handleViewDetails}
                animationDelay={0.3 + i * 0.05}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<ZapIcon className="w-16 h-16" />}
            title="No skills found"
            description={
              searchQuery 
                ? `No skills match "${searchQuery}". Try a different search.`
                : "No skills in this category yet."
            }
            action={
              searchQuery || selectedCategory
                ? {
                    label: 'Clear filters',
                    onClick: () => {
                      setSearchQuery('');
                      setSelectedCategory(null);
                    },
                  }
                : undefined
            }
          />
        )}

        {/* Bundles Section */}
        {!searchQuery && !selectedCategory && SKILL_BUNDLES.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              🎁 Bundle & Save
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SKILL_BUNDLES.map((bundle, i) => (
                <Card
                  key={bundle.id}
                  className="relative overflow-hidden border-purple-500/30 bg-gradient-to-br from-purple-900/30 to-transparent"
                >
                  {bundle.claimedPercent && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">
                        🔥 {bundle.claimedPercent}% claimed
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{bundle.name}</CardTitle>
                    <CardDescription>{bundle.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-3xl font-bold text-white">
                        ${(bundle.bundlePrice / 100).toFixed(0)}
                      </span>
                      <span className="text-gray-400">/mo</span>
                      <span className="ml-2 text-sm text-green-400">
                        Save {bundle.savings}%
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {bundle.skills.map(skillId => {
                        const skill = skills.find(s => s.id === skillId);
                        return skill ? (
                          <span
                            key={skillId}
                            className="px-3 py-1 text-sm bg-gray-800/50 rounded-full text-gray-300"
                          >
                            {skill.icon} {skill.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                    <Button variant="primary" fullWidth>
                      Get Bundle
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}

        {/* Skill Detail Modal */}
        <SkillDetailModal
          skill={selectedSkill}
          userSkill={selectedSkill ? userSkills.find(us => us.skillId === selectedSkill.id) : undefined}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSkill(null);
          }}
          onToggle={handleToggleSkill}
        />
      </div>
    </div>
  );
}
