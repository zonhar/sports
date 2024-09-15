<template>
	<view>
		<view :style="{ height: iStatusBarHeight + 'px',backgroundColor:'#cc0002'}"></view>
		<view style="background-color: #cc0002;">
			<view class="user">
				<view class="image">
					<image v-if="userInfo?.avatar" @click="showAvatar()" mode="widthFix"  :src="`${baseURL}${userInfo?.avatar}`"></image>
					<image v-else-if="userInfo?.localAvatar" mode="widthFix"  :src="`${userInfo?.localAvatar}`"></image>
					<uni-icons v-else type="person-filled" size="48" color="#999"></uni-icons>
				</view>	
				<text class="user-text">{{userInfo?.phonenumber}}</text>
				<view class="user-icon" @click="goPersonal('/pages/personal/personal?info=' +  encodeURIComponent(JSON.stringify(this.userInfo)))"><text class="uni-navigate-icon uni-icon">&#xe470;</text></view>
			</view>
			<view class="my-banner">
				<view class="banner-l">
					<view><text style="font-size:12px;">账户余额</text></view>
					<view><text class="tit">{{balance.toFixed(2)}}</text></view>
				</view>
				<view class="banner-r">
					<view class="btn-item" @click="onCharge">预存</view>
				</view>
			</view>
		</view>
		<view class="block-wrap">
			<view class="block">
				<view @click="onItemClick(item)" class="block-item" v-for="item in records" :key="item.id">
					<uni-icons :type="item.type" size="28" :color="item.color"></uni-icons>
					<text>{{item.title}}</text>
				</view>
			</view>
			<!-- <view class="block"> -->
				<uni-list>
					<uni-list-item 
						:show-extra-icon="true" 
						showArrow 
						:extra-icon="{
							color: '#666',
							size: '22',
							type: 'wallet'
						}" 
						clickable
						@click="goPersonal('/pages/ledgerDetail/ledgerDetail')"
						title="账户明细" 
					/>
					<uni-list-item
						:show-extra-icon="true" 
						showArrow 
						clickable
						@click="goPersonal('/pages/personal/personal')"
						:extra-icon="{
							color: '#666',
							size: '22',
							type: 'auth'
						}" 
						title="个人信息" 
					/>
					<uni-list-item
						:show-extra-icon="true" 
						showArrow 
						clickable
						@click="goPersonal('/pages/service/service')"
						:extra-icon="{
							color: '#666',
							size: '22',
							type: 'help'
						}" 
						title="联系客服" 
					/>
					
					<uni-list-item
						:show-extra-icon="true" 
						showArrow 
						clickable
						@click="goPersonal('/pages/appInfo/appInfo')"
						:extra-icon="{
							color: '#666',
							size: '22',
							type: 'shop'
						}" 
						title="关于店铺" 
					/>
				</uni-list>
				<!-- <view class="block-item" v-for="item in tools" :key="item.id">
					<uni-icons :type="item.type" size="28" :color="item.color"></uni-icons>
					<text>{{item.title}}</text>
				</view> -->
			<!-- </view> -->
			<!-- <view class="block">
				<view class="block-item" v-for="item in others" :key="item.id">
					<uni-icons :type="item.type" size="28" :color="item.color"></uni-icons>
					<text>{{item.title}}</text>
				</view>
			</view> -->
		</view>
		
	</view>
</template>

<script>
	import { getCurrentShop, getUserInfo } from '../../../common/util'
	import config from '@/common/config.js'
	import request from '@/common/request.js'
	export default {
		data() {
			return {
				balance:0,
				iStatusBarHeight:0,
				baseURL:config.baseURL,
				currentShop:{},
				userInfo:{},
				avatar:'/static/shop.png',
				records:[
					{id:0,title:'选号记录',type:'calendar',color:'#333'},
					{id:1,title:'保存记录',type:'heart',color:'#333'},
					{id:2,title:'推荐记录',type:'hand-up',color:'#333'},
					{id:3,title:'合买记录',type:'personadd',color:'#333'},
				],
				tools:[
					{id:1,title:'我的消息',type:'chatbubble-filled',color:'#F9A726'},
					{id:2,title:'活动奖励',type:'medal-filled',color:'#2196F3'},
					{id:3,title:'我的礼包',type:'gift-filled',color:'#FF5722'},
					{id:4,title:'有料好单',type:'heart-filled',color:'#F9A825'},
					{id:5,title:'大神推单',type:'hand-up-filled',color:'#FFAD5F'},
					{id:6,title:'我的工具',type:'wallet-filled',color:'#FFCF48'},
					{id:7,title:'我的直播',type:'videocam-filled',color:'#FFAD5F'},
					{id:8,title:'竞猜宝典',type:'vip-filled',color:'#7FB3D5'},
					{id:9,title:'智能大数据',type:'star-filled',color:'#F7A072'},
					{id:10,title:'严选红单',type:'flag-filled',color:'#F75C03'},
				],
				others:[
					{id:1,title:'通知订阅',type:'notification-filled',color:'#66C7B4'},
					{id:2,title:'我的投诉',type:'paperplane-filled',color:'#FFA500'},
					{id:3,title:'关注的人',type:'personadd-filled',color:'#F7D558'},
					{id:4,title:'关于店铺',type:'shop-filled',color:'#F15A24'},
				]
			}
		},
		methods: {
			showAvatar(){
				const url = config.baseURL + this.userInfo.avatar;
				
				uni.previewImage({
					urls: [url], //预览的图片数组
					current:  [url]
				})

			},
			async getFunds(){
				const options = {
					url:`${config.baseURL}/service/fundsTable/getFunds`,
					method:'post',
					data:{
						"storeId": this.currentShop?.id,
						"userId": this.userInfo?.userId
					}
				}
				const data = await request(options)
				this.balance = data.balance
			},
			goPersonal(url){
				uni.navigateTo({
					url
				})
			},
			onItemClick(item){
				uni.setStorageSync('recordTabIndex',item.id)
				uni.switchTab({
					url:`/pages/tabBar/record/record`,
				})
			},
			onCharge(){
				uni.switchTab({
					url:'/pages/tabBar/ledger/ledger'
				})
			}
		},
		onShow(){
			this.currentShop = getCurrentShop()
			this.userInfo =  getUserInfo()
			this.getFunds()	
		},
		onLoad(){
			this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			this.getFunds();
		},
	}
</script>

<style scoped lang="scss">
.user{
	display: flex;
	flex-direction: row;
	align-items: center;
	padding:12px;
	// margin-bottom:12px;
}
.user-text{
	margin-left: 15px;
	color:#fff;
	font-size:16px;
}
.user-icon{
	flex:1;
	text-align: right;
}
.user-icon .uni-icon{
	color:#ccc;
}
.block{
	display: flex;
	flex-direction: row;
	align-items: center;
	flex-wrap: wrap;
	background-color: #fff;
	border-radius: 5px;
	margin-bottom: 12px;
	padding-top:15px;
}
.block-item{
	width:25%;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-sizing: border-box;
	text-align: center;
	margin-bottom:20px;
}
.block-wrap{
	padding: 10px;
}
.image{
	width:60px;
	height:60px;
	line-height:60px;
	background-color: #fff;
	border-radius: 50%;
	text-align: center;
	overflow: hidden;
	image{
		width:100%;
		height:100%;
	}
}
.my-banner{
	display: flex;
	flex-direction: row;
	align-items: center;
	color:#fff;
	padding:0 16px 10px 16px;
	.banner-l{
		flex:1;
		.tit{
			font-size:20px;
		}
	}
}
.btn-item{
	padding:6px 20px;
	background-color: #fff;
	border-radius:99px;
	text-align:center;
	font-size:14px;
	color:#cc0002;
}
</style>
