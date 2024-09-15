<template>
	<view class="content">
		<view>
			<text class="tit">猜一场和竞彩足球有啥区别？</text> 
		</view>
		<view>
			<text>猜一场通过系统匹配可以自动实现投一场比赛出单的效果。</text> 
		</view>
		<view>
			<text class="tit">猜一场的原理是什么？</text> 
		</view>
		<view>
			<text>当您选定场次和选项后，系统会自动匹配当前一场的结果全包比赛，并按照各单注的投注比例进行注数分配，以达到每种组合奖金基本一致的效果。</text> 
		</view>
		<view>
			<text class="tit">如何使用猜一场投注？</text> 
		</view>
		<view>
			<text>当您对某场比赛信心十足，而对其他场次比赛结果不确定时，可以使用猜一场来保证中奖。选中这场看好的比赛结果点击下一步确认即可。</text> 
		</view>
		<view>
			<text class="tit">举例说明</text>
		</view>
		<view>
			<text>1.您自选一场2101胜；</text>
		</view>
		<view>
			<text>2.系统匹配一场的结果全包比赛2102胜、2102(-1)让负；</text> 
		</view>
		<view>
			<text>3.系统自动按平均优化的方式对于两个2串1组合进行注数分配，尽量让两个奖金一致；</text> 
		</view>
		<view>
			<text>4.自选+匹配组合得到2个2串1组合，只要您的自选命中，就可以中奖。 </text> 
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
		margin-bottom:10px;
	}
	text{
		font-size:16px;
		line-height:26px;
	}
	.tit{
		font-weight:bold;
		color:#000;
	}
}
</style>
