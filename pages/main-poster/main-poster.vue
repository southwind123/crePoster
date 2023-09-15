<template>
  <view class="mainposter-container">
        <!-- 轮播图 -->
    		<swiper class="image-container" :current="currentIndex" previous-margin="45rpx" next-margin="45rpx" circular @change="swiperChange" height="890rpx">
    			<swiper-item :class="currentIndex == index ? 'swiper-item' : 'swiper-item-side'" v-for="(item, index) in newImageList" :key="index" lazy-load>
    				<view class="item" :class="currentIndex == index ? 'item-img' : 'item-img-side'">
    					<image :src="item.poster" mode=""></image>
    				</view>
    			</swiper-item>
    		</swiper>
        <!-- 轮播图下面的小图 -->
        <view class="imagelist-container">
          <image :src="item.poster" v-for="(item, index) in newImageList" :key="index" mode="widthFix" :class="currentImage == index ? 'image-img' : 'image-img-side'" @click="changeActive" :data-id="index"></image>
        </view>
        <!-- 重新生成 -->
        <view class="regenerateButton">
          <button @click="regeneratePoster">REGENERATION</button>
        </view>
        <!-- 底部保存与分享按钮 -->
        <view class="bottom-contact">
          <view class="download-filled" @click="saveImage">
            <uni-icons type="download-filled" size="40" color="#B56C30"></uni-icons>
          </view>
          <view class="redo-filled">
            <uni-icons type="redo-filled" size="40" color="#999999"></uni-icons>
          </view>
          <view class="pyq">
            <uni-icons type="pyq" size="40" color="#999999"></uni-icons>
          </view>
          <view class="qq">
            <uni-icons type="qq" size="40" color="#999999"></uni-icons>
          </view>
          <view class="weibo">
            <uni-icons type="weibo" size="40" color="#999999"></uni-icons>
          </view>
        </view>
  </view>
</template>

<script>
  import { mapState, mapMutations,mapGetters } from 'vuex'
  import {pathToBase64,base64ToPath} from '../../js_sdk/mmmm-image-tools/index.js'
  export default {
    data() {
      return {
                // 轮播图
        				currentIndex: 0,
                // 下面的小图
                currentImage : 0,
        				dontFirstAnimation: true,
                name :''
                //被用户选中的海报图片（path格式）
                // newImage:'',
                //新生成的海报列表（path格式）
                // newImageList:[],
      };
    },
    computed:{
      ...mapState('m_user', ['imageSrc','imageList','newImageList']),
      //被用户选中的海报图片（path格式）
      newImage(){
        return this.newImageList[this.currentIndex]
      },
    },
    methods:{
      ...mapMutations('m_user', ['updateImageList','updatenewImageList']),
      swiperChange(e) {
      				// this.dontFirstAnimation = false
      				this.currentIndex = e.detail.current
              this.currentImage = e.detail.current
      },
      changeActive(e){
        this.currentImage = e.target.dataset.id
        this.currentIndex = e.target.dataset.id
      },
      regeneratePoster(){
        this.getImage(this.imageSrc)
      },
      //发送用户从本地获取的图片到后端，后端再发过来处理之后的海报
      async getImage(image){
        //将图片转换为base64
        const image_base64 =  await pathToBase64(image)
        // console.log(image_base64);
        
        //直接将base64的图片发送到后端，注意uniapp发送的数据类型都是json字符串，后端需要express.json()转换
        const {data:res} = await uni.$http.post('https://pangu.didalab.cn:7777/',{posterImg:image_base64,key_num:1,name:this.name})
        // console.log(result);
        if (res.status !== 200) return uni.$showMsg()
        // uni.hideLoading()
        console.log(res);
        //将base64海报变为path
        for(let i=0 ; i<res.newPosterImg.length ; i++){
          console.log(res.newPosterImg[i]);
          res.newPosterImg[i] = await base64ToPath(res.newPosterImg[i])
        }
        // const newPoster =  await base64ToPath(res.newPosterImg[0])
        // console.log(this.newPoster);
        // //获取后端发送过来的海报
        // console.log(res.newPosterImg[0]);
        // this.newImage = res.newPosterImg[0]
        // this.newImageList = [res.newPosterImg[0],res.newPosterImg[1],res.newPosterImg[2],res.newPosterImg[3]]
        this.updatenewImageList([
        {
          poster:res.newPosterImg[0],caption:res.caption,headline:res.headline,location:res.location,time:res.time,islove:false,isdelete:false
        },
        {
          poster:res.newPosterImg[1],caption:res.caption,headline:res.headline,location:res.location,time:res.time,islove:false,isdelete:false
        },
        {
          poster:res.newPosterImg[2],caption:res.caption,headline:res.headline,location:res.location,time:res.time,islove:false,isdelete:false
        },
        {
          poster:res.newPosterImg[3],caption:res.caption,headline:res.headline,location:res.location,time:res.time,islove:false,isdelete:false
        }])
        // this.imageList = [...res.newPosterImg,...this.imageList]
      },
      //保存图片到相册
      saveImage(){
        const Image = this.newImage.poster
        uni.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              // console.log(1111);
                uni.saveImageToPhotosAlbum({
                			filePath: Image,
                			success: function () {
                				console.log('保存成功');
                        uni.$showMsg('保存成功！')
                			},
                      fail(e) {
                        console.log('保存失败');
                        uni.$showMsg('保存失败！')
                      }
                });
            }
        })
      },
      
      
    },
    onLoad(e) {
      console.log(e.name);
      this.name = e.name
      // this.getImage(this.imageSrc)
    },
    
    onUnload() {
      this.updateImageList(this.newImage)
    },
  }
</script>

<style lang="scss" scoped>
  .mainposter-container{
    // box-sizing: border-box;
    width: 100%;
    height: 100%;
    padding-bottom: 200rpx;
    background-color: #FAF8F4;
    // 轮播图
    		.image-container {
    			width: 750rpx;
    			height: 890rpx;
    		}
    		
    		.item {
    			// background: linear-gradient(44deg, #FFCC8F, #FFA657);
    			position: relative;
    		}
    		
    		.item-img {
    			width: 630rpx;
    			height: 890rpx;
    			border-radius: 24rpx;
    			animation: to-big 1s;
    			box-shadow: 0rpx 0rpx 10rpx rgba($color: #000, $alpha: .4);
          image{
            width: 630rpx;
            height: 100%;
            border-radius: 24rpx;
          }
    		}
    		
    		
    		.swiper-item {
    			width: 630rpx;
    			height: 890rpx;
    			display: flex;
    			justify-content: center;
    			align-items: center;
    		}
    		.item-img-side {
    			width: 610rpx;
    			height: 862rpx;
    			border-radius: 24rpx;
    			animation: to-mini 1s;
          image{
            width: 610rpx;
            height: 100%;
            border-radius: 24rpx;
          }
    		}
    		
    		.swiper-item-side {
    			width: 610rpx;
    			height: 862rpx;
    			display: flex;
    			justify-content: center;
    			align-items: center;
    		}
    		@keyframes to-mini
    		{
    			from {
    				width: 630rpx;
    			}
    			to {
    				width: 610rpx;
    			}
    		}
    		@keyframes to-big
    		{
    			from {
    				width: 610rpx;
    			}
    			to {
    				width: 630rpx;
    			}
    		}
        .imagelist-container{
          padding: 0 51rpx;
          margin-top: 24rpx;
          display: flex;
          justify-content: space-evenly;
          image{
            width: 23%;
          }
          .image-img{
            border: #B56C30 solid 2rpx;
          }
          .image-img-side{
            border: #fff solid 2rpx;
          }
          
        }
        .regenerateButton{
          display: flex;
          width: 100%;
          justify-content: center;
          align-items: center;
          margin-top: 32rpx;
          // margin-bottom: 156rpx;
          padding-bottom: 200rpx;
          box-sizing: border-box;
          button{
            width: 269rpx;
            height: 67rpx;
            color: #B56C30;
            background-color: #fff;
            box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
            border-radius: 67rpx;
            font-size: 28rpx;
            line-height: 67rpx;
            font-weight: 700;
          }
        }
        .bottom-contact{
          box-sizing: border-box;
          width: 100%;
          position: fixed;
          bottom: 0;
          display: flex;
          justify-content: space-between;
          padding: 30rpx 60rpx;
          background-color: #fff;
          border-radius: 40rpx 40rpx 0 0;
          .download-filled ,.redo-filled ,.pyq ,.qq ,.weibo{
            width: 96rpx;
            height: 96rpx;
            background-color: #EDE4D9;
            border-radius: 20rpx;
            line-height: 96rpx;
            text-align: center;
            uni-icons{
              
            }
          }
        }
  }
  	
  	
  	
</style>
