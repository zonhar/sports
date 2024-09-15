<template>
	<view style="margin-left: 20rpx;margin-right: 20rpx;margin-top: 30rpx;">
		<uni-card is-full :is-shadow="false">
			<view style="margin-top: 30rpx;">

				<uni-forms ref="form" :modelValue="userInfo" :rules="rules">

					<uni-forms-item label="邮箱" name="email">
						<uni-easyinput type="text" v-model="userInfo.email" placeholder="请输入邮箱" />
					</uni-forms-item>


					<view class="uni-btn-v">
						<button style="background-color: #D42C33;color: aliceblue;" @click="formSubmit()"
							:loading="loading">保存</button>
					</view>
				</uni-forms>
			</view>
		</uni-card>
	</view>
</template>

<script>
	import {
		getCurrentShop,
		getUserInfo,
		setUserInfo
	} from '@/common/util'
	import config from '@/common/config.js'
	import request from '@/common/request.js'
	export default {
		data() {
			return {
				userInfo: {},
				dbUserInfo: {},
				loading: false,
				rules: {
					// 对name字段进行必填验证
					email: {
						rules: [{
								required: true,
								errorMessage: '请输入邮箱',
							},
							{
								validateFunction: function(rule, value, data, callback) {
									let email_reg =
										/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

									if (!email_reg.test(value)) {
										callback('邮箱格式不正确，请重新填写')
									}
								}
							}
						]
					}
				}
			}
		},
		methods: {
			formSubmit(e) {
				const that = this;
				this.$refs.form.validate().then(res => {
					that.dbUserInfo.email = that.userInfo.email;
					that.updateCustomer(that.dbUserInfo);
				}).catch(err => {
					console.log('表单错误信息：', err);
				})
			},
			async getRequstUserUnfo(){
				const options = {
					url:`${config.baseURL}/service/customer/getCustomerByUserId`,
					method:'get',
					data:{
						"userId": this.userInfo?.userId
					}
				}
				const data = await request(options);
				this.dbUserInfo = data;
			},
			async updateCustomer(datas){
				const options = {
					url:`${config.baseURL}/service/customer/updateCustomer`,
					method:'post',
					data:datas
				}
				const data = await request(options);
				if(data.code == 200){
					setUserInfo('userInfo',this.userInfo)
					//更新缓存
					uni.showToast({
						title: '修改成功',
						icon: 'success',
						duration:1000
					});
					setTimeout(function() {
						//返回上一页
						uni.navigateBack({
							delta: 1,
						});
					}, 500)
				}else {
					uni.showToast({
						title: '修改失败',
						icon: 'error',
						duration:1000
					})
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		onShow() {
			
			this.userInfo = getUserInfo();
			this.dbUserInfo =this.getRequstUserUnfo();
		}
	}
</script>

<style>

</style>