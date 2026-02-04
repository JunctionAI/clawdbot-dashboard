'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  SkillCard, 
  SkillDetailModal, 
  BundleCard,
  ActiveSkillsBar,
  SkillCategoryFilter,
  Skill,
  UserSkill,
  SkillBundle,
  SKILLS,
  SKILL_BUNDLES,
} from '@/components/skills';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useToast, ToastType } from '@/components/ui/Toast';
import { ConfirmModal } from '@/components/ui/Modal';

type Category = Skill['category'] | 'all';

export default function SkillsPage() {
  // User's active skills (would come from API in real app)
  const [userSkills, setUserSkills] = useState<UserSkill[]>([
    { skillId: 'gmail', active: true, activatedAt: '2024-01-15', isTrialing: false },
    { skillId: 'calendar', active: true, activatedAt: '2024-01-15', isTrialing: true, trialEndsAt: '2024-01-22' },
  ]);

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ skillId: string; action: 'enable' | 'disable' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { addToast } = useToast();

  // Filter skills by category and search
  const filteredSkills = useMemo(() => {
    let filtered = SKILLS;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(s => s.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.features.some(f => f.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [selectedCategory, searchQuery]);

  // Calculate skill counts per category
  const skillCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    SKILLS.forEach(skill => {
      counts[skill.category] = (counts[skill.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Get user skill status
  const getUserSkill = useCallback((skillId: string) => {
    return userSkills.find(us => us.skillId === skillId);
  }, [userSkills]);

  // Get active skill IDs
  const activeSkillIds = useMemo(() => {
    return userSkills.filter(us => us.active).map(us => us.skillId);
  }, [userSkills]);

  // Handle skill toggle
  const handleSkillToggle = useCallback(async (skillId: string, active: boolean) => {
    if (active) {
      // Enabling - show confirmation with trial info
      setPendingAction({ skillId, action: 'enable' });
      setShowConfirmModal(true);
    } else {
      // Disabling - show confirmation
      setPendingAction({ skillId, action: 'disable' });
      setShowConfirmModal(true);
    }
  }, []);

  // Confirm skill action
  const confirmSkillAction = useCallback(async () => {
    if (!pendingAction) return;
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { skillId, action } = pendingAction;
    const skill = SKILLS.find(s => s.id === skillId);
    
    if (action === 'enable') {
      setUserSkills(prev => {
        const existing = prev.find(us => us.skillId === skillId);
        if (existing) {
          return prev.map(us => 
            us.skillId === skillId 
              ? { ...us, active: true, isTrialing: true, trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() }
              : us
          );
        }
        return [...prev, {
          skillId,
          active: true,
          activatedAt: new Date().toISOString(),
          isTrialing: true,
          trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        }];
      });
      addToast({
        type: 'success',
        title: `${skill?.name} enabled! 🎉`,
        message: 'Your 7-day free trial has started.',
      });
    } else {
      setUserSkills(prev => 
        prev.map(us => 
          us.skillId === skillId ? { ...us, active: false } : us
        )
      );
      addToast({
        type: 'info',
        title: `${skill?.name} disabled`,
        message: 'You can re-enable it anytime.',
      });
    }
    
    setIsLoading(false);
    setShowConfirmModal(false);
    setPendingAction(null);
  }, [pendingAction, addToast]);

  // Handle bundle activation
  const handleBundleActivate = useCallback((bundle: SkillBundle) => {
    // In real app, this would trigger a checkout flow
    addToast({
      type: 'info',
      title: 'Bundle checkout',
      message: `Redirecting to checkout for ${bundle.name}...`,
    });
  }, [addToast]);

  // View skill details
  const handleViewDetails = useCallback((skill: Skill) => {
    setSelectedSkill(skill);
    setShowDetailModal(true);
  }, []);

  // Get pending action skill
  const pendingSkill = pendingAction 
    ? SKILLS.find(s => s.id === pendingAction.skillId) 
    : null;

  // Separate skills into active and available
  const activeSkillsList = filteredSkills.filter(s => activeSkillIds.includes(s.id));
  const availableSkillsList = filteredSkills.filter(s => !activeSkillIds.includes(s.id) && !s.comingSoon);
  const comingSoonSkillsList = filteredSkills.filter(s => s.comingSoon);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Animated gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <header className="mb-8 animate-fade-in-down">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                🏪 Skill Marketplace
              </h1>
              <p className="text-gray-400">
                Unlock powerful capabilities for your AI assistant
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="info" size="md">
                Your Plan: <span className="font-bold">Pro</span>
              </Badge>
            </div>
          </div>

          {/* Active skills bar */}
          <ActiveSkillsBar 
            skills={SKILLS}
            userSkills={userSkills}
            onSkillClick={handleViewDetails}
          />
        </header>

        {/* Search and filters */}
        <div className="mb-8 space-y-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              🔍
            </span>
          </div>

          {/* Category filter */}
          <SkillCategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            skillCounts={skillCounts}
          />
        </div>

        {/* Bundles section */}
        <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">💎</span>
            <h2 className="text-2xl font-bold text-white">Bundles — Save Up to 29%</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILL_BUNDLES.map((bundle, idx) => (
              <BundleCard
                key={bundle.id}
                bundle={bundle}
                userSkillIds={activeSkillIds}
                onActivate={handleBundleActivate}
                animationDelay={0.3 + idx * 0.1}
              />
            ))}
          </div>
        </section>

        {/* Active skills section */}
        {activeSkillsList.length > 0 && (
          <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">⚡</span>
              <h2 className="text-2xl font-bold text-white">Your Active Skills</h2>
              <Badge variant="success" size="md">{activeSkillsList.length}</Badge>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeSkillsList.map((skill, idx) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  userSkill={getUserSkill(skill.id)}
                  onToggle={handleSkillToggle}
                  onViewDetails={handleViewDetails}
                  animationDelay={0.5 + idx * 0.1}
                />
              ))}
            </div>
          </section>
        )}

        {/* Available skills section */}
        {availableSkillsList.length > 0 && (
          <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🛒</span>
              <h2 className="text-2xl font-bold text-white">Available Skills</h2>
              <Badge variant="default" size="md">{availableSkillsList.length}</Badge>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableSkillsList.map((skill, idx) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  userSkill={getUserSkill(skill.id)}
                  onToggle={handleSkillToggle}
                  onViewDetails={handleViewDetails}
                  animationDelay={0.7 + idx * 0.1}
                />
              ))}
            </div>
          </section>
        )}

        {/* Coming soon section */}
        {comingSoonSkillsList.length > 0 && (
          <section className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">🚀</span>
              <h2 className="text-2xl font-bold text-white">Coming Soon</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoonSkillsList.map((skill, idx) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  userSkill={getUserSkill(skill.id)}
                  onToggle={handleSkillToggle}
                  onViewDetails={handleViewDetails}
                  animationDelay={0.9 + idx * 0.1}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {filteredSkills.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No skills found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Request skill card */}
        <Card className="animate-fade-in-up mt-8" style={{ animationDelay: '1s' }}>
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">💡</span>
              <div>
                <h3 className="text-lg font-semibold text-white">Missing a skill?</h3>
                <p className="text-gray-400">Let us know what capability you'd like to see</p>
              </div>
            </div>
            <Button variant="outline">
              Request a Skill
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Skill detail modal */}
      <SkillDetailModal
        skill={selectedSkill}
        userSkill={selectedSkill ? getUserSkill(selectedSkill.id) : undefined}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onToggle={handleSkillToggle}
      />

      {/* Confirmation modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setPendingAction(null);
        }}
        onConfirm={confirmSkillAction}
        title={pendingAction?.action === 'enable' 
          ? `Enable ${pendingSkill?.name}?` 
          : `Disable ${pendingSkill?.name}?`
        }
        message={pendingAction?.action === 'enable'
          ? `You'll get a 7-day free trial. After that, it's $${pendingSkill ? pendingSkill.price / 100 : 0}/month. Cancel anytime.`
          : `You'll lose access to ${pendingSkill?.name} features immediately. You can re-enable it anytime.`
        }
        confirmText={pendingAction?.action === 'enable' ? 'Start Free Trial' : 'Disable Skill'}
        variant={pendingAction?.action === 'enable' ? 'info' : 'warning'}
        isLoading={isLoading}
      />
    </div>
  );
}
