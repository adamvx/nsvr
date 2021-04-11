
import { EventEmitter } from 'events';
import { EEvnentType } from "../types";

const emitter = new EventEmitter();

export function publish<T>(event: EEvnentType, data: T): void {
  emitter.emit(event, data);
}

export function on<T>(event: EEvnentType | EEvnentType[], listener: (data: T) => void): void {
  const events = Array.isArray(event) ? event : [event];
  events.forEach(event => emitter.on(event, listener));
}

export function off<T>(event: EEvnentType | EEvnentType[], listener: (data: T) => void): void {
  const events = Array.isArray(event) ? event : [event];
  events.forEach(event => emitter.off(event, listener));
}

export function once<T>(event: EEvnentType | EEvnentType[], listener: (data: T) => void): void {
  const events = Array.isArray(event) ? event : [event];
  events.forEach(event => emitter.once(event, listener));
}

export function removeAll(event: EEvnentType | EEvnentType[]): void {
  const events = Array.isArray(event) ? event : [event];
  events.forEach(event => emitter.removeAllListeners(event));
}

export function subscribe<T>(event: EEvnentType | EEvnentType[], listener: (data: T) => void): void {
  removeAll(event);
  const events = Array.isArray(event) ? event : [event];
  events.forEach(event => emitter.on(event, listener));
}