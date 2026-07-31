import React, { useState } from 'react';
import { 
  Sparkles, Shield, Image, Smile, Hash, Send, X, AlertCircle, MapPin, Tag, Phone, Clock
} from 'lucide-react';
import { useCircle, Post } from '../../context/CircleContext';
import Card from '../common/Card';
import Button from '../common/Button';
import { useToast } from '../../context/ToastContext';

const EMOJIS = ['😀', '📚', '🍲', '⚽', '🔍', '💡', '🏷️', '🎉', '🔥', '❤️'];

const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=600&auto=format&fit=crop&q=80',
];

interface PostComposerProps {
  onSuccess?: () => void;
  onCloseModal?: () => void;
  isModal?: boolean;
}

export const PostComposer: React.FC<PostComposerProps> = ({
  onSuccess,
  onCloseModal,
  isModal = false,
}) => {
  const { userProfile, addPost } = useCircle();
  const { showToast } = useToast();

  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Post['category']>('General');
  const [hashtagsInput, setHashtagsInput] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(userProfile.anonymousPostingDefault);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  // Lost & Found fields
  const [lfItem, setLfItem] = useState('');
  const [lfType, setLfType] = useState<'Lost' | 'Found'>('Found');
  const [lfLocation, setLfLocation] = useState('');
  const [lfDate, setLfDate] = useState('');
  const [lfPhone, setLfPhone] = useState('+91 98401 98765');

  const handleAddEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && category !== 'Lost & Found') {
      showToast({
        title: 'Empty Content',
        message: 'Please write a message or description for your post.',
        type: 'error',
      });
      return;
    }

    // Process hashtags
    const hashtags = hashtagsInput
      .split(/[\s,]+/)
      .filter(Boolean)
      .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`));

    const postData: Partial<Post> = {
      content: content.trim(),
      category,
      hashtags: hashtags.length > 0 ? hashtags : ['#HostelCircle'],
      isAnonymous,
      photoUrl: selectedPhoto || undefined,
    };

    if (category === 'Lost & Found') {
      postData.lostFoundDetails = {
        item: lfItem || 'Unspecified Item',
        type: lfType,
        location: lfLocation || 'Hostel Campus',
        date: lfDate || 'Today',
        contactPhone: lfPhone,
      };
    }

    addPost(postData);

    showToast({
      title: 'Post Published',
      message: isAnonymous
        ? `Your post was published anonymously as ${userProfile.communityUsername}!`
        : 'Your post is now live in Hostel Circle!',
      type: 'success',
    });

    setContent('');
    setHashtagsInput('');
    setSelectedPhoto(null);
    if (onSuccess) onSuccess();
    if (onCloseModal) onCloseModal();
  };

  const contentCard = (
    <div className="space-y-4 font-body text-xs">
      {/* Header & Anonymous Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E7E4DF]">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-xs"
            style={{ backgroundColor: isAnonymous ? '#2A5C8A' : '#996E7D' }}
          >
            {isAnonymous ? <Shield className="w-4 h-4" /> : userProfile.realName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="font-heading font-extrabold text-[#1A1A1A] block">
              {isAnonymous ? userProfile.communityUsername : userProfile.realName}
            </span>
            <span className="text-[10px] text-[#8E8E93]">
              {isAnonymous ? 'Posting Anonymously' : 'Vaigai Hostel • Block A'}
            </span>
          </div>
        </div>

        {/* Anonymous Mode Toggle Switch */}
        <div className="flex items-center gap-2 bg-[#FAF8F2] p-1.5 rounded-xl border border-[#E7E4DF] self-start sm:self-auto">
          <span className="text-[11px] font-bold text-[#1A1A1A] flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-[#2A5C8A]" />
            Anonymous Mode
          </span>
          <button
            type="button"
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
              isAnonymous ? 'bg-[#2A5C8A]' : 'bg-[#E7E4DF]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                isAnonymous ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Category & Hashtag Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="font-bold text-[#1A1A1A] block mb-1">
            Category <span className="text-[#D9534F]">*</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Post['category'])}
            className="w-full p-2.5 rounded-xl border border-[#E7E4DF] bg-white text-[#1A1A1A] font-medium outline-none cursor-pointer"
          >
            <option value="General">General Discussion</option>
            <option value="Study">Study & Academics</option>
            <option value="Events">Campus Events & Sports</option>
            <option value="Food">Mess & Food Feedback</option>
            <option value="Lost & Found">Lost & Found Item</option>
            <option value="Marketplace">Marketplace & Buy/Sell</option>
            <option value="Suggestions">Hostel Suggestions</option>
          </select>
        </div>

        <div>
          <label className="font-bold text-[#1A1A1A] block mb-1">
            Hashtags (Optional)
          </label>
          <div className="relative">
            <Hash className="w-3.5 h-3.5 text-[#8E8E93] absolute left-3 top-3" />
            <input
              type="text"
              value={hashtagsInput}
              onChange={(e) => setHashtagsInput(e.target.value)}
              placeholder="StudyGroup, ExamPrep"
              className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-[#E7E4DF] bg-[#FAF8F2] text-[#1A1A1A] outline-none font-medium"
            />
          </div>
        </div>
      </div>

      {/* Dedicated Lost & Found Form Section */}
      {category === 'Lost & Found' && (
        <div className="p-3.5 bg-[#FEF9E7] rounded-2xl border border-[#D97706]/30 space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-[#D97706] font-bold text-xs">
            <Tag className="w-4 h-4" />
            Lost & Found Specific Details
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[#1A1A1A] block mb-1">Notice Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLfType('Found')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    lfType === 'Found' ? 'bg-[#059669] text-white' : 'bg-white border border-[#E7E4DF] text-[#1A1A1A]'
                  }`}
                >
                  I Found Something
                </button>
                <button
                  type="button"
                  onClick={() => setLfType('Lost')}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    lfType === 'Lost' ? 'bg-[#D9534F] text-white' : 'bg-white border border-[#E7E4DF] text-[#1A1A1A]'
                  }`}
                >
                  I Lost Something
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#1A1A1A] block mb-1">Item Name</label>
              <input
                type="text"
                value={lfItem}
                onChange={(e) => setLfItem(e.target.value)}
                placeholder="e.g. Titan Watch, Blue ID Card"
                className="w-full p-2 rounded-xl border border-[#E7E4DF] bg-white text-[#1A1A1A] font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#1A1A1A] block mb-1">Location</label>
              <input
                type="text"
                value={lfLocation}
                onChange={(e) => setLfLocation(e.target.value)}
                placeholder="e.g. Library 2nd Floor, Mess Hall 1"
                className="w-full p-2 rounded-xl border border-[#E7E4DF] bg-white text-[#1A1A1A] font-medium"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#1A1A1A] block mb-1">Date & Contact Phone</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={lfDate}
                  onChange={(e) => setLfDate(e.target.value)}
                  placeholder="Today 2:00 PM"
                  className="w-full p-2 rounded-xl border border-[#E7E4DF] bg-white text-[#1A1A1A] font-medium"
                />
                <input
                  type="text"
                  value={lfPhone}
                  onChange={(e) => setLfPhone(e.target.value)}
                  placeholder="+91..."
                  className="w-full p-2 rounded-xl border border-[#E7E4DF] bg-white text-[#1A1A1A] font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Text Area */}
      <div>
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            isAnonymous
              ? `Write an anonymous post as ${userProfile.communityUsername}...`
              : "Share an update, ask a question, or start a hostel discussion..."
          }
          className="w-full p-3 rounded-2xl border border-[#E7E4DF] bg-[#FAF8F2] text-[#1A1A1A] font-body text-xs outline-none focus:border-[#2A5C8A] transition-all"
        />
      </div>

      {/* Selected Photo Preview */}
      {selectedPhoto && (
        <div className="relative inline-block rounded-xl overflow-hidden border border-[#E7E4DF]">
          <img src={selectedPhoto} alt="Attachment" className="h-28 w-auto object-cover" />
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Photo Picker Drawer */}
      {showPhotoPicker && (
        <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#E7E4DF] space-y-2 animate-fadeIn">
          <span className="text-[10px] font-bold text-[#8E8E93] uppercase block">
            Select Photo Attachment Placeholder
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SAMPLE_PHOTOS.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="Sample"
                onClick={() => {
                  setSelectedPhoto(url);
                  setShowPhotoPicker(false);
                }}
                className="w-16 h-16 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-all border border-[#E7E4DF]"
              />
            ))}
          </div>
        </div>
      )}

      {/* Bottom Bar: Emojis, Photo button & Submit */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#E7E4DF]">
        {/* Quick Emojis & Attachments */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <div className="flex items-center gap-1 bg-[#FAF8F2] p-1 rounded-xl border border-[#E7E4DF]">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => handleAddEmoji(e)}
                className="hover:scale-125 transition-transform p-1 text-sm cursor-pointer"
              >
                {e}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowPhotoPicker(!showPhotoPicker)}
            className="p-2 rounded-xl border border-[#E7E4DF] bg-white text-[#666666] hover:text-[#2A5C8A] hover:bg-[#EBF3FA] transition-all cursor-pointer flex items-center gap-1 shrink-0"
            title="Attach Photo"
          >
            <Image className="w-4 h-4" />
            <span className="text-[11px] font-bold hidden md:inline">Photo</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 shrink-0">
          {isModal && onCloseModal && (
            <button
              type="button"
              onClick={onCloseModal}
              className="px-4 py-2 rounded-xl border border-[#E7E4DF] font-bold text-[#666666] hover:bg-[#FAF8F2] transition-all cursor-pointer"
            >
              Cancel
            </button>
          )}

          <Button variant="primary" onClick={handleSubmit}>
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Post
          </Button>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-[28px] border border-[#E7E4DF] shadow-2xl max-w-xl w-full p-6 relative animate-slideUp">
          <button
            onClick={onCloseModal}
            className="absolute top-4 right-4 p-2 rounded-full border border-[#E7E4DF] text-[#666666] hover:text-[#1A1A1A] hover:bg-[#FAF8F2] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <h3 className="font-heading text-lg font-black text-[#1A1A1A] mb-4">
            Create Hostel Circle Post
          </h3>
          {contentCard}
        </div>
      </div>
    );
  }

  return <Card className="p-5">{contentCard}</Card>;
};

export default PostComposer;
