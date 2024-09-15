<template>
	<view class="login-wrap">
		<view class="form-item">
			<input :value="username" class="uni-input" @input="changeUsername" focus placeholder="请输入用户名" />
			<text class="uni-icon" v-if="showUsernameClearIcon" @click="clearUserIcon">&#xe434;</text>
		</view>
		<view class="form-item">
			<input class="uni-input" @input="changePassword" placeholder="请输入密码" :password="showPassword" />
			<uni-icons 
				size="20" 
				:type="[!showPassword ? 'eye-filled' : 'eye-slash-filled']" 
				@click="changeShowPassword">
			</uni-icons>
		</view>　
		<view class="login-btns">
			<button @click="login" type='warn'>登陆</button>
		</view>
	</view>
</template>

<script>
	import config from '@/common/config.js'
	import request from '@/common/request.js'
	import { setToken,setUserInfo } from '@/common/util.js'
	export default {
		data() {
			return {
				showUsernameClearIcon:false,
				showPassword: true,
				username:'',
				password:"",
			}
		},
		methods: {
			clearUserIcon(){
				this.username=''
				this.showUsernameClearIcon=false
			},
			async login(){
				if(!this.username || !this.password){
					uni.showToast({
						icon:'none',
						title:'请输入用户名或密码'
					})
					return
				}
				try{
					const data = await request({
						url: `${config.baseURL}/service/open/accountLogin`,
						method:"POST",
						data:{
							userName:this.username,
							password:this.password
						},
						loading:true,
						showSuccessToast:true,
						showErrorToast:true
					})
					setToken('token',data.loginToken)
					setUserInfo('userInfo',data)
					uni.switchTab({
						url:'/pages/tabBar/home/home'
					})
				}catch(e){
					//TODO handle the exception
					console.log(e)
				}
				
			},
			changeShowPassword(){
				 this.showPassword = !this.showPassword;
			},
			changeUsername(e){
				this.username = e.detail.value
				this.showUsernameClearIcon = this.username?true:false
			},
			changePassword(e){
				this.password=e.detail.value
			}
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
	background-color: #fff;
	padding:10px;
}
.login-btns{
	padding:16px;
}
.form-item{
	display: flex;
	flex-direction: row;
	align-items: center;
	border:1px solid #ddd;
	padding:10px;
	margin-bottom:10px;
	height:30px;
	input{
		flex:1;
		text-align: left;
	}
}
</style>
