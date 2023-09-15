<template>
  <view class="libraryDetail-container">
    <view class="detail-Image">
      <image :src="imageList[index].poster" mode="widthFix"></image>
    </view>
    <view class="detail-des" :style="{height:Height}">
      <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" >
        <view class="top">
          <text class="title1">INFORMATION</text>
          <view class="content1">
            <text class="text1">Headline</text>
            <text class="text2" user-select>{{imageList[index].headline}}</text>
          </view>
          <view class="content2">
            <text class="text3">Location</text>
            <text class="text4" user-select>{{imageList[index].location}}</text>
          </view>
        </view>
        <view class="bottom">
          <text class="title1">DETAILS</text>
          <text class="text5" user-select>{{imageList[index].caption}}</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  import { mapState, mapMutations,mapGetters } from 'vuex'
  export default {
    data() {
      return {
        index : 0,
        Height :0,
      };
    },
    computed:{
      ...mapState('m_user', ['token','imageList',]),
    },
    onLoad(e) {
      console.log(e);
      console.log(typeof(e));
      this.index = e.index
      console.log();
    },
    onReady() {
      const that = this
      uni.getSystemInfo({
      	success: function (res) {
          that.Height = (res.windowHeight - uni.upx2px(400))/(uni.upx2px(10)/10) + 'rpx'
      	 }
      });
    },
  }
</script>

<style lang="scss">
  .libraryDetail-container{
    position: relative;
    background-color: #FAF8F4;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    .detail-Image{
      z-index: 100;
      position: absolute;
      top: 24rpx;
      left: 194rpx;
      width: 373rpx;
      image{
        width: 100%;
        height: 100%;
        border-radius: 25rpx;
      }
    }
    .detail-des{
      box-sizing: border-box;
      background-color: #fff;
      position: fixed;
      left: 0;
      // bottom: 0;
      top: 400rpx;
      width: 100%;
      // height: 807rpx;
      padding: 200rpx 63rpx 30rpx;
      border-radius: 48rpx 48rpx 0 0;
      scroll-view{
        font-family: HarmonyOS_Sans_SC_Regular;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
        padding-bottom: 83rpx;
        .top{
          display: flex;
          margin-bottom: 43rpx;
          flex-direction: column;
          .title1{
            font-weight: 700;
            display: block;
            width: 100%;
            height: 78rpx;
            line-height: 70rpx;
            font-size: 35rpx;
            color: #6F3F0F;
          }
          .content1{
            min-height: 52rpx;
            display: flex;
            align-items: center;
            margin-bottom: 12rpx;
            .text1{
              font-weight: 700;
              color: #9A7251;
              font-size: 30rpx;
              margin-right: 45rpx;
            }
            .text2{
              color: #9A7251;
              font-size: 30rpx;
            }
          }
          .content2{
            min-height: 52rpx;
            display: flex;
            align-items: center;
            .text3{
              font-weight: 700;
              color: #9A7251;
              font-size: 30rpx;
              margin-right: 46rpx;
            }
            .text4{
              color: #9A7251;
              font-size: 30rpx;
            }
          }
        }
        .bottom{
          display: flex;
          flex-direction: column;
          .title1{
            font-weight: 700;
            display: block;
            width: 100%;
            height: 75rpx;
            
            font-size: 35rpx;
            color: #6F3F0F;
          }
          .text5{
            color: #9A7251;
            font-size: 30rpx;
            line-height: 40rpx;
          }
        }
      }
    }
  }
</style>
