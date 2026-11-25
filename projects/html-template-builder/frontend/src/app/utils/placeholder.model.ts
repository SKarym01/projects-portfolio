export interface Placeholder {
  // Unique identifier for the placeholder
  id: string;

  // The key used as a placeholder label in the template (e.g. {{firstName}})
  key: string;

  // Description to help users understand the purpose of the placeholder
  description: string;

  // Optional category to group placeholders (e.g. "PIs", "Study Info")
  category?: string;

  // Order in which the placeholder should appear in the UI
  display_order: number;
}
