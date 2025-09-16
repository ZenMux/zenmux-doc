/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import axios from 'axios';

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  // 从 cookie 里么读取 ctoken
  // 放到 query 里
  const url = new URL(config.url || '', 'https://zenmux.ai');
  const ctoken = typeof document !== 'undefined' 
    ? document.cookie
        .split('; ')
        .find((row) => row.startsWith('ctoken='))
        ?.split('=')[1]
    : undefined;
  if (ctoken) {
    url.searchParams.set('ctoken', ctoken);
  }
  config.url ='https://zenmux.ai' + url.pathname + url.search;
  return config;
}, (error) => {
  // 对请求错误做些什么
  return Promise.reject(error);
});

/** 此处后端没有提供注释 GET api/user/info */
export async function info(options?: { [key: string]: any }) {
  return axios<{
    success?: boolean;
    data: {
      userId?: string;
      accountId?: string;
      loginType?: string;
      avatarUrl?: string;
      displayName?: string;
      email?: string;
      connectedAccounts?: Array<{
        id?: string;
        provider?: string;
        nickname?: string;
      }>;
    };
  }>('https://zenmux.ai/api/user/info', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST api/user/logout */
export async function logout(options?: { [key: string]: any }) {
  return axios<{ success?: boolean; data: Record<string, any> }>(
    'https://zenmux.ai/api/user/logout',
    {
      method: 'POST',
      ...(options || {}),
    },
  );
}
