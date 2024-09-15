<template>
	<view class="wrap">
		<view class="tip"><text class="red">红色框选项可投单关</text></view>	
		<table ref="table" border>
			<tr :class="{'single':SportteryNWDL.is_single==='1'}">
				<td rowspan="2" class="rowspan">
					<view class="label-td">
						<view class="label-td-u"><text>胜平负</text></view>	
						<view class="label-td-d"><text>主+1</text></view>
					</view>
				</td>
				<td 
					class="td"
					:class="{'active':_subItem.list?.SportteryNWDL?.leftActive}"
					@click="tdClick2(_subItem.list?.SportteryNWDL,'left')"
				>
					<view class="td-wrap">
						<text class="label">胜</text>
						<text class="val">{{_subItem.list?.SportteryNWDL?.odds['3']??'未受注'}}</text>
					</view>
					<div v-if="_subItem.list?.SportteryNWDL?.is_single==='1'" class="single-tag">单</div>
				 </td>
				<td 
					class="td"
					:class="{'active':_subItem.list?.SportteryNWDL?.middleActive}"
					@click="tdClick2(_subItem.list?.SportteryNWDL,'middle')"
				>
					<view class="td-wrap">
						<text class="label">平</text>
						<text class="val">{{_subItem.list?.SportteryNWDL?.odds['1']??'未受注'}}</text>
					</view>
				</td>
				<td
					class="td last"
					:class="{'active':_subItem.list?.SportteryNWDL?.rightActive}"
					@click="tdClick2(_subItem.list?.SportteryNWDL,'right')"
				>
					<view class="td-wrap">
						<text class="label">负</text>
						<text class="val">{{_subItem.list?.SportteryNWDL?.odds['0']??'未受注'}}</text>
					</view>
				</td>
			</tr>
			<tr class="odd" :class="{'single':_subItem.list?.SportteryWDL?.is_single==='1'}">
				<td
					class="td"
					:class="{'active':_subItem.list?.SportteryWDL?.leftActive}"
					@click="tdClick2(_subItem.list?.SportteryWDL,'left')"
				>
					<view class="td-wrap">
						<text class="label">胜</text>
						<text class="val">{{_subItem.list?.SportteryWDL?.odds['3']??'未受注'}}</text>
					</view>
					<div v-if="_subItem.list?.SportteryWDL?.is_single==='1'" class="single-tag">单</div>
				 </td>
				<td
					class="td"
					:class="{'active':_subItem.list?.SportteryWDL?.middleActive}"
					@click="tdClick2(_subItem.list?.SportteryWDL,'middle')"
				>
					<view class="td-wrap">
						<text class="label">平</text>
						<text class="val">{{_subItem.list?.SportteryWDL?.odds['1']??'未受注'}}</text>
					</view>
				</td>
				<td
					class="td last"
					:class="{'active':_subItem.list?.SportteryWDL?.rightActive}"
					@click="tdClick2(_subItem.list?.SportteryWDL,'right')"
				>
					<view class="td-wrap">
						<text class="label">负</text>
						<text class="val">{{_subItem.list?.SportteryWDL?.odds['0']??'未受注'}}</text>
					</view>
				</td>
			</tr>
		</table>
		
		<!-- 比分 -->
		<table ref="table" border>
			<tr v-for="(score,sIndex) in _subItem.score3" :key="sIndex" :class="{'single':SportteryScore.is_single==='1'}">
				<td v-if="sIndex===0" :rowspan="rowspanScore" class="rowspan">
					<view class="label-td">
						<view class="label-td-u" style="background-color: #85B5DB;"><text>比分</text></view>
					</view>
				</td>
				<td 
					class="td"
					v-for="(gItem,gIndex) in score"
					:class="{'active':gItem.active}"
					@click="tdClick(gItem)"
					:key="gIndex"
				>
					<view class="td-wrap">
						<text class="label" v-if="gItem.main==4 && gItem.sub==3">胜其它</text>
						<text class="label" v-else>{{gItem.main}}:{{gItem.sub}}</text>
						<text class="val">{{gItem.val}}</text>
					</view>
					<div v-if="sIndex===0 && gIndex===0 && SportteryScore.is_single==='1'" class="single-tag">单</div>
				 </td>
			</tr>
			<tr v-for="(pScore,pIndex) in _subItem.score1" :key="pIndex" :class="{'single':SportteryScore.is_single==='1'}">
				<td
					class="td"
					v-for="(pItem,pInd) in pScore"
					:key="pInd"
					:class="{'active':pItem.active}"
					@click="tdClick(pItem)"
				>
					<view class="td-wrap">
						<text class="label" v-if="pItem.main==4 && pItem.sub==4">平其它</text>
						<text class="label" v-else>{{pItem.main}}:{{pItem.sub}}</text>
						<text class="val">{{pItem.val}}</text>
					</view>
				 </td>
			</tr>
			<tr v-for="(fScore,fIndex) in _subItem.score0" :key="fIndex" :class="{'single':SportteryScore.is_single==='1'}">
				<td
					class="td"
					v-for="(fItem,fInd) in fScore"
					:key="fInd"
					:class="{'active':fItem.active}"
					@click="tdClick(fItem)"
				>
					<view class="td-wrap">
						<text class="label" v-if="fItem.main==3 && fItem.sub==4">负其它</text>
						<text class="label" v-else>{{fItem.main}}:{{fItem.sub}}</text>
						<text class="val">{{fItem.val}}</text>
					</view>
				 </td>
			</tr>
		</table>
		<table ref="table" border>
			<tr v-for="(goal,goalIndex) in _subItem.totalGoals" :key="goalIndex" :class="{'single':SportteryTotalGoals.is_single==='1'}">
				<td v-if="goalIndex===0" :rowspan="_subItem.totalGoals.length" class="rowspan">
					<view class="label-td">
						<view class="label-td-u" style="background-color: #F29983;"><text>总进球数</text></view>
					</view>
				</td>
				<td 
					class="td"
					v-for="(goalItem,goalInd) in goal"
					:key="goalInd"
					:class="{'active':goalItem.active}"
					@click="tdClick(goalItem)"
				>
					<view class="td-wrap">
						<text class="label">{{goalItem.label}}球</text>
						<text class="val">{{goalItem.val}}</text>
					</view>
					<div v-if="goalIndex===0 && goalInd===0 && SportteryTotalGoals.is_single==='1'" class="single-tag">单</div>
				 </td>
			</tr>
		</table>
		
		<table ref="table" border>
			<tr v-for="(half,hIndex) in _subItem.halfFull" :key="hIndex" :class="{'single':SportteryHalfFull.is_single==='1'}">
				<td v-if="hIndex===0" :rowspan="_subItem.halfFull.length" class="rowspan">
					<view class="label-td">
						<view class="label-td-u" style="background-color: #FABB5D;"><text>半全场</text></view>
					</view>
				</td>
				<td 
					class="td"
					:class="{'active':halfItem.active}"
					@click="tdClick(halfItem)"
					v-for="(halfItem,hInd) in half"
					:key="hInd"
				>
					<view class="td-wrap">
						<text class="label">{{formatHalf(halfItem.label)}}</text>
						<text class="val">{{halfItem.val}}</text>
					</view>
					<div v-if="hIndex===0 && hInd===0 && SportteryHalfFull.is_single==='1'" class="single-tag">单</div>
				 </td>
			</tr>
			
		</table>
		
		<view class="foot-btns">
			<button @click="cancel" class="foot-btns-item" size="small" type="default">取消</button>
			<button @click='confirm' class="foot-btns-item" style="margin-left:15px;" size="small" type="primary">确定</button>
		</view>
	</view>
</template>

<script>
import _ from 'lodash'
import request from '../../common/request'
	export default {
		data(){
			return {
				_subItem:{},
				score3:[],
				score1:[],
				score0:[],
				rowspanScore:0,
				totalGoals:[],
				halfFull:[],
				SportteryScore:{},
				SportteryTotalGoals:{},
				SportteryHalfFull:{},
				SportteryNWDL:{},
				
			}
		},
		
		methods:{
			cancel(){
				this._subItem = this.subItem
				// this.subItem = {...getApp().globalData.subItem}
				uni.navigateBack()
			},
			confirm(){
				getApp().globalData.subItem = this._subItem
				//返回上级页面并传参
				let pages = getCurrentPages()
				let prevPage = pages[pages.length -2]
				prevPage.$vm.getValue({key:this.key,subKey:this.subKey})
				uni.navigateBack({
					delta: 1 // 返回的页面数
				})
			},
			async getSelectMore(serial_no,bet_id){
				const data = await request({
					url:'/api/match/selectmore',
					data:{
						platform: 'koudai_mobile',
						_prt: 'https',
						ver: '20180101000000',
						serial_no,
						bet_id,
						t: 253263,
						_: 1713134944325,
					}
				})
				// 比分
				const { SportteryScore,SportteryTotalGoals,SportteryHalfFull,SportteryNWDL } = data[serial_no].list
				getApp().globalData.otherData = {
					[serial_no]:{
						SportteryScore,
						SportteryTotalGoals,
						SportteryHalfFull
					}
				}
				const scores = this.formatJson(SportteryScore.odds)
				this.SportteryScore = SportteryScore
				this.SportteryTotalGoals = SportteryTotalGoals
				this.SportteryHalfFull = SportteryHalfFull
				this.SportteryNWDL = SportteryNWDL

				this._subItem.score3 = this._subItem.score3 || _.chunk(scores.filter(o=>Number(o.main)>Number(o.sub)),5)//胜比分集合
				this._subItem.score1 = this._subItem.score1 || _.chunk(scores.filter(o=>o.main===o.sub),5)//平比分集合
				this._subItem.score0 = this._subItem.score0 || _.chunk(scores.filter(o=>Number(o.main)<Number(o.sub)),5)//负比分集合
				this.rowspanScore = this._subItem.score3.length+this._subItem.score1.length+this._subItem.score0.length
				//总进球数
				let totalGoals = []
				totalGoals = Object.entries(SportteryTotalGoals.odds)
				totalGoals = totalGoals.map((item)=>{
					item={
						label:item[0],
						val:item[1]
					}
					return item
				}).filter(o=>o.val)
				totalGoals = _.chunk(totalGoals,4)
				this._subItem.totalGoals = this._subItem.totalGoals || totalGoals
				
				//半全场
				let halfFull = []
				halfFull = Object.entries(SportteryHalfFull.odds)
				halfFull = halfFull.map((item)=>{
					item={
						label:item[0],
						val:item[1]
					}
					return item
				})
				halfFull = _.sortBy(halfFull,(o)=>Number(o.val)).reverse()
				halfFull = _.chunk(halfFull,3)
				this._subItem.halfFull = this._subItem.halfFull || halfFull
				
			},
			formatJson(value){
				const arr = []
				for(let key in value){
					arr.push({
						main: key.split('')[0],
						sub:key.split('')[1],
						val: value[key]
					})
				}
				return arr
			},
			tdClick(row){
				if(!row){
					return
				}
				row[`active`] = !row[`active`]
				// this.$set(row,'active',!row[`active`])
				// this.handleSelectList(row,pos,key,subKey,postname)
				// this.selectedTipFlag = this.handleRule()
			},
			tdClick2(row,pos){
				if(!row){
					return
				}
				// this.$set(row,`${pos}Active`,!row[`${pos}Active`])
				row[`${pos}Active`] = !row[`${pos}Active`]
			},
			transforV(value){
				if(value==='3'){
					return '胜'
				}
				if(value==='1'){
					return '平'
				}
				return '负'
			},
			formatHalf(val){
				
				const arr = val.split('')
				return this.transforV(arr[0])+'/'+this.transforV(arr[1])
			}
		},
		onLoad(option){
			const {subKey,key} = option
			this.key = key
			this.subKey = subKey
			this._subItem = JSON.parse(JSON.stringify(getApp().globalData.subItem))
			this.getSelectMore(subKey,this._subItem.list.SportteryNWDL.bet_id)
		},
		onShow(option){
			this.subItem = JSON.parse(JSON.stringify(getApp().globalData.subItem))
		}
	}
</script>

<style scoped lang="scss">
	.tip{
		padding:10px;
		color:red;
		text-align: center;
		font-size:12px;
	}
	table{
		width:100%; 
		border-spacing: 0;
		border-collapse: collapse;
		margin-bottom:15px;
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
		padding: 5px 5px;
		font-size:13px;
		color:#000;
		background-color: #fff;
	}
	.td-wrap{
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
	.active{
		background-color: #cc0002!important;
		text{
			color:#fff;
		}
	}
	.foot-btns{
		position: fixed;
		bottom:0;
		left:0;
		z-index: 100;
		display: flex;
		flex-direction: row;
		align-items: center;
		padding:10px 15px;
		background-color: #fff;
		box-sizing: border-box;
		width:100%;
		.foot-btns-item{
			flex:1;
		}
	}
	.wrap{
		padding:0 10px 80px 10px;
	}
	.label-td{
		display: flex;
		justify-content: center;
		flex-direction: column;
		text-align: center;
		position: absolute;
		top:0;
		bottom:0;
		left:0;
		.label-td-u{
			flex:1;
			background-color: #aaa;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			color:#fff;
			align-items: center;
		}
		.label-td-d{
			flex:1;
			background-color: #cc0002;
			color:#fff;
		}
	}
	.rowspan{
		position: relative;
		width:14px;
	}
</style>