<template>
	<view class="content">
		<view>
			<text>因您投注的对阵、选项、赔率、让球、让分、理论奖金等参考数据，与店铺实际出票存在时间差异，可能导致出票前看到的参考数据与彩票零售店销售终端的实际出票数据不一致的情况。因此，平台所提供的参考数据，不作为实际选号、兑奖的凭证。您在提交投注方案后，应向店铺索要凭证，自行核对实票数据，如有问题可及时联系店铺协商解决。平台无法且不会对因前述风险而导致的任何损失或损害承担责任，但平台将尽力采取必要的措施协助您解决相关问题或纠纷。</text> 
		</view>
		<view>
			<text>数据说明</text> 
		</view>
		<view>
			<text>对阵：指比赛双方的球队，竞彩足球主队在前、客队在后，竞彩篮球主队在后、客队在前。</text> 
		</view>
		<view>
			<text>选项：选项为比赛可能出现的结果，竞彩足球、北单足球均竞猜指定的比赛场次在全场90分钟（含伤停补时）的比赛结果。</text> 
		</view>
		<view>
			<text>让球、让分：因为体育比赛中经常会出现参赛队伍强弱分明的情况，为了平衡强弱两队的实力，从而设立强队让弱队N球（N分）。此类玩法在计算结果的时候需要将让球（让分）计算在内，例如竞彩足球让球胜平负玩法，彩果应为主队进球减让球后的胜平负。示例</text> 
		</view>
		<view>
			<text>巴西（-1）VS德国，为巴西让一球</text> 
		</view>
		<view>
			<text>如果巴西赢1球以上，比分4-1、3-1，则为巴西让球胜</text>
		</view>
		<view>
			<text>如果巴西赢1球，比分2-1、1-0，则为巴西让球平</text>
		</view>
		<view>
			<text>如果巴西赢战平或者输球，比分1-1、0-1，则为巴西让球负</text> 
		</view>
		<view>
			<text>理论奖金：系统选项以及奖金指数计算得出的金额，此金额并非实际奖金，仅作为参考。</text> 
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped lang="scss">
.content{
	padding:10px;
	view{
		text-indent: 2em;
		margin-bottom:10px;
	}
	text{
		font-size:16px;
		line-height:26px;
	}
}
</style>
