<template>
	<view class="page-content">
		<view class="nav-bar">
			<view :style="{ height: iStatusBarHeight + 'px',backgroundColor:'#cc0002'}"></view>
			<uni-nav-bar left-icon="left" background-color="#cc0002" color="#ffffff" height="40px"
				@clickLeft="clickLeft" @clickRight="clickRight">
				<view class="button-center">
					北京单场
				</view>
				<template v-slot:right>
					<zb-popover style="position: absolute;" placement="bottom-end" :options="actions" ref="ZbPopover"
						theme="dark" @select="select" class="item-popover">
						<view style="position:relative;padding-right:5px;">
							<uni-badge :is-dot="true" absolute="rightTop" size="small" :text="filters?1:0">
								<uni-icons type="list" size="22" color="#fff"></uni-icons>
							</uni-badge>
						</view>
					</zb-popover>
				</template>
			</uni-nav-bar>
		</view>

		<uni-drawer :width="280" ref="showRight" mode="right" :mask-click="false">
			<view :style="{ height: iStatusBarHeight + 'px',backgroundColor:'#fff'}"></view>
			<view style="padding:58px 10px 10px 10px;">
				<scroll-view :style="{height:scrollHeight+'px'}" scroll-y="true">
					<view class="tit"><text>胜平负低赔率区间</text></view>
					<uni-data-checkbox multiple v-model="checkbox1" :localdata="hobby"></uni-data-checkbox>

					<view class="tit" style="margin-top:15px;"><text>赛事</text></view>
					<uni-data-checkbox multiple v-model="checkbox2" :localdata="hobbys"></uni-data-checkbox>

				</scroll-view>
				<view class="footerBtns">
					<button @click="cancel" type="default">取消</button>
					<button style="margin-left:10px;" @click="confirm" type="primary">确定</button>
				</view>
			</view>
		</uni-drawer>

		<view :style="{paddingTop:(iStatusBarHeight+38)+'px'}">
			<button-group :buttons="buttons" :isRadius="false" @change="change" unactiveBackgroundColor='#fff'
				activeBackgroundColor='#cc0002' activeColor='#fff' unactiveColor='#cc0002'>
			</button-group>
		</view>
		<scroll-view scroll-y="true" :style="{paddingBottom:'90px'}">
			<view v-if="tabIndex===0">
				<uni-collapse>
					<uni-collapse-item v-for="(item,key) in list" :key="key" :title="formatTitle(item,key)"
						:open="true">
						<view class="content">
							<view class="content-item" v-for="(subItem,subKey) in item" :key="subItem">
								<view class="content-l">
									<text>{{subKey}}</text>
									<uni-tag :style="{margin:'3px 0',backgroundColor:subItem.league_color[0],border:0}"
										:text="subItem.league_name" type="primary" size="small" />
									<text>{{dayjs(subItem.bet_time).format('HH:mm')}}</text>
									<!-- <text style="color:#019AFE">分析</text> -->
								</view>
								<view class="table-left">
									<text class="dot"
										:class="{'success':subItem.list?.WDL?.boundary>0,'danger':subItem.list?.WDL?.boundary<0}">
										{{subItem.list?.WDL?.boundary>0?'+':''}}{{subItem.list?.WDL?.boundary}}
									</text>
								</view>
								<view class="content-r">
									<view class="content-r-top">
										<view class="content-r-sub">
											<text>[{{ subItem.rank && subItem.rank['1'].rank}}]</text>
											<text>{{ subItem.rank && subItem.rank['1'].rank_league}}</text>
										</view>
										<view class="content-r-vs">
											{{subItem.rank && subItem.rank['1'].team_name}} <text>VS</text>
											{{subItem.rank && subItem.rank['2'].team_name}}
										</view>
										<view class="content-r-sub">
											<text>[{{subItem.rank && subItem.rank['2'].rank}}]</text>
											<text>{{subItem.rank && subItem.rank['2'].rank_league}}</text>
										</view>
									</view>
									<view class="table-wrap">

										<table ref="table" border>
											<tr>
												<td class="td" :class="{'active':subItem.list?.WDL?.leftActive}"
													@click="tdClick(subItem.list?.WDL,'left',key,subKey,'WDL')">
													<view class="td-wrap">
														<text class="label">胜</text>
														<text class="val">{{subItem.list?.WDL?.odds['3']??'未受注'}}</text>
													</view>
												</td>
												<td class="td" :class="{'active':subItem.list?.WDL?.middleActive}"
													@click="tdClick(subItem.list?.WDL,'middle',key,subKey,'WDL')">
													<view class="td-wrap">
														<text class="label">平</text>
														<text class="val">{{subItem.list?.WDL?.odds['1']??'未受注'}}</text>
													</view>
												</td>
												<td class="td" :class="{'active':subItem.list?.WDL?.rightActive}"
													@click="tdClick(subItem.list?.WDL,'right',key,subKey,'WDL')">
													<view class="td-wrap">
														<text class="label">负</text>
														<text class="val">{{subItem.list?.WDL?.odds['0']??'未受注'}}</text>
													</view>
												</td>
											</tr>
										</table>
									</view>
								</view>
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>
			<view v-if="tabIndex===1">
				<uni-collapse>
					<uni-collapse-item v-for="(item,key) in list" :key="key" :title="formatTitle(item,key)"
						:open="true">
						<view class="content">
							<view class="content-item" v-for="(subItem,subKey) in item" :key="subItem">
								<view class="content-l">
									<text>{{subKey}}</text>
									<uni-tag :style="{margin:'3px 0',backgroundColor:subItem.league_color[0],border:0}"
										:text="subItem.league_name" type="primary" size="small" />
									<text>{{dayjs(subItem.bet_time).format('HH:mm')}}</text>
									<!-- <text style="color:#019AFE">分析</text> -->
								</view>

								<view class="content-r">
									<view class="content-r-top">
										<view class="content-r-sub">
											<text>[{{ subItem.rank && subItem.rank['1'].rank}}]</text>
											<text>{{ subItem.rank && subItem.rank['1'].rank_league}}</text>
										</view>
										<view class="content-r-vs">
											{{subItem.rank && subItem.rank['1'].team_name}} <text>VS</text>
											{{subItem.rank && subItem.rank['2'].team_name}}
										</view>
										<view class="content-r-sub">
											<text>[{{subItem.rank && subItem.rank['2'].rank}}]</text>
											<text>{{subItem.rank && subItem.rank['2'].rank_league}}</text>
										</view>
									</view>
									<view class="table-wrap">

										<table ref="table" border>
											<tr>
												<td class="td" :class="{'active':subItem.list?.TotalGoals?.Active0}"
													@click="tdClick(subItem.list?.TotalGoals,'0',key,subKey,'TotalGoals')">
													<view class="td-wrap">
														<text class="label">0球</text>
														<text
															class="val">{{subItem.list?.TotalGoals?.odds['0']??'未受注'}}</text>
													</view>
												</td>
												<td class="td" :class="{'active':subItem.list?.TotalGoals?.Active1}"
													@click="tdClick(subItem.list?.TotalGoals,'1',key,subKey,'TotalGoals')">
													<view class="td-wrap">
														<text class="label">1球</text>
														<text
															class="val">{{subItem.list?.TotalGoals?.odds['1']??'未受注'}}</text>
													</view>
												</td>
												<td class="td" :class="{'active':subItem.list?.TotalGoals?.Active2}"
													@click="tdClick(subItem.list?.TotalGoals,'2',key,subKey,'TotalGoals')">
													<view class="td-wrap">
														<text class="label">2球</text>
														<text
															class="val">{{subItem.list?.TotalGoals?.odds['2']??'未受注'}}</text>
													</view>
												</td>
												<td class="td" :class="{'active':subItem.list?.TotalGoals?.Active3}"
													@click="tdClick(subItem.list?.TotalGoals,'3',key,subKey,'TotalGoals')">
													<view class="td-wrap">
														<text class="label">3球</text>
														<text
															class="val">{{subItem.list?.TotalGoals?.odds['3']??'未受注'}}</text>
													</view>
												</td>
											</tr>
											<tr>
												<td class="td" :class="{'active':subItem.list?.TotalGoals?.Active4}"
													@click="tdClick(subItem.list?.TotalGoals,'4',key,subKey,'TotalGoals')">
													<view class="td-wrap">
														<text class="label">4球</text>
														<text
															class="val">{{subItem.list?.TotalGoals?.odds['4']??'未受注'}}</text>
													</view>
												</td>
												<td class="td" :class="{'active':subItem.list?.TotalGoals?.Active5}"
													@click="tdClick(subItem.list?.TotalGoals,'5',key,subKey,'TotalGoals')">
													<view class="td-wrap">
														<text class="label">5球</text>
														<text
															class="val">{{subItem.list?.TotalGoals?.odds['5']??'未受注'}}</text>
													</view>
												</td>
												<td class="td" :class="{'active':subItem.list?.TotalGoals?.Active6}"
													@click="tdClick(subItem.list?.TotalGoals,'6',key,subKey,'TotalGoals')">
													<view class="td-wrap">
														<text class="label">6球</text>
														<text
															class="val">{{subItem.list?.TotalGoals?.odds['6']??'未受注'}}</text>
													</view>
												</td>
												<td class="td" :class="{'active':subItem.list?.TotalGoals?.Active7}"
													@click="tdClick(subItem.list?.TotalGoals,'7',key,subKey,'TotalGoals')">
													<view class="td-wrap">
														<text class="label">7+</text>
														<text
															class="val">{{subItem.list?.TotalGoals?.odds['7']??'未受注'}}</text>
													</view>
												</td>
											</tr>
										</table>
									</view>
								</view>
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>
			<view v-if="tabIndex===2">
				<uni-collapse>
					<uni-collapse-item v-for="(item,key) in list" :key="key" :title="formatTitle(item,key)"
						:open="true">
						<view class="content">
							<view class="content-item" v-for="(subItem,subKey) in item" :key="subItem">
								<view class="content-l">
									<text>{{subKey}}</text>
									<uni-tag :style="{margin:'3px 0',backgroundColor:subItem.league_color[0],border:0}"
										:text="subItem.league_name" type="primary" size="small" />
									<text>{{dayjs(subItem.bet_time).format('HH:mm')}}</text>
									<!-- <text style="color:#019AFE">分析</text> -->
								</view>

								<view class="content-r">
									<view class="content-r-top">
										<view class="content-r-sub">
											<text>[{{ subItem.rank && subItem.rank['1'].rank}}]</text>
											<text>{{ subItem.rank && subItem.rank['1'].rank_league}}</text>
										</view>
										<view class="content-r-vs">
											{{subItem.rank && subItem.rank['1'].team_name}} <text>VS</text>
											{{subItem.rank && subItem.rank['2'].team_name}}
										</view>
										<view class="content-r-sub">
											<text>[{{subItem.rank && subItem.rank['2'].rank}}]</text>
											<text>{{subItem.rank && subItem.rank['2'].rank_league}}</text>
										</view>
									</view>
									<view @click.stop="togglePoup(key,subKey)"
										v-if="subItem.result && subItem.result.length>0" class="active select-block">
										<uni-badge size="small" :text="subItem.result.length" absolute="rightTop"
											type="error">
											<text>{{subItem.result.join(' ')}}</text>
										</uni-badge>
									</view>

									<view v-else @click.stop="togglePoup(key,subKey)" class="select-block">
										<text>点击展开投注</text>
									</view>

								</view>
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>
			<view v-if="tabIndex===3">
				<uni-collapse>
					<uni-collapse-item v-for="(item,key) in list" :key="key" :title="formatTitle(item,key)"
						:open="true">
						<view class="content">
							<view class="content-item" v-for="(subItem,subKey) in item" :key="subItem">
								<view class="content-l">
									<text>{{subKey}}</text>
									<uni-tag :style="{margin:'3px 0',backgroundColor:subItem.league_color[0],border:0}"
										:text="subItem.league_name" type="primary" size="small" />
									<text>{{dayjs(subItem.bet_time).format('HH:mm')}}</text>
									<!-- <text style="color:#019AFE">分析</text> -->
								</view>

								<view class="content-r">
									<view class="content-r-top">
										<view class="content-r-sub">
											<text>[{{ subItem.rank && subItem.rank['1'].rank}}]</text>
											<text>{{ subItem.rank && subItem.rank['1'].rank_league}}</text>
										</view>
										<view class="content-r-vs">
											{{subItem.rank && subItem.rank['1'].team_name}} <text>VS</text>
											{{subItem.rank && subItem.rank['2'].team_name}}
										</view>
										<view class="content-r-sub">
											<text>[{{subItem.rank && subItem.rank['2'].rank}}]</text>
											<text>{{subItem.rank && subItem.rank['2'].rank_league}}</text>
										</view>
									</view>
									<view @click.stop="togglePoup(key,subKey)"
										v-if="subItem.result && subItem.result.length>0" class="active select-block">
										<uni-badge size="small" :text="subItem.result.length" absolute="rightTop"
											type="error">
											<text>{{subItem.result.join(' ')}}</text>
										</uni-badge>
									</view>

									<view v-else @click.stop="togglePoup(key,subKey)" class="select-block">
										<text>点击展开投注</text>
									</view>
								</view>
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>
			<view v-if="tabIndex===4">
				<uni-collapse>
					<uni-collapse-item v-for="(item,key) in list" :key="key" :title="formatTitle(item,key)"
						:open="true">
						<view class="content">
							<view class="content-item" v-for="(subItem,subKey) in item" :key="subItem">
								<view class="content-l">
									<text>{{subKey}}</text>
									<uni-tag :style="{margin:'3px 0',backgroundColor:subItem.league_color[0],border:0}"
										:text="subItem.league_name" type="primary" size="small" />
									<text>{{dayjs(subItem.bet_time).format('HH:mm')}}</text>
									<!-- <text style="color:#019AFE">分析</text> -->
								</view>

								<view class="content-r">
									<view class="content-r-top">
										<view class="content-r-sub">
											<text>[{{ subItem.rank && subItem.rank['1'].rank}}]</text>
											<text>{{ subItem.rank && subItem.rank['1'].rank_league}}</text>
										</view>
										<view class="content-r-vs">
											{{subItem.rank && subItem.rank['1'].team_name}} <text>VS</text>
											{{subItem.rank && subItem.rank['2'].team_name}}
										</view>
										<view class="content-r-sub">
											<text>[{{subItem.rank && subItem.rank['2'].rank}}]</text>
											<text>{{subItem.rank && subItem.rank['2'].rank_league}}</text>
										</view>
									</view>
									<view class="table-wrap">

										<table ref="table" border>
											<tr>
												<td class="td" :class="{'active':subItem.list?.OverUnder?.Active3}"
													@click="tdClick(subItem.list?.OverUnder,'3',key,subKey,'OverUnder')">
													<view class="td-wrap">
														<text class="label">上单</text>
														<text
															class="val">{{subItem.list?.OverUnder?.odds['3']??'未受注'}}</text>
													</view>
												</td>
												<td class="td" :class="{'active':subItem.list?.OverUnder?.Active2}"
													@click="tdClick(subItem.list?.OverUnder,'2',key,subKey,'OverUnder')">
													<view class="td-wrap">
														<text class="label">上双</text>
														<text
															class="val">{{subItem.list?.OverUnder?.odds['2']??'未受注'}}</text>
													</view>
												</td>
												<td class="td" :class="{'active':subItem.list?.OverUnder?.Active1}"
													@click="tdClick(subItem.list?.OverUnder,'1',key,subKey,'OverUnder')">
													<view class="td-wrap">
														<text class="label">下单</text>
														<text
															class="val">{{subItem.list?.OverUnder?.odds['1']??'未受注'}}</text>
													</view>
												</td>
												<td class="td" :class="{'active':subItem.list?.OverUnder?.Active0}"
													@click="tdClick(subItem.list?.OverUnder,'0',key,subKey,'OverUnder')">
													<view class="td-wrap">
														<text class="label">下双</text>
														<text
															class="val">{{subItem.list?.OverUnder?.odds['0']??'未受注'}}</text>
													</view>
												</td>
											</tr>
										</table>
									</view>
								</view>
							</view>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>
		</scroll-view>
		<view class="opt-wrap" v-if="showOpt">
			<view class="select-tip" v-if="selectCount===0">
				<text class="title" v-if="selectedTipFlag===0">{{noSelectTitleTip}}</text>
				<text @click="goExplain" style="text-decoration: underline;"
					v-if="selectedTipFlag===0 || selectedTipFlag===1">{{noSelectDescTip}}</text>
			</view>
			<view v-if="selectCount>0">
				<view class='select-info'>
					<!-- <uni-badge class="uni-badge-left-margin" :text="selectCount" absolute="rightTop" size="small">
						<view class="flag-box"><text class="text">{{selectCount>1?`${selectCount}串1`:'单关'}}</text></view>
					</uni-badge> -->
					<uni-badge class="uni-badge-left-margin" :text="poupSelected.length" absolute="rightTop"
						size="small">
						<view class="flag-box" @click="openDialog" v-if="poupSelected.length<1">选择过关</view>
						<view class="flag-box" @click="openDialog" v-else>
							{{`${selectCount===1?'单关':poupSelected.join(',')}`}}
						</view>
					</uni-badge>
					<view class="scale-block">
						<uni-number-box :min="1" :max="50000" :width="60" :value="scaleValue" @change="changeNumBox" />
						<text>倍</text>
					</view>

					<view class="select-amount">
						<text class="amount-tit">金额<text>{{amountValue}}</text>元</text>
						<text class='amount-desc'>最高奖<text>{{prizeValue}}</text>元</text>
					</view>
				</view>
				<view class="btns">
					<view class="btns-item" @click="reset"><uni-icons type="trash" color='#666' size="20"></uni-icons>
					</view>
					<view class="btns-item btns-prize"></view>
					<view class="btns-item" @click="submitOrder(3)">保存</view>
					<!-- <view class="btns-item">合买</view> -->
					<view @click="submitOrder(0)" class="btns-item btns-next">下一步</view>
				</view>
			</view>
		</view>
		<uni-popup ref="popupHalf" background-color="#fff" @change="poupChange">
			<view class="popup-content" style="padding:16px 16px 16px 16px;">
				<view class="content-r-top" style="margin-bottom:15px;">
					<view class="content-r-sub">
						<text>[{{ subItemModal.rank && subItemModal.rank['1'].rank}}]</text>
						<text>{{ subItemModal.rank && subItemModal.rank['1'].rank_league}}</text>
					</view>
					<view class="content-r-vs">
						{{subItemModal.rank && subItemModal.rank['1'].team_name}} <text>VS</text>
						{{subItemModal.rank && subItemModal.rank['2'].team_name}}
					</view>
					<view class="content-r-sub">
						<text>[{{subItemModal.rank && subItemModal.rank['2'].rank}}]</text>
						<text>{{subItemModal.rank && subItemModal.rank['2'].rank_league}}</text>
					</view>
				</view>
				<view class="table-wrap">
					<table ref="table" border>
						<tr>
							<td class="td" :class="{'active':subItemModal['active33']}" @click="onModalTdClick('33')">
								<view class="td-wrap-modal">
									<text class="label">胜/胜</text>
									<text class="val">{{subItemModal.list?.HalfFull?.odds['33']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active13']}" @click="onModalTdClick('13')">
								<view class="td-wrap-modal">
									<text class="label">平/胜</text>
									<text class="val">{{subItemModal.list?.HalfFull?.odds['13']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active03']}" @click="onModalTdClick('03')">
								<view class="td-wrap-modal">
									<text class="label">负/胜</text>
									<text class="val">{{subItemModal.list?.HalfFull?.odds['03']??'未受注'}}</text>
								</view>
							</td>
						</tr>
						<tr>
							<td class="td" :class="{'active':subItemModal['active31']}" @click="onModalTdClick('31')">
								<view class="td-wrap-modal">
									<text class="label">胜/平</text>
									<text class="val">{{subItemModal.list?.HalfFull?.odds['31']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active11']}" @click="onModalTdClick('11')">
								<view class="td-wrap-modal">
									<text class="label">平/平</text>
									<text class="val">{{subItemModal.list?.HalfFull?.odds['11']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active01']}" @click="onModalTdClick('01')">
								<view class="td-wrap-modal">
									<text class="label">负/平</text>
									<text class="val">{{subItemModal.list?.HalfFull?.odds['01']??'未受注'}}</text>
								</view>
							</td>
						</tr>
						<tr>
							<td class="td" :class="{'active':subItemModal['active30']}" @click="onModalTdClick('30')">
								<view class="td-wrap-modal">
									<text class="label">胜/负</text>
									<text class="val">{{subItemModal.list?.HalfFull?.odds['30']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active10']}" @click="onModalTdClick('10')">
								<view class="td-wrap-modal">
									<text class="label">平/负</text>
									<text class="val">{{subItemModal.list?.HalfFull?.odds['10']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active00']}" @click="onModalTdClick('00')">
								<view class="td-wrap-modal">
									<text class="label">负/负</text>
									<text class="val">{{subItemModal.list?.HalfFull?.odds['00']??'未受注'}}</text>
								</view>
							</td>
						</tr>
					</table>
				</view>
				<view class="modal-buttons">
					<button type="default" @click="cancelModal">取消</button>
					<button type="warn" style="margin-left:10px;" @click="confirmModal">确定</button>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popupScore" background-color="#fff" @change="poupChange">
			<view class="popup-content" style="padding:16px 16px 16px 16px;">
				<view class="content-r-top" style="margin-bottom:15px;">
					<view class="content-r-sub">
						<text>[{{ subItemModal.rank && subItemModal.rank['1'].rank}}]</text>
						<text>{{ subItemModal.rank && subItemModal.rank['1'].rank_league}}</text>
					</view>
					<view class="content-r-vs">
						{{subItemModal.rank && subItemModal.rank['1'].team_name}} <text>VS</text>
						{{subItemModal.rank && subItemModal.rank['2'].team_name}}
					</view>
					<view class="content-r-sub">
						<text>[{{subItemModal.rank && subItemModal.rank['2'].rank}}]</text>
						<text>{{subItemModal.rank && subItemModal.rank['2'].rank_league}}</text>
					</view>
				</view>
				<view class="table-wrap">
					<table ref="table" border>
						<tr>
							<td class="td" rowspan="2"
								style="color:#fff;width:16px;text-align: center;background-color: #cc0002;">主胜比分</td>
							<td class="td" :class="{'active':subItemModal['active10']}" @click="onModalTdClick('10')">
								<view class="td-wrap-modal">
									<text class="label">1:0</text>
									<text class="val">{{subItemModal.list?.Score?.odds['10']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active20']}" @click="onModalTdClick('20')">
								<view class="td-wrap-modal">
									<text class="label">2:0</text>
									<text class="val">{{subItemModal.list?.Score?.odds['20']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active21']}" @click="onModalTdClick('21')">
								<view class="td-wrap-modal">
									<text class="label">2:1</text>
									<text class="val">{{subItemModal.list?.Score?.odds['21']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active30']}" @click="onModalTdClick('30')">
								<view class="td-wrap-modal">
									<text class="label">3:0</text>
									<text class="val">{{subItemModal.list?.Score?.odds['30']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active31']}" @click="onModalTdClick('31')">
								<view class="td-wrap-modal">
									<text class="label">3:1</text>
									<text class="val">{{subItemModal.list?.Score?.odds['31']??'未受注'}}</text>
								</view>
							</td>
						</tr>
						<tr>
							<td class="td" :class="{'active':subItemModal['active32']}" @click="onModalTdClick('32')">
								<view class="td-wrap-modal">
									<text class="label">3:2</text>
									<text class="val">{{subItemModal.list?.Score?.odds['32']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active40']}" @click="onModalTdClick('40')">
								<view class="td-wrap-modal">
									<text class="label">4:0</text>
									<text class="val">{{subItemModal.list?.Score?.odds['40']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active41']}" @click="onModalTdClick('41')">
								<view class="td-wrap-modal">
									<text class="label">4:1</text>
									<text class="val">{{subItemModal.list?.Score?.odds['41']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active42']}" @click="onModalTdClick('42')">
								<view class="td-wrap-modal">
									<text class="label">4:2</text>
									<text class="val">{{subItemModal.list?.Score?.odds['42']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active43']}" @click="onModalTdClick('43')">
								<view class="td-wrap-modal">
									<text class="label">胜其它</text>
									<text class="val">{{subItemModal.list?.Score?.odds['43']??'未受注'}}</text>
								</view>
							</td>
						</tr>
						<tr>
							<td class="td" style="color:#fff;width:16px;text-align: center;background-color: #333;">平局
							</td>
							<td class="td" :class="{'active':subItemModal['active00']}" @click="onModalTdClick('00')">
								<view class="td-wrap-modal">
									<text class="label">0:0</text>
									<text class="val">{{subItemModal.list?.Score?.odds['00']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active11']}" @click="onModalTdClick('11')">
								<view class="td-wrap-modal">
									<text class="label">1:1</text>
									<text class="val">{{subItemModal.list?.Score?.odds['11']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active22']}" @click="onModalTdClick('22')">
								<view class="td-wrap-modal">
									<text class="label">2:2</text>
									<text class="val">{{subItemModal.list?.Score?.odds['22']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active33']}" @click="onModalTdClick('33')">
								<view class="td-wrap-modal">
									<text class="label">3:3</text>
									<text class="val">{{subItemModal.list?.Score?.odds['33']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active44']}" @click="onModalTdClick('44')">
								<view class="td-wrap-modal">
									<text class="label">平其它</text>
									<text class="val">{{subItemModal.list?.Score?.odds['44']??'未受注'}}</text>
								</view>
							</td>
						</tr>
						<tr>
							<td class="td" rowspan="2"
								style="color:#fff;width:16px;text-align: center;background-color: #019afe;">主负比分</td>
							<td class="td" :class="{'active':subItemModal['active01']}" @click="onModalTdClick('01')">
								<view class="td-wrap-modal">
									<text class="label">0:1</text>
									<text class="val">{{subItemModal.list?.Score?.odds['01']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active02']}" @click="onModalTdClick('02')">
								<view class="td-wrap-modal">
									<text class="label">0:2</text>
									<text class="val">{{subItemModal.list?.Score?.odds['02']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active12']}" @click="onModalTdClick('12')">
								<view class="td-wrap-modal">
									<text class="label">1:2</text>
									<text class="val">{{subItemModal.list?.Score?.odds['12']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active03']}" @click="onModalTdClick('03')">
								<view class="td-wrap-modal">
									<text class="label">0:3</text>
									<text class="val">{{subItemModal.list?.Score?.odds['03']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active13']}" @click="onModalTdClick('13')">
								<view class="td-wrap-modal">
									<text class="label">1:3</text>
									<text class="val">{{subItemModal.list?.Score?.odds['13']??'未受注'}}</text>
								</view>
							</td>
						</tr>
						<tr>
							<td class="td" :class="{'active':subItemModal['active23']}" @click="onModalTdClick('23')">
								<view class="td-wrap-modal">
									<text class="label">2:3</text>
									<text class="val">{{subItemModal.list?.Score?.odds['23']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active04']}" @click="onModalTdClick('04')">
								<view class="td-wrap-modal">
									<text class="label">0:4</text>
									<text class="val">{{subItemModal.list?.Score?.odds['04']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active14']}" @click="onModalTdClick('14')">
								<view class="td-wrap-modal">
									<text class="label">1:4</text>
									<text class="val">{{subItemModal.list?.Score?.odds['14']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active24']}" @click="onModalTdClick('24')">
								<view class="td-wrap-modal">
									<text class="label">2:4</text>
									<text class="val">{{subItemModal.list?.Score?.odds['24']??'未受注'}}</text>
								</view>
							</td>
							<td class="td" :class="{'active':subItemModal['active34']}" @click="onModalTdClick('34')">
								<view class="td-wrap-modal">
									<text class="label">负其它</text>
									<text class="val">{{subItemModal.list?.Score?.odds['34']??'未受注'}}</text>
								</view>
							</td>
						</tr>
					</table>
				</view>
				<view class="modal-buttons">
					<button type="default" @click="cancelModal">取消</button>
					<button type="warn" style="margin-left:10px;" @click="confirmModal">确定</button>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0">
			<view class="poup-container">
				<view class="poup-tit">过关方式 <uni-icons @click="closeDialog" class="closeIcon" type='close' color="#666"
						size="24"></uni-icons></view>
				<scroll-view class="poup-wrap" scroll-y="true">
					<view class="poup-item-wrap">
						<view class="poup-block" v-for="item in selectedTipFlagFilter" :key="item">
							<view :class="{'active':poupSelected.includes(`${item}串1`)}" @click="onPoupItemClick(item)"
								class="poup-item">{{item}}串1</view>
						</view>
					</view>
					<view class="more-poup">更多过关</view>

				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import buttonGroup from '../component/button-group/button-group.vue';
	import request from '../../common/request.js';
	import dayjs from 'dayjs';
	import _ from 'lodash'
	import config from '@/common/config.js'
	import {
		transformVs,
		transformScore,
		calculateTotalCombinations,
		calculateBeijingdanchangTotalCombinations,
		getUserInfo,
		getCurrentShop
	} from '@/common/util.js'
	export default {
		data() {
			return {
				popupHalf: false,
				poupSelected: [],
				showOpt: true,
				checkbox1: [],
				checkbox2: [],
				hobby: [{
					text: '1.50以下',
					value: '0,1.5'
				}, {
					text: '1.50-2.00',
					value: '1.5,2'
				}, {
					text: '2.00以上',
					value: '2,0'
				}],
				hobbys: [],
				dayjs,
				fixH: 60,
				scaleValue: 1,
				flag: 1,
				flagText: '单关',
				selectedTipFlag: 0,
				noSelectTitleTip: '至少选择一场比赛（竞猜全场90分钟的比赛结果）',
				noSelectTitleTip2: '红色选框为回报更高的竞彩单关',
				noSelectTitleTip3: '红色框选项可投单关，至少选择二场比赛',
				noSelectDescTip: '竞猜90分钟比赛结果，数据仅供参考，请以实票为准',
				tabIndex: 0,
				iStatusBarHeight: 0,
				buttons: [{
						title: '胜平负'
					},
					{
						title: '总进球'
					},
					{
						title: '半全场'
					},
					{
						title: '比分'
					},
					{
						title: '上下单双'
					}
				],
				list: [],
				selectList: {
					0: [],
					1: [],
					2: [],
					3: [],
					4: []
				},
				filters: '',
				lottery_types: ['WDL', 'TotalGoals', 'HalfFull', 'Score', 'OverUnder'],
				subItemModal: {},
				scheduleList: [],
				scheduleIndex: 0,
				actions: [{
						text: '开奖结果'
					},
					{
						text: '选号记录'
					},
					{
						text: '即时比分'
					},
					{
						text: '玩法说明'
					},
				]
			}
		},
		components: {
			buttonGroup
		},
		computed: {
			selectedTipFlagFilter() {
				const selectCount = _.uniqBy(this.selectList[this.tabIndex], (o) => o.subKey).length
				let arr = []
				for (let i = 2; i <= selectCount; i++) {
					arr.push(i)
				}
				return arr
			},
			scrollHeight() {
				const tHeight = (this.iStatusBarHeight + 460) + 'px'
				const data = window.innerHeight - tHeight
				return data
			},
			amountValue() {
				const obj = _.groupBy(this.selectList[this.tabIndex], (o) => o.subKey)
				let result = 0
				let rs = []
				for (let key in obj) {
					rs.push(obj[key].length)
				}
				//计算金额
				for (let i = 0; i < this.poupSelected.length; i++) {
					const n = this.poupSelected[i].split('串')[0]
					result += calculateTotalCombinations(rs, n)
				}

				return this.scaleValue * 2 * result
			},
			prizeValue() {
				// if (this.selectList[this.tabIndex].length === 0) {
				// 	return 0
				// }
				// const arr = this.selectList[this.tabIndex].map(item => Number(item.value))
				// return Number(Math.max.apply(null, arr) * this.scaleValue).toFixed(2)
				const obj = _.groupBy(this.selectList[this.tabIndex], (o) => o.subKey)
				let result = 0
				let rs = []
				
				
				
				for (let key in obj) {
					let arr;
					if(this.tabIndex===2){
						
						arr = obj[key][0].row.halfData.map(item=>item.halfOdds)
					}else if(this.tabIndex===3){
						arr = obj[key][0].row.scoreData.map(item=>item.scoreOdds)
					}else{
						arr = obj[key].map(item=>item.value)
					}
					const maxVal = Math.max.apply(null, arr)
					rs.push(maxVal)
				}
				
	
				
				//计算金额
				for (let i = 0; i < this.poupSelected.length; i++) {
					const n = this.poupSelected[i].split('串')[0]
					result += calculateBeijingdanchangTotalCombinations(rs, n)
				}
			
				return (this.scaleValue * 2 * result*0.65).toFixed(2)
			},
			selectCount() {
				return _.uniqBy(this.selectList[this.tabIndex], (o) => o.subKey).length
			}
		},
		methods: {
			clearSelect(){
				this.findList()
			},
			select(item){
				if("玩法说明" === item.text){
					uni.navigateTo({
						url: '/pages/choose/component/bjdc/description/description'
					})
				}else if("即时比分" === item.text){
					uni.navigateTo({
						url: '/pages/choose/component/bjdc/score/score'
					})
				}else if("选号记录" === item.text){
					uni.switchTab({
					    url: '/pages/tabBar/record/record',
					    success: function (e) {
					        // 成功跳转后的回调
					    },
					    fail: function (e) {
					        // 失败的回调
					    }
					});
				}else if("开奖结果" === item.text){
					uni.navigateTo({
						url: '/pages/choose/component/bjdc/lotteryResult/lotteryResult'
					})
				}
			},
			async getSchedule() {
				const options = {
					platform: 'koudai_mobile',
					_prt: 'https',
					ver: '20180101000000',
					lottery_type: 'ToTo',
					station_user_id: '54275526',
					station_uuid: 'b9cfdcrpfsj3fd1661155817'
				}

				const data = await request({
					url: '/api/zucai/getschedule',
					data: options,
					showLoading: true,
				})
				this.scheduleList = data.list;
			},
			onPoupItemClick(item) {
				if (this.poupSelected.includes(`${item}串1`)) {
					this.poupSelected = this.poupSelected.filter(o => o !== `${item}串1`)
				} else {
					this.poupSelected.push(`${item}串1`)
				}
				this.poupSelected = this.poupSelected.sort()
				this.changeFlagStatus = true
			},
			openDialog() {
				this.$refs.popup.open('bottom')
			},
			closeDialog() {
				this.$refs.popup.close()
			},
			async submitOrder(orderType) {
				if (this.selectCount >= 1) {
					if (this.poupSelected.length === 0) {
						uni.showToast({
							icon: 'none',
							title: '请选择过关方式'
						})
						return
					}
					let options = {
						userId: getUserInfo()?.userId,
						userName: getUserInfo()?.userName,
						storeId: getCurrentShop()?.id,
						lotteryAmount: this.amountValue,
						payType: 1,
						periods: '',
						orderType,
						lotteryType: 5,
						multiple: this.scaleValue,
						customsClearanceMode: this.selectCount.length === 0 ? '单关' :
							`${this.poupSelected.join(',')}`,
						lotteryOrderOdds: []
					}
					let selectListObj = _.groupBy(this.selectList[this.tabIndex], (o) => o.subKey)

					let result = 1;
					for (let key in selectListObj) {
						const item = selectListObj[key]
						const option = {
							matchCode: key,
							matchDate: this.list[item[0].key][key].bet_time,
							league: this.list[item[0].key][key].league_name,
							homeTeam: this.list[item[0].key][key].rank[1].team_name,
							awayTeam: this.list[item[0].key][key].rank[2].team_name,
						}
						options.periods = this.list[item[0].key][key].lottery_no
						if (this.tabIndex === 0) {
							let sfpData = item.map(o => {
								let obj = {
									[o.result === '胜' ? 'homeOddsName' : (o.result === '负' ?
										'awayOddsName' : 'drawOddsName')]: o.result,
									boundary: o.row.boundary,
									[o.result === '胜' ? 'homeOdds' : (o.result === '负' ? 'awayOdds' :
										'drawOdds')]: o.value
								}
								return obj
							})
							//原始数据
							const {
								list
							} = this.list[item[0].key][key]
							const {
								WDL
							} = list
							const {
								odds,
								boundary
							} = WDL
							let sfpGameData = [{
									homeOddsName: '胜',
									boundary,
									homeOdds: odds[3]
								},
								{
									drawOddsName: '平',
									boundary,
									drawOdds: odds[1]
								},
								{
									awayOddsName: '负',
									boundary,
									awayOdds: odds[0]
								},
							]
							option.sfpData = JSON.stringify(sfpData)
							option.sfpGameData = JSON.stringify(sfpGameData)
						}

						if (this.tabIndex === 1) {
							let goalData = item.map(o => {
								let obj = {
									homeGoal: o.result,
									goalOdds: o.value,
									boundary: o.row.boundary,
								}
								return obj
							})
							//原始数据
							const {
								list
							} = this.list[item[0].key][key]
							const {
								TotalGoals
							} = list
							const {
								odds,
								boundary
							} = TotalGoals
							let goalGameData = [{
									homeGoal: '0',
									boundary,
									goalOdds: odds[0]
								},
								{
									homeGoal: '1',
									boundary,
									goalOdds: odds[1]
								},
								{
									homeGoal: '2',
									boundary,
									goalOdds: odds[2]
								},
								{
									homeGoal: '3',
									boundary,
									goalOdds: odds[3]
								},
								{
									homeGoal: '4',
									boundary,
									goalOdds: odds[4]
								},
								{
									homeGoal: '5',
									boundary,
									goalOdds: odds[5]
								},
								{
									homeGoal: '6',
									boundary,
									goalOdds: odds[6]
								},
								{
									homeGoal: '7',
									boundary,
									goalOdds: odds[7]
								},
							]
							option.goalGameData = JSON.stringify(goalGameData)
							option.goalData = JSON.stringify(goalData)
						}
						if (this.tabIndex === 2) {
							let halfData = []
							item.map(o => {
								halfData = halfData.concat(o.row.halfData)
							})
							option.halfData = JSON.stringify(halfData)
							option.halfGameData = JSON.stringify(halfData)
						}
						if (this.tabIndex === 3) {
							let scoreData = []
							item.map(o => {
								scoreData = scoreData.concat(o.row.scoreData)
							})
							option.scoreData = JSON.stringify(scoreData)
							option.scoreGameData = JSON.stringify(scoreData)
						}
						if (this.tabIndex === 4) {
							let sxdsData = item.map(o => {
								let name;
								if (o.result === '3') {
									name = '上单'
								} else if (o.result === '2') {
									name = '上双'
								} else if (o.result === '1') {
									name = '下单'
								} else if (o.result === '0') {
									name = '下双'
								}
								let obj = {
									name,
									odds: o.value,
								}
								return obj
							})
							//原始数据
							const {
								list
							} = this.list[item[0].key][key]
							const {
								OverUnder
							} = list
							const {
								odds,
								boundary
							} = OverUnder
							const sxdsGameData = [{
									name: '上单',
									odds: odds[3]
								},
								{
									name: '上双',
									odds: odds[2]
								},
								{
									name: '下单',
									odds: odds[1]
								},
								{
									name: '下双',
									odds: odds[0]
								},
							]
							option.sxdsData = JSON.stringify(sxdsData)
							option.sxdsGameData = JSON.stringify(sxdsGameData)
						}
						options.lotteryOrderOdds.push(option)
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
						uni.navigateTo({
							url: '/pages/tabBar/record/component/beijindanchang/beijindanchang'
						});
					}else{
						getApp().globalData.detailOptions = {...options}
						uni.navigateTo({
							url: '/pages/tabBar/record/component/order/order'
						});
					}
					
					// getApp().globalData.detailOptions = options
					// uni.navigateTo({
					// 	url: '/pages/tabBar/record/component/beijindanchang/beijindanchang'
					// })
					return
				}
				uni.showToast({
					title: '请选择',
					icon: 'none'
				})


			},
			cancelModal() {
				this.$refs.popup.close()
				this.$refs.popupHalf.close()
				this.$refs.popupScore.close()
			},
			confirmModal() {
				this.handleList()
				this.$refs.popup.close()
				this.$refs.popupHalf.close()
				this.$refs.popupScore.close()
			},
			onModalTdClick(pos) {
				this.subItemModal[`active${pos}`] = !this.subItemModal[`active${pos}`]
			},
			handleList() {
				// 格式化数据
				let obj = JSON.parse(JSON.stringify(this.subItemModal))
				let arr = []
				obj.result = []

				for (let pro in obj) {
					if (pro.indexOf('active') === 0 && obj[pro]) {
						const num = pro.replace(/active/, '')
						if (this.tabIndex === 2) {
							obj.result.push(transformVs(num))
							arr.push({
								half: num.split('')[0],
								halfOdds: obj.list?.HalfFull?.odds[num]
							}, {
								half: num.split('')[1],
								halfOdds: obj.list?.HalfFull?.odds[num]
							})
						} else if (this.tabIndex === 3) {
							obj.result.push(transformScore(num))
							arr.push({
								homeScore: num.split('')[0],
								awayScore: num.split('')[1],
								scoreOdds: obj.list?.Score?.odds[num]
							})
						}

					}
				}
				if (this.tabIndex === 2) {
					obj.halfData = arr
				} else if (this.tabIndex === 3) {
					obj.scoreData = arr
				}

				this.list[this.key][this.subKey] = obj
				this.selectList[this.tabIndex] = this.selectList[this.tabIndex] || []
				if (obj.result.length > 0) {
					let isIn = false
					this.selectList[this.tabIndex] = this.selectList[this.tabIndex].map(item => {
						if (item.key === this.key && item.subKey === this.subKey) {
							isIn = true
							item = {
								key: this.key,
								subKey: this.subKey,
								row: {
									...obj
								},
							}
						}
						return item
					})
					if (!isIn) {
						this.selectList[this.tabIndex].push({
							key: this.key,
							subKey: this.subKey,
							row: {
								...obj
							},
						})
					}
				} else {
					this.selectList[this.tabIndex] = this.selectList[this.tabIndex].filter(o => o.key !== this.key && o
						.subKey !== this.subKey)
				}

				const selectedCount = _.uniqBy(this.selectList[this.tabIndex], (o) => o.subKey).length
				this.poupSelected = [`${selectedCount}串1`]
			},
			poupChange(data) {
				this.showOpt = !data.show
			},
			togglePoup(key, subKey) {
				this.subItemModal = this.list[key][subKey]
				this.showOpt = false
				if (this.tabIndex === 2) {
					this.$refs.popupHalf.open('bottom')
				} else if (this.tabIndex === 3) {
					this.$refs.popupScore.open('bottom')
				}

				this.key = key
				this.subKey = subKey
			},
			guessExplain() {
				uni.navigateTo({
					url: '/pages/explain/guessOne'
				})
			},
			reset() {
				uni.showModal({
					title: '提示',
					content: '是否清空已投注选项？',
					confirmText: '确定',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							this.selectList = []
							this.findList()
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			goExplain() {
				uni.navigateTo({
					url: '/pages/explain/explain'
				})
			},
			formatTitle(item, key) {
				const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
				const index = dayjs(key).format('d')
				return dayjs(key).format('MM-DD') + ' ' + weeks[index] + ' ' + `共${Object.keys(item).length}场`
			},
			changeNumBox(value) {
				this.scaleValue = value
			},
			clickLeft() {
				uni.navigateBack()
			},
			clickRight() {
				//this.$refs.showRight.open();
			},
			cancel() {
				this.$refs.showRight.close();
			},
			confirm() {
				let str = ''
				this.checkbox1.map((item, index) => {
					str += '&' + `odds_list[${index}][]=${item.split(',')[0]}`
					str += '&' + `odds_list[${index}][]=${item.split(',')[1]}`
				})
				this.checkbox2.map((item) => {
					str += '&' + `league_name[]=${item}`
				})
				this.filters = str
				this.$refs.showRight.close();
				this.findList()
			},
			change(index) {
				const item = this.buttons[index]
				this.tabIndex = index;
				this.findList()
			},
			tdClick(row, pos, key, subKey, postname) {
				if (!row) {
					return
				}
				if (this.tabIndex === 1 || this.tabIndex === 4) {
					row[`Active${pos}`] = !row[`Active${pos}`]
				} else {
					row[`${pos}Active`] = !row[`${pos}Active`]
				}

				this.handleSelectList(row, pos, key, subKey, postname)

			},
			handleSelectList(row, pos, key, subKey, postname) {
				let selectList = this.selectList[this.tabIndex] || []
				if (this.tabIndex === 0) {
					const obj = {
						left: 3,
						middle: 1,
						right: 0
					}
					const index = obj[pos]
					if (row[`${pos}Active`]) {
						selectList.push({
							key,
							subKey,
							pos,
							postname,
							value: row.odds[index],
							result: pos === 'left' ? '胜' : pos === 'middle' ? '平' : '负',
							row,
						})
					} else {
						selectList = selectList.filter(o => !(o.key === key && o.subKey === subKey && o.pos === pos && o
							.postname === postname))
					}
				} else if (this.tabIndex === 1) {
					if (row[`Active${pos}`]) {
						selectList.push({
							key,
							subKey,
							pos,
							postname,
							value: row.odds[pos],
							result: pos,
							row,
						})
					} else {
						selectList = selectList.filter(o => !(o.key === key && o.subKey === subKey && o.pos === pos))
					}
				} else if (this.tabIndex === 4) {
					if (row[`Active${pos}`]) {
						selectList.push({
							key,
							subKey,
							pos,
							postname,
							value: row.odds[pos],
							result: pos,
							row,
						})
					} else {
						selectList = selectList.filter(o => !(o.key === key && o.subKey === subKey && o.pos === pos))
					}
				}
				this.selectList[this.tabIndex] = selectList

				const selectedCount = _.uniqBy(selectList, (o) => o.subKey).length
				this.poupSelected = [`${selectedCount}串1`]
			},
			uniqueArrayJSON(arr) {
				var unique = arr.map(JSON.stringify) // 将每个对象转为字符串
					.filter((item, index, arr) => arr.indexOf(item) === index) // 去重
					.map(JSON.parse); // 再将字符串转回对象
				return unique;
			},
			handleRule() {
				if (this.selectList[this.tabIndex].length === 0) {
					return 0
				}
				let data = this.selectList[this.tabIndex].filter(o => o.row.is_single === '0').map(item => ({
					key: item.key,
					subKey: item.subKey
				}))
				data = this.uniqueArrayJSON(data)
				if (data.length === 0) {
					//  选单场
					return this.selectList[this.tabIndex].length === 1 ? 'is_single' : 'is_double'
				}
				if (data.length === 1) {
					return 1
				}
				return data.length
			},
			async findList() {
				let url =
					`platform=koudai_mobile&_prt=https&ver=20180101000000&lottery_type=${this.lottery_types[this.tabIndex]}&station_user_id=54275526&station_uuid=b9cfdcrpfsj3fd1661155817${this.filters}`
				const data = await request({
					url: '/api/dc/selectlist?' + url,
					data: {},
					showLoading: true,
				})
				this.list = data
			},
			async findType() {
				const data = await request({
					url: '/api/match/leaguequerylist',
					data: {
						platform: 'koudai_mobile',
						_prt: 'https',
						ver: 20180101000000
					}
				})
				this.hobbys = data.league_list.map(item => ({
					text: item,
					value: item
				}))
			}
		},
		onLoad() {
			this.iStatusBarHeight = uni.getSystemInfoSync().statusBarHeight;
			this.findList()
			this.findType()
			this.getSchedule()
		},
	}
</script>

<style scoped lang="scss">
	.page-content {
		height: 100%;
	}

	.nav-bar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 1000;
		height: 48px;
		background-color: #cc0002;
	}

	.button-center {
		flex: 1;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		color: #fff;
		font-size: 17px;
	}

	.content-r-top {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		text-align: center;
		margin-bottom: 3px;

		.content-r-sub {
			display: flex;
			flex-direction: column;

			text {
				color: #666;
				font-size: 12px;
			}
		}

		.content-r-vs {
			margin: 0 10px;
			color: #000;
			font-size: 14px;

			text {
				margin: 0 3px;
			}
		}
	}

	.content {
		.content-item {
			display: flex;
			flex-direction: row;
			padding-bottom: 12px;
		}

		.content-l {
			display: flex;
			flex-direction: column;
			text-align: center;
			margin-right: 15px;
			width: 60px;

			text {
				font-size: 12px;
			}
		}

		.content-r {
			flex: 1;
		}
	}

	.table-wrap {
		display: flex;
		flex-direction: row;

		.td-wrap {
			display: flex;
			flex-direction: row;
			align-items: center;

			.label {
				font-size: 14px;
				flex: 1;
			}

			.val {
				text-align: right;
				font-size: 12px;
				color: #666;
				width: 50px;
			}
		}

		.td-wrap-modal {
			display: flex;
			flex-direction: column;
			align-items: center;

			.label {
				font-size: 14px;
			}

			.val {
				flex: 1;
				text-align: right;
				font-size: 12px;
				color: #666;
			}
		}
	}

	.table-left {
		display: flex;
		flex-direction: column;
		margin-right: 5px;
		margin-top: 30px;

		.dot {
			width: 16px;
			height: 16px;
			line-height: 16px;
			background-color: #ccc;
			color: #fff;
			font-size: 12px;
			text-align: center;
			border-radius: 50%;
			margin-top: 16px;
		}

		.dot.success {
			background-color: #4cd964;
		}

		.dot.danger {
			background-color: #cc0002;
		}
	}

	.active {
		background-color: #cc0002 !important;

		text {
			color: #fff;
		}

		.val {
			color: #fff !important;
		}
	}

	table {
		width: 100%;
		border-spacing: 0;
		border-collapse: collapse;

		tr {
			td {
				border: 1px solid #ddd;
				border-collapse: collapse;
				position: relative;
			}
		}
	}

	td {
		padding: 8px 3px;
		font-size: 13px;
		color: #000;
		background-color: #fff;
	}

	.guess-tip {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		padding: 10px;
		background-color: #FFF7E7;
		text-align: center;
		color: #333;
		font-size: 13px;
	}

	.opt-wrap {
		background-color: #fff;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 100;
		width: 100%;
		box-sizing: border-box;
		border-top: 1px solid #ddd;

		.select-tip {
			display: flex;
			padding: 10px;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			font-size: 12px;
			color: #999;

			.title {
				font-size: 13px;
				color: red;
			}
		}

		.select-info {
			display: flex;
			flex-direction: row;
			align-items: center;
			padding: 5px 10px;

			.flag-box {
				padding: 3px 5px;
				border: 1px solid #ddd;
				border-radius: 3px;
				width: 50px;
				text-align: center;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				color: #cc0002;
				font-size: 12px;
			}

			.text {
				font-size: 12px;
			}

			.select-amount {
				flex: 1;
				text-align: center;
				display: flex;
				flex-direction: column;
				text-align: right;

				.amount-tit {
					font-size: 15px;

					text {
						color: red;
						font-weight: bold;
						font-size: 17px;
						margin: 0 3px;
					}
				}

				.amount-desc {
					font-size: 14px;

					text {
						text-decoration: underline;
						color: red;
					}
				}
			}

			.scale-block {
				display: flex;
				flex-direction: row;
				align-items: center;
				margin-left: 15px;

				text {
					margin-left: 5px;
				}
			}
		}

		.btns {
			display: flex;
			flex-direction: row;
			// align-items:center;
			border-top: 1px solid #ddd;

			.btns-item {
				padding: 10px;
				text-align: center;
				font-size: 15px;
				color: #333;
				background-color: #f2f2f2;
				border-left: 1px solid #ddd;
			}

			.btns-prize {
				flex: 1;
				color: #666;
				background-color: #fff;
			}

			.btns-next {
				background-color: #cc0002;
				color: #fff;
				width: 110px;
				font-size: 15px;
			}
		}
	}

	.uni-collapse .content {
		background-color: #f2f2f2;
		padding: 10px 10px 0 10px;
	}

	::v-deep .uni-collapse-item__title-box {
		height: 30px;
		line-height: 30px;
	}

	.tit {
		margin-bottom: 10px;
	}

	.footerBtns {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 30px;

		button {
			flex: 1;
		}
	}

	.noData {
		font-size: 14px;
		color: #999;
		padding-top: 50px;
		text-align: center;
	}

	.select-block {
		padding: 6px 10px;
		background-color: #fff;
		border: 1px solid #ddd;
		text-align: center;
	}

	.select-block.active {
		text {
			color: #cc0002 !important;
		}

		border:1px solid #cc0002 !important;
		background-color: #fff !important;
	}

	.modal-buttons {
		padding: 10px;
		border-top: 1px solid #f5f5f5;
		margin-top: 10px;
		display: flex;
		flex-direction: row;

		button {
			flex: 1;
		}
	}

	.poup-container {
		padding-bottom: 100px;
		background-color: #fff;
	}

	.poup-wrap {
		padding: 10px 0;
		height: 250px;
	}

	.poup-desc {
		color: #666;
		text-align: center;
	}

	.poup-item-wrap {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.poup-block {
		width: 25%;
		padding: 10px;
		box-sizing: border-box;

	}

	.poup-item {
		border-radius: 5px;
		padding: 5px 0;
		text-align: center;
		border: 1px solid #ddd;
	}

	.poup-item.active {
		background-color: #cc0002;
		color: #fff;
	}

	.poup-tit {
		padding: 10px 0;
		text-align: center;
		background-color: #f5f5f5;
		border-bottom: 1px solid #ddd;
		position: relative;

		.closeIcon {
			position: absolute;
			top: 7px;
			right: 15px;
		}
	}

	.more-poup {
		text-align: center;
		font-size: 12px;
		color: #666;
		padding: 10px 0;
	}
</style>