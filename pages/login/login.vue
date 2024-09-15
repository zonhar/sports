<template>
	<view class="login-wrap">
		<image class="image" mode="widthFix" src="../../static/logo.png" />	
		<view class="login-btns">
			<button @click="oneKeylogin" type='warn'>一键登陆</button>
			<button style="margin-top:20px;" @click="otherLogin">其它登陆方式</button>
		</view>
		<view class="tip"><text>还没有账号？ <text style="color:#cc0002" @click="register">立即注册</text></text></view>
	</view>
</template>

<script>
	import config from '@/common/config.js'
	import { setToken, setUserInfo } from '@/common/util.js'
	import request from '@/common/request.js'
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			async oneKeylogin(){
				uni.login({
					provider: 'univerify',
					univerifyStyle: {
				    fullScreen: true
				  }
				}).then(async(data)=>{
					const {openid,access_token} = data.authResult
					console.log(openid,access_token)
					uniCloud.callFunction({
					  name: 'oneClickLogin', // 你的云函数名称
					  data: {
					    access_token, // 客户端一键登录接口返回的access_token
					    openid // 客户端一键登录接口返回的openid
					  }
					}).then(async(res) => {
						console.log('res',res)
						// uni.showToast({
						// 	title:JSON.stringify(res.result.data),
						// 	icon:'none',
						// 	duration:10000
						// })
						
						uni.closeAuthView()
						
						const data = await request({
							url:`${config.baseURL}/service/open/login`,
							method:'post',
							data:{
								deviceId: this.deviceInfo?.deviceId,
								loginType: 1,
								phonenumber:res.result.data.phoneNumber
							},
							loading:true,
							showSuccessToast:false,
							showErrorToast:false
						})
						// console.log('data',data)
						setToken('token',data.loginToken)
						setUserInfo('userInfo',data)
						uni.switchTab({
							url:'/pages/tabBar/home/home'
						})
					    
					}).catch(err=>{
						// uni.showModal({
						// 	title: '提示',
						// 	content: 'err:'+JSON.stringify(err),
						// 	success: function (res) {
						// 		if (res.confirm) {
						// 			console.log('用户点击确定');
						// 		} else if (res.cancel) {
						// 			console.log('用户点击取消');
						// 		}
						// 	}
						// });
						console.log('err',err)
					  // 处理错误
					})
					
				})
				// const data = await request({
				// 	url:`${config.baseURL}/service/open/login`,
				// 	method:'post',
				// 	data:{
				// 		deviceId: this.deviceInfo?.deviceId,
				// 		loginType: 0
				// 	},
				// 	loading:true,
				// 	showSuccessToast:true,
				// 	showErrorToast:true
				// })
				// setToken('token',data.loginToken)
				// setUserInfo('userInfo',data)
				// uni.switchTab({
				// 	url:'/pages/tabBar/home/home'
				// })
			},
			otherLogin(){
				uni.navigateTo({
					url:'/pages/login/otherLogin'
				})
			},
			register(){
				uni.navigateTo({
					url:'/pages/login/register'
				})
			},
			
		},
		onLoad(){
			this.deviceInfo = uni.getDeviceInfo()
		}
	}
</script>

<style scoped lang='scss'>
.image{
	width:80px;
	height:80px;
}
.login-wrap{
	text-align: center;
	padding:30px 0;
	background-color: #fff;
}
.login-btns{
	padding:16px;
}
.tip{
	text-align: center;
	color:#666;
	margin-top:30px;
}
</style>
