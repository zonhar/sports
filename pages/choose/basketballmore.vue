<template>
	<view class="wrap">
		<view class="tip"><text class="red">红色框选项可投单关</text></view>	
		<view><text>让球胜负/大小球</text></view>
		<view class="content-r-top">
			<view class="content-r-sub">
				<text><text class="sub">客</text> [{{ _subItem.rank && _subItem.rank['2'].rank}}]</text>
			</view>	
			<view class="content-r-vs">
				
				{{_subItem.rank && _subItem.rank['2'].team_name}} 
				<text>VS</text> 
				{{_subItem.rank && _subItem.rank['1'].team_name}}
				
			</view>
			<view class="content-r-sub">
				<text>[{{_subItem.rank && _subItem.rank['1'].rank}}] <text class="sub">主</text></text>
			</view>	
		</view>
		<view class="table-wrap">
			<table ref="table" border>
				<tr :class="{'single':_subItem.list?.SportteryHWL?.is_single==='1'}">
					<td 
						class="td"
						:class="{'active':_subItem.list?.SportteryHWL?.leftActive}"
						@click="tdClick(_subItem.list?.SportteryHWL,'left',key,subKey,'SportteryHWL')"
					>
						<view class="td-wrap">
							<text class="label">客胜</text>
							<text class="val">{{_subItem.list?.SportteryHWL?.odds['0']??'未受注'}}</text>
						</view>
						<div v-if="_subItem.list?.SportteryHWL?.is_single==='1'" class="single-tag">单</div>
					 </td>
					<td 
						class="td rowspan-td"
						rowspan="2"
					>
						<view style="margin-bottom:10px;" :class="{'red':_subItem.list?.SportteryHWL?.boundary<0,'green':_subItem.list?.SportteryHWL?.boundary>0}">
							<view>主{{_subItem.list?.SportteryHWL?.boundary>0?'+':''}}{{_subItem.list?.SportteryHWL?.boundary}}</view>
						</view>
						<view class="red">
							{{_subItem.list?.SportteryBS?.boundary}}
						</view>
					</td>
					<td
						class="td last"
						:class="{'active':_subItem.list?.SportteryHWL?.rightActive}"
						@click="tdClick(_subItem.list?.SportteryHWL,'right',key,subKey,'SportteryHWL')"
					>
						<view class="td-wrap">
							<text class="label">主胜</text>
							<text class="val">{{_subItem.list?.SportteryHWL?.odds['3']??'未受注'}}</text>
						</view>
					</td>
				</tr>
				<tr class="odd" :class="{'single':_subItem.list?.SportteryBS?.is_single==='1'}">
					<td
						class="td"
						:class="{'active':_subItem.list?.SportteryBS?.leftActive}"
						@click="tdClick(_subItem.list?.SportteryBS,'left',key,subKey,'SportteryBS')"
					>
						<view class="td-wrap">
							<text class="label">大分</text>
							<text class="val">{{_subItem.list?.SportteryBS?.odds['3']??'未受注'}}</text>
						</view>
						<div v-if="_subItem.list?.SportteryBS?.is_single==='1'" class="single-tag">单</div>
					 </td>
					<td
						class="td last"
						:class="{'active':_subItem.list?.SportteryBS?.rightActive}"
						@click="tdClick(_subItem.list?.SportteryBS,'right',key,subKey,'SportteryBS')"
					>
						<view class="td-wrap">
							<text class="label">小分</text>
							<text class="val">{{_subItem.list?.SportteryBS?.odds['0']??'未受注'}}</text>
						</view>
					</td>
				</tr>
			</table>
		</view>	
		
		
		<view><text>胜负</text></view>
		<view class="table-wrap">
			<table ref="table2" border>
				<tr>
					<td 
						class="td"
						:class="{'active':_subItem.list?.SportteryWL?.leftActive}"
						@click="tdClick(_subItem.list?.SportteryWL,'left',key,subKey,'SportteryWL')"
					>
						<view class="td-wrap">
							<text class="label">客胜</text>
							<text class="val">{{_subItem.list?.SportteryWL?.odds['0']??'未受注'}}</text>
						</view>
						<div v-if="_subItem.list?.SportteryWL?.is_single==='1'" class="single-tag">单</div>
					 </td>
					<td
						class="td last"
						:class="{'active':_subItem.list?.SportteryWL?.rightActive}"
						@click="tdClick(_subItem.list?.SportteryWL,'right',key,subKey,'SportteryWL')"
					>
						<view class="td-wrap">
							<text class="label">主胜</text>
							<text class="val">{{_subItem.list?.SportteryWL?.odds['3']??'未受注'}}</text>
						</view>
					</td>
				</tr>
			</table>
		</view>
		
		
		<view><text>胜分差</text></view>
		<view class="table-wrap">
			<table ref="table3" border>
				<tr :class="{'single':_subItem.list?.SportteryWS?.is_single==='1'}">
					<td 
						class="td"
						:class="{'active':_subItem.list?.SportteryWS?.odds['11Active']}"
						@click="tdClick(_subItem.list?.SportteryWS?.odds,'11',key,subKey,'SportteryWS')"
					>
						<view class="td-wrap">
							<text class="label">1-5</text>
							<text class="val">{{_subItem.list?.SportteryWS?.odds['11']??'未受注'}}</text>
						</view>
						<div v-if="_subItem.list?.SportteryWS?.is_single==='1'" class="single-tag">单</div>
					 </td>
					<td
						class="td"
						:class="{'active':_subItem.list?.SportteryWS?.odds['12Active']}"
						@click="tdClick(_subItem.list?.SportteryWS?.odds,'12',key,subKey,'SportteryWS')"
					>
						<view class="td-wrap">
							<text class="label">6-10</text>
							<text class="val">{{_subItem.list?.SportteryWS?.odds['12']??'未受注'}}</text>
						</view>
					 </td>
					 <td
					 	class="td"
					 	:class="{'active':_subItem.list?.SportteryWS?.odds['13Active']}"
					 	@click="tdClick(_subItem.list?.SportteryWS?.odds,'13',key,subKey,'SportteryWS')"
					 >
					 	<view class="td-wrap">
					 		<text class="label">11-15</text>
					 		<text class="val">{{_subItem.list?.SportteryWS?.odds['13']??'未受注'}}</text>
					 	</view>
				    </td>
					<td
					 	class="td"
					 	:class="{'active':_subItem.list?.SportteryWS?.odds['14Active']}"
					 	@click="tdClick(_subItem.list?.SportteryWS?.odds,'14',key,subKey,'SportteryWS')"
					 >
					 	<view class="td-wrap">
					 		<text class="label">16-20</text>
					 		<text class="val">{{_subItem.list?.SportteryWS?.odds['14']??'未受注'}}</text>
					 	</view>
					</td>
					<td
					 	class="td"
					 	:class="{'active':_subItem.list?.SportteryWS?.odds['15Active']}"
					 	@click="tdClick(_subItem.list?.SportteryWS?.odds,'15',key,subKey,'SportteryWS')"
					 >
					 	<view class="td-wrap">
					 		<text class="label">21-25</text>
					 		<text class="val">{{_subItem.list?.SportteryWS?.odds['15']??'未受注'}}</text>
					 	</view>
					</td>
					<td
					 	class="td last"
					 	:class="{'active':_subItem.list?.SportteryWS?.odds['16Active']}"
					 	@click="tdClick(_subItem.list?.SportteryWS?.odds,'16',key,subKey,'SportteryWS')"
					 >
					 	<view class="td-wrap">
					 		<text class="label">26+</text>
					 		<text class="val">{{_subItem.list?.SportteryWS?.odds['16']??'未受注'}}</text>
					 	</view>
					</td>
				</tr>
				<tr :class="{'single':_subItem.list?.SportteryWS?.is_single==='1'}">
					<td 
						class="td"
						:class="{'active':_subItem.list?.SportteryWS?.odds['01Active']}"
						@click="tdClick(_subItem.list?.SportteryWS?.odds,'01',key,subKey,'SportteryWS')"
					>
						<view class="td-wrap">
							<text class="label">1-5</text>
							<text class="val">{{_subItem.list?.SportteryWS?.odds['01']??'未受注'}}</text>
						</view>
					 </td>
					<td
						class="td"
						:class="{'active':_subItem.list?.SportteryWS?.odds['02Active']}"
						@click="tdClick(_subItem.list?.SportteryWS?.odds,'02',key,subKey,'SportteryWS')"
					>
						<view class="td-wrap">
							<text class="label">6-10</text>
							<text class="val">{{_subItem.list?.SportteryWS?.odds['02']??'未受注'}}</text>
						</view>
					 </td>
					 <td
					 	class="td"
					 	:class="{'active':_subItem.list?.SportteryWS?.odds['03Active']}"
					 	@click="tdClick(_subItem.list?.SportteryWS?.odds,'03',key,subKey,'SportteryWS')"
					 >
					 	<view class="td-wrap">
					 		<text class="label">11-15</text>
					 		<text class="val">{{_subItem.list?.SportteryWS?.odds['03']??'未受注'}}</text>
					 	</view>
				    </td>
					<td
					 	class="td"
					 	:class="{'active':_subItem.list?.SportteryWS?.odds['04Active']}"
					 	@click="tdClick(_subItem.list?.SportteryWS?.odds,'04',key,subKey,'SportteryWS')"
					 >
					 	<view class="td-wrap">
					 		<text class="label">16-20</text>
					 		<text class="val">{{_subItem.list?.SportteryWS?.odds['04']??'未受注'}}</text>
					 	</view>
					</td>
					<td
					 	class="td"
					 	:class="{'active':_subItem.list?.SportteryWS?.odds['05Active']}"
					 	@click="tdClick(_subItem.list?.SportteryWS?.odds,'05',key,subKey,'SportteryWS')"
					 >
					 	<view class="td-wrap">
					 		<text class="label">21-25</text>
					 		<text class="val">{{_subItem.list?.SportteryWS?.odds['05']??'未受注'}}</text>
					 	</view>
					</td>
					<td
					 	class="td last"
					 	:class="{'active':_subItem.list?.SportteryWS?.odds['06Active']}"
					 	@click="tdClick(_subItem.list?.SportteryWS?.odds,'06',key,subKey,'SportteryWS')"
					 >
					 	<view class="td-wrap">
					 		<text class="label">26+</text>
					 		<text class="val">{{_subItem.list?.SportteryWS?.odds['06']??'未受注'}}</text>
					 	</view>
					</td>
				</tr>
			</table>
		</view>
		
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
				if(this._subItem.isSelectedCorner){
					delete getApp().globalData.basketOtherData[this._subItem.serial_no]
				}
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
						jc_type: 'basket'
					}
				})
				const { SportteryBS,SportteryHWL,SportteryWL,SportteryWS } = data[serial_no].list
				getApp().globalData.basketOtherData = {
					[serial_no]:{
						SportteryBS,
						SportteryHWL,
						SportteryWL,
						SportteryWS
					}
				}
			},
		
			tdClick(row,pos,key,subKey,postname){
				if(!row){
					return
				}
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
			this.getSelectMore(subKey,this._subItem.list.SportteryWL?.bet_id??this._subItem.list.SportteryHWL.bet_id)
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
			td.rowspan-td{
				border: 1px solid #ddd;
				background-color: #e4e4e4;
				border-right: 0;
			}
			td.last::before{
				border-right:1px solid #cc0002; 
				border-top:0;
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
				margin:0 3px;
			}
			.sub{
				color:#666;
				fongt-size:10px;
			}
		}
	}
	.rowspan-td{
		background-color: #e4e4e4;
		text-align: center;
		padding:0;
		width:80px;
	}
	.red{
		color:red;
	}
	.green{
		color:green
	}
</style>