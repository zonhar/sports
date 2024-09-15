const baseUrl = 'https://apic.91bixin.net'
import { getToken,clearStorage } from './util'
/**
 * request 网络请求方法
 * @param {url} string
 * @param {method} string
 * @param {data} object
 * @param {header} object
 * @param {timeout} number
 * @param {loading} boolean
 * @param {loadingText} string
 * @param {showSuccessToast} boolean
 * @param {showErrorToast} boolean
 * @param {silence} boolean
 * @param {successMsg} string
 * @param {errorMsg} string
 * @param {originalResponse} boolean
 * @return {promise}
*/ 
const request = (options)=>{
    options.loading && uni.showLoading({
        title: options.loadingText || '加载中',
    })
    return new Promise((resolve,reject)=>{
		const token = getToken()
		const header = options.url.indexOf('/api')>-1?{
			'content-type': 'application/json',
			...options.header
			}:{
			'content-type': 'application/json',
			'Authorization': `Bearer ${token}`,
			...options.header
		};
		console.warn('options',options)
        uni.request({
            url:options.url.indexOf('http')===0?options.url:(baseUrl+options.url),
            method:options.method || 'GET',
            data:options.data,
            header,
            timeout:options.timeout || 60000,
            success:(res)=>{
				console.warn('success',res)
                const {data}=res
                if(data.code===200 || data.code === 1 || data.status==='success' || data.errcode===0){
					!options.silence && options.showSuccessToast &&  uni.showToast({
                        title: options.successMsg || data.msg,
                        icon:'success'
                    })
                    options.loading && uni.hideLoading()
                    resolve(options.originalResponse ? data : data.data)
                    return 
                }
                if(data.code === 401){
                    clearStorage()
					options.loading && uni.hideLoading()
                    uni.navigateTo({
                      url: '/pages/login/login',
                    })
                    return
                }
                !options.silence && options.showErrorToast && uni.showToast({
                  title: options.errorMsg || data.msg,
                  icon:'error'
                })
                options.loading && uni.hideLoading()
                reject(data)
            },
            fail:(error)=>{
				console.log('error',error)
                reject(error)
                !options.silence && options.showErrorToast && uni.showToast({
                    title: error.message,
                    icon:'error'
                })
                options.loading && uni.hideLoading()
            }
        })
    })
}
export default request;