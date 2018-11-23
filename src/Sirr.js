import {ReplaySubject} from 'rxjs';
import {bufferCount} from 'rxjs/operators';
import _ from 'lodash';

export default class Sirr {
    constructor(config){
        this.levels = {};
        if(!config) { config = {} };
        this.config = _.defaultsDeep(config, {
            buffer: {
                size: 10,
                every: 1
            },
            replayBuffer: {
                size: 20
            },
            pathSeparator: "."
        });
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
      let path = _.split(message.target, this.config.pathSeparator);
      let currentLevel = this.levels;
      _.each(path, element => {
        this.initLevel(currentLevel, element);        
        currentLevel[element].subject.next(message);
        currentLevel["*"].subject.next(message);
        currentLevel = currentLevel[element];
      })
    }

    subscribe(target, callback, buffer) {
        let path = _.split(target, this.config.pathSeparator);
        let currentLevel = this.levels;
        let level = _.reduce(path, (result, element) => {
            this.initLevel(result, element);
            if (!element) {
                return result;
            }
            return result[element];
        }, currentLevel);
        if (level) {
            if (buffer) {
                if (buffer.size === undefined) {
                    buffer.size = this.config.buffer.size;
                }
                if(buffer.every === undefined) {
                    buffer.every = this.config.buffer.every;
                }
                return level.subject.pipe(bufferCount(buffer.size, buffer.every)).subscribe(callback);
            } else {
                return level.subject.subscribe(callback);
            }
        }
    }
}

export var __useDefault = true;