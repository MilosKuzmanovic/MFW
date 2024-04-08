import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss'],
})
export class CountdownTimerComponent implements OnInit, OnDestroy {
  @Input() durationInSeconds: number = 60;
  @Output() onFinish: EventEmitter<boolean> = new EventEmitter();
  displayTime: string = '';
  private subscription: Subscription;
  private beepAudio: HTMLAudioElement;
  private beepLongAudio: HTMLAudioElement;
  alertClass: string;

  ngOnInit() {
    this.beepAudio = new Audio('./assets/beep.mp3');
    this.beepLongAudio = new Audio('./assets/beep-long-2.mp3');
    this.startTimer();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private startTimer() {
    this.durationInSeconds = this.durationInSeconds + 1;

    const timer$ = timer(0, 1000);
    this.subscription = timer$.subscribe((tick) => {
      const remainingTime = this.durationInSeconds - tick;
      this.displayTime = this.formatTime(remainingTime - 1);

      if (remainingTime - 1 <= 10 && remainingTime > 1) {
        this.alertClass = 'time-alert'
        try {
          this.beepAudio.play();
        } catch {
          this.beepAudio = new Audio('./assets/beep.mp3');
          this.beepAudio.play();
        }
      }
  
      if (remainingTime == 1) {
        this.beepAudio.pause();
        try {
          this.beepLongAudio.play();
        } catch {
          this.beepLongAudio = new Audio('./assets/beep.mp3');
          this.beepLongAudio.play();
        }
      }

      if (remainingTime <= 0) {
        this.onFinish.emit(true);
        this.subscription.unsubscribe();
      }
    });
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
