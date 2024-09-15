<template>
	<view class="page-content">
		<scroll-view scroll-y="true" :style="{paddingBottom:'90px'}">
			<!-- <view><uni-notice-bar style="margin-bottom:0;" show-icon :text="lottery.desc" /></view> -->
			<view class="prize-tit">
				<text>第{{info.lottery_no}}期<text class="red">{{formats(dayjs(info.itou_end_time).unix())}} {{dayjs(info.itou_end_time).format('HH:mm')}}</text>截止 </text>
			</view>
			<button-group 
				ref="buttonGroupRef" 
				:buttons="buttons" 
				unactiveBackgroundColor='#fff'
				unactiveColor='#cc0002'
				@change="change"
			>
			</button-group>
			
			<view class="wraps">
				<view class="wraps-item" v-for="(item,index) in selectedList" :key="index">
					<uni-icons @click="delSelect(index)" style="margin-right:10px;" type='closeempty' size="20" color="#666"></uni-icons>
					<view style="margin-right:10px;" v-if="tabIndex===0">{{ _types[item.tabIndex][item.optTabIndex] }}</view>
					<view style="margin-right:10px;" v-if="tabIndex===1">{{ types[item.teamIndex-1] }}</view>
					<view class="wraps-subItem" :class="{'bor':item.tabIndex===0}" v-for="(subItem,subIndex) in item.data" :key="subIndex">
						<template v-if="tabIndex===0">
							<template v-if="item.optTabIndex===0">
								<view class="circle" v-for="grand in subItem.permutationNumList">{{grand}}</view>
							</template>
							<template v-if="item.optTabIndex===1">
								<view class="circle" >{{subItem}}</view>
							</template>
						</template>
						<template v-if="tabIndex===1">
							<view style="margin-top:12px;color:#666;font-size:12px;" v-if="subIndex===0 && [3,4,5].includes(item.teamIndex) && subItem.length>0">[胆：</view>
							<view v-if="subIndex===0" class="circle" v-for="grandItem in subItem">{{grandItem}}</view>
							<view style="margin-top:12px;color:#666;font-size:12px;" v-if="subIndex===0 && [3,4,5].includes(item.teamIndex) && subItem.length>0">]</view>
							<view v-if="subIndex===1 && [3,4,5].includes(item.teamIndex)" class="circle" v-for="grandItem in _.difference(item.data[1],item.data[0])">{{grandItem}}</view>
							<view v-if="subIndex===1 && item.teamIndex===7" class="circle" v-for="grandItem in item.data[1]">{{grandItem}}</view>
						</template>
					</view>
				</view>
			</view>
			
		</scroll-view>
		<view class="opt-wrap">
			<view style="font-size:14px;padding:10px;text-align: center;">共<text class="red">{{amountValue}}</text>元</view>
			<view class="btns">
				<view class="scale-block">
					<uni-number-box :min="1" :max="50000" :width="60" :value="scaleValue" @change="changeNumBox" />
					<text>倍</text>
				</view>
				<view style="flex:1"></view>
				<view class="btns-item" @click="submitOrder(3)">保存</view>
				<view @click="submitOrder(0)" class="btns-item btns-next">提交到店</view>
			</view>
		</view>
	</view>
</template>

<script>
	import request from '../../common/request.js';
	import dayjs from 'dayjs';
	import {formatNumber,formats,factorials,getUserInfo, getCurrentShop } from '../../common/util.js'
	import config from '@/common/config.js'
	import buttonGroup from '../component/button-group/button-group.vue';
	import _ from 'lodash'
	export default {
		data() {
			return {
				_,
				selectedList: [],
				_types:{
					0:{
						0:'普通',
						1:'和值'
					},
				},
				types:['普通','和值','组3','组6','组3组6','和值','组3单式'],
				buttons: [
					{
					  title: '继续添加',
					},
					{
					  title: '机选5注',
					},
					{
					  title: '机选1注',
					},
					{
					  title: '清空',
					},
				],
				tabIndex:0,
				optTabIndex:0,
				formats,
				dayjs,
				scaleValue:1,
				iStatusBarHeight: 0,
				info:{},

			}
		},
		components:{
			buttonGroup
		},
		computed:{
			scrollHeight(){
				const tHeight = (this.iStatusBarHeight + 460) + 'px'
				const data =  window.innerHeight - tHeight
				return data
			},
			amountValue(){
				let sum = this.selectedList.reduce(function (prev, cur) {
					return prev + cur.amount;
				},0);
				return sum
			},
			permutationThreeType(){
				if(this.optTabIndex===0){
					return '1'
				}
				if(this.optTabIndex===1){
					return '2'
				}
				return '1'
			}
		},
		watch:{
			selectedList:{
				handler:function(val){
					uni.setStorageSync(`selectedList${this.lotteryType}${this.tabIndex}${this.optTabIndex}`,val || [])
				}
			}
		},
		methods: {
			async submitOrder(orderType){
				if(this.selectedList.length===0){
					uni.showToast({
						title:'请至少选中一注号码',
						icon:'none'
					})
					return
				}
				let options = {
					userId: getUserInfo()?.userId,
					userName: getUserInfo()?.userName,
					storeId: getCurrentShop()?.id,
					lotteryAmount: this.amountValue,
					payType:1,
					orderType,
					endDate:this.endDate,
					lotteryType:this.lotteryType,
					multiple: this.scaleValue,
					customsClearanceMode: '',
					periods:this.info.lottery_no,
					lotteryOrderOdds:this.selectedList.map(item=>{
						if(item.tabIndex===0){
							if(item.optTabIndex===0){
								return {
									permutationThreeType: item.permutationThreeType || (item.optTabIndex+1),
									permutationNum: JSON.stringify({one:item.data[0].permutationNumList,two:item.data[1].permutationNumList,three:item.data[2].permutationNumList})
								}
							}
							if(item.optTabIndex===1){
								return {
									permutationThreeType: item.permutationThreeType || (item.optTabIndex+1),
									permutationNum:JSON.stringify({sumValue:item.data})
								}
							}
						}else{
							return  {
								permutationThreeType: item.permutationThreeType || item.teamIndex,
								permutationNum: JSON.stringify({
									[item.teamIndex===7?'doubleNum':(item.teamIndex===6?'num':'fixed')]:item.data[0],
									[item.teamIndex===7?'singleNum':'num']:(item.teamIndex===6?item.data[0]:item.data[1])
								})
							}
						}
					}),
				}
				if(orderType===3){
					const {topBonusAmount,maskLotteryId} = await request({
						url: `${config.baseURL}/mobile/lotteryOrder/submitOrder`,
						method: 'post',
						data: options,
						loading: true,
						isSendTicket: this.isSendTicket,
						showSuccessToast: true,
						showErrorToast: true,
						successMsg: '提交成功'
					});
					getApp().globalData.detailOptions = { ...options, topBonusAmount,maskLotteryId };
					//保存成功，清理已选项
					try{
						uni.removeStorageSync(`selectedList${this.lotteryType}${this.tabIndex}${this.optTabIndex}`)
					}catch(e){
						//TODO handle the exception
					}
					
					uni.navigateTo({
						url:'/pages/tabBar/record/component/pl3/pl3'
					})
				}else{
					getApp().globalData.detailOptions= {...options}
					uni.navigateTo({
						url: `/pages/tabBar/record/component/order/order?lotteryType=${this.lotteryType}&tabIndex=${this.tabIndex}&optTabIndex=${this.optTabIndex}`
					});
				}
			},
			appendRandom(n){
				let arr = []
				for(let i=0;i<n;i++){
					const r1 = Math.floor(Math.random() * 10)
					const r2 = Math.floor(Math.random() * 10)
					const r3 = Math.floor(Math.random() * 10)
					arr.push({
						tabIndex:this.tabIndex,
						optTabIndex:0,
						teamIndex:this.tabIndex===1?4:null, //默认组6
						amount:2,
						permutationThreeType:8,
						data:this.tabIndex===1?[
							[],
							[r1,r2,r3],
						]:[
							{
								permutationNumList:[r1]
							},{
								permutationNumList:[r2]
							},
							{
								permutationNumList:[r3]
							}
						],
					})
				}
				return arr
			},
			delSelect(index){
				this.selectedList.splice(index,1)
				uni.setStorageSync(`selectedList${this.lotteryType}${this.tabIndex}${this.optTabIndex}`,this.selectedList)
			},
			clearAll(){
				uni.removeStorageSync(`selectedList${this.lotteryType}${this.tabIndex}${this.optTabIndex}`)
			},
			change(index){
				if(index===3){
					this.selectedList = []
					this.clearAll()
				}
				if(index===2){
					const data = this.appendRandom(1)
					data.map(item=>{
						this.selectedList.push(item)
					})
					uni.setStorageSync(`selectedList${this.lotteryType}${this.tabIndex}${this.optTabIndex}`,this.selectedList)
				}
				if(index===1){
					const data = this.appendRandom(5)
					data.map(item=>{
						this.selectedList.push(item)
					})
					uni.setStorageSync(`selectedList${this.lotteryType}${this.tabIndex}${this.optTabIndex}`,this.selectedList)
				}
				if(index===0){
					uni.navigateBack()
				}
			},
			
			changeNumBox(value){
				this.scaleValue=value
			},
			
			async findList(){
				let url = `platform=koudai_mobile&_prt=https&ver=20180101000000&lottery_type=P3&station_user_id=54275526&station_uuid=b9cfdcrpfsj3fd1661155817&t=254689&_=1713826090148`
				const data = await request({
					url:'/api/shuzi/infocurrent?'+url,
					method:'POST',
					data:{},
					showLoading:true,
				})
				this.info = data
			},
			
			init(){
				this.findList()
			},
			handleSelectedList(){
				this.lotteryType = uni.getStorageSync('lotteryType')
				const tabIndex = uni.getStorageSync('tabIndex')
				this.tabIndex = tabIndex
				const optTabIndex = uni.getStorageSync('optTabIndex')
				this.optTabIndex = tabIndex
				const lotIndex = tabIndex+'_'+optTabIndex
				this.lotIndex = lotIndex
				this.selectedList = uni.getStorageSync(`selectedList${this.lotteryType}${this.tabIndex}${this.optTabIndex}`) || []
				
				const amountValue = uni.getStorageSync('amountValue')
				this.endDate = uni.getStorageSync('endDate')
				let result;
				let amount;
				let index;
				if(tabIndex===0){
					result = uni.getStorageSync(`optTabIndex${optTabIndex}`)
				}else{
					index = uni.getStorageSync(`teamIndex`)
					result = uni.getStorageSync(`team${index}`)
				}
				if(!result){
					return
				}
				this.selectedList.push({tabIndex,optTabIndex,data:result,amount:amountValue,teamIndex:index})
				// 删除
				if(tabIndex===0) {
					uni.removeStorageSync(`optTabIndex${tabIndex}`)
				}else{
					uni.removeStorageSync(`team${index}`)
				}
			}
		},
		onShow(){
			this.init()
			this.handleSelectedList()
		},
		onLoad() {
			this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			
		},
	}
</script>

<style scoped lang="scss">
.wraps{
	background-color: #fff;
	padding:0 10px;
}
.wraps-item{
	display: flex;
	flex-direction: row;
	align-items: center;
	// padding:5px 0;
	border-bottom:1px dashed #ddd;
	// margin-bottom: 5px;
}
.wraps-subItem{
	display: flex;
	flex-direction: row;
	// padding:5px 0;
	flex-wrap:wrap;
	text-align: center;
	justify-content: center;
}
.bor{
	border-right: 1px solid #ddd;
}
.bor:last-child{
	border-right:0;
}
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

.content{
	padding:0 10px;
}
// .active{
// 	background-color: #cc0002!important;
// 	text{
// 		color:#fff;
// 	}
// }

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
			padding:3px 10px;
			border:1px solid #ddd;
			border-radius:3px;
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
		
	}
	.btns{
		display: flex;
		flex-direction: row;
		align-items:center;
		// border-top:1px solid #ddd;
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

.red{
	color:red;
}
.opt{
	display: flex;
	flex-direction: row;
	align-items: center;
	padding:5px 10px 0 10px;
	.opt-tab{
		flex:1;
		display: flex;
		flex-direction: row;
		align-items: center;
		view{
			padding:5px 0;
			border-bottom:2px solid #f2f2f2;
			margin-right:10px;
		}
		view.active{
			color:#cc0002;
			border-bottom:2px solid #cc0002;
		}
	}
	
	.opt-btn{
		display: flex;
		flex-direction: row;
		align-items: center;
		text-align:right;
		justify-content: flex-end;
	}
}

.prize-tit{
	padding:10px 0;
	background-color: #fff;
	text-align:center;
}
.seven-container{
	flex:1;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
}
.titbar{
	padding:10px 0 0 120px;
	background-color: #fff;
	
}
.scale-block{
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 0 10px;
	// margin-left: 15px;
	text{
		margin-left:5px;
	}
}
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
</style>
