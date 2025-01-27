import { Monad } from './monad'
import { maybe } from './maybe.factory'

export class Maybe<T> implements Monad<T> {

  constructor(private readonly val?: T) { }

  public map<U>(f: (t: T) => U): Monad<U> {
    return this.val ? maybe(f(this.val)) : maybe()
  }

  public flatMap<U>(f: (t: T) => Monad<U>): Monad<U> {
    return this.val ? f(this.val) : maybe()
  }

  public hasValue(): boolean {
    return !!this.val
  }

  public isEmpty(): boolean {
    return !this.val
  }
  
  public getOrUndefined(): T | undefined {
    return this.val ?? undefined 
  }

  public getOrDefault(t: T): T {
    return this.val ?? t 
  }

  public orElseGet(f: () => T): T {
    return this.val ?? f()
  }

  public orElseThrow(t: () => Error): Error {
    throw t()
  }

  public filter(f: (t: T) => boolean): Monad<T> {
    return this.val && f(this.val) ? maybe(this.val) : maybe()
  }

  public doIfEmpty(f: () => void): Monad<T> {
    if (!this.val) f()
    return this
  }

  public doIfPresent(f: (t: T) => void): Monad<T> {
    if (this.val) f(this.val)
    return this
  }

  public doOnError(f: (t: T) => void): Monad<T> {
    if(!this.val) return maybe()
    if (this.val instanceof Error) f(this.val)
    return this
  }

  public doOnErrorMatching(p: (t: T) => boolean, f: (t: T) => void): Monad<T> {
    if (!this.val) return maybe()

    if (this.val instanceof Error && p(this.val)) {
      f(this.val)
      return this
    }
    return maybe()
  }

  public onErrorMap<U>(f: (t: T) => U): Monad<U> {
    return this.val && this.val instanceof Error ? maybe(f(this.val)) : maybe()
  }

  public onErrorMapMatching<U>(p: (t: T) => boolean, f: (t: T) => U): Monad<U> {
    if (!this.val) return maybe()

    if (this.val instanceof Error) {
      return p(this.val) ? maybe(f(this.val)) : this as unknown as Monad<U>
    }
    return maybe()
  }

  public onErrorFlatMap<U>(f: (t: T) => Monad<U>): Monad<U> {
    return this.val && this.val instanceof Error
      ? f(this.val) : maybe()
  }

  public onErrorFlatMapMatching<U>(p: (t: T) => boolean, f: (t: T) => Monad<U>): Monad<U> {
    if (!this.val) return maybe()

    if (this.val instanceof Error) {
      return p(this.val) ? f(this.val) : this as unknown as Monad<U>
    }
    
    return maybe()
  }

  public switchIfEmpty<U>(u: U): Monad<U> {
    return !this.val ? maybe(u) : this as unknown as Monad<U>
  }

  public or<U>(f: () => Monad<U>): Monad<U> {
    return !this.val ? f() : this as unknown as Monad<U>
  }
}
