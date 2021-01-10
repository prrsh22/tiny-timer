var events = require('events');

class Timer extends events.EventEmitter {
  constructor({
    interval = 1000,
    stopwatch = false,
    defaultDuration = 30 * 1000 * 60
  } = {}) {
    super();
    this._pauseTime = 0;
    this._status = 'stopped';

    this.tick = () => {
      if (this.status === 'paused') return;

      if (Date.now() >= this._endTime) {
        this.stop();
        this.emit('tick', this._stopwatch ? this._duration : 0);
        this.emit('done'); // 타이머 끝나면 또 defaultDuration으로

        this.changeDuration(this._defaultDuration - this._duration);
      } else {
        this.emit('tick', this.time);
      }
    };

    this._interval = interval;
    this._stopwatch = stopwatch;
    this._defaultDuration = defaultDuration;
    this._duration = defaultDuration;
    this._endTime = Date.now() + defaultDuration;
  }

  start(duration, interval) {
    if (this.status !== 'stopped') return;
    if (duration == null) throw new TypeError('Must provide duration parameter');
    this._duration = duration;
    this._endTime = Date.now() + duration;

    this._changeStatus('running');

    this.emit('tick', this._stopwatch ? 0 : this._duration);
    this._timeoutID = setInterval(this.tick, interval || this._interval);
  }

  stop() {
    if (this._timeoutID) clearInterval(this._timeoutID); // 스탑시 기본 duration으로 duration 재설정

    this.changeDuration(this._defaultDuration - this._duration);

    this._changeStatus('stopped');
  }

  pause() {
    if (this.status !== 'running') return;
    this._pauseTime = Date.now();

    this._changeStatus('paused');
  }

  resume() {
    if (this.status !== 'paused') return;
    this._endTime += Date.now() - this._pauseTime;
    this._pauseTime = 0;

    this._changeStatus('running');
  } //시간 ms단위로 추가, 차감하는 함수: 추가의 경우 amount가 양수, 차감의 경우 음수


  changeDuration(amount) {
    if (this._endTime + amount < 3000) {
      alert('차감이 불가합니다!');
      return;
    } else {
      this._duration += amount;
      this._endTime += amount;
      this.emit('durationChanged', this._duration, amount);
    }
  }

  _changeStatus(status) {
    this._status = status;
    this.emit('statusChanged', this.status);
  }

  get time() {
    if (this.status === 'stopped') return 0;
    const time = this.status === 'paused' ? this._pauseTime : Date.now();
    const left = this._endTime - time;
    return this._stopwatch ? this._duration - left : left;
  }

  get duration() {
    return this._duration;
  }

  get status() {
    return this._status;
  }

}

module.exports = Timer;
//# sourceMappingURL=tiny-timer.js.map
