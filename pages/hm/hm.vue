<template>
	<view class="container">
		<image class="bg-set" src="~@/static/z1.png"></image>
		<view class="content"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imageURL: '/static/jjqd.png'
			}
		},
		methods: {

		}
	}
</script>

<style scoped>
	.bg-set {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: #f4f4f4;
		z-index: -1;
	}
</style>