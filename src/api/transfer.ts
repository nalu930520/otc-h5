import request from '@/utils/request';

export function fetchWallet() {
  // TODO 这块 USDT 暂时写死
  return request({
    url: '/h5/wallet/usdt',
    method: 'get',
  });
}

export function fetchOrderCount() {
  return request({
    url: '/h5/order/notable/count',
    method: 'get',
  });
}

export function fetchOrderDetail(params: any) {
  return request({
    url: `/h5/order/${params}`,
    method: 'get',
  });
}

export function fetchTransaction(params: any) {
  return request({
    url: `/h5/transaction/${params}`,
    method: 'get',
  });
}

export function cancelOrPayOrder(params: any) {
  return request({
    url: '/h5/order/op/void',
    method: 'post',
    data: params,
  });
}

export function verifySign(params: any) {
  return request({
    url: '/h5/transfer',
    method: 'post',
    data: params,
  });
}

export function createOrder(params: any) {
  return request({
    url: '/h5/order',
    method: 'post',
    data: params,
  });
}

export function transferConfirm(params: any) {
  return request({
    url: '/h5/transfer/confirm',
    method: 'post',
    data: params,
  });
}

export function requestSendVcode(params: any) {
  return request({
    url: '/h5/transfer/send_vcode',
    method: 'post',
    data: params,
  });
}
