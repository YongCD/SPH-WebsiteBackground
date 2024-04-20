import request from '@/utils/request'

// 获取sku列表
export const reqGetSkuList = (page, limit) => request({url: `/admin/product/list/${page}/${limit}`})

// 上架操作
export const reqOnSale = skuId => request({url: `/admin/product/onSale/${skuId}`})

// 下架操作
export const reqCancelSale = skuId => request({url: `/admin/product/cancelSale/${skuId}`})

// 通过skuId得到sku详情
export const reqGetSkuDetail = skuId => request({url: `/admin/product/getSkuById/${skuId}`})

// 删除某个sku
export const reqDeleteSku = skuId => request({url: `/admin/product/deleteSku/${skuId}`, method:'delete'})