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
  private audio: HTMLAudioElement;

  ngOnInit() {
    this.audio = new Audio('./assets/beep.mp3'); // Adjust the path to your sound file
    this.startTimer();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private startTimer() {
    const timer$ = timer(0, 1000);
    this.subscription = timer$.subscribe((tick) => {
      const remainingTime = this.durationInSeconds - tick;
      this.displayTime = this.formatTime(remainingTime);

      if (remainingTime <= 0) {
        this.onFinish.emit(true);
        this.subscription.unsubscribe();
      }
    });
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (remainingSeconds < 10) {
      this.audio?.play();
    }

    return `${this.pad(minutes)}:${this.pad(remainingSeconds)}`;
  }

  private pad(val: number): string {
    return val < 10 ? `0${val}` : `${val}`;
  }
}
