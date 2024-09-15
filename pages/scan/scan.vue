<template>
		<view class="scan-list">
			<scroll-view>
				<view v-if="shopList.length===0">
					<view class="tit">马上有店</view>
					<view class="imageWrap">
						<view class="imageWrap-item" style="margin-right:10px;">
							<image mode="scaleToFill" src="../../static/shop1.png" />
							<view class="imageWrap-text">找附近的实体店</view>
						</view>
						<view class="imageWrap-item">
							<image mode="scaleToFill" src="../../static/shop2.png" />
							<view class="imageWrap-text">扫店铺二维码</view>
						</view>
					</view>
					<view class="tit">店铺服务</view>
					<view class="b-flex">
						<view class="b-f-1">
							<uni-icons type="loop" size="28" color="#e64340"></uni-icons>
							<text>信息交互</text>
						</view>
						<view class="b-f-1">
							<uni-icons type="chat" size="28" color="#e64340"></uni-icons>
							<text>数据资讯</text>
						</view>
						<view class="b-f-1">
							<uni-icons type="search" size="28" color="#e64340"></uni-icons>
							<text>凭证查询</text>
						</view>
						<view class="b-f-1">
							<uni-icons type="paperplane" size="28" color="#e64340"></uni-icons>
							<text>订阅服务</text>
						</view>
					</view>
				</view>
				<view class="shop-item" v-for="(item,index) in shopList" :key="item.id">
					<view @click="onShopItemClick(index)" class="shopContent">
						<image class="image" mode="scaleToFill" :src="`${baseURL}${item.storePicture}`" />
						<text>{{ item.storeName }}</text>
						<view class="tags">
							<uni-tag class="tag-item" :text="item.authenticationInformation" size="mini" type="warning" custom-style="font-size:12px;" />
							<uni-tag class="tag-item" v-if="item.isDefault===1" text="默认店" size="mini" type="warning" custom-style="font-size:12px;background-color:#cc0002" />
						</view>
					</view>
					<uni-icons v-if="item.storeCode!=='0000'" @click="deleteShop(index)" type="closeempty" size="20" color="#999"></uni-icons>
				
				</view>
			</scroll-view>
			<view class="wrapInput" v-if="env==='h5'">
				<input clearable @input="onKeyInput" class="uni-input" focus placeholder="请输入门店编码进店" />
				<button @click="handleScanInput" type="warn">提交</button>
			</view>
			<button v-else @click="scan" class="btn"  type="warn">扫码进店</button>
			
		</view>
		
</template>

<script>
	import config from '@/common/config.js'
	import request from '@/common/request.js'
	import { getShop, setShop,removeShop,checkPlatform } from '@/common/util.js'
	export default {
		data() {
			return {
				baseURL:config.baseURL,
				shopList:[],
				env:checkPlatform(),
				inputValue:''
			}
		},
		methods: {
			handleScanInput(){
				const code = this.inputValue
				if(!code ){
					uni.showToast({
						title:"请输入店铺编码",
						icon:'none'
					})
					return
				}
				
				const isIn = this.shopList.filter(o=>o.storeCode===code)
				if(isIn.length>0){
					uni.showToast({
						title:'店铺已存在,无需重复扫码',
						icon:'none'
					})
					return
				}
				this.handleScan(code)
			},
			onKeyInput: function(event) {
				this.inputValue = event.detail.value
			},
			scan(){
				uni.scanCode({
					success: (res)=> {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						const params = res.result.split('?')[1]
						const code = params.split('=')[1]
						const isIn = this.shopList.filter(o=>o.storeCode===code)
						if(isIn.length>0){
							uni.showToast({
								title:'店铺已存在,无需重复扫码',
								icon:'none'
							})
							return
						}
						this.handleScan(code)
					}
				});
			},
			onShopItemClick(index){
				this.shopList.map((item,key)=>{
					if(key===index){
						item.lastVisitShop = 1
					}else{
						item.lastVisitShop = 0
					}
					return item
				})
				setShop('shopList',this.shopList)
				uni.switchTab({
					url:'/pages/tabBar/home/home'
				})
			},
			deleteShop(index){
				uni.showModal({
					title: '提示',
					content: '您确定要删除店铺吗？删除后需要重新扫码才能进入店铺',
					confirmText: '确定',
					cancelText: '取消',
					success: (res)=> {
						if (res.confirm) {
							this.shopList.splice(index,1)
							if(this.shopList.length>0){
								setShop('shopList',this.shopList)
							}else{
								removeShop()
							}
						} 
					}
				});
			},
			async handleScan(StoreCode){
				try{
					const data = await request({
						url:`${config.baseURL}/service/open/getStoreByStoreCode`,
						data:{
							StoreCode
						},
						loading:true,
						// silence: true,
						showErrorToast:true
					})		
					if(data){
						this.shopList.unshift(data)
					}
					setShop('shopList',this.shopList)
				}catch(e){
					console.log(e)
					//TODO handle the exception
				}
			}
		},
		onShow(){
			try {
				const value = getShop();
				if (value) {
					this.shopList = value
					
				}
			} catch (e) {
				// error
			}
		},
		
	}
</script>

<style scoped lang="scss">
.scan-list{
	padding:12px 12px 46px 12px;
}
.btn{
	position:fixed;
	bottom:0;
	left:0;
	width:100%;
	z-index: 100;
	border-radius:0;
	height:46px;
}
.shop-item{
	display: flex;
	flex-direction: row;
	align-items: center;
	padding:20px 12px;
	background-color: #fff;
	border-radius:5px;
	margin-bottom:12px;
	image{
		width: 50px; 
		height: 50px;
		border-radius:50%;
		margin-right:10px; 
		background-color: #fff;
	}
	.tags{
		flex:1;
		margin:0 10px;
		.tag-item{
			margin-right:10px;
		}
	}
	text{
		font-size:18px;
	}
}
.login-tip{
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: #fff;
	padding:15px;
}
.shopContent{
	flex:1;
	display: flex;
	flex-direction: row;
	align-items: center;
}
.imageWrap{
	display: flex;
	flex-direction: row;
	align-items: center;
	.imageWrap-item{
		padding:20px 10px;
		background-color: #fff1dd;
		image{
			width: 140px;
			height:88px;
		}
	}
	.imageWrap-text{
		text-align: center;
	}
}
.tit{
	font-size:14px;
	margin:15px 0;
}
.b-flex{
	display: flex;
	flex-direction: row;
	align-items: center;
	.b-f-1{
		flex:1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		text{
			margin-top:10px;
		}
	}
}
.wrapInput{
	position:fixed;
	bottom:0;
	left:0;
	width:100%;
	z-index: 100;
	border-radius:0;
	display: flex;
	flex-direction: row;
	align-items: center;
	padding:10px 16px;
	box-sizing: border-box;
	button{
		margin-left:10px;
		font-size:14px;
	}
}
</style>
