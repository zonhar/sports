<template>
	<view>
		<view :style="{ height: iStatusBarHeight + 'px',backgroundColor:'#cc0002'}"></view>
		<view class="topBar">
			<view class="logo" @click="shopInfo">
				<image class="image" mode="scaleToFill" :src="`${baseURL}${currentShop?.storePicture}`" />
				<text>{{currentShop.storeName}}</text>
				<text style="margin-left:5px;" class="uni-navigate-icon uni-icon">&#xe470;</text>
			</view>
			<view class="icons">
				<uni-icons @click="scan" class="item" type="scan" size="26"></uni-icons>
				<uni-icons @click="tel" class="item" type="phone" size="26"/> 
				<uni-icons @click="share" class="item" type="redo" size="26"/> 
			</view>
		</view>
		
		<view class="ad" v-if="adList.length>0">
			<image style="width:100%;display: block;height:120px" mode="scaleToFill" :src="`${baseURL}${adList[0].pictureAddress}`" />
		</view>
		
		<!-- 顶部推荐 -->
		<view class="icons-block">
			<uni-grid :column="4" :showBorder="false"  :square="false">
				<uni-grid-item @click="goLink(item)" style="border-bottom:0;padding-bottom:10px;" class="grid-item" v-for="item in tops" :key="item.id">
					<uni-icons :type="item.type" size="32" :color="item.color"></uni-icons>
					<text class="text">{{item.title}}</text>
				</uni-grid-item>
			</uni-grid>
		</view>
		
		<view class="icons-block" style="padding:0;">
			<view class="block-tit">
				<text class="block-tit-l">选号分析</text>
				<view class="block-tit-r" @click="toLive()"> 
					<uni-icons type="videocam-filled" size="22" color="#F44336"></uni-icons>
					<text>比分直播</text>
					<text style="margin-left:5px;padding-left:0;" class="uni-navigate-icon uni-icon">&#xe470;</text>
				</view>
			</view>
			
			<uni-grid :column="4" :highlight="false" :showBorder="false"  @change="change">
				<uni-grid-item class="uni-grid-item" v-for="(item, index) in grids" :index="index" :key="item.id">
					<view class="grid-item-box">
						<image :src="item.url" class="image" mode="aspectFill" />
						<text class="text">{{item.title}}</text>
						<text class="desc">{{item.desc}}</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
	</view>
</template>

<script>
import config from '@/common/config.js'
import request from '@/common/request.js'
import dayjs from 'dayjs';
import {formats, formatNumber, getShop, setShop, getUserInfo} from '@/common/util.js'
	export default {
		data() {
			return {
				adList:[],
				baseURL:config.baseURL,
				userInfo:null,
				shopList:[],
				iStatusBarHeight: 0,
				tops:[
					{id:1,title:'合买',color:'#FFC857',type:'personadd-filled'},
					{id:2,title:'全网牛单',color:'#F44336',type:'hand-up-filled'},
					{id:3,title:'活动',color:'#FFC107',type:'gift-filled'},
					{id:4,title:'开奖',color:'#F44336',type:'medal-filled'},
				],
				grids:[
					{id:1,title:'竞彩足球',target:'football',color:'#cc0002',url:'/static/z1.png',desc:''},
					{id:2,title:'竞彩篮球',target:'basketball',color:'#cc0002',url:'/static/z2.png',desc:''},
					{id:3,title:'足球14场',target:'football14',color:'#cc0002',url:'/static/z3.png',desc:''},
					{id:4,title:'任选9场',target:'football9',color:'#cc0002',url:'/static/z4.png',desc:''},
					{id:5,title:'大乐透',target:'dlt',color:'#cc0002',url:'/static/z5.png',desc:''},
					{id:6,title:'七星彩',target:'seven',color:'#cc0002',url:'/static/z6.png',desc:''},
					{id:7,title:'排列3',target:'three',color:'#cc0002',url:'/static/z7.png',desc:''},
					{id:8,title:'排列5',target:'five',color:'#cc0002',url:'/static/z8.png',desc:''},
					{id:9,title:'北京单场',target:'bjdc',color:'#cc0002',url:'/static/z9.png',desc:''},
					{id:10,title:'胜负过关',target:'vs',color:'#cc0002',url:'/static/z10.png',desc:''},
					// {id:11,title:'顶呱刮',target:'dgg',color:'#cc0002',url:'/static/z11.png',desc:'想玩就玩 刮出大奖'}
				]
			}
		},
		computed:{
			currentShop(){
				if(this.shopList.length>0){
					const defaultShop = this.shopList.filter(item=>item.isDefault===1)
					const lastVisitShop = this.shopList.filter(item=>item.lastVisitShop===1)
					const data = lastVisitShop[0]??defaultShop[0]??this.shopList[0]
					getApp().globalData.currentShop = data;
					return data
				}
				return {}
			}
		},
		methods: {
			goLink(item){
				if(item.id===4){
					uni.navigateTo({
						url:'/pages/prize/prize'
					})
				} else if(item.id===1){
					uni.showToast({
						title: '敬请期待',
						icon: 'error',
						duration: 1000
					});
				} else if(item.id===2){
					uni.showToast({
						title: '敬请期待',
						icon: 'error',
						duration: 1000
					});
				} else if(item.id===3) {
					uni.showToast({
						title: '敬请期待',
						icon: 'error',
						duration: 1000
					});
				}
				
			},
			toLive(){
				uni.navigateTo({
					url:'/pages/live/live'
				})
			},
			shopInfo(){
				if(!getUserInfo){
					uni.navigateTo({
						url:'/pages/login/login'
					})
					return
				}
				uni.navigateTo({
					url: '/pages/shop/shop'
				})
			},
			change(data){
				const {index} = data.detail 
				uni.navigateTo({
					url:`/pages/choose/${this.grids[index].target}`
				})
			},
			tel(){
				
				if (this.currentShop.mobile == null || this.currentShop.mobile === '') {
					uni.showToast({
						title: '商家未提供手机号',
						icon: 'error',
						duration: 1000
					});
					return;
				}
				
				//调用户手机拨打电话
				uni.makePhoneCall({
					phoneNumber: this.currentShop.mobile
				});
			},
			share(){
				uni.navigateTo({
					url:'/pages/share/share'
				})
			},
			scan(){
				uni.navigateTo({
					url:'/pages/scan/scan'
				})
			},
			init(){
				this.initShop()
				this.selectCount()
				this.getAd()
			},
			async initShop(){
				try {
					const value = getShop();
					if (!value) {
						const StoreCode = '0000';
						const data = await request({
							url:`${config.baseURL}/service/open/getStoreByStoreCode`,
							data:{
								StoreCode
							}
						})
						
						if(data){
							this.shopList = [data]
							setShop('shopList',[data])
						}
						return
					}
					this.shopList = value;
				} catch (e) {
					// error
				}
			},
			async selectCount(){
				const data = await request({
					url:'/api/match/selectcount',
					data:{
						platform: 'koudai_mobile',
						_prt: 'https',
						ver: '20180101000000'
					}
				})
				
				const t = dayjs(data.end_time.ToTo).unix()
				const t1 = dayjs(data.end_time.NineToTo).unix()
				const t2 = dayjs(data.end_time.P3).unix()
				const t3 = dayjs(data.end_time.P5).unix()
				
				this.grids[0].desc = data.soccer_count+'场比赛';
				this.grids[1].desc = data.basket_count+'场比赛';
				this.grids[8].desc = data.dc_count+'场比赛';
				this.grids[9].desc = data.wl_count+'场比赛';
				this.grids[2].desc = data.end_time?.ToTo ? (formats(t)+' '+dayjs(data.end_time.ToTo).format('HH:mm')+'停售'):'暂无比赛'
				this.grids[3].desc = data.end_time?.NineToTo ? (formats(t1)+' '+dayjs(data.end_time.NineToTo).format('HH:mm')+'停售'):'暂无比赛'
				this.grids[4].desc = '奖池'+formatNumber(data.pool_prize.SuperLotto)
				this.grids[5].desc = '奖池'+formatNumber(data.pool_prize.SSQ)
				this.grids[6].desc = formats(t2)+'开奖'
				this.grids[7].desc = formats(t3)+'开奖'
				this.grids = [...this.grids]
			},
			async getAd(){
				const data = await request({
					url:`${config.baseURL}/service/open/getAdvertising`,
				})
				this.adList = data
			}
		},
		onLoad() {
			this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
		},
		onShow(){
			this.init()
		}
	}
</script>

<style>
@import '../../../common/uni-nvue.css';

	
.topBar{
	padding:10px;
	background-color: #fff;
	margin-bottom:12px;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.topBar .logo{
	margin-right:10px;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.topBar .logo image{
	width:40px;
	height:40px;
	margin-right:10px;
	border-radius:5px;
}
.topBar .logo text{
	font-size:16px;
	font-weight:bold;
}
.topBar .icons{
	flex:1;
	text-align: right;
}
.topBar .icons .item{
	padding:0 10px;
}
.ad{
	/* height:100px; */
	background-color: #fff;
	margin-bottom:12px;
}
.icons-block{
	background-color: #fff;
	padding:0 10px;
	margin-bottom:12px;
}
.block-tit{
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 10px;
}
.block-tit-l{
	flex:1;
	text-align: left;
}
.block-tit-r{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
}
.grid-item{
	text-align: center;
}
.grid-item .text{
	font-size:14px;
	margin-top:5px;
}
.grid-item-box .image{
	width:30px;
	height:30px;
}

.grid-item-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.grid-item-box .text{
	margin-top:12px;
	font-size:14px;
}
.uni-grid-item{
	padding-top:15px;
	border-bottom:1px solid #f5f5f5;
}
.desc{
	color:#666;
	font-size:12px;
	margin-top:3px;
}
</style>
