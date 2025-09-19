import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeUtilsService {

  constructor() { }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
  }

  pad(val: number): string {
    return val < 10 ? `0${val}` : `${val}`;
  }

  formatTimeReadable(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const remainingSecondsAfterHours = totalSeconds % 3600;
    const minutes = Math.floor(remainingSecondsAfterHours / 60);
    const seconds = remainingSecondsAfterHours % 60;

    let formattedTime = '';

    if (hours > 0) {
      formattedTime += `${hours}h `;
    }

    if (minutes > 0) {
      formattedTime += `${minutes}min `;
    }

    if (seconds > 0 || (hours === 0 && minutes === 0)) {
      formattedTime += `${seconds}s`;
    }

    return formattedTime;
  }

  timeStringToSeconds(timeString: string): number {
    if (!timeString) return 0;
    const parts = timeString.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return parseInt(timeString) || 0;
  }

  getTimePlusSeconds(secondsToAdd: number): string {
    const now = new Date();
    const targetTime = new Date(now.getTime() + secondsToAdd * 1000);
    
    const hours = targetTime.getHours();
    const minutes = targetTime.getMinutes();
    const seconds = targetTime.getSeconds();
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
