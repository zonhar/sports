<template>
	<view>
		<view class="shop-banner">
			<image style="width:100%;" class="image" mode="widthFix" :src="`${baseURL}${currentShop.storePicture}`" />
		</view>
		<view class="shop-item">
			<view class="title"><text>{{currentShop.storeName}}</text><uni-tag type="warning" :text="currentShop.authenticationInformation"></uni-tag></view>
			<view class="desc"><text>店铺已于{{currentShop.authenticationTime}}通过实名认证</text></view>
		</view>
		<view class="shop-item shop-service">
			<view class="tit"><text>本店服务</text></view>
			<view class="shop-wrap">
				<view class="shop-block" style="border-bottom:1px solid #ddd;" @click="goDetail('/pages/shop/shopTip1')">
					<view class="shop-content">
						<view class="title"><text>代存票</text></view>
						<view class="desc"><text>本店可免费为您保管所出彩票，点击查看详情</text></view>
					</view>
					<text style="margin-left:5px;font-size:18px;color:#999;" class="uni-navigate-icon uni-icon">&#xe470;</text>
				</view>
			</view>
			<view class="shop-wrap">
				<view class="shop-block" @click="goDetail('/pages/shop/shopTip2')">
					<view class="shop-content">
						<view class="title"><text>代兑付</text></view>
						<view class="desc"><text>金额小于等于50000元的奖金，本店可代为兑付</text></view>
					</view>
					<text style="margin-left:5px;font-size:18px;color:#999;" class="uni-navigate-icon uni-icon">&#xe470;</text>
				</view>
			</view>
		</view>
		<view class="btn" >
			<button @click="bindOrUnbind" type="warn">{{text}}</button>
		</view>
	</view>
</template>

<script>
	import request from '@/common/request.js';
	import config from '@/common/config.js'
	import { getCurrentShop,setShop,getShop } from '@/common/util';
	export default {
		data() {
			return {
				currentShop:{},
				text:'绑定店铺',
				baseURL: config.baseURL
			}
		},
		computed:{
			title(){
				return this.text==='绑定店铺'?'绑定店铺':'解绑店铺?'
			},
			content(){
				return this.text==='绑定店铺'?'绑定后方便本店为您提供更多优质服务。':'解除绑定后，您与店铺的关系将取消，可能会影响您的功能使用，请确认后再操作。'
			}
		},
		methods: {
			goDetail(url){
				uni.navigateTo({
					url
				})
			},
			async doBind(){
				const options = {
					"userId":getApp().globalData.userInfo.userId,
					"storeId":getApp().globalData.currentShop.id
				}
				try{
					const data = await request({
						url:this.text==='绑定店铺'?`${config.baseURL}/service/customer/binding`:`${config.baseURL}/service/customer/untie`,
						method:'POST',
						data:options,
						loading:true
					})
					uni.showToast({
						title: this.text==='绑定店铺'?'绑定成功':'解绑成功'
					})
					this.text= this.text==='绑定店铺'?'解绑店铺':'绑定店铺'
					this.handleStore()
				}catch(e){
					uni.showToast({
						title:e.msg,
						icon:'error'
					})
					//TODO handle the exception
				}
				
			},
			handleStore(){
				if(this.text==='绑定店铺'){
					const currentShop =  getCurrentShop()
					let shopList  = getShop()
					shopList = shopList.filter(o=>o.id!==currentShop.id)
					console.log('shopList==',shopList)
					setShop('shopList',shopList)
				}
			},
			bindOrUnbind(){
				uni.showModal({
					title: this.title,
					content: this.content,
					confirmText: '确定',
					cancelText: '取消',
					success: (res)=> {
						if (res.confirm) {
							this.doBind()
							
						}
					}
				});
			},
		},
		onShow(){
			this.currentShop = getCurrentShop()
			const userInfo = getUserInfo()
			this.text= '绑定店铺'
		}
	}
</script>

<style scoped lang="scss">
.shop-banner{
	padding:10px;
}

.shop-item{
	padding:10px 15px;
	background-color: #fff;
	margin-bottom: 12px;
	.tit{
		border-bottom:1px solid #ddd;
		padding:10px 15px;
		margin-bottom:10px;
	}
	.title{
		color:#333;
		font-size:14px;
		margin-bottom:5px;
		text{
			margin-right:10px;
		}
	}
	.desc{
		color:#666;
		font-size:12px;
	}
}
.shop-service{
	padding:0;
}
.shop-wrap{
	padding:0 15px;
}
.shop-block{
	padding:10px 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	.shop-content{
		flex:1;
	}
}
.btn{
	position: fixed;
	bottom:0;
	left:0;
	padding:10px;
	width:100%;
	z-index:100;
	box-sizing: border-box;
}
</style>
