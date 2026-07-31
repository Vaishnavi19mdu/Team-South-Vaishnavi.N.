import React, { createContext, useContext, useState } from 'react';

export interface Comment {
  id: string;
  authorName: string;
  authorUsername: string;
  isAnonymous: boolean;
  avatarColor: string;
  timestamp: string;
  content: string;
  likes: number;
  userLiked?: boolean;
}

export interface LostFoundDetails {
  item: string;
  type: 'Lost' | 'Found';
  location: string;
  date: string;
  contactPhone: string;
}

export interface Post {
  id: string;
  authorName: string;
  authorUsername: string;
  authorRollNo: string;
  authorHostel: string; // e.g. "Vaigai Hostel"
  authorBlock: string;  // e.g. "Block A"
  isAnonymous: boolean;
  avatarColor: string;
  timestamp: string;
  category: 'General' | 'Study' | 'Events' | 'Sports' | 'Food' | 'Lost & Found' | 'Marketplace' | 'Suggestions';
  hashtags: string[];
  content: string;
  photoUrl?: string;
  likes: number;
  userLiked?: boolean;
  isBookmarked?: boolean;
  isPinned?: boolean;
  isCommentsLocked?: boolean;
  comments: Comment[];
  lostFoundDetails?: LostFoundDetails;
}

export interface ModerationRequest {
  id: string;
  postId: string;
  postContentSnippet: string;
  postHostel: string;
  requestingWardenName: string;
  requestingWardenHostel: string;
  targetWardenHostel: string;
  reason: 'Spam' | 'Harassment' | 'False Information' | 'Inappropriate Content' | 'Other';
  notes: string;
  timestamp: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface UserCommunityProfile {
  realName: string;
  communityUsername: string; // e.g. "@NovaFalcon"
  prefix: string;
  suffix: string;
  anonymousPostingDefault: boolean;
  profileVisibility: 'Hostel Only' | 'All Hostels';
  allowMentions: boolean;
  communityNotifications: boolean;
  lastUsernameChangedDate: string; // ISO date or formatted
}

interface CircleContextType {
  posts: Post[];
  userProfile: UserCommunityProfile;
  moderationRequests: ModerationRequest[];
  
  // Actions
  addPost: (newPostData: Partial<Post>) => void;
  editPost: (postId: string, newContent: string) => void;
  deletePost: (postId: string) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, commentText: string, isAnon: boolean) => void;
  likeComment: (postId: string, commentId: string) => void;
  toggleBookmark: (postId: string) => void;
  reportPost: (postId: string, reason: string) => void;
  
  // Warden Moderation Actions
  wardenDeletePostDirect: (postId: string) => void;
  wardenPinPost: (postId: string) => void;
  wardenLockComments: (postId: string) => void;
  wardenHidePost: (postId: string) => void;
  
  // Cross-Hostel Removal Requests
  submitRemovalRequest: (
    postId: string, 
    reason: ModerationRequest['reason'], 
    notes: string, 
    requestingWardenName: string, 
    requestingWardenHostel: string
  ) => void;
  approveRemovalRequest: (requestId: string) => void;
  rejectRemovalRequest: (requestId: string) => void;

  // Settings
  updateUserProfile: (updated: Partial<UserCommunityProfile>) => void;
  generateUsername: (prefix: string, suffix: string) => { username: string; isAvailable: boolean; suggestions: string[] };
}

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-101',
    authorName: 'Vaishnavi N',
    authorUsername: '@PixelCoder',
    authorRollNo: '21CS094',
    authorHostel: 'Vaigai Hostel',
    authorBlock: 'Block A',
    isAnonymous: false,
    avatarColor: '#996E7D',
    timestamp: '10 mins ago',
    category: 'Lost & Found',
    hashtags: ['#LostAndFound', '#VaigaiLibrary'],
    content: 'Found a silver Titan automatic wrist watch on Study Table 4 in the 2nd Floor Central Library yesterday around 7:30 PM. Turned it over to the library helpdesk, or message me directly if it belongs to you!',
    photoUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    likes: 18,
    userLiked: false,
    isBookmarked: true,
    isPinned: true,
    isCommentsLocked: false,
    lostFoundDetails: {
      item: 'Silver Titan Automatic Watch',
      type: 'Found',
      location: 'Central Library, 2nd Floor (Table 4)',
      date: 'Yesterday, 7:30 PM',
      contactPhone: '+91 98401 98765',
    },
    comments: [
      {
        id: 'c-1',
        authorName: 'Kavya S',
        authorUsername: '@NovaFalcon',
        isAnonymous: true,
        avatarColor: '#2A5C8A',
        timestamp: '5 mins ago',
        content: 'Thanks for handing it to the library desk! My roommate was looking for this exact watch since last night.',
        likes: 4,
      },
    ],
  },
  {
    id: 'post-102',
    authorName: 'Kavya Sundaram',
    authorUsername: '@NovaFalcon',
    authorRollNo: '21EC042',
    authorHostel: 'Vaigai Hostel',
    authorBlock: 'Block B',
    isAnonymous: true,
    avatarColor: '#2A5C8A',
    timestamp: '1 hour ago',
    category: 'Study',
    hashtags: ['#ExamPrep', '#StudyGroup', '#OSMidsem'],
    content: 'Is anyone preparing for the Operating Systems mid-sem exam this Thursday? Setting up an informal study & problem-solving group in Vaigai Block B Common Room today at 8:00 PM. All are welcome!',
    likes: 24,
    userLiked: true,
    isBookmarked: false,
    comments: [
      {
        id: 'c-2',
        authorName: 'Ananya R',
        authorUsername: '@GoldenScholar',
        isAnonymous: false,
        avatarColor: '#059669',
        timestamp: '45 mins ago',
        content: 'Count me in! I have compiled notes on Deadlock handling and Virtual Memory paging algorithms.',
        likes: 6,
      },
    ],
  },
  {
    id: 'post-103',
    authorName: 'Ananya R',
    authorUsername: '@GoldenScholar',
    authorRollNo: '21EE018',
    authorHostel: 'Vaigai Hostel',
    authorBlock: 'Block A',
    isAnonymous: false,
    avatarColor: '#059669',
    timestamp: '3 hours ago',
    category: 'Food',
    hashtags: ['#MessFood', '#SundaySpecial'],
    content: 'Kudos to the Vaigai Mess Committee! Today’s special lunch menu of Paneer Butter Masala, Garlic Naan & Special Biryani was exceptional.',
    likes: 42,
    userLiked: false,
    isBookmarked: false,
    comments: [],
  },
  {
    id: 'post-104',
    authorName: 'Pooja M',
    authorUsername: '@SwiftTiger',
    authorRollNo: '22ME055',
    authorHostel: 'Kaveri Hostel',
    authorBlock: 'Block C',
    isAnonymous: false,
    avatarColor: '#D97706',
    timestamp: '5 hours ago',
    category: 'Events',
    hashtags: ['#SportsMeet', '#InterHostel'],
    content: 'Registrations are open for the Annual Inter-Hostel FIFA & Badminton Tournament! Teams of 2 can sign up at the Student Activity Center before Friday 5:00 PM.',
    likes: 31,
    userLiked: false,
    isBookmarked: false,
    comments: [],
  },
  {
    id: 'post-105',
    authorName: 'Meera V',
    authorUsername: '@BrightPhoenix',
    authorRollNo: '21CS110',
    authorHostel: 'Amaravathi Hostel',
    authorBlock: 'Block D',
    isAnonymous: false,
    avatarColor: '#9333EA',
    timestamp: 'Yesterday',
    category: 'Marketplace',
    hashtags: ['#Marketplace', '#StudyLamp'],
    content: 'Selling an almost brand new LED Desk Lamp with 3 adjustable warmth levels and USB rechargeable battery. Selling for ₹350. DM or comment if interested!',
    photoUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
    likes: 12,
    userLiked: false,
    isBookmarked: false,
    comments: [],
  },
];

const INITIAL_MODERATION_REQUESTS: ModerationRequest[] = [
  {
    id: 'mod-req-1',
    postId: 'post-105',
    postContentSnippet: 'Selling an almost brand new LED Desk Lamp with 3 adjustable warmth levels...',
    postHostel: 'Amaravathi Hostel',
    requestingWardenName: 'Dr. K. Arumugam (Vaigai Warden)',
    requestingWardenHostel: 'Vaigai Hostel',
    targetWardenHostel: 'Amaravathi Hostel',
    reason: 'Spam',
    notes: 'Please verify if commercial marketplace sales are allowed without prior approval.',
    timestamp: 'Yesterday',
    status: 'Pending',
  },
];

const TAKEN_USERNAMES = ['@SilentCoder', '@BrightScholar', '@SwiftTiger', '@GoldenEagle', '@NovaPhoenix'];

const CircleContext = createContext<CircleContextType | undefined>(undefined);

export const CircleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [moderationRequests, setModerationRequests] = useState<ModerationRequest[]>(INITIAL_MODERATION_REQUESTS);

  const [userProfile, setUserProfile] = useState<UserCommunityProfile>({
    realName: 'Vaishnavi N',
    communityUsername: '@NovaFalcon',
    prefix: 'Nova',
    suffix: 'Falcon',
    anonymousPostingDefault: false,
    profileVisibility: 'Hostel Only',
    allowMentions: true,
    communityNotifications: true,
    lastUsernameChangedDate: '2026-07-01',
  });

  const addPost = (newPostData: Partial<Post>) => {
    const isAnon = newPostData.isAnonymous ?? userProfile.anonymousPostingDefault;
    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorName: userProfile.realName,
      authorUsername: userProfile.communityUsername,
      authorRollNo: '21CS094',
      authorHostel: 'Vaigai Hostel',
      authorBlock: 'Block A',
      isAnonymous: isAnon,
      avatarColor: isAnon ? '#2A5C8A' : '#996E7D',
      timestamp: 'Just now',
      category: newPostData.category || 'General',
      hashtags: newPostData.hashtags || ['#VaigaiCircle'],
      content: newPostData.content || '',
      photoUrl: newPostData.photoUrl,
      likes: 0,
      userLiked: false,
      isBookmarked: false,
      comments: [],
      lostFoundDetails: newPostData.lostFoundDetails,
    };

    setPosts([newPost, ...posts]);
  };

  const editPost = (postId: string, newContent: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, content: newContent } : p))
    );
  };

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const likePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const userLiked = !p.userLiked;
          return {
            ...p,
            userLiked,
            likes: userLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const addComment = (postId: string, commentText: string, isAnon: boolean) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment: Comment = {
            id: `c-${Date.now()}`,
            authorName: userProfile.realName,
            authorUsername: userProfile.communityUsername,
            isAnonymous: isAnon,
            avatarColor: isAnon ? '#2A5C8A' : '#996E7D',
            timestamp: 'Just now',
            content: commentText,
            likes: 0,
          };
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );
  };

  const likeComment = (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments.map((c) => {
              if (c.id === commentId) {
                const userLiked = !c.userLiked;
                return {
                  ...c,
                  userLiked,
                  likes: userLiked ? c.likes + 1 : c.likes - 1,
                };
              }
              return c;
            }),
          };
        }
        return p;
      })
    );
  };

  const toggleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p))
    );
  };

  const reportPost = (postId: string, reason: string) => {
    console.log(`Post ${postId} reported for: ${reason}`);
  };

  // Warden Actions
  const wardenDeletePostDirect = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const wardenPinPost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isPinned: !p.isPinned } : p))
    );
  };

  const wardenLockComments = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isCommentsLocked: !p.isCommentsLocked } : p))
    );
  };

  const wardenHidePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  // Cross-Hostel Removal Requests
  const submitRemovalRequest = (
    postId: string,
    reason: ModerationRequest['reason'],
    notes: string,
    requestingWardenName: string,
    requestingWardenHostel: string
  ) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const newReq: ModerationRequest = {
      id: `mod-req-${Date.now()}`,
      postId,
      postContentSnippet: post.content.slice(0, 70) + '...',
      postHostel: post.authorHostel,
      requestingWardenName,
      requestingWardenHostel,
      targetWardenHostel: post.authorHostel,
      reason,
      notes,
      timestamp: 'Just now',
      status: 'Pending',
    };

    setModerationRequests([newReq, ...moderationRequests]);
  };

  const approveRemovalRequest = (requestId: string) => {
    const req = moderationRequests.find((r) => r.id === requestId);
    if (req) {
      setPosts((prev) => prev.filter((p) => p.id !== req.postId));
      setModerationRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'Approved' } : r))
      );
    }
  };

  const rejectRemovalRequest = (requestId: string) => {
    setModerationRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Rejected' } : r))
    );
  };

  const updateUserProfile = (updated: Partial<UserCommunityProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  const generateUsername = (prefix: string, suffix: string) => {
    const base = `@${prefix}${suffix}`;
    const isTaken = TAKEN_USERNAMES.includes(base);
    if (isTaken) {
      const suggestions = [
        `@${prefix}${suffix}23`,
        `@${prefix}${suffix}82`,
        `@${prefix}${suffix}141`,
      ];
      return { username: base, isAvailable: false, suggestions };
    }
    return { username: base, isAvailable: true, suggestions: [] };
  };

  return (
    <CircleContext.Provider
      value={{
        posts,
        userProfile,
        moderationRequests,
        addPost,
        editPost,
        deletePost,
        likePost,
        addComment,
        likeComment,
        toggleBookmark,
        reportPost,
        wardenDeletePostDirect,
        wardenPinPost,
        wardenLockComments,
        wardenHidePost,
        submitRemovalRequest,
        approveRemovalRequest,
        rejectRemovalRequest,
        updateUserProfile,
        generateUsername,
      }}
    >
      {children}
    </CircleContext.Provider>
  );
};

export const useCircle = () => {
  const context = useContext(CircleContext);
  if (!context) {
    throw new Error('useCircle must be used within a CircleProvider');
  }
  return context;
};
