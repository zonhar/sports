<template>
	<view class="wrap">
		<view class="desc">
			<uni-datetime-picker
				v-model="daterange"
				type="daterange"
				return-type="date"
				rangeSeparator="至"
				:clear-icon="false"
				@change="change"
			/>
		</view>
		<view class="list-wrap">
			<view v-if='dataList.records.length ===0' class="noData">暂无数据</view>
			<view class='records-wrap' v-for="record in dataList.records" :key="record.id">
				<view class="records-content">
					<view style="font-size:15px;margin-bottom:10px;font-weight: bold;">流水号:<text>{{record.transactionNo}}</text></view>
						<!-- <uni-row>
							<uni-col class="tit">{{types[parseInt(record.transactionType)]}}</uni-col>	
						</uni-row> -->
						<uni-row>
							<uni-col><text>{{record.description}}</text></uni-col>
						</uni-row>
					</view>
					<view style="text-align:right;color:#666">
						<text>余额 <text style="color: red;" class="amount">{{record.balance}}</text>元</text>	
						<view class="time"><text>{{record.createdAt}}</text></view>
						
					</view>
			</view>
			<uni-load-more @clickLoadMore="clickLoadMore" v-if="dataList.records.length>0" :status="status" :content-text="contentText" />
					
		</view>
		
	</view>
	
</template>

<script>
	import dayjs from 'dayjs';
	import _ from 'lodash';
	import config from '@/common/config.js'
	import request from '@/common/request.js'
	export default {
		data() {
			return {
				baseURL:config.baseURL,
				contentText:{
					contentdown: '下拉显示下一页',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				userInfo:{},
				types:{
					0:'存款',
					1:'提款',
					2:'订单扣款',
					3:'审核扣款'
				},
				addCount:0,
				addAmount:'0.00',
				reduceCount:0,
				reduceAmount:'0.00',
				list:[],
				dataList:{},
				total:0,
				pageNum:1,
				pageSize:10,
				daterange:[dayjs(dayjs().subtract(30, 'day')).format('YYYY-MM-DD'),dayjs().format('YYYY-MM-DD')]
			}
		},
		methods: {
			async change(val){
				this.daterange = [dayjs(val[0]).format('YYYY-MM-DD'),dayjs(val[1]).format('YYYY-MM-DD')]
				this.pageNum = 1
				this.dataList = {}
				this.findList()
			},
			async findList(){
				const options = {
					url:`${config.baseURL}/service/transactionTable/list`,
					method: 'get',
					data:{
						userId: getApp().globalData.userInfo.userId,
						storeId: getApp().globalData.currentShop.id,
						startTime: this.daterange[0],
						endTime: this.daterange[1],
						pageNum: this.pageNum,
						pageSize: this.pageSize
					},
					loading:true,
				}
				const data = await request(options)
				this.dataList = data;
				console.log('data',data)
			}
		},
		onLoad(){
			this.userInfo = getApp().globalData.userInfo
			this.findList()
		},
		onPullDownRefresh() {
			this.dataList = {}
			this.status = 'loading'
			this.pageNum++
			this.findList()
			this.findList()
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		clickLoadMore(e) {
			console.log('e.detail.status',e.detail.status)
			if(e.detail.status==='more'){
				this.status = 'loading'
				this.pageNum++
				this.findList()
			}
			
		}
	}
</script>

<style scoped lang='scss'>
.wrap{
	
}
.list-wrap{
	padding:10px;
	.list-item{
		background-color: #fff;
	}
}
.desc{
	padding:10px;
	background-color: #fff;
	font-size:13px;
	color:#666;
}
.noData{
	font-size:14px;
	color:#666;
	padding:50px 0;
	text-align: center;
}

.empty{
	color:#999;
	text-align: center;
	padding-top:100px;
}
</style>
