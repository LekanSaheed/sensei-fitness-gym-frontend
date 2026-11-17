export interface GalleryImage {
  _id: string;
  url: string;
  caption?: string;
  width?: number;
  height?: number;
  bytes?: number;
  createdAt?: string;
  uploadedBy?: { firstname: string; lastname: string } | null;
  /** Archive folders that include this image */
  folders?: { _id: string; title: string }[];
}

export interface ArchiveEventSummary {
  _id: string;
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  isPublished?: boolean;
  imageCount: number;
  /** Cover plus one more photo; the rest of the stack is placeholder cards */
  preview: GalleryImage[];
  updatedAt?: string;
}

export interface ArchiveEvent {
  _id: string;
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  isPublished: boolean;
  images: GalleryImage[];
  coverImage?: GalleryImage | null;
}

export interface PublicArchiveEvent {
  _id: string;
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  coverImage: GalleryImage | null;
  images: GalleryImage[];
}
