<template>
	<view style = "background-color: #fff;padding-bottom:100px;">
		<view class="top-bar">截止时间: <text style="color:red"> {{orderDetail.scheduleStatus}}</text></view>
		<view class="detail">
			<view class="detail-tit"><text>选单详情</text></view>	
			<view class="detail-wrap">
				<view>
					<view>
						<text>{{orderTypes[orderDetail.lotteryType]}}</text>
					</view>
					<view v-if="orderDetail.customsClearanceMode==='单关'">单关</view>
					<view v-else-if="orderDetail.goalData?.length>0 || orderDetail.halfData?.length>0 || orderDetail.scoreData?.length>0">混合过关</view>
					<view v-else>胜平负</view>
					<view>方案金额: <text style="color:red"> {{orderDetail.lotteryAmount}}</text> 元</view>
				</view>
			</view>
			<view class="detail-tit"><text>设置方案类型</text></view>	
			<view style="padding:10px;border-bottom: 1px solid #f5f5f5;">
				<view class="wrap-item">
					<view style="width:60px;"><uni-data-checkbox multiple v-model="needTakePhone" :localdata="TakePhoneArr"></uni-data-checkbox></view>
					<view style="flex:1">
						<text style="font-weight: bold;">要求拍照上传票样</text>
						<view><text>要求店主出票后上传票样，您可至方案详情进行查看</text></view>
					</view>
				</view>
				<view class="wrap-item">
					<view style="width:60px;"><uni-data-checkbox multiple v-model="needAgree" :localdata="agreeArr"></uni-data-checkbox></view>
					<text style="margin-top:2px;">服务使用须知与风险声明</text>
				</view>
			</view>
			<view class="pink-block">
				<uni-icons type="info-filled" size="16" color="#CC0002"></uni-icons>
				 为保证您的个人利益，在作出使用店铺服务决定前，请您阅读完整的服务使用须知与风险声明。
			</view>
			<view class="desc">
				本平台系接受商户委托为商户提供信息技术服务支持，仅依据商户上传信息提供信息展示服务。您在本平台上点击任何一款产品服务，都将与对应商户直接联系对接。产品服务展示的所有内容均系商户制作和提供，该产品服务也由商户自行运营管理。您若购买产品服务，将会直接与产品对应商户进行交易。
			</view>
			<view style="padding:10px;">
				<view class="wrap-item">
					<view style="width:60px;"><uni-data-checkbox multiple v-model="needAgree" :localdata="agreeArr"></uni-data-checkbox></view>
					<text>我已年满18周岁,同意并接受《用户服务协议》和《隐私政策》</text>
				</view>
			</view>
		</view>
		<view v-if="orderDetail.lotteryAmount<10" class="fixTip">
			<view style="color:#CC0002">提交方案未满足店铺设置要求，点击返回修改 ></view>
			<view style="color:#999;font-size:13px;">方案金额需要大于等于10元</view>
		</view>
		<view v-else class="order-btn">
			<button @click="order" type='warn'>提交</button>
		</view>
	</view>
</template>

<script>
	import request from '@/common/request.js';
	import config from '@/common/config.js';
	import {orderTypes} from '@/common/util.js'
	export default {
		name:"Order",
		data(){
			return {
				orderTypes,
				orderDetail:{},
				agreeArr:[{value: 1,"text": ""}],
				needAgree:[1],
				TakePhoneArr:[{value: 1,"text": ""}],
				needTakePhone:[]
			}
		},
		methods:{
			async order(){
				const data = await request({
					url: `${config.baseURL}/mobile/lotteryOrder/submitOrder`,
					method: 'post',
					data: { ...this.orderDetail, isSendTicket: this.needTakePhone[0]?0:1, orderType:0 },
					loading: true,
					isSendTicket: this.needTakePhone[0]?0:1,
					showSuccessToast: true,
					showErrorToast: true,
					successMsg: '提交成功'
				});
				
				//清理已选项
				try{
					
					if(this.tabIndex>-1 && this.optTabIndex>-1){
						//排列3
						uni.removeStorageSync(`selectedList${this.lotteryType}${this.tabIndex}${this.optTabIndex}`)
					}else{
						//排列5
						uni.removeStorageSync(`selectedList${this.lotteryType}`)
					}
					
					
				}catch(e){
					//TODO handle the exception
				}
				
			
				uni.switchTab({
					url: '/pages/tabBar/home/home'
				});
			}
		},
		onLoad(option){
			const {lotteryType,tabIndex, optTabIndex} = option
			this.lotteryType = lotteryType
			this.tabIndex = tabIndex
			this.optTabIndex = optTabIndex
			const options = getApp().globalData.detailOptions;
			this.orderDetail = options
			console.log('options',options)
		}
	}
</script>

<style scoped lang="scss">
	.top-bar{
		padding:5px 0;
		background-color: #ccc;
		text-align: center;
		font-size:12px;
	}
	.detail-tit{
		padding:10px;
		border-bottom:1px solid #f5f5f5;
	}
	.detail-wrap{
		padding:10px;
		border-bottom:1px solid #f5f5f5;
	}
	.wrap-item{
		display: flex;
		flex-direction: row;
		text{
			flex:1;
			color:#666;
		}
	
	}
	.pink-block{
		margin:10px;
		padding:10px;
		background-color: #FFE9F3; 
		border-radius: 5px;
		font-size:12px;
	}
	.desc{
		font-size:12px;
		color:#999;
		padding:10px;
		text-indent: 2em;
	}
	.fixTip{
		padding:15px;
		border:2px solid #CC0002;
		position: fixed;
		bottom:0;
		left:0;
		z-index:1000;
		width:100%;
		border-radius: 10px;
		box-sizing: border-box;
		background-color: #fff;
	}
	.order-btn{
		position: fixed;
		bottom:0;
		left:0;
		z-index:1000;
		width:100%;
		padding:15px;
		box-sizing: border-box;
		background-color: #fff;
	}
</style>