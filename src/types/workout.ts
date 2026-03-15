export interface Exercise {
  name: string;
  primary_muscle: string;
  secondary_muscle: string[];
  movement_type: string;
  sets: number;
  repetitions: number;
  weight: number; // New field for PR tracking
  rest_time: number;
  video_url: string;
  suggested_scheme?: string;
}