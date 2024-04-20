import request from '@/utils/request'

// 获取一级分类数据的接口
export const reqGetCategory1 = () => request({url:'/admin/product/getCategory1'})

// 获取二级分类数据的接口
export const reqGetCategory2 = category1Id => request({url:`/admin/product/getCategory2/${category1Id}`})

// 获取三级分类数据的接口
export const reqGetCategory3 = category2Id => request({url:`/admin/product/getCategory3/${category2Id}`})

// 获取属性信息列表的接口
export const reqGetAttrInfoList = (category1Id, category2Id, category3Id) => request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`})

// 请求添加属性与属性值接口
export const reqAddAttr = data => request({url:'/admin/product/saveAttrInfo', method:'post', data})

// 删除属性的接口
export const reqDeleteAttr = attrId => request({url:`/admin/product/deleteAttr/${attrId}`, method: 'delete'})