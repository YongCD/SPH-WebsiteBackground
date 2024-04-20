import request from '@/utils/request'

// 获取SPU列表数据的接口
export const reqSpuList = (page, limit, category3Id) => request({url:`/admin/product/${page}/${limit}`, params:{category3Id}})

// 获取某个spu的基本信息
export const reqSpuInfo = spuId => request({url:`/admin/product/getSpuById/${spuId}`})

// 获取品牌的信息
export const reqTradeMarkList = () => request({url:'/admin/product/baseTrademark/getTrademarkList'})

// 获取SPU图片的接口
export const reqSpuImageList = spuId => request({url:`/admin/product/spuImageList/${spuId}`})

// 获取平台全部销售属性（就只有三个）
export const reqBaseSaleAttrList = () => request({url:'/admin/product/baseSaleAttrList'})

// 修改或添加SPU
export const reqAddOrUpdateSpu = spuInfo => {
  if(spuInfo.id) return request({url:'/admin/product/updateSpuInfo', method: 'post', data: spuInfo})
  return request({url:'/admin/product/saveSpuInfo', method:'post', data: spuInfo})
}

// 删除SPU
export const reqDeleteSpu = spuId => request({url: `/admin/product/deleteSpu/${spuId}`, method: 'delete'})

// 获取某个spu的销售属性列表
export const reqSpuSaleAttrList = spuId => request({url: `/admin/product/spuSaleAttrList/${spuId}`})

// 给某个spu添加sku
export const reqAddSku = skuInfo => request({url: '/admin/product/saveSkuInfo', method: 'post', data: skuInfo})

// 通过spuId查找当前spu的sku列表
export const reqGetSkuList = spuId => request({url: `/admin/product/findBySpuId/${spuId}`})