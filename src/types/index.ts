export type ItemType = 'lost' | 'found';
export type ItemStatus = 'pending' | 'resolved';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  fcmToken?: string | null;
  createdAt: number;
}

export interface Item {
  id?: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  type: ItemType;
  status: ItemStatus;
  userId: string;
  userName: string;
  userPhotoURL?: string;
  imageUrl?: string;
  keywords?: string[];
  createdAt: number;
}

export interface Match {
  id?: string;
  lostItemId: string;
  foundItemId: string;
  score: number;
  createdAt: number;
  notified: boolean;
}

export interface ChatMessage {
  id?: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: number;
}

export interface ChatRoom {
  id?: string;
  itemId: string;
  participants: string[];
  lastMessage?: string;
  updatedAt: number;
}
