<template>
	<view>
		<view class="wrapper">
			<view class="wrapper-item">
				<text class="tit">头像</text>
				<view class="image" @click="uploadAvatar">
					<image v-if="userInfo?.avatar" mode="scaleToFill"  :src="`${baseURL}${userInfo.avatar}`"></image>
					<image v-else-if="userInfo?.avatar"  :src="`${userInfo.avatar}`"></image>
					<uni-icons v-else type="person-filled" size="40" color="#999"></uni-icons>
				</view>	
			</view>
			<uni-list>
				<uni-list-item
					showArrow 
					clickable
					@click="goPersonal('/pages/personal/component/nick/nick?info=' + encodeURIComponent(JSON.stringify(this.userInfo)))"
					title="昵称" 
					:right-text="userInfo?.nickName"
				/>
				<uni-list-item
					showArrow 
					clickable
					@click="goPersonal('/pages/personal/component/phonenumber/phonenumber?info=' + encodeURIComponent(JSON.stringify(this.userInfo)))"
					title="手机号" 
					:right-text="userInfo?.phonenumber"
				/>
				<uni-list-item
					showArrow 
					clickable
					@click="goPersonal('/pages/personal/component/email/email?info=' + encodeURIComponent(JSON.stringify(this.userInfo)))"
					title="邮箱" 
					:right-text="userInfo?.email"
				/>
			</uni-list>
		
		</view>
		<view @click="exit" class="logout">
			<text>退出当前账户</text>
		</view>
	</view>
</template>

<script>
	import config from '@/common/config.js'
	import request from '@/common/request.js'
	import { getCurrentShop, getUserInfo ,setUserInfo } from '@/common/util'
	export default {
		data() {
			return {
				baseURL:config.baseURL,
				userInfo:{},
				dbUserInfo: {}
			}
		},
		methods: {
			
			goPersonal(url){
				uni.navigateTo({
					url
				})
			},
			uploadAvatar(){
				const that = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album','camera'], //从相册选择
					success:  (res)=> {
						console.log(JSON.stringify(res.tempFilePaths));
						// that.userInfo.localAvatar ='';
						// uni.setStorageSync('userInfo',getUserInfo)
						uni.uploadFile({
							url: `${config.baseURL}/service/upload`, 
							filePath:  res.tempFilePaths[0],
							name: 'file',
							header: {
								'Authorization': `Bearer ${uni.getStorageSync('token')}`
							},
							success: (res) => {
								console.log('res',res)
								if(res.code == 401 || res.code == 500){
									uni.showModal({
										content: '上传失败',
										showCancel: false
									})
								}else {
									console.log('userInfo',that.userInfo)
									that.userInfo.avatar = JSON.parse(res.data).fileName;
									that.dbUserInfo.avatar =JSON.parse(res.data).fileName;
									that.updateCustomer(that.dbUserInfo);
								}
							}
						});
					}
				});
			},
			async getRequstUserUnfo() {
				const options = {
					url: `${config.baseURL}/service/customer/getCustomerByUserId`,
					method: 'get',
					data: {
						"userId": this.userInfo?.userId
					}
				}
				const data = await request(options);
				this.dbUserInfo = data;
			},
			async updateCustomer(datas) {
				const options = {
					url: `${config.baseURL}/service/customer/updateCustomer`,
					method: 'post',
					data: datas
				}
				const data = await request(options);
				if (data.code == 200) {
					setUserInfo('userInfo', this.userInfo)
					//更新缓存
					uni.showToast({
						title: '修改成功',
						icon: 'success',
						duration: 1000
					});
			
					setTimeout(function() {
						//返回上一页
						uni.navigateBack({
							delta: 1,
						});
					}, 500)
				} else {
					uni.showToast({
						title: '修改失败',
						icon: 'error',
						duration: 1000
					})
				}
			},
			clearUserInfo(){
				uni.removeStorageSync('token')
				uni.removeStorageSync('userInfo')
				getApp().globalData.userInfo=null
			},
			exit(){
				uni.showModal({
					title: '提示',
					content: '您确定要退出登陆吗？',
					confirmText: '确定',
					cancelText: '取消',
					success: async(res)=> {
						if (res.confirm) {
							try{
								await request({
									url:`${config.baseURL}/logout`,
								})
							}catch(e){
								console.log(e)
								//TODO handle the exception
							}
							
							this.clearUserInfo()
							uni.redirectTo({
								url:'/pages/scan/scan'
							})
							
						}
					}
				});
			}
		},
		onShow(){
			this.userInfo = getUserInfo()
			this.getRequstUserUnfo();
		}
	}
</script>

<style scoped lang='scss'>
.wrapper{
	padding:10px 0;
	background-color: #fff;
}
.wrapper-item{
	display: flex;
	flex-direction: row;
	align-items: center;
	border-bottom:1px solid #f5f5f5;
	padding:12px;
	.tit{
		flex:1;
	}
	.image {
		width: 50px; 
		height: 50px;
		border-radius:50%;
		background-color: #f2f2f2;
		text-align:center;
		line-height:50px;
		overflow: hidden;
		image{
			width:100%;
			height:100%;
		}
	}
	
}
.wrapper-item:last-child{
	border-bottom:0;
}
.tit{
	color:#333;
	font-size:14px;
}
.logout{
	margin-top:12px;
	padding:12px;
	text-align: center;
	font-size:16px;
	color: royalblue;
	background-color: #fff;
}
</style>
