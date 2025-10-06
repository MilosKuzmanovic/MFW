import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss'],
})
export class CountdownTimerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() durationInSeconds: number = 60;
  @Input() isPaused: boolean = false;
  @Output() onFinish: EventEmitter<boolean> = new EventEmitter();
  displayTime: string = '';
  private subscription: Subscription;
  private beepAudio: HTMLAudioElement;
  private beepLongAudio: HTMLAudioElement;
  alertClass: string;
  remainingTime: number;
  private beepPlayed: Set<number> = new Set();
  private isTimerRunning: boolean = false;
  private startTime: number = 0;
  private pausedTime: number = 0;
  private pauseStartTime: number = 0;

  ngOnInit() {
    this.initializeAudio();
    this.startTimer();
  }

  private initializeAudio() {
    // Create new audio instances
    this.beepAudio = new Audio();
    this.beepAudio.src = './assets/beep.mp3';
    this.beepAudio.preload = 'auto';
    this.beepAudio.volume = 0.8;

    this.beepLongAudio = new Audio();
    this.beepLongAudio.src = './assets/beep-long-2.mp3';
    this.beepLongAudio.preload = 'auto';
    this.beepLongAudio.volume = 0.8;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['durationInSeconds'] && !changes['durationInSeconds'].firstChange) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.beepPlayed.clear(); // Reset beep tracking
      this.startTimer();
    }
    
    if (changes['isPaused']) {
      if (this.isPaused) {
        this.pauseTimer();
      } else {
        this.resumeTimer();
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private startTimer() {
    this.remainingTime = this.durationInSeconds;
    this.beepPlayed.clear();
    this.isTimerRunning = true;
    this.displayTime = this.formatTime(this.remainingTime);
    this.startTime = Date.now();
    this.pausedTime = 0;
    this.pauseStartTime = 0;

    const updateTimer = () => {
      if (!this.isTimerRunning) return; // Don't count down when paused
      
      const currentTime = Date.now();
      const elapsed = currentTime - this.startTime - this.pausedTime;
      const remainingMs = Math.max(0, (this.durationInSeconds * 1000) - elapsed);
      this.remainingTime = Math.ceil(remainingMs / 1000);
      this.displayTime = this.formatTime(this.remainingTime);

      if (this.remainingTime <= 10 && this.remainingTime > 0) {
        this.alertClass = 'time-alert';
        // Play beep only once for each remaining time
        if (!this.beepPlayed.has(this.remainingTime)) {
          this.playBeep();
          this.beepPlayed.add(this.remainingTime);
        }
      } else {
        this.alertClass = '';
      }
  
      if (this.remainingTime <= 0) {
        this.playBeepLong();
        this.onFinish.emit(true);
        clearInterval(intervalId);
      }
    };

    // Update immediately to show correct time
    updateTimer();
    
    // Then update every 100ms for smooth countdown
    const intervalId = setInterval(updateTimer, 100);

    // Store interval ID for cleanup
    this.subscription = new Subscription(() => clearInterval(intervalId));
  }

  private pauseTimer() {
    this.isTimerRunning = false;
    this.pauseStartTime = Date.now();
  }

  private resumeTimer() {
    if (this.pauseStartTime > 0) {
      this.pausedTime += Date.now() - this.pauseStartTime;
      this.pauseStartTime = 0;
    }
    this.isTimerRunning = true;
  }

  private playBeep() {
    try {
      // Create a new audio instance for each beep to avoid conflicts
      const audio = new Audio('./assets/beep.mp3');
      audio.volume = 0.8;
      audio.play().catch(() => {
        // Ignore play errors silently
      });
    } catch (error) {
      // Ignore errors silently
    }
  }

  private playBeepLong() {
    try {
      // Create a new audio instance for the long beep
      const audio = new Audio('./assets/beep-long-2.mp3');
      audio.volume = 0.8;
      audio.play().catch(() => {
        // Ignore play errors silently
      });
    } catch (error) {
      // Ignore errors silently
    }
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
      return `${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
  }

  private pad(val: number): string {
    return val < 10 ? `0${val}` : `${val}`;
  }
}

