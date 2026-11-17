export const ACTIVITY_ZONES = [
  "active",
  "not_active",
  "warning",
  "danger",
] as const;

export type ActivityZone = (typeof ACTIVITY_ZONES)[number];

export type NotifiableZone = Exclude<ActivityZone, "active">;

export const NOTIFIABLE_ZONES: NotifiableZone[] = [
  "not_active",
  "warning",
  "danger",
];

/** Single source of truth for zone labels/colours across dashboard, tables and profiles */
export const ZONE_META: Record<
  ActivityZone,
  {
    label: string;
    description: string;
    color: string;
    dot: string;
    badge: string;
  }
> = {
  active: {
    label: "Active",
    description: "Checked in recently",
    color: "#10b981",
    dot: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700",
  },
  not_active: {
    label: "Not Active",
    description: "Needs engagement",
    color: "#f59e0b",
    dot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-700",
  },
  warning: {
    label: "Warning",
    description: "Becoming disengaged",
    color: "#f97316",
    dot: "bg-orange-500",
    badge: "bg-orange-100 text-orange-700",
  },
  danger: {
    label: "Danger",
    description: "High risk of abandonment",
    color: "#e11d48",
    dot: "bg-rose-600",
    badge: "bg-rose-100 text-rose-700",
  },
};

export interface ZoneNotificationSettings {
  enabled: boolean;
  daysBefore: number;
  title: string;
  message: string;
  repeatIntervalDays: number;
}

export interface ActivityZoneThresholds {
  notActiveDays: number;
  warningDays: number;
  dangerDays: number;
}

export interface ZoneAfterEnteringSettings {
  enabled: boolean;
  daysAfter: number;
  title: string;
  message: string;
  repeatIntervalDays: number;
}

export interface ActivityZoneSettings {
  thresholds: ActivityZoneThresholds;
  /** Reminders before entering a zone */
  notifications: Record<NotifiableZone, ZoneNotificationSettings>;
  /** Reminders after entering a zone */
  afterEntering: Record<NotifiableZone, ZoneAfterEnteringSettings>;
  updatedAt?: string;
}

export interface ActivityZoneSummary {
  counts: Record<ActivityZone, number>;
  total: number;
  thresholds: ActivityZoneThresholds;
}

export interface ActivityZoneHistoryEntry {
  _id: string;
  from: ActivityZone | null;
  to: ActivityZone;
  reason: "check-in" | "login" | "scheduled";
  createdAt: string;
}

export interface MemberActivity {
  zone: ActivityZone;
  zoneEnteredAt?: string;
  previousZone: ActivityZone | null;
  daysSinceLastCheckIn?: number | null;
  daysSinceLastLogin?: number | null;
  history?: ActivityZoneHistoryEntry[];
  inactivityFeedback?: InactivityFeedbackEntry[];
}

export interface InactivityReasonOption {
  value: string;
  label: string;
}

export interface InactivityFeedbackEntry {
  _id: string;
  reason: string;
  reasonLabel: string;
  note: string;
  reminderZone: NotifiableZone;
  reminderKind?: "before" | "after";
  zoneAtSubmission: ActivityZone;
  updatedAt: string;
}

export interface InactivityFeedbackSummary {
  total: number;
  reasons: (InactivityReasonOption & { count: number })[];
  recent: (InactivityFeedbackEntry & {
    user: {
      _id: string;
      firstname: string;
      lastname: string;
      profile_picture?: string;
    } | null;
  })[];
}
