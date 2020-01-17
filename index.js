'use strict';
require('reflect-metadata');

const {
  METHOD_METADATA,
  PATH_METADATA,
  PREFIX_METADATA,
  MIDDLEWARE_METADATA,
} = require('./constants')

const map = new Map();

const createMappingDecorator = (method) => (path, middlewareList) => {
  return (target, key, descriptor) => {
    // target 类的原型
    // descriptor.value 被修饰的方法
    // target 类的原型
    map.set(target, target);
    // 在target上添加了{path: path}
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    // 在target添加了{method: method}
    Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value);

    if (middlewareList && Array.isArray(middlewareList) && middlewareList.length) {
      Reflect.defineMetadata(MIDDLEWARE_METADATA, middlewareList, descriptor.value);
    }
  };
};

function RouterDecorator(app, options) {
  const { router } = app;

  if (options.prefix) {
    router.prefix(options.prefix);
  }
  map.forEach((value) => {
    const propertyNames = Object.getOwnPropertyNames(value)
      .filter(pName => pName !== 'constructor' && pName !== 'pathName' && pName !== 'fullPath');

    const prefix = Reflect.getMetadata(PREFIX_METADATA, value) || '';

    propertyNames.forEach(name => {
      const reqMethod = Reflect.getMetadata(METHOD_METADATA, value[name]);
      const path = Reflect.getMetadata(PATH_METADATA, value[name]);
      const middlewareList = Reflect.getMetadata(MIDDLEWARE_METADATA, value[name]) || [];
      const controller = async (ctx, next) => {
        // value 每个控制器的原型
        // value.constructor 控制器， controller
        const instance = new value.constructor(ctx);

        await instance[name](ctx);
      };

      router[reqMethod](prefix + path, ...middlewareList, controller);
    });


  });

}

// 类的装饰器，
const Prefix = (path) => {
  // 类本身
  return (target) => {
    Reflect.defineMetadata(PREFIX_METADATA, path, target.prototype);
  };
};

const Get = createMappingDecorator('get');
const Post = createMappingDecorator('post');
const Put = createMappingDecorator('put');
const Delete = createMappingDecorator('delete');


export {
  Get,
  Post,
  Put,
  Delete,
  Prefix,
  RouterDecorator
};
