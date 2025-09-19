export interface IStorageService {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface IValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

export interface ITrainingFormData {
  name: string;
  description: string;
  breakBetweenGroups: string;
  breakBetweenSeries: string;
  breakBetweenExercises: string;
}

export interface IGroupFormData {
  name: string;
  description: string;
  time: string;
  numberOfSeries: string;
  order: string;
}

export interface IExerciseFormData {
  name: string;
  description: string;
  order: string;
  time: string;
}

export interface IToastOptions {
  message: string;
  duration?: number;
  position?: 'top' | 'bottom' | 'middle';
  color?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'light' | 'medium' | 'dark';
}
