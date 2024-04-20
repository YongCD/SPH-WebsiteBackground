import request from '@/utils/request'
// 获取品牌列表接口
export const reqTradeMarkList = (page, limit) => request({url:`/admin/product/baseTrademark/${page}/${limit}`})

// 处理添加品牌与修改品牌
// 因为携带的数据差不多，封装成一个函数
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  if(tradeMark.id) {
    return request({method:'put', url:'/admin/product/baseTrademark/update', data:tradeMark})
  }else {
    return request({method:'post', url:'/admin/product/baseTrademark/save', data:tradeMark})
  }
}

// 删除品牌
export const reqRemoveTradeMark = (id) => request({url:`/admin/product/baseTrademark/remove/${id}`, method:'delete'})