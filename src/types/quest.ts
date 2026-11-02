export interface Quest {
  /** Stable ID used by saved progress. Never renumber an existing lesson. */
  id: number;
  text: string;
  /** A verified UI outcome event; null is the final completion summary. */
  targetId: string | null;
  exp: number;
  chapter?: string;
  /** A short transfer tip for using the corresponding feature on a real tablet. */
  tip?: string;
}
