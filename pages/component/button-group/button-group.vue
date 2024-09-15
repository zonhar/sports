<template>
	<view class="btn-group-wrap">
		<view 
			:class="index===currentIndex?'btn-group-item-active btn-group-item':'btn-group-item'" 
			:style="{
				backgroundColor:index===currentIndex?activeBackgroundColor:unactiveBackgroundColor,
				color:index===currentIndex?activeColor:unactiveColor,
				border:`1px solid ${unactiveColor}`,
				borderRadius:isRadius?'':0
			}" 
			v-for="(item,index) in buttons" 
			:key="index"
			@click="onItemClick(index)"
		>
			{{item.title}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentIndex:0,
			}
		},
		props:{
			width:{
				type: Number,
				default: 360
			},
			isRadius:{
				type: Boolean,
				default: true
			},
			borderColor:{
				type:String,
				default:'#fff'
			},
			activeBackgroundColor:{
				type: String,
				default: '#ffffff'
			},
			unactiveBackgroundColor:{
				type: String,
				default: '#cc0002'
			},
			activeColor:{
				type: String,
				default: '#cc0002'
			},
			unactiveColor:{
				type: String,
				default: '#ffffff'
			},
			buttons:{
				type: Array,
				default(){
					return []
				}
			},
			
		},
		methods: {
			onItemClick(index){
				if(this.$attrs['before-change']){
					this.$attrs['before-change']((res)=>{
						if(res){
							this.currentIndex = index
							this.$emit('change',index)
							return
						}
					})
					return
				}
				this.currentIndex = index
				this.$emit('change',index)
			},
			toggle(){
				this.currentIndex = this.currentIndex===0?1:0
				this.$emit('change',this.currentIndex)
			}
		}
	}
</script>

<style scoped lang="scss">
.btn-group-wrap{
	display:flex;
	flex-direction:row;
	padding:5px;
	flex:1;
	.btn-group-item-active{
		// font-weight: bold;
	}
	.btn-group-item{
		flex:1;
		padding:5px;
		text-align: center;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		align-items: center;
		text-align: center;
		justify-content: center;
		font-size:13px;
		border-right-width:0!important;
	}
	.btn-group-item:first-child{
		border-top-left-radius: 50px;
		border-bottom-left-radius: 50px;
	}
	.btn-group-item:last-child{
		border-top-right-radius: 50px;
		border-bottom-right-radius: 50px;
		border-right-width:1px!important;
	}
}
</style>
