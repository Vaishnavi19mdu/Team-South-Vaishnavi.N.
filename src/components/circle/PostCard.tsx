import React, { useState } from 'react';
import { 
  Heart, MessageSquare, Share2, Bookmark, Shield, ShieldAlert, 
  MoreVertical, Edit3, Trash2, Flag, Pin, Lock, EyeOff, Tag, Phone, 
  Send, CornerDownRight, CheckCircle2, User, Building, AlertCircle
} from 'lucide-react';
import { useCircle, Post } from '../../context/CircleContext';
import Card from '../common/Card';
import Badge from '../common/Badge';
import RequestRemovalModal from './RequestRemovalModal';
import { useToast } from '../../context/ToastContext';

interface PostCardProps {
  post: Post;
  viewMode?: 'resident' | 'warden' | 'superadmin';
  assignedWardenHostel?: string;
  assignedWardenName?: string;
}

const CATEGORY_COLORS: Record<Post['category'], { bg: string; text: string }> = {
  'General': { bg: 'bg-[#FAF8F2]', text: 'text-[#1A1A1A]' },
  'Study': { bg: 'bg-[#EBF3FA]', text: 'text-[#2A5C8A]' },
  'Events': { bg: 'bg-[#FDF2F2]', text: 'text-[#996E7D]' },
  'Sports': { bg: 'bg-[#FEF9E7]', text: 'text-[#D97706]' },
  'Food': { bg: 'bg-[#ECFDF5]', text: 'text-[#059669]' },
  'Lost & Found': { bg: 'bg-[#FEF3C7]', text: 'text-[#B45309]' },
  'Marketplace': { bg: 'bg-[#F3E8FF]', text: 'text-[#7E22CE]' },
  'Suggestions': { bg: 'bg-[#F1F5F9]', text: 'text-[#475569]' },
};

export const PostCard: React.FC<PostCardProps> = ({
  post,
  viewMode = 'resident',
  assignedWardenHostel = 'Vaigai Hostel',
  assignedWardenName = 'Dr. K. Arumugam',
}) => {
  const { 
    userProfile, 
    likePost, 
    addComment, 
    likeComment, 
    toggleBookmark, 
    deletePost,
    editPost,
    reportPost,
    wardenDeletePostDirect,
    wardenPinPost,
    wardenLockComments,
    wardenHidePost
  } = useCircle();

  const { showToast } = useToast();

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentIsAnon, setCommentIsAnon] = useState(userProfile.anonymousPostingDefault);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [showRemovalModal, setShowRemovalModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate Content');

  const isOwnPost = post.authorName === userProfile.realName || post.authorUsername === userProfile.communityUsername;
  const isSameHostel = post.authorHostel === assignedWardenHostel;
  const isSuperAdmin = viewMode === 'superadmin';

  const handleShare = () => {
    const url = `${window.location.origin}/resident/circle/post/${post.id}`;
    navigator.clipboard?.writeText(url);
    showToast({
      title: 'Post Link Copied',
      message: 'Post URL has been copied to your clipboard!',
      type: 'info',
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (post.isCommentsLocked) {
      showToast({
        title: 'Comments Locked',
        message: 'A warden has locked comments on this post.',
        type: 'error',
      });
      return;
    }
    addComment(post.id, commentText.trim(), commentIsAnon);
    setCommentText('');
    showToast({
      title: 'Comment Added',
      message: 'Your comment has been posted.',
      type: 'success',
    });
  };

  const handleSaveEdit = () => {
    editPost(post.id, editContent);
    setIsEditing(false);
    showToast({
      title: 'Post Updated',
      message: 'Your changes have been saved.',
      type: 'success',
    });
  };

  const handleReport = () => {
    reportPost(post.id, reportReason);
    setShowReportModal(false);
    showToast({
      title: 'Report Submitted',
      message: 'Thank you for keeping Hostel Circle safe. Wardens have been notified.',
      type: 'info',
    });
  };

  const catStyle = CATEGORY_COLORS[post.category] || CATEGORY_COLORS['General'];

  return (
    <Card className={`p-5 relative transition-all ${post.isPinned ? 'border-2 border-[#2A5C8A]/40 bg-[#FAF8F2]/50' : ''}`}>
      {/* Pinned Indicator */}
      {post.isPinned && (
        <div className="mb-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EBF3FA] text-[#2A5C8A] font-bold text-[10px] uppercase tracking-wider border border-[#2A5C8A]/20">
          <Pin className="w-3 h-3 fill-[#2A5C8A]" /> Pinned by Warden
        </div>
      )}

      {/* Post Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs border border-white"
            style={{ backgroundColor: post.isAnonymous ? '#2A5C8A' : post.avatarColor }}
          >
            {post.isAnonymous ? <Shield className="w-5 h-5" /> : post.authorName.slice(0, 2).toUpperCase()}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-heading text-sm font-extrabold text-[#1A1A1A]">
                {post.isAnonymous ? post.authorUsername : post.authorName}
              </span>

              {post.isAnonymous ? (
                <span className="px-2 py-0.5 rounded-full bg-[#EBF3FA] text-[#2A5C8A] border border-[#2A5C8A]/20 text-[10px] font-extrabold flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Anonymous Resident
                </span>
              ) : (
                <span className="text-[11px] text-[#8E8E93] font-medium hidden sm:inline">
                  • {post.authorHostel}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px] text-[#8E8E93] font-medium mt-0.5">
              <span>{post.timestamp}</span>
              <span>•</span>
              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${catStyle.bg} ${catStyle.text}`}>
                {post.category}
              </span>

              {/* Identity Disclosure for Warden / Admin Mode */}
              {(viewMode === 'warden' || isSuperAdmin) && (
                <span className="px-2 py-0.5 rounded-full bg-[#FEF9E7] text-[#D97706] font-mono font-bold text-[9px] border border-[#D97706]/30">
                  Warden View: {post.authorName} ({post.authorRollNo}) - {post.authorHostel}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Options Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-full text-[#8E8E93] hover:text-[#1A1A1A] hover:bg-[#FAF8F2] transition-all cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-44 bg-white border border-[#E7E4DF] rounded-2xl shadow-xl p-1.5 z-30 font-body text-xs space-y-0.5 animate-fadeIn">
              {isOwnPost && (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#1A1A1A] hover:bg-[#FAF8F2] font-semibold cursor-pointer text-left"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#2A5C8A]" />
                    Edit Post
                  </button>

                  <button
                    onClick={() => {
                      deletePost(post.id);
                      setShowMenu(false);
                      showToast({ title: 'Post Deleted', message: 'Your post was deleted.', type: 'info' });
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#D9534F] hover:bg-[#FDF2F2] font-bold cursor-pointer text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[#D9534F]" />
                    Delete Post
                  </button>
                </>
              )}

              {!isOwnPost && (
                <button
                  onClick={() => {
                    setShowReportModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#D97706] hover:bg-[#FEF9E7] font-bold cursor-pointer text-left"
                >
                  <Flag className="w-3.5 h-3.5 text-[#D97706]" />
                  Report Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Body / Edit Mode */}
      <div className="my-3 font-body text-xs text-[#1A1A1A] leading-relaxed">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              rows={3}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#2A5C8A] bg-[#FAF8F2] text-xs font-body outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 rounded-lg border border-[#E7E4DF] text-xs font-bold text-[#666666] hover:bg-[#FAF8F2] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 rounded-lg bg-[#2A5C8A] text-white text-xs font-bold hover:bg-[#1A1A1A] cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-line">{post.content}</p>
        )}
      </div>

      {/* Hashtags Chips */}
      {post.hashtags && post.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 my-2">
          {post.hashtags.map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-md bg-[#FAF8F2] border border-[#E7E4DF] text-[11px] font-mono font-bold text-[#2A5C8A] hover:underline cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Photo Attachment */}
      {post.photoUrl && (
        <div className="my-3 rounded-2xl overflow-hidden border border-[#E7E4DF] max-h-72">
          <img src={post.photoUrl} alt="Post attachment" className="w-full h-auto object-cover" />
        </div>
      )}

      {/* Special Lost & Found Banner Box */}
      {post.lostFoundDetails && (
        <div className="my-3 p-3.5 bg-[#FEF3C7] rounded-2xl border border-[#B45309]/30 space-y-2 font-body text-xs">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-[#B45309] flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <Tag className="w-3.5 h-3.5" /> Notice: {post.lostFoundDetails.type} Item
            </span>
            <span className="font-bold text-[#1A1A1A] text-[11px]">{post.lostFoundDetails.date}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white/80 p-2.5 rounded-xl border border-[#B45309]/20">
            <div>
              <span className="text-[10px] text-[#8E8E93] font-bold uppercase block">Item Description</span>
              <span className="font-bold text-[#1A1A1A]">{post.lostFoundDetails.item}</span>
            </div>

            <div>
              <span className="text-[10px] text-[#8E8E93] font-bold uppercase block">Last Seen / Found At</span>
              <span className="font-bold text-[#1A1A1A]">{post.lostFoundDetails.location}</span>
            </div>
          </div>

          <button
            onClick={() => {
              showToast({
                title: 'Contact Information',
                message: `Owner Phone: ${post.lostFoundDetails?.contactPhone}`,
                type: 'info',
              });
            }}
            className="w-full py-2 rounded-xl bg-[#B45309] text-white font-bold hover:bg-[#1A1A1A] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            Contact {post.lostFoundDetails.type === 'Found' ? 'Finder' : 'Owner'} ({post.lostFoundDetails.contactPhone})
          </button>
        </div>
      )}

      {/* Interaction Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-[#E7E4DF] text-xs font-body">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Like */}
          <button
            onClick={() => likePost(post.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              post.userLiked
                ? 'bg-[#FDF2F2] text-[#D9534F] font-extrabold'
                : 'text-[#666666] hover:bg-[#FAF8F2] hover:text-[#1A1A1A]'
            }`}
          >
            <Heart className={`w-4 h-4 ${post.userLiked ? 'fill-[#D9534F]' : ''}`} />
            <span>{post.likes}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[#666666] hover:bg-[#FAF8F2] hover:text-[#1A1A1A] transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.comments.length}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-xl text-[#666666] hover:bg-[#FAF8F2] hover:text-[#1A1A1A] transition-all cursor-pointer"
            title="Share Post"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Bookmark */}
        <button
          onClick={() => toggleBookmark(post.id)}
          className={`p-1.5 rounded-xl transition-all cursor-pointer ${
            post.isBookmarked
              ? 'bg-[#EBF3FA] text-[#2A5C8A]'
              : 'text-[#666666] hover:bg-[#FAF8F2] hover:text-[#1A1A1A]'
          }`}
          title="Save Post"
        >
          <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-[#2A5C8A]' : ''}`} />
        </button>
      </div>

      {/* Comments Drawer */}
      {showComments && (
        <div className="mt-4 pt-3 border-t border-[#E7E4DF] space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="font-heading text-xs font-extrabold text-[#1A1A1A] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#2A5C8A]" />
              Community Discussion ({post.comments.length})
            </span>

            {post.isCommentsLocked && (
              <span className="text-[10px] text-[#D9534F] font-bold flex items-center gap-1">
                <Lock className="w-3 h-3" /> Comments Locked
              </span>
            )}
          </div>

          {/* Comment List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {post.comments.length === 0 ? (
              <p className="text-[11px] text-[#8E8E93] italic text-center py-2">
                No comments yet. Start the conversation!
              </p>
            ) : (
              post.comments.map((c) => (
                <div key={c.id} className="p-2.5 bg-[#FAF8F2] rounded-xl border border-[#E7E4DF] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-[#1A1A1A]">
                        {c.isAnonymous ? c.authorUsername : c.authorName}
                      </span>
                      {c.isAnonymous && (
                        <span className="text-[9px] text-[#2A5C8A] font-bold bg-[#EBF3FA] px-1.5 py-0.2 rounded-full">
                          Anon
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#8E8E93] font-mono">{c.timestamp}</span>
                  </div>

                  <p className="text-[#1A1A1A]">{c.content}</p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => likeComment(post.id, c.id)}
                      className="text-[10px] text-[#8E8E93] hover:text-[#D9534F] flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <Heart className={`w-3 h-3 ${c.userLiked ? 'fill-[#D9534F] text-[#D9534F]' : ''}`} />
                      {c.likes > 0 && c.likes} Like
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* New Comment Input */}
          {!post.isCommentsLocked && (
            <form onSubmit={handleAddComment} className="pt-2 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={
                    commentIsAnon
                      ? `Comment anonymously as ${userProfile.communityUsername}...`
                      : "Write a reply..."
                  }
                  className="flex-1 p-2 rounded-xl border border-[#E7E4DF] bg-white text-xs outline-none focus:border-[#2A5C8A]"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-[#2A5C8A] text-white text-xs font-bold hover:bg-[#1A1A1A] transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#8E8E93]">
                <button
                  type="button"
                  onClick={() => setCommentIsAnon(!commentIsAnon)}
                  className="text-[#2A5C8A] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Shield className="w-3 h-3" />
                  Comment Anonymously: {commentIsAnon ? 'ON' : 'OFF'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ==================== WARDEN / ADMIN MODERATION CONTROL TOOLBAR ==================== */}
      {(viewMode === 'warden' || isSuperAdmin) && (
        <div className="mt-4 pt-3 border-t-2 border-dashed border-[#2A5C8A]/30 bg-[#FAF8F2] p-3 rounded-xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-heading text-[11px] font-extrabold text-[#2A5C8A] uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Warden Moderation Controls ({post.authorHostel})
            </span>

            {isSameHostel || isSuperAdmin ? (
              <span className="text-[10px] text-[#059669] font-bold bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#059669]/20">
                Authorized Warden
              </span>
            ) : (
              <span className="text-[10px] text-[#D97706] font-bold bg-[#FEF9E7] px-2 py-0.5 rounded-full border border-[#D97706]/20">
                Cross-Hostel Post
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {isSameHostel || isSuperAdmin ? (
              <>
                <button
                  onClick={() => {
                    wardenDeletePostDirect(post.id);
                    showToast({ title: 'Post Removed', message: 'Post permanently deleted by Warden.', type: 'error' });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#D9534F] text-white font-bold hover:bg-[#C9302C] text-[11px] flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>

                <button
                  onClick={() => {
                    wardenPinPost(post.id);
                    showToast({ title: 'Pin Toggled', message: post.isPinned ? 'Post unpinned' : 'Post pinned to top of feed', type: 'info' });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#2A5C8A] text-white font-bold hover:bg-[#1A1A1A] text-[11px] flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Pin className="w-3 h-3" /> {post.isPinned ? 'Unpin' : 'Pin'}
                </button>

                <button
                  onClick={() => {
                    wardenLockComments(post.id);
                    showToast({ title: 'Comments Toggled', message: post.isCommentsLocked ? 'Comments unlocked' : 'Comments locked', type: 'info' });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF8F2] border border-[#E7E4DF] text-[#1A1A1A] font-bold hover:bg-[#EBF3FA] text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3 h-3 text-[#2A5C8A]" /> {post.isCommentsLocked ? 'Unlock' : 'Lock'}
                </button>

                <button
                  onClick={() => {
                    wardenHidePost(post.id);
                    showToast({ title: 'Post Hidden', message: 'Post hidden from resident feed.', type: 'info' });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#E7E4DF] text-[#666666] font-bold hover:bg-[#FAF8F2] text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <EyeOff className="w-3 h-3" /> Hide
                </button>
              </>
            ) : (
              /* Cross-Hostel Request Removal Button */
              <button
                onClick={() => setShowRemovalModal(true)}
                className="w-full py-1.5 rounded-xl bg-[#D97706] text-white font-bold hover:bg-[#1A1A1A] transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ShieldAlert className="w-4 h-4" />
                Request Post Removal from {post.authorHostel} Warden
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal: Cross-Hostel Request Removal */}
      {showRemovalModal && (
        <RequestRemovalModal
          postId={post.id}
          postHostel={post.authorHostel}
          requestingWardenName={assignedWardenName}
          requestingWardenHostel={assignedWardenHostel}
          onClose={() => setShowRemovalModal(false)}
        />
      )}

      {/* Modal: Report Post */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[24px] border border-[#E7E4DF] shadow-2xl max-w-sm w-full p-5 space-y-4 font-body text-xs">
            <h3 className="font-heading text-base font-extrabold text-[#1A1A1A] flex items-center gap-1.5">
              <Flag className="w-4 h-4 text-[#D97706]" />
              Report Post to Wardens
            </h3>

            <div>
              <label className="font-bold text-[#1A1A1A] block mb-1">Reason for Report</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E7E4DF] bg-[#FAF8F2] outline-none"
              >
                <option value="Inappropriate Content">Inappropriate Content</option>
                <option value="Spam or Unsolicited Commercial">Spam or Unsolicited Commercial</option>
                <option value="Harassment or Bullying">Harassment or Bullying</option>
                <option value="False Information">False Information</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E7E4DF]">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-3 py-1.5 rounded-xl border border-[#E7E4DF] font-bold text-[#666666]"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="px-3 py-1.5 rounded-xl bg-[#D97706] text-white font-bold hover:bg-[#1A1A1A]"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PostCard;
