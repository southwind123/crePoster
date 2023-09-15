<script>
	export default {
		onLaunch: function() {
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
  @font-face {
  		font-family: 'DingTalkJinBuTi';
  		src: url('https://pangu.didalab.cn/static/fonts/DingTalkJinBuTi.ttf') format('truetype');
  }
  @font-face {
  		font-family: 'HarmonyOS_Sans_SC_Black';
  		src: url('https://pangu.didalab.cn/static/fonts/HarmonyOS_Sans_SC_Black.ttf') format('truetype');
  }
  @font-face {
  		font-family: 'HarmonyOS_Sans_SC_Bold';
  		src: url('https://pangu.didalab.cn/static/fonts/HarmonyOS_Sans_SC_Bold.ttf') format('truetype');
  }
  @font-face {
  		font-family: 'HarmonyOS_Sans_SC_Light';
  		src: url('https://pangu.didalab.cn/static/fonts/HarmonyOS_Sans_SC_Light.ttf') format('truetype');
  }
  @font-face {
  		font-family: 'HarmonyOS_Sans_SC_Medium';
  		src: url('https://pangu.didalab.cn/static/fonts/HarmonyOS_Sans_SC_Medium.ttf') format('truetype');
  }
  @font-face {
  		font-family: 'HarmonyOS_Sans_SC_Regular';
  		src: url('https://pangu.didalab.cn/static/fonts/HarmonyOS_Sans_SC_Regular.ttf') format('truetype');
  }
  @font-face {
  		font-family: 'HarmonyOS_Sans_SC_Thin';
  		src: url('https://pangu.didalab.cn/static/fonts/HarmonyOS_Sans_SC_Thin.ttf') format('truetype');
  }
  @font-face {
  		font-family: 'SourceHanSansSC-Bold';
  		src: url('https://pangu.didalab.cn/static/fonts/SourceHanSansSC-Bold.otf') format('truetype');
  }
  @font-face {
  		font-family: 'SourceHanSansSC-ExtraLight';
  		src: url('https://pangu.didalab.cn/static/fonts/SourceHanSansSC-ExtraLight.otf') format('truetype');
  }
  @font-face {
  		font-family: 'SourceHanSansSC-Heavy';
  		src: url('https://pangu.didalab.cn/static/fonts/SourceHanSansSC-Heavy.otf') format('truetype');
  }
  @font-face {
  		font-family: 'SourceHanSansSC-Light';
  		src: url('https://pangu.didalab.cn/static/fonts/SourceHanSansSC-Light.otf') format('truetype');
  }
  @font-face {
  		font-family: 'SourceHanSansSC-Medium';
  		src: url('https://pangu.didalab.cn/static/fonts/SourceHanSansSC-Medium.otf') format('truetype');
  }
  @font-face {
  		font-family: 'SourceHanSansSC-Normal';
  		src: url('https://pangu.didalab.cn/static/fonts/SourceHanSansSC-Normal.otf') format('truetype');
  }
  @font-face {
  		font-family: 'SourceHanSansSC-Regular';
  		src: url('https://pangu.didalab.cn/static/fonts/SourceHanSansSC-Regular.otf') format('truetype');
  }
	// 设置整个项目的背景色
	page {
		background-color: #ffffff;
    height: 100%;
    box-sizing: border-box;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>
