<template>
	<view style="padding-bottom:200px;">
		<uni-card is-full :is-shadow="false">
			<view>
				<text class="label" style="width:60px;">{{orders[record.orderType]}}方案</text>
				<text class="desc">{{record.lotteryOrderOdds[0].matchDate}}截止</text>
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
					<text>金额: <text class="amount">{{record.lotteryAmount}}</text>元</text>
					<text>[{{record.multiple}}]倍</text>
				</view>
				<view>
					<text v-if="record.isLottery===1">预计中奖奖金:<text style="color:red">{{record.winningAmount}}</text>元</text>
					<view>第{{record.periods}}期</view>
				</view>
				
			</view>
			<view>
				<text style="color:#019AFE">{{types[record.lotteryType]}}</text>
				<text class="amount" style="margin-left:15px;">{{record.lotteryOrderOdds.length>9?`${record.lotteryOrderOdds.length}转9`:'已选9场'}}</text>
			</view>
			<!-- 选票 -->
			<view class="content">
				<view class="content-item" v-for="(subItem,subKey) in record.lotteryOrderOdds" :key="subItem">
					<view style="width:50px;text-align: center;color:#999;">
						{{subItem.sfpData.key}}
						<view v-if="record.danKeys?.includes(subItem.sfpData.key)" class="active tag">胆</view>
					</view>
					<view class="content-l">
						<!-- <text>{{subItem.matchCode}}</text> -->
						<!-- <uni-tag :style="{margin:'3px 0',border:0}" :text="subItem.league" size="small" /> -->
						<view style="font-size:12px;">{{subItem.league}}</view>
						<text>{{dayjs(subItem.matchDate).format('M-D HH:mm')}}</text>
						<!-- <text style="color:#019AFE">分析</text> -->
					</view>
					<!-- <view class="table-left">
						<text class="dot">{{subItem.sfpGameData[0]?.boundary}}</text>
						<text class="dot" :class="{'success':subItem.sfpGameData[0]?.boundary>0,'danger':subItem.sfpGameData[0]?.boundary<0}">{{subItem.sfpGameData[0]?.boundary>0?'+':''}}{{subItem.sfpGameData[0]?.boundary}}</text>
					</view> -->
					<view class="content-r">
						<view class="table-wrap">
							
							<table ref="table" border>
								<tr>
									<td 
										class="td"
										:class="{'active':subItem.sfpGameData?.leftActive}"
										
									>
										<view class="td-wrap">
											<text class="label">{{subItem.homeTeam}}</text>
											<text class="val">{{subItem.sfpGameData?.homeOdds??'未受注'}}</text>
										</view>
										
									 </td>
									<td 
										class="td"
										:class="{'active':subItem.sfpGameData?.middleActive}"
									>
										<view class="td-wrap">
											<text class="label">平局</text>
											<text class="val">{{subItem.sfpGameData?.drawOdds??'未受注'}}</text>
										</view>
									</td>
									<td
										class="td last"
										:class="{'active':subItem.sfpGameData?.rightActive}"
									>
										<view class="td-wrap">
											<text class="label">{{subItem.awayTeam}}</text>
											<text class="val">{{subItem.sfpGameData?.awayOdds??'未受注'}}</text>
										</view>
									</td>
								</tr>
							</table>
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
	import request from '@/common/request.js';
	import config from '@/common/config.js'
	export default {
		components:{
			OrderFooter
		},
		data() {
			return {
				scheduleStatus:'',
				maxAmount:0,
				orders:['订单','推单','合买','保存'],
				types:{
					1:'竞足胜平负',
					3:'足彩14场',
					4:'足彩任选9',
				},
				dayjs,
				record: {},
				src: '',
				config
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
					//返回上级页面并传参
					try{
						let pages = getCurrentPages()
						let prevPage = pages[pages.length -2]
						prevPage.$vm.clearSelect({from:'details'})
					}catch(e){
						//TODO handle the exception
					}
					uni.navigateBack({
						delta: 1 // 返回的页面数
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
			this.detailOptions = JSON.parse(JSON.stringify(getApp().globalData.detailOptions))
			let detailOptions1 = JSON.parse(JSON.stringify(this.detailOptions))
			let detailOptions = getApp().globalData.detailOptions
			let matchDates = []
			detailOptions.lotteryOrderOdds.map(item=>{
				matchDates.push(item.matchDate)
				try{
					item.sfpGameData = JSON.parse(item.sfpGameData)
					item.sfpData = JSON.parse(item.sfpData)
					const isHomeIn = item.sfpData.homeOdds===item.sfpGameData.homeOdds && item.sfpData.homeOddsName===item.sfpGameData.homeOddsName
					const isAwayIn = item.sfpData.awayOdds===item.sfpGameData.awayOdds && item.sfpData.awayOddsName===item.sfpGameData.awayOddsName
					const isDrawIn = item.sfpData.drawOdds===item.sfpGameData.drawOdds && item.sfpData.drawOddsName===item.sfpGameData.drawOddsName
					if(isHomeIn){
						item.sfpGameData.leftActive=true
					}
					if(isAwayIn){
						item.sfpGameData.rightActive=true
					}
					if(isDrawIn){
						item.sfpGameData.middleActive=true
					}
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
.content{
	/* padding:0 10px; */
	margin-top:20px;
	.content-item{
		display: flex;
		flex-direction: row;
		padding-bottom: 12px;
	}
	.content-l{
		width:50px;
		display: flex;
		flex-direction: column;
		text-align: center;
		margin-left: 30rpx;
		margin-right:20px;
		text{
			font-size:10px;
		}
	}
	.content-r{
		flex:1;
		.content-r-top{
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			text-align: center;
			margin-bottom:3px;
			.content-r-sub{
				display: flex;
				flex-direction: column;
				text{
					color:#666;
					font-size:12px;
				}
			}
			.content-r-vs{
				margin:0 10px;
				color:#000;
				font-size:14px;
				text{
					margin:0 10px;
					color:#666;
				}
			}
		}
		.table-wrap{
			display: flex;
			flex-direction: row;
			.td-wrap{
				display: flex;
				flex-direction: column;
				align-items: center;
				.label{
					/* font-size:15px; */
				}
				.val{
					flex:1;
					text-align: right;
					color:#666;
				}
			}
		}

	}
}
.table-left{
	display: flex;
	flex-direction: column;
	margin-right:5px;
	margin-top:30px;
	.dot{
		width:16px;
		height:16px;
		line-height:16px;
		background-color: #ccc;
		color:#fff;
		font-size:12px;
		text-align: center;
		border-radius:50%;
		margin-top:16px;
	}
	.dot.success{
		background-color: #4cd964;
	}
	.dot.danger{
		background-color: #cc0002;
	}
}
.active{
	background-color: #cc0002!important;
	text{
		color:#fff;
	}
	.td-wrap {
		.val{
			color:#fff!important;
		}
	}

}
table{
	width:100%;
	border-spacing: 0;
	border-collapse: collapse;
	tr{
		td{
			border: 1px solid #ddd;
			border-collapse: collapse;
			position: relative;
		}
	}
	tr.single{
		td.td{
			border: 1px solid #cc0002;
			background-color: rgba(231,0,0,.05);
			position: relative;
			.single-tag{
				position:absolute;
				top:-5px;
				left:0;
				width:14px;
				height:14px;
				line-height:14px;
				font-size:12px;
				color:#fff;
				background-color: #cc0002;
				padding:1px;
				box-shadow: 0 2px 5px #cc0002;
			}
		}
		td.last::before{
			border-right:1px solid #cc0002;
			content: '';
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
		}
		td.rowspan{
			border-left:2px solid #ddd;
		}
	}
	.odd.single{
		td::before{
			border-top:1px solid #cc0002;
			content: '';
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
		}
	}
}
td{
	padding: 8px;
	font-size:13px;
	color:#000;
	background-color: #fff;
}
.guess-tip{
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	padding:10px;
	background-color: #FFF7E7;
	text-align: center;
	color:#333;
	font-size:13px;
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
.tag{
	font-size:12px;
	width:12px;
	height:12px;
	background-color: #ccc;
	text-align:center;
	line-height: 12px;
	border-radius:50%;
	padding:5px;
	color:#fff;
	margin-left:10px;
}
</style>
