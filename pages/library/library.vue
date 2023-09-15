<template>
  <view class="library-container">
     <text class="title">Poster library</text>
     <!-- 海报的历史记录 -->
     <view class="grid-container">
       <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" >
                 <view class="grid" >
                     <view class="grid-image" v-for="(item,index) in imageListAll" :key="index">
                       <image :src="item.poster" mode="widthFix"  :data-id1="index+1" @click="preDetail(index)" @longtap="changeIscheckbox"></image>
                       <view class="love" @click="loveChange">
                         <uni-icons type="heart-filled" size="27" v-if="item.islove" color="#D75B5B" :data-id="index"></uni-icons>
                         <uni-icons type="heart" size="27" v-else color="#969696" :data-id="index"></uni-icons>
                       </view>
                     </view> 
                 </view>
       </scroll-view>
       
     </view>
  </view>
</template>

<script>
  // 1. 从 vuex 中按需导入 mapState 辅助函数
  import { mapState, mapMutations,mapGetters } from 'vuex'
  export default {
    data() {
      return {
        
      };
    },
    computed: {
        // 2. 从 m_user 模块中导入需要的 token 字符串
        ...mapState('m_user', ['token','imageList',]),
        imageListAll(){
          return this.token !== '' ? this.imageList : []
        },
    },
    methods:{
      ...mapMutations('m_user', ['updateImageState']),
      loveChange(e){
        const index = e.target.dataset.id
        // console.log(e.target.dataset.id);
        this.updateImageState({index:index,islove:!this.imageList[index].islove})
      },
      preDetail(i){
        console.log(i);
        uni.navigateTo({
        	url: `/pages/library/library-detail?index=${i}`
        });
      },
    },
  }
</script>

<style lang="scss">
  .library-container {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 0 40rpx;
    padding-top: 16rpx;
    .title{
      font-family: DingTalkJinBuTi;
      display: inline-block;
      padding-left: 19rpx;
      margin-bottom: 20rpx;
      font-size: 35rpx;
      // font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
      line-height: 52rpx;
    }
    .grid-container{
      height: 100%;
      flex: 1;
      scroll-view{
        height: 100%;
        .grid{
          padding-bottom: 59rpx;
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          .grid-image{
             width: 48%;
             position: relative;
             border-radius: 24rpx;
             image{
               border-radius: 24rpx;
               width: 100%;
             }
             .love{
               position: absolute;
               top: 7rpx;
               right:7rpx;
             }
          }
          
          
        }
      }
    }
  }
</style>

