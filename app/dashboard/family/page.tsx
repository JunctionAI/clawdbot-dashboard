'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { UsersIcon } from '@/components/ui/icons';

interface FamilyMember {
  id: string;
  email: string;
  name: string;
  relation: string;
  status: 'active' | 'pending' | 'expired';
  joinedAt?: string;
  invitedAt: string;
  avatar?: string;
}

// Mock family data
const mockFamily: {
  manager: { name: string; email: string };
  members: FamilyMember[];
  maxMembers: number;
} = {
  manager: {
    name: 'John',
    email: 'john@example.com',
  },
  members: [
    {
      id: '1',
      email: 'jane@example.com',
      name: 'Jane',
      relation: 'spouse',
      status: 'active',
      joinedAt: '2024-01-15',
      invitedAt: '2024-01-10',
      avatar: 'JD',
    },
    {
      id: '2',
      email: 'tommy@example.com',
      name: 'Tommy',
      relation: 'child',
      status: 'active',
      joinedAt: '2024-01-16',
      invitedAt: '2024-01-10',
      avatar: 'TD',
    },
    {
      id: '3',
      email: 'grandma@example.com',
      name: 'Grandma',
      relation: 'parent',
      status: 'pending',
      invitedAt: '2024-01-20',
      avatar: 'GD',
    },
  ],
  maxMembers: 5,
};

// Member status badge
const StatusBadge = ({ status }: { status: FamilyMember['status'] }) => {
  const config = {
    active: { variant: 'success' as const, text: 'Active' },
    pending: { variant: 'warning' as const, text: 'Pending' },
    expired: { variant: 'error' as const, text: 'Expired' },
  };
  const { variant, text } = config[status];
  return <Badge variant={variant} size="sm">{text}</Badge>;
};

// Relation display
const RelationLabel = ({ relation }: { relation: string }) => {
  const labels: Record<string, string> = {
    spouse: '💑 Spouse',
    partner: '💑 Partner',
    child: '👶 Child',
    parent: '👴 Parent',
    sibling: '👫 Sibling',
    other: '👤 Family',
  };
  return <span className="text-sm text-gray-400">{labels[relation] || relation}</span>;
};

// Member card component
const MemberCard = ({
  member,
  isManager,
  onResendInvite,
  onRemove,
}: {
  member: FamilyMember;
  isManager: boolean;
  onResendInvite: () => void;
  onRemove: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {member.avatar || member.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-white font-medium">{member.name}</h4>
              <StatusBadge status={member.status} />
            </div>
            <p className="text-sm text-gray-400">{member.email}</p>
            <RelationLabel relation={member.relation} />
          </div>
        </div>

        {isManager && (
          <div className="flex items-center gap-2">
            {member.status === 'pending' && (
              <Button variant="ghost" size="sm" onClick={onResendInvite}>
                Resend invite
              </Button>
            )}
            <button
              onClick={onRemove}
              className="p-2 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-700/30 flex items-center justify-between text-xs text-gray-500">
        <span>
          {member.status === 'active' 
            ? `Joined ${member.joinedAt}`
            : `Invited ${member.invitedAt}`}
        </span>
        {member.status === 'active' && (
          <span className="text-green-400/70">Using Clawdbot</span>
        )}
      </div>
    </motion.div>
  );
};

// Invite modal
const InviteModal = ({
  isOpen,
  onClose,
  onInvite,
}: {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (member: Omit<FamilyMember, 'id' | 'status' | 'invitedAt'>) => void;
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [loading, setLoading] = useState(false);

  const relations = ['Spouse', 'Partner', 'Child', 'Parent', 'Sibling', 'Other'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: API call to send invite
    await new Promise((r) => setTimeout(r, 1000));
    
    onInvite({ email, name, relation: relation.toLowerCase() });
    setLoading(false);
    setEmail('');
    setName('');
    setRelation('');
    onClose();
  };

  const isValid = email.includes('@') && name && relation;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Family Member" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="family@example.com"
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            required
          />
          <p className="mt-1.5 text-xs text-gray-500">
            They'll receive an email invitation to join your family plan.
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Their first name"
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Relation</label>
          <select
            value={relation}
            onChange={(e) => setRelation(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-purple-500/50 transition-colors"
            required
          >
            <option value="">Select relation...</option>
            {relations.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
          <h4 className="text-sm font-medium text-purple-400 mb-2">What they'll get:</h4>
          <ul className="space-y-1.5 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Their own private Clawdbot workspace
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              15 skills included
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Access to shared family calendar
            </li>
          </ul>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={!isValid} loading={loading} className="flex-1">
            Send Invitation
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default function FamilyManagementPage() {
  const [members, setMembers] = useState<FamilyMember[]>(mockFamily.members);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  const totalSlots = mockFamily.maxMembers - 1; // Minus manager
  const usedSlots = members.length;
  const availableSlots = totalSlots - usedSlots;

  const handleInvite = (newMember: Omit<FamilyMember, 'id' | 'status' | 'invitedAt'>) => {
    const member: FamilyMember = {
      ...newMember,
      id: Date.now().toString(),
      status: 'pending',
      invitedAt: new Date().toISOString().split('T')[0],
      avatar: newMember.name.substring(0, 2).toUpperCase(),
    };
    setMembers([...members, member]);
  };

  const handleRemove = () => {
    if (selectedMember) {
      setMembers(members.filter((m) => m.id !== selectedMember.id));
      setRemoveModalOpen(false);
      setSelectedMember(null);
    }
  };

  const handleResendInvite = (member: FamilyMember) => {
    // TODO: API call to resend invite
    console.log('Resending invite to', member.email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900">
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <a href="/dashboard" className="text-gray-400 hover:text-white text-sm mb-4 inline-flex items-center gap-1 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </a>
          <h1 className="text-3xl font-bold text-white">Family Plan</h1>
          <p className="text-gray-400 mt-1">Manage your family members and invitations.</p>
        </div>

        {/* Overview Card */}
        <Card className="mb-8 bg-gradient-to-br from-purple-900/30 to-pink-900/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <UsersIcon className="w-7 h-7 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Your Family</h2>
                  <p className="text-gray-400">
                    {usedSlots} of {totalSlots} member slots used
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">$19</div>
                  <div className="text-xs text-gray-400">/month total</div>
                </div>
                <a href="/dashboard/billing">
                  <Button variant="outline" size="sm">
                    Manage billing
                  </Button>
                </a>
              </div>
            </div>

            {/* Slots visualization */}
            <div className="mt-6 flex gap-2">
              {Array.from({ length: totalSlots }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full ${
                    i < usedSlots ? 'bg-purple-500' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {availableSlots > 0 
                ? `${availableSlots} invitation${availableSlots > 1 ? 's' : ''} remaining`
                : 'All slots filled'}
            </p>
          </CardContent>
        </Card>

        {/* Family Manager (You) */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-base">Family Manager (You)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                {mockFamily.manager.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-white font-medium">{mockFamily.manager.name}</h4>
                  <Badge variant="default" size="sm">Manager</Badge>
                </div>
                <p className="text-sm text-gray-400">{mockFamily.manager.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Family Members */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Family Members</CardTitle>
                <CardDescription>
                  {members.length > 0 
                    ? `${members.filter(m => m.status === 'active').length} active, ${members.filter(m => m.status === 'pending').length} pending`
                    : 'No members yet'}
                </CardDescription>
              </div>
              {availableSlots > 0 && (
                <Button onClick={() => setInviteModalOpen(true)}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Invite Member
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
                  <UsersIcon className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No family members yet</h3>
                <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                  Invite your family to share the power of Clawdbot. Each member gets their own private workspace.
                </p>
                <Button onClick={() => setInviteModalOpen(true)}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Invite Your First Member
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {members.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      isManager={true}
                      onResendInvite={() => handleResendInvite(member)}
                      onRemove={() => {
                        setSelectedMember(member);
                        setRemoveModalOpen(true);
                      }}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help section */}
        <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-white font-medium mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="text-gray-300 font-medium mb-1">Can family members see my data?</h4>
              <p className="text-gray-500">No, each member has their own completely private workspace. Only shared calendars are visible to everyone.</p>
            </div>
            <div>
              <h4 className="text-gray-300 font-medium mb-1">What happens if I remove a member?</h4>
              <p className="text-gray-500">They'll lose access immediately but their data is preserved for 30 days in case you re-invite them.</p>
            </div>
            <div>
              <h4 className="text-gray-300 font-medium mb-1">Can I transfer management to someone else?</h4>
              <p className="text-gray-500">Yes, contact support and we can transfer the family manager role to another active member.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <InviteModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onInvite={handleInvite}
      />

      <ConfirmModal
        isOpen={removeModalOpen}
        onClose={() => {
          setRemoveModalOpen(false);
          setSelectedMember(null);
        }}
        onConfirm={handleRemove}
        title="Remove family member?"
        message={`${selectedMember?.name} will lose access to Clawdbot immediately. You can re-invite them later.`}
        confirmText="Remove"
        variant="danger"
      />
    </div>
  );
}
