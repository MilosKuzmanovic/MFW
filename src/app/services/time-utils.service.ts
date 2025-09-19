import { Injectable } from '@angular/core';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class TimeUtilsService {
  private readonly SECONDS_IN_MINUTE = 60;
  private readonly SECONDS_IN_HOUR = 3600;
  private readonly MILLISECONDS_IN_SECOND = 1000;

  constructor() { }

  /**
   * Formats seconds into MM:SS format
   */
  formatTime(seconds: number): string {
    if (!this.isValidTime(seconds)) {
      return '00:00';
    }

    const minutes = Math.floor(seconds / this.SECONDS_IN_MINUTE);
    const remainingSeconds = seconds % this.SECONDS_IN_MINUTE;
    return `${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
  }

  /**
   * Formats time into readable format (e.g., "1h 30min 45s")
   */
  formatTimeReadable(totalSeconds: number): string {
    if (!this.isValidTime(totalSeconds)) {
      return '0s';
    }

    const hours = Math.floor(totalSeconds / this.SECONDS_IN_HOUR);
    const remainingSecondsAfterHours = totalSeconds % this.SECONDS_IN_HOUR;
    const minutes = Math.floor(remainingSecondsAfterHours / this.SECONDS_IN_MINUTE);
    const seconds = remainingSecondsAfterHours % this.SECONDS_IN_MINUTE;

    const timeParts: string[] = [];

    if (hours > 0) {
      timeParts.push(`${hours}h`);
    }

    if (minutes > 0) {
      timeParts.push(`${minutes}min`);
    }

    if (seconds > 0 || (hours === 0 && minutes === 0)) {
      timeParts.push(`${seconds}s`);
    }

    return timeParts.join(' ');
  }

  /**
   * Converts time string to seconds
   */
  timeStringToSeconds(timeString: string): number {
    if (!timeString || typeof timeString !== 'string') {
      return 0;
    }

    const trimmedString = timeString.trim();
    
    // Handle MM:SS format
    if (trimmedString.includes(':')) {
      const parts = trimmedString.split(':');
      if (parts.length === 2) {
        const minutes = parseInt(parts[0], 10) || 0;
        const seconds = parseInt(parts[1], 10) || 0;
        return minutes * this.SECONDS_IN_MINUTE + seconds;
      }
    }

    // Handle plain number (seconds)
    const seconds = parseInt(trimmedString, 10);
    return isNaN(seconds) ? 0 : Math.max(0, seconds);
  }

  /**
   * Gets current time plus specified seconds
   */
  getTimePlusSeconds(secondsToAdd: number): string {
    if (!this.isValidTime(secondsToAdd)) {
      return this.getCurrentTime();
    }

    const now = new Date();
    const targetTime = new Date(now.getTime() + secondsToAdd * this.MILLISECONDS_IN_SECOND);
    
    return this.formatDateTime(targetTime);
  }

  /**
   * Gets current time in HH:MM:SS format
   */
  getCurrentTime(): string {
    return this.formatDateTime(new Date());
  }

  /**
   * Validates if time value is valid
   */
  private isValidTime(seconds: number): boolean {
    return typeof seconds === 'number' && 
           !isNaN(seconds) && 
           seconds >= 0 && 
           seconds <= APP_CONSTANTS.VALIDATION.MAX_TIME_VALUE;
  }

  /**
   * Pads number with leading zero
   */
  private pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  /**
   * Formats date to HH:MM:SS
   */
  private formatDateTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  /**
   * Converts seconds to hours, minutes, seconds object
   */
  parseTime(seconds: number): { hours: number; minutes: number; seconds: number } {
    if (!this.isValidTime(seconds)) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = Math.floor(seconds / this.SECONDS_IN_HOUR);
    const remainingSecondsAfterHours = seconds % this.SECONDS_IN_HOUR;
    const minutes = Math.floor(remainingSecondsAfterHours / this.SECONDS_IN_MINUTE);
    const remainingSeconds = remainingSecondsAfterHours % this.SECONDS_IN_MINUTE;

    return { hours, minutes, seconds: remainingSeconds };
  }
}
