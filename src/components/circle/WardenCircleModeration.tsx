import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, CheckCircle2, XCircle, Trash2, Filter, 
  Search, Flag, AlertTriangle, Compass, Clock, Check
} from 'lucide-react';
import { useCircle } from '../../context/CircleContext';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import PostCard from './PostCard';
import { useToast } from '../../context/ToastContext';

interface WardenCircleModerationProps {
  wardenName?: string;
  assignedHostel?: string;
}

export const WardenCircleModeration: React.FC<WardenCircleModerationProps> = ({
  wardenName = 'Dr. K. Arumugam',
  assignedHostel = 'Vaigai Hostel',
}) => {
  const { posts, moderationRequests, handleModerationRequest, wardenDeletePostDirect } = useCircle();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'feed' | 'requests'>('feed');
  const [hostelFilter, setHostelFilter] = useState<'All' | 'Vaigai Hostel' | 'Kaveri Hostel' | 'Amaravathi Hostel'>('All');

  const pendingRequests = moderationRequests.filter((r) => r.status === 'Pending');

  return (
    <div className="space-y-6 font-body text-xs text-[#1A1A1A] animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-[#1A1A1A] text-white p-6 rounded-[24px] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2A5C8A]/30 text-[#93C5FD] font-extrabold uppercase text-[10px] tracking-wider mb-2 border border-[#2A5C8A]/30">
            <ShieldAlert className="w-3.5 h-3.5" /> Warden Administrative Portal
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-black text-white">
            Hostel Circle Community Moderation
          </h1>
          <p className="text-gray-300 text-xs mt-1">
            Enforce community conduct, manage cross-hostel removal requests, and ensure resident safety.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
              activeTab === 'feed'
                ? 'bg-white text-[#1A1A1A] shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            All Feed Posts ({posts.length})
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer relative ${
              activeTab === 'requests'
                ? 'bg-[#D97706] text-white shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Removal Requests
            {pendingRequests.length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold animate-pulse">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content View */}
      {activeTab === 'feed' ? (
        <div className="space-y-4">
          {/* Hostel Filter Bar */}
          <Card className="p-3 flex items-center justify-between gap-3">
            <span className="font-bold text-xs text-[#1A1A1A] flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-[#2A5C8A]" />
              Filter Feed by Hostel:
            </span>

            <div className="flex items-center gap-1.5">
              {(['All', 'Vaigai Hostel', 'Kaveri Hostel', 'Amaravathi Hostel'] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setHostelFilter(h)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    hostelFilter === h
                      ? 'bg-[#2A5C8A] text-white shadow-xs'
                      : 'bg-[#FAF8F2] border border-[#E7E4DF] text-[#666666] hover:bg-[#EBF3FA]'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </Card>

          {/* Posts List */}
          <div className="space-y-4">
            {posts
              .filter((p) => hostelFilter === 'All' || p.authorHostel === hostelFilter)
              .map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  viewMode="warden"
                  assignedWardenHostel={assignedHostel}
                  assignedWardenName={wardenName}
                />
              ))}
          </div>
        </div>
      ) : (
        /* Removal Requests Tab */
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <h3 className="font-heading text-base font-extrabold text-[#1A1A1A] flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#D97706]" />
              Cross-Hostel Post Removal Requests ({moderationRequests.length})
            </h3>
            <p className="text-xs text-[#666666]">
              When a Warden flags a post created by a resident from another hostel, it enters this queue for approval by the resident&apos;s home hostel Warden.
            </p>

            <div className="space-y-3 pt-2">
              {moderationRequests.length === 0 ? (
                <p className="text-xs text-[#8E8E93] italic py-4 text-center">
                  No moderation requests pending at this time.
                </p>
              ) : (
                moderationRequests.map((req) => (
                  <div
                    key={req.id}
                    className={`p-4 rounded-2xl border space-y-3 transition-all ${
                      req.status === 'Pending'
                        ? 'bg-[#FEF9E7] border-[#D97706]/40'
                        : req.status === 'Approved'
                        ? 'bg-[#ECFDF5] border-[#059669]/30'
                        : 'bg-[#FDF2F2] border-[#D9534F]/30'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 pb-2">
                      <div>
                        <span className="font-bold text-[#1A1A1A]">
                          Requested by {req.requestingWardenName} ({req.requestingWardenHostel})
                        </span>
                        <span className="text-[10px] text-[#8E8E93] block">
                          Target Hostel: <strong className="text-[#1A1A1A]">{req.targetHostel}</strong> • {req.timestamp}
                        </span>
                      </div>

                      <Badge
                        variant={req.status === 'Approved' ? 'success' : req.status === 'Pending' ? 'warning' : 'danger'}
                        size="md"
                      >
                        {req.status}
                      </Badge>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-[#E7E4DF] space-y-1">
                      <span className="text-[10px] font-bold text-[#D97706] uppercase block">
                        Reason: {req.reason}
                      </span>
                      <p className="font-mono text-xs font-bold text-[#1A1A1A]">
                        Post snippet: &ldquo;{req.postSnippet}&rdquo;
                      </p>
                      {req.notes && (
                        <p className="text-[11px] text-[#666666] italic">
                          Notes: {req.notes}
                        </p>
                      )}
                    </div>

                    {req.status === 'Pending' && (
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => {
                            handleModerationRequest(req.id, 'Rejected');
                            showToast({ title: 'Request Rejected', message: 'Post retained in feed.', type: 'info' });
                          }}
                          className="px-3 py-1.5 rounded-xl border border-[#D9534F] text-[#D9534F] font-bold hover:bg-[#FDF2F2] cursor-pointer flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject Request
                        </button>

                        <button
                          onClick={() => {
                            handleModerationRequest(req.id, 'Approved');
                            showToast({ title: 'Request Approved', message: 'Post removed permanently from feed.', type: 'success' });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#059669] text-white font-bold hover:bg-[#1A1A1A] cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Delete Post
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WardenCircleModeration;
