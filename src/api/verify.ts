import request from '@/utils/request';

export function sendVerifyCode(params: any) {
  return request({
    url: '/h5/send_verify_code',
    method: 'post',
    data: params,
  });
}

export function verifyCode(params: any) {
  return request({
    url: '/h5/verify_code',
    method: 'post',
    data: params,
  });
}

export function verifyPin(params: any) {
  return request({
    url: '/h5/verify_pin',
    method: 'post',
    data: params,
  });
}

export function customerInfo(params: any) {
  return request({
    url: '/h5/customer_info',
    method: 'get',
    params,
  });
}
