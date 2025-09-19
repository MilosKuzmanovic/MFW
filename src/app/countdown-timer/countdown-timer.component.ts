import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss'],
})
export class CountdownTimerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() durationInSeconds: number = 60;
  @Output() onFinish: EventEmitter<boolean> = new EventEmitter();
  displayTime: string = '';
  private subscription: Subscription;
  private beepAudio: HTMLAudioElement;
  private beepLongAudio: HTMLAudioElement;
  alertClass: string;
  remainingTime: number;
  private lastBeepTime: number = 0;

  ngOnInit() {
    this.beepAudio = new Audio('./assets/beep.mp3');
    this.beepLongAudio = new Audio('./assets/beep-long-2.mp3');
    this.startTimer();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['durationInSeconds'] && !changes['durationInSeconds'].firstChange) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.lastBeepTime = 0; // Reset beep tracking
      this.startTimer();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private startTimer() {
    this.remainingTime = this.durationInSeconds;
    this.lastBeepTime = 0;

    const timer$ = timer(0, 1000);
    this.subscription = timer$.subscribe((tick) => {
      this.remainingTime = this.durationInSeconds - tick;
      this.displayTime = this.formatTime(this.remainingTime);

      if (this.remainingTime <= 10 && this.remainingTime > 0) {
        this.alertClass = 'time-alert';
        // Play beep only once per second and only for specific remaining times
        if (this.remainingTime !== this.lastBeepTime) {
          this.playBeep();
          this.lastBeepTime = this.remainingTime;
        }
      }
  
      if (this.remainingTime === 0) {
        this.playBeepLong();
        this.onFinish.emit(true);
        this.subscription.unsubscribe();
      }
    });
  }

  private playBeep() {
    try {
      // Stop any currently playing audio
      this.beepAudio.pause();
      this.beepAudio.currentTime = 0;
      
      // Play the beep
      this.beepAudio.play().catch((error) => {
        console.log('Beep play failed:', error);
        // Try to reload and play again
        this.beepAudio.load();
        this.beepAudio.play().catch(() => {
          // Final fallback - ignore
        });
      });
    } catch (error) {
      console.log('Beep error:', error);
    }
  }

  private playBeepLong() {
    try {
      // Stop any currently playing audio
      this.beepAudio.pause();
      this.beepLongAudio.pause();
      this.beepLongAudio.currentTime = 0;
      
      // Play the long beep
      this.beepLongAudio.play().catch((error) => {
        console.log('Long beep play failed:', error);
        // Try to reload and play again
        this.beepLongAudio.load();
        this.beepLongAudio.play().catch(() => {
          // Final fallback - ignore
        });
      });
    } catch (error) {
      console.log('Long beep error:', error);
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

