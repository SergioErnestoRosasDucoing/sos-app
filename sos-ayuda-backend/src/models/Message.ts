export interface Message {
  id: string;
  request_id: string;
  sender_type: 'user' | 'pro';
  content: string;
  created_at: Date;
}
