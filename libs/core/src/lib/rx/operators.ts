import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export function shareReplayRefCount(bufferSize: number) {
  return <T>(source: Observable<T>) =>
    source.pipe(shareReplay({ bufferSize: bufferSize, refCount: true }));
}
