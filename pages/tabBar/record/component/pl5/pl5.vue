<template>
	<view style="padding-bottom:200px;">
		<uni-card is-full :is-shadow="false">
			<view>
				<text class="label" style="width:60px;">{{orderTabs[record.orderType]}}方案</text>
				<text class="desc">{{scheduleStatus}}</text>
			</view> 
			<view>
				<text class="label" style="width:60px;">方案号</text>
				<text style="margin-left:20px;font-weight:400">{{record.maskLotteryId}}</text>
			</view>
			<view>
				<text class="label" style="width:60px;">是否传票</text>
				<image 
					v-if="record.pic"
					style="width: 30px; height: 30px;margin-left:20px; background-color: #eeeeee;" 
					mode="scaleToFill" 
					:src="`${config.baseURL}${record.pic}`"
					@click="openImg"
				>
				</image>
				<text v-else style="margin-left:20px;font-weight:400">未传票</text>
			</view>
			<view>
				<text class="label" style="width:60px;">是否中奖</text>
				<text v-if="record.openLottery==='{}' || !record.openLottery" style="margin-left:20px;font-weight:400">待开奖</text>
				<text v-else>
					<text v-if="record.isLottery===0" style="margin-left:20px;font-weight:400">未中奖</text>
					<text v-if="record.isLottery===1" style="margin-left:20px;font-weight:400">已中奖</text>
				</text>
			</view>
		</uni-card>
		<uni-card title="方案详情" :is-shadow="false" style="margin: 30rpx 0 0 0;padding:0;">
			<view class="flex">
				<view class="flex-item">
					<text>金额: 共<text class="amount">{{record.lotteryAmount}}</text>元</text>
					<text>[{{record.multiple}}]倍</text>
				</view>
				<view>
					<text v-if="record.isLottery===1">预计中奖奖金:<text style="color:red">{{record.winningAmount}}</text>元</text>
				</view>
			</view>
			<view>
				<text style="color:#019AFE">{{orderTypes[record.lotteryType]}}</text>
				<text style="margin-left:10px;">{{record.lotteryOrderOdds[0].permutationThreeType<3?'直选':'组选'}}</text>
				<text style="margin-left:10px;">{{record.periods}}期</text>
			</view>
			
			<view class="content">
				<view class="inner">
					<view class="inner-item" v-for="item in record.lotteryOrderOdds">
						<view class="inner-flex">
							<view style="margin-right:10px;">排列5</view>
							<view class="circle-wrap">
								<text class="circle" v-for="subItem in item.permutationNum.one">{{subItem}}</text>
								<text v-if='item.permutationNum.two && item.permutationNum.two.length>0' class="bor">|</text>
								<text class="circle" v-for="subItem in item.permutationNum.two">{{subItem}}</text>
								<text v-if='item.permutationNum.three && item.permutationNum.three.length>0' class="bor">|</text>
								<text class="circle" v-for="subItem in item.permutationNum.three">{{subItem}}</text>
								<text v-if='item.permutationNum.four && item.permutationNum.four.length>0' class="bor">|</text>
								<text class="circle" v-for="subItem in item.permutationNum.four">{{subItem}}</text>
								<text v-if='item.permutationNum.five && item.permutationNum.five.length>0' class="bor">|</text>
								<text class="circle" v-for="subItem in item.permutationNum.five">{{subItem}}</text>
							</view>	
						</view>
						
						
						
					</view>
				</view>
			</view>
			
		</uni-card>
		
		<view class="tip">
			<view>足球竞猜的是全场90分钟（含伤停补时）的赛果，不含加时赛和点球大战。</view>
			<view style="text-decoration: underline;">投注数据、奖金仅供参考，请以实票数据为准</view>
		</view>
		<uni-popup ref="popup" type="center" border-radius="10px 10px 0 0">
			<view class="poup-container" style="width: 550rpx;height: 400rpx;">
				<view class="image-content"><image style="width: 550rpx;height: 400rpx; background-color: #eeeeee;" :src="src"></image></view>
			</view>
		</uni-popup>
		<OrderFooter v-if="showOrder" @confirmOrder="confirmOrder"></OrderFooter>
	</view>
</template>

<script>
	import OrderFooter from '../OrderFooter.vue';
	import dayjs from 'dayjs';
	import _ from 'lodash';
	import { orderTypes, orderTabs } from '@/common/util.js'
	import config from '@/common/config.js';
	import request from '@/common/request.js';
	export default {
		components:{
			OrderFooter
		},
		data() {
			return {
				scheduleStatus:'',
				_,
				orderTypes,
				orderTabs,
				maxAmount:0,
				dayjs,
				record: {},
				src: '',
				config,
			}
		},
		computed:{
			showOrder(){
				if(this.record.orderType===3 && this.scheduleStatus.indexOf('方案已过官网停售时间')===-1){
					return true
				}
				if(this.record.orderType===0 && !this.record.maskLotteryId ){
					return true
				}
				return false
			}
		},
		methods: {
			confirmOrder(isSendTicket){
				uni.navigateTo({
					url:'/pages/tabBar/record/component/order/order'
				})
			},
			async submitOrder(){ 
				
				
				this.detailOptions.lotteryOrderOdds = this.detailOptions.lotteryOrderOdds.map(item=>{
					try{
						item.permutationNum = JSON.stringify(item.permutationNum)
					}catch(e){
						//TODO handle the exception
					}
					
					return item
				})
				const data = await request({
					url:`${config.baseURL}/mobile/lotteryOrder/submitOrder`,
					method:"post",
					data:{...this.detailOptions,isSendTicket:this.isSendTicket,orderType:this.detailOptions.maskLotteryId?0:this.detailOptions.orderType},
					loading:true,
					isSendTicket:this.isSendTicket,
					showSuccessToast:true,
					showErrorToast:true,
					successMsg:'提交成功'
				})
				uni.navigateTo({
					url:'/pages/choose/five'
				})
			
			},
			openImg(){
				if(this.record.pic !== null && this.record.pic !== '' ) {
					this.src = `${config.baseURL}` + this.record.pic;
					this.$refs.popup.open('center');
				}else {
					uni.showToast({
						title: '商家还没传票!',
						duration: 2000,
						icon: 'error'
					});
				}
				
			}
		},
		onLoad(options) {
			let detailOptions = JSON.parse(JSON.stringify(getApp().globalData.detailOptions))
			
			this.detailOptions = detailOptions
			let detailOptions1 = JSON.parse(JSON.stringify(this.detailOptions))
			let matchDates=[detailOptions.endDate];
			detailOptions.lotteryOrderOdds.map(item=>{
				try{
					item.permutationNum = JSON.parse(item.permutationNum)
				}catch(e){
					//TODO handle the exception
				}
				
				return item
			})
			this.record = detailOptions
			console.log('this.record',this.record)
			const arr = matchDates.map(date=>new Date(date))
			const minDate = dayjs(Math.min.apply(null,arr)).format('YYYY-MM-DD HH:mm')
			const diffM = dayjs().diff(dayjs(minDate),'minutes')
			if(diffM>15){
				this.scheduleStatus = '方案已过官网停售时间'
			}else{
				this.scheduleStatus = dayjs(minDate).format('MM-DD HH:mm')+ ' 截止'
			}
			detailOptions1.scheduleStatus = this.scheduleStatus
			getApp().globalData.detailOptions = detailOptions1
		}
	}
</script>

<style scoped>
.page-content{
	height:100%;
}
.nav-bar{
	position: fixed;
	top:0;
	left:0;
	width:100%;
	z-index:1000;
	height:48px;
	background-color: #cc0002;
}
.button-center{
	flex:1;
	display: flex;
	flex-direction: row;
	justify-content: center;
	padding:0 5px;
}

.opt-wrap{
	background-color: #fff;
	position:fixed;
	left:0;
	bottom:0;
	z-index:100;
	width:100%;
	box-sizing: border-box;
	border-top:1px solid #ddd;
	.select-tip{
		display: flex;
		padding:10px;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size:12px;
		color:#999;
		.title{
			font-size:13px;
			color: red;
		}
	}
	.select-info{
		display: flex;
		flex-direction: row;
		align-items: center;
		padding:5px 10px;
		.flag-box{
			padding:3px 5px;
			border:1px solid #ddd;
			border-radius:3px;
			width:50px;
			text-align: center;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			color: #cc0002;
			font-size:12px;
		}
		.text{
			font-size:12px;
		}
		.select-amount{
			flex:1;
			text-align: center;
			display: flex;
			flex-direction: column;
			text-align:right;

			.amount-tit{
				font-size:15px;
				text{
					color:red;
					font-weight:bold;
					font-size:17px;
					margin: 0 3px;
				}
			}
			.amount-desc{
				font-size:14px;
				text{
					text-decoration: underline;
					color:red;
				}
			}
		}
		.scale-block{
			display: flex;
			flex-direction: row;
			align-items: center;
			margin-left: 15px;
			text{
				margin-left:5px;
			}
		}
	}
	.btns{
		display: flex;
		flex-direction: row;

		border-top:1px solid #ddd;
		.btns-item{
			padding:10px;
			text-align: center;
			font-size:15px;
			color:#333;
			background-color: #f2f2f2;
			border-left:1px solid #ddd;
		}
		.btns-prize{
			flex:1;
			color:#666;
			background-color: #fff;
		}
		.btns-next{
			background-color: #cc0002;
			color:#fff;
			width:110px;
			font-size:15px;
		}
	}
}
.uni-collapse .content{
	background-color: #f2f2f2;
	padding:10px 10px 0 10px;
}
::v-deep .uni-collapse-item__title-box{
	height:40px;
	line-height:40px;
}
.tit{
	margin-bottom:10px;
}
.footerBtns{
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-top:30px;
	button{
		flex:1;
	}
}
.noData{
	font-size:14px;
	color:#999;
	padding-top:50px;
	text-align: center;
}
.selected-corner{
	color: red;
	overflow: hidden;
	view{
		width:20px;
		height:20px;
		background-color: #cc0002;
		position:absolute;
		right:-10px;
		bottom:-10px;
		color:#fff;
		font-size:12px;
		text-align: left;
		font-weight: bold;
		padding:3px;
		box-sizing: border-box;
		transform: rotate(45deg);
	}
}
.poup-container{
	padding-bottom:100px;
	background-color: #fff;
}
.poup-wrap{
	padding:10px 0;
	height:250px;
}
.poup-desc{
	color:#666;
	text-align: center;
}
.poup-item-wrap{
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}
.poup-block{
	width:25%;
	padding:10px;
	box-sizing: border-box;

}
.poup-item{
	border-radius: 5px;
	padding:5px 0;
	text-align: center;
	border:1px solid #ddd;
}
.poup-item.active{
	background-color: #cc0002;
	color:#fff;
}
.poup-tit{
	padding:10px 0;
	text-align: center;
	background-color: #f5f5f5;
	border-bottom:1px solid #ddd;
	position: relative;
	.closeIcon{
		position: absolute;
		top:7px;
		right:15px;
	}
}
.more-poup{
	text-align: center;
	font-size: 12px;
	color: #666;
	padding: 10px 0;
}
.desc{
	/* font-size:13px; */
	/* color:#999; */
	font-weight: normal;
	margin-left:20px;
}
.label{
	/* width:60px; */
	display: inline-block;
	color:#000;
}
.flex{
	display: flex;
	flex-direction: row;
	align-items: center;
}
.amount{
	color:red;
}
.flex-item{
	flex:1;
}
.tip{
	padding: 8px 12px;
	background: #fbeee4;
	border: 1px solid #ffe3cd;
	font-size: 12px;
}
.content{
	padding:20px 10px 10px 10px;
	margin-top:20px;
	border-top:1px solid #f5f5f5;
	.inner{
		border:1px solid #ddd;
		font-size:12px;
		padding:10px;
		.inner-item{
			display: flex;
			flex-direction: row;
			align-items: center;
		}
		
	}
}
.inner-flex{
	display: flex;
	flex-direction: row;
	align-items: center;
	.circle-wrap{
		flex:1;
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: wrap;
		.circle{
			width:24px;
			height:24px;
			line-height:24px;
			background-color: #cc0002;
			text-align: center;
			color:#fff;
			border-radius:50%;
			margin:8px;
			
		}
	}
}
</style>
