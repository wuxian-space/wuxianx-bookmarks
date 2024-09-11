// 将一个函数类型转换为异步的函数类型
declare type AsyncFunction<T, R = ReturnType<T>> = (...args: Parameters<T>) => Promise<R>;