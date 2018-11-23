/**
 * 设置sessionStorage
 */
export const setStore = (name: string, content: string) => {
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.sessionStorage.setItem(name, content);
};

/**
 * 获取sessionStorage
 */
export const getStore = (name: string) => {
  const obj: any = window.sessionStorage.getItem(name);
  return JSON.parse(obj);
};

/**
 * 删除sessionStorage
 */
export const removeStore = (name: string) => {
  window.sessionStorage.removeItem(name);
};
