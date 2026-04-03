export interface Message {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorInitials: string;
  asset: string;
  date: string;
  text: string;
  dataPoint?: string;
  dataPointValue?: string;
  photoUrl?: string;
}
