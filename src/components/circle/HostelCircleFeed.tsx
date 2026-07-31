import React, { useState } from 'react';
import { 
  Compass, Plus, Search, Filter, Hash, TrendingUp, Shield, Sparkles, 
  HelpCircle, ShieldCheck, Tag, Lock, ArrowLeft, MessageSquare, AlertCircle
} from 'lucide-react';
import { useCircle, Post } from '../../context/CircleContext';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import PostComposer from './PostComposer';
import PostCard from './PostCard';

interface HostelCircleFeedProps {
  viewMode?: 'resident' | 'warden' | 'superadmin';
  assignedWardenHostel?: string;
  assignedWardenName?: string;
  selectedPostId?: string;
  onNavigateRoute?: (route: string) => void;
}

const CATEGORIES: Post['category'][] = [
  'General', 'Study', 'Events', 'Sports', 'Food', 'Lost & Found', 'Marketplace', 'Suggestions'
];

const TRENDING_HASHTAGS = [
  { tag: '#StudyGroup', count: 28 },
  { tag: '#MovieNight', count: 19 },
  { tag: '#MessFood', count: 15 },
  { tag: '#ExamPrep', count: 12 },
  { tag: '#LostAndFound', count: 10 },
  { tag: '#InterHostel', count: 8 },
];

export const HostelCircleFeed: React.FC<HostelCircleFeedProps> = ({
  viewMode = 'resident',
  assignedWardenHostel = 'Vaigai Hostel',
  assignedWardenName = 'Dr. K. Arumugam',
  selectedPostId,
  onNavigateRoute,
}) => {
  const { posts, userProfile } = useCircle();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showComposerModal, setShowComposerModal] = useState(false);
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    // Category match
    if (selectedCategory !== 'All' && p.category !== selectedCategory) {
      return false;
    }

    // Bookmarks match
    if (onlyBookmarks && !p.isBookmarked) {
      return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchContent = p.content.toLowerCase().includes(q);
      const matchAuthor = p.authorName.toLowerCase().includes(q) || p.authorUsername.toLowerCase().includes(q);
      const matchHashtags = p.hashtags?.some((t) => t.toLowerCase().includes(q));
      const matchItem = p.lostFoundDetails?.item.toLowerCase().includes(q);
      if (!matchContent && !matchAuthor && !matchHashtags && !matchItem) {
        return false;
      }
    }

    return true;
  });

  // If viewing single post route /resident/circle/post/:id
  const singlePost = selectedPostId ? posts.find((p) => p.id === selectedPostId) : null;

  return (
    <div className="space-y-6 font-body text-xs text-[#1A1A1A] animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-[#1A1A1A] text-white p-6 rounded-[24px] shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#996E7D] text-[10px] font-extrabold uppercase tracking-wider border border-white/10">
            <Compass className="w-3.5 h-3.5" /> Private Hostel Community
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-black text-white tracking-tight">
            Hostel Circle
          </h1>
          <p className="text-gray-300 text-xs max-w-xl">
            A secure campus forum for residents of Vaigai, Kaveri & Amaravathi hostels to collaborate, share lost & found notices, organize study groups, and discuss hostel life.
          </p>
        </div>

        <div className="flex items-center gap-2 z-10 shrink-0">
          {viewMode === 'resident' && (
            <Button
              variant="primary"
              onClick={() => setShowComposerModal(true)}
              className="shadow-md"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Create Post
            </Button>
          )}
        </div>

        {/* Decorative circle */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* Single Post Detail View */}
      {selectedPostId && singlePost ? (
        <div className="space-y-4">
          <button
            onClick={() => onNavigateRoute?.('/resident/circle')}
            className="px-3 py-1.5 rounded-xl border border-[#E7E4DF] bg-white font-bold text-[#1A1A1A] hover:bg-[#FAF8F2] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Circle Feed
          </button>

          <PostCard
            post={singlePost}
            viewMode={viewMode}
            assignedWardenHostel={assignedWardenHostel}
            assignedWardenName={assignedWardenName}
          />
        </div>
      ) : (
        /* Main Feed View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed Column (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Inline Post Composer Box */}
            {viewMode === 'resident' && <PostComposer />}

            {/* Search and Filter Controls */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 flex items-center bg-[#FAF8F2] border border-[#E7E4DF] rounded-xl px-3 py-2">
                  <Search className="w-4 h-4 text-[#8E8E93] mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search posts, hashtags (#StudyGroup), or items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent text-xs outline-none text-[#1A1A1A] font-medium"
                  />
                </div>

                <button
                  onClick={() => setOnlyBookmarks(!onlyBookmarks)}
                  className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    onlyBookmarks
                      ? 'bg-[#EBF3FA] border border-[#2A5C8A] text-[#2A5C8A]'
                      : 'border-[#E7E4DF] bg-white text-[#666666] hover:bg-[#FAF8F2]'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  Saved
                </button>
              </div>

              {/* Category Pills Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-1 rounded-xl font-bold text-xs shrink-0 transition-all cursor-pointer ${
                    selectedCategory === 'All'
                      ? 'bg-[#1A1A1A] text-white shadow-xs'
                      : 'bg-[#FAF8F2] border border-[#E7E4DF] text-[#666666] hover:bg-[#EBF3FA]'
                  }`}
                >
                  All Posts
                </button>

                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl font-bold text-xs shrink-0 transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-[#2A5C8A] text-white shadow-xs'
                        : 'bg-[#FAF8F2] border border-[#E7E4DF] text-[#666666] hover:bg-[#EBF3FA]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </Card>

            {/* Posts Feed List */}
            <div className="space-y-4">
              {filteredPosts.length === 0 ? (
                <Card className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#FAF8F2] text-[#8E8E93] flex items-center justify-center mx-auto border border-[#E7E4DF]">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading text-base font-extrabold text-[#1A1A1A]">
                    No Circle Posts Found
                  </h3>
                  <p className="text-xs text-[#666666] max-w-sm mx-auto">
                    There are no posts matching your selected category or search parameters. Try clearing filters or be the first to start a conversation!
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSearchQuery('');
                      setOnlyBookmarks(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#2A5C8A] text-white font-bold text-xs hover:bg-[#1A1A1A] cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </Card>
              ) : (
                filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    viewMode={viewMode}
                    assignedWardenHostel={assignedWardenHostel}
                    assignedWardenName={assignedWardenName}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar Widget Column (1 col) */}
          <div className="space-y-5">
            {/* User Community Profile Card */}
            {viewMode === 'resident' && (
              <Card className="p-4 space-y-3 bg-[#FAF8F2]">
                <span className="text-[10px] font-bold text-[#8E8E93] uppercase tracking-wider block">
                  Your Active Hostel Identity
                </span>

                <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-[#E7E4DF]">
                  <div className="w-10 h-10 rounded-full bg-[#2A5C8A] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-mono font-extrabold text-xs text-[#2A5C8A] truncate">
                      {userProfile.communityUsername}
                    </p>
                    <p className="text-[10px] text-[#8E8E93] truncate">
                      Real: {userProfile.realName}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-[#666666] flex justify-between items-center pt-1 border-t border-[#E7E4DF]">
                  <span>Default Anon: <strong className="text-[#1A1A1A]">{userProfile.anonymousPostingDefault ? 'ON' : 'OFF'}</strong></span>
                  <button
                    onClick={() => onNavigateRoute?.('/resident/settings')}
                    className="text-[#2A5C8A] font-bold hover:underline cursor-pointer"
                  >
                    Change Settings
                  </button>
                </div>
              </Card>
            )}

            {/* Trending Hashtags Widget */}
            <Card className="p-5 space-y-3">
              <h3 className="font-heading text-sm font-extrabold text-[#1A1A1A] flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#996E7D]" />
                Trending Hostel Hashtags
              </h3>

              <div className="space-y-1">
                {TRENDING_HASHTAGS.map((item) => (
                  <button
                    key={item.tag}
                    onClick={() => setSearchQuery(item.tag)}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF8F2] transition-all cursor-pointer text-left group"
                  >
                    <span className="font-mono font-bold text-xs text-[#1A1A1A] group-hover:text-[#2A5C8A] transition-colors">
                      {item.tag}
                    </span>
                    <span className="text-[10px] text-[#8E8E93] font-medium bg-[#FAF8F2] px-2 py-0.5 rounded-full border border-[#E7E4DF]">
                      {item.count} posts
                    </span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Community Security & Guidelines */}
            <Card className="p-5 space-y-3 bg-[#EBF3FA]/40 border border-[#2A5C8A]/20">
              <h3 className="font-heading text-xs font-extrabold text-[#2A5C8A] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Hostel Circle Safety & Privacy
              </h3>

              <ul className="space-y-2 text-[11px] text-[#666666] leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2A5C8A] mt-1 shrink-0" />
                  <span><strong>Authenticated Access:</strong> Only registered residents of Vaigai campus can access this community feed.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2A5C8A] mt-1 shrink-0" />
                  <span><strong>Anonymous Protection:</strong> When using Anonymous Mode, your real identity is completely hidden from other students.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2A5C8A] mt-1 shrink-0" />
                  <span><strong>Warden Oversight:</strong> Wardens retain identity access to enforce anti-harassment and community safety guidelines.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      )}

      {/* Modal Composer */}
      {showComposerModal && (
        <PostComposer
          isModal={true}
          onCloseModal={() => setShowComposerModal(false)}
        />
      )}
    </div>
  );
};

export default HostelCircleFeed;
