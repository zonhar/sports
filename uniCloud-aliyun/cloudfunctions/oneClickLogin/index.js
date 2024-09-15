exports.main = async function (event, context){
  const res = await uniCloud.getPhoneNumber({
    appid: "__UNI__8D2502A", // 客户端callFunction时携带的AppId信息
    provider: 'univerify',
    access_token: event.access_token,
    openid: event.openid
  })
  // 执行入库等操作，正常情况下不要把完整手机号返回给前端
  console.log('执行入库',res)
  return {
    code: 0,
    message: '获取手机号成功',
	data:res
  }
}