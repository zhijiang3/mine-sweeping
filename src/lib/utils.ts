const userAgent = navigator.userAgent;

export const isMacOS = /macintosh|mac os x/i.test(userAgent);
export const isWindows = /windows|win32/i.test(userAgent);
