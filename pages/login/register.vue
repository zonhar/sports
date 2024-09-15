<template>
	<view class="register-wrap">
		<uni-forms ref="baseForm" :rules="rules" :modelValue="baseFormData">
			<uni-forms-item label="用户名" name="userName" required>
				<uni-easyinput v-model="baseFormData.userName" placeholder="请输入姓名" />
			</uni-forms-item>
			<uni-forms-item label="密码" name="password" required>
				<uni-easyinput type="password" v-model="baseFormData.password" placeholder="请输入密码" />
			</uni-forms-item>
			<uni-forms-item label="确认密码" name="repassword" required>
				<uni-easyinput type="password" v-model="baseFormData.repassword" placeholder="请再次输入密码" />
			</uni-forms-item>
			<!-- <uni-forms-item label="邮箱" required>
				<uni-easyinput v-model="baseFormData.email" placeholder="请输入邮箱" />
			</uni-forms-item> -->
			<uni-forms-item label="手机号" name="phonenumber" required>
				<uni-easyinput  v-model="baseFormData.phonenumber" placeholder="请输入手机号" />
			</uni-forms-item>
		</uni-forms>
		<button @click="register" type='warn'>立即注册</button>
	</view>
</template>

<script>
	import config from '@/common/config.js'
	import request from '@/common/request.js'
	import { getCurrentShop } from '@/common/util.js'
	export default {
		data() {
			return {
				baseFormData:{},
				rules: {
					userName: {
						rules: [{
							required: true,
							errorMessage: '用户名不能为空'
						}]
					},
					password: {
						rules: [{
							required: true,
							errorMessage: '密码不能为空'
						}]
					},
					repassword: {
						rules: [{
							required: true,
							errorMessage: '确认密码不能为空'
						}]
					},
					phonenumber: {
						rules: [{
							required: true,
							errorMessage: '手机号码不能为空'
						}]
					},
				}
			}
		},
		methods: {
			async register(){
				this.$refs.baseForm.validate().then(async(valid)=>{
					console.log('valid',valid)
					if(valid){
						if(this.baseFormData.password !== this.baseFormData.repassword){
							uni.showToast({
								title:'两次输入密码不一致',
								icon:'none'
							})
							return
						}
						const data = await request({
							url: `${config.baseURL}/service/open/register`,
							method:"POST",
							data:{
								...this.baseFormData,
								storeId: getCurrentShop()?.id
							},
							loading:true,
							showSuccessToast:true,
							showErrorToast:true,
						})
						uni.redirectTo({
							url:'/pages/login/otherLogin'
						})
						return
					}
					uni.showToast({
						icon:'none',
						title:'请输入后再提交'
					})
				})
			}
		}
	}
</script>

<style scoped lang='scss'>
.register-wrap{
	padding:16px;
	background-color: #fff;
}
</style>
