<template>
	<view class="content">
		<image class="logo" src="/static/pixpin.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
	</view>
  <stream-chat />
  <image-parse />
</template>

<script>
	import StreamChat from "@/stream-chat/stream-chat.vue";
  import ImageParse from "@/image-parse/image-parse.vue";

  export default {
    components: {ImageParse, StreamChat},
		data() {
			return {
				title: '小程序测试'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
