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
  /** Photos directly in this folder */
  imageCount: number;
  /** Photos in this folder and all its subfolders */
  totalImageCount: number;
  subfolderCount: number;
  parent?: string | null;
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
  parent: string | null;
  /** 1 for a top-level folder */
  depth: number;
  maxDepth: number;
  /** Folders above this one, outermost first */
  ancestors: { _id: string; title: string; isPublished: boolean }[];
  subfolders: ArchiveEventSummary[];
  /** Subfolders at any depth */
  descendantCount: number;
}

export interface PublicArchiveEvent {
  _id: string;
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  coverImage: GalleryImage | null;
  images: GalleryImage[];
  /** The events this one sits in, outermost first */
  ancestors: { title: string; slug: string }[];
  subfolders: ArchiveEventSummary[];
}
