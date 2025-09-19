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

    const timer$ = timer(0, 1000);
    this.subscription = timer$.subscribe(() => {
      if (!this.isTimerRunning) return; // Don't count down when paused
      
      this.remainingTime--;
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
  
      if (this.remainingTime === 0) {
        this.playBeepLong();
        this.onFinish.emit(true);
        this.subscription.unsubscribe();
      }
    });
  }

  private pauseTimer() {
    this.isTimerRunning = false;
  }

  private resumeTimer() {
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

