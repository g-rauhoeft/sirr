import {interval, ReplaySubject} from 'rxjs';
import { bufferCount, buffer, filter } from 'rxjs/operators';
import _ from 'lodash';

export default class Sirr {
    constructor(config){
        this.state = {};
        this.config = config || {
            buffer: {
                size: 10,
                every: 1
            },
            replayBuffer: {
                size: 20
            }
        };
    }

    initLevel(currentLevel, element) {
        if (!currentLevel["*"]) {
            currentLevel["*"] = {
                subject: new ReplaySubject(this.config.replayBuffer.size)
            }
        }
        if (!currentLevel[element]) {
            currentLevel[element] = {
                subject: new ReplaySubject(this.config.replayBuffer.size)
            };
        }
    }

    publish(message) {
      let path = _.split(message.target,".");
      let currentLevel = this.state;
      _.each(path, element => {
        this.initLevel(currentLevel, element);        
        currentLevel[element].subject.next(message);
        currentLevel["*"].subject.next(message);
        currentLevel = currentLevel[element];
      })
    }

    subscribe(target, callback, buffer) {
        let path = _.split(target, ".");
        let currentLevel = this.state;
        let level = _.reduce(path, (result, element) => {
            this.initLevel(result, element);
            if (!element) {
                return result;
            }
            return result[element];
        }, currentLevel);
        if (level) {
            if (buffer) {
                if (!buffer.size && !buffer.every) {
                    buffer = this.config.buffer;    
                }
                return level.subject.pipe(bufferCount(buffer.size, buffer.every)).subscribe(callback);
            } else {
                return level.subject.subscribe(callback);
            }
        }
    }
}