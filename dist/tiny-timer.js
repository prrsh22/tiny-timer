var events = require('events');

class Timer extends events.EventEmitter {
  constructor({
    interval = 1000,
    stopwatch = false
  } = {}) {
    super();
    this._duration = 0;
    this._endTime = 0;
    this._pauseTime = 0;
    this._status = 'stopped';

    this.tick = () => {
      if (this.status === 'paused') return;

      if (Date.now() >= this._endTime) {
        this.stop();
        this.emit('tick', this._stopwatch ? this._duration : 0);
        this.emit('done');
      } else {
        this.emit('tick', this.time);
      }
    };

    this._interval = interval;
    this._stopwatch = stopwatch;
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
    if (this._timeoutID) clearInterval(this._timeoutID);

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
  } //시간 분단위로 추가, 차감하는 함수: 추가의 경우 amount가 양수, 차감의 경우 음수
  // amount는 ms 단위 말고 분단위로. 함수 내에서 ms화


  changeDuration(amount) {
    const amountInMs = amount * 60 * 1000;

    if (this._endTime + amountInMs < 3000) {
      alert('차감이 불가합니다!');
      return;
    } else {
      this._endTime += amountInMs;
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
