interface RouterDecorator {
  (app: object, options: object): void
}

interface Decorator {
  (target: any, key: string, descriptor: PropertyDescriptor): void
}

interface SingleDecorator {
  (value: any, middlewareList?: any[]): Decorator
}

export const RouterDecorator: RouterDecorator

export const Get: SingleDecorator
export const Post: SingleDecorator
export const Put: SingleDecorator
export const Delete: SingleDecorator
