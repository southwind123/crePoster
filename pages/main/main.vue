<template>
  <view class="main-container">
    <view class="top-container">
      <image src="../../static/bg/bg1.png" class="bg1"></image>
      <image src="../../static/bg/bg3.png" mode="widthFix" class="bg2"></image>
      <view class="text-container">
        <text class="text1">Cre-poster</text><br>
        <text class="text2">Your own Cultural relic poster</text>
        <button @click="takePhoto">TAKE A PHOHO</button>
      </view>
      
    </view>
    <!-- 弹出层 -->
    <view class="takePhoto-pop">
      <!-- 弹出层 -->
      <uni-popup ref="popup" type="center">
        <view class="uniPopup">
          <text class="text1">Enter your name</text>
          <text class="text2">Please enter An English name, Chinese cannot be displayed.</text>
          <input class="uni-input" focus v-model="name"/>
          <button data-id=1 @click="chooseImage">TAKE A PHOHO!</button>
          <text class="text3" data-id=2 @click="chooseImage">UPLOAD IMAGE</text>
        </view>
      </uni-popup>
    </view>
    
    <view class="bottom-container"  :style="{height:scrollHeight ,top:top+'rpx'}" >
      <!-- 海报的历史记录 -->
      <view class="grid-container" v-if="bottomType">
        <text class="title" @touchstart="bottomTouchstart" @touchend="bottomTouchend">History</text>
        <!-- 长按图片出现的全选与删除按钮 -->
        <view class="delete-container" v-if="ischeckbox">
                <!-- <checkbox-group @change="isFulldeleteChange">
                  <checkbox value="cb" :checked="isFullDelete" />
                </checkbox-group> -->
                <uni-icons type="checkbox" size="32" @click="isFulldeleteChange" color="#de9152" v-if="!isfull"></uni-icons>
                <uni-icons type="checkbox-filled" size="32" @click="isFulldeleteChange" color="#de9152" v-else></uni-icons>
                <button @click="deleteImage">Delete</button>
                <uni-icons type="closeempty" size="23" @click="changeIscheckbox" color="#ccc"></uni-icons>
                
        </view>
        <!-- 提示窗示例 -->
              <!-- <view class="alertDialog">
                <uni-popup ref="alertDialog" type="dialog">
                  <uni-popup-dialog :type="msgType" cancelText="cancel" confirmText="delete" content="Do you want to detete pictures?" @confirm="dialogConfirm" @close="dialogClose"></uni-popup-dialog>
                </uni-popup>
              </view> -->
        <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" >
                  <view class="grid" >
                      <view class="grid-image" v-for="(item,index) in imageListAll" :key="index">
                        <image :src="item.poster" mode="widthFix"  :data-id1="index+1" @click="preImage(index)" @longtap="changeIscheckbox"></image>
                        <view class="isdeleteIcon" v-if="ischeckbox">
                          <checkbox-group @change="radioClickHandler" :data-id="index">
                              <checkbox value="cb" :checked="item.isdelete" :value="index"/>
                          </checkbox-group>
                        </view>
                        <view class="love" @click="loveChange" v-else>
                          <uni-icons type="heart-filled" size="27" v-if="item.islove" color="#D75B5B" :data-id="index"></uni-icons>
                          <uni-icons type="heart" size="27" v-else color="#969696" :data-id="index"></uni-icons>
                        </view>
                      </view> 
                  </view>
        </scroll-view>
        
      </view>
      
      <!-- 文物图片案例 -->
      <view class="grid-container1" v-else>
        <text class="title" @touchstart="bottomTouchstart" @touchend="bottomTouchend">Examples</text>
        <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" >
                  <view class="grid" >
                      <view class="grid-image" v-for="(item,index) in imageExamples" :key="index">
                        <image :src="item" mode="widthFix"  :data-id1="index+1" @click="preImage1(index)" @longtap="changeIscheckbox"></image>
                      </view> 
                  </view>
        </scroll-view>
      </view>
      <!-- <view class="scroll-icon">
        <uni-icons type="bottom" size="20" color="#ccc" v-if="bottom_ani" @click="pullDown" class="bottomslide"></uni-icons>
        <uni-icons type="top" size="20" color="#ccc" v-else @click="scroll" class="bottomslide1"></uni-icons>
      </view> -->
    </view>
    
  </view>
</template>

<script>
  import { mapState, mapMutations,mapGetters } from 'vuex'
  import {pathToBase64,base64ToPath} from '../../js_sdk/mmmm-image-tools/index.js'
  export default {
    data() {
      return {
        // 用户生成海报时上传的名字
        name:'',
        // 上传的文物照片的类型
        type:'',
        imageExamples:['https://ts1.cn.mm.bing.net/th/id/R-C.1fdcb23dd837cf4bc2dfb30cd6d571bf?rik=H%2baxpKvjUkpkvg&riu=http%3a%2f%2fwww.cssqt.com%2fUpload%2f20160918%2fRe_201609181333562018.jpg&ehk=iQ93YDx3svxcXWxRD3%2fLA7iO9HMZ1kJtUNqinvUG0qg%3d&risl=&pid=ImgRaw&r=0'],
        scrollTop: 0,
        windowHeight:0,
        scrollHeight:'310rpx',
        // 小
        scrollHeight1:'',
        // 大
        scrollHeight2:'',
        top:800,
        bottom_ani :0,
        bottom_animin:1,
        ischeckbox :0,
        isfull:false,
        touchStartX:0,
        touchStartY:0,
      };
    },
    computed:{
      ...mapState('m_user', ['imageList','loveimageList','newImageList','token']),
      ...mapGetters('m_user', ['checkedCount','total']),
      imageListAll(){
        
        
        return this.token !== '' ? this.imageList : []
      },
      bottomType(){
        console.log(this.imageListAll == '');
        return this.imageListAll == '' ? false : true
      },
      isFullDelete(){
                return this.total === this.checkedCount
      },
    },
    watch:{
      isFullDelete (newName, oldName) {
              this.isfull = newName
          }
    },
    onLoad() {
      
    },
    onReady() {
      const res = uni.getSystemInfoSync()
      let h = 1
      if(res.platform==='ios'){
          h = 44+res.statusBarHeight
      }else if(res.platform==='android'){
          h = 48+res.statusBarHeight
      }else{
          h = 0;
      }
      const that = this
      uni.getSystemInfo({
      	success: function (res) {
          console.log('--------------scrollHeight'+that.scrollHeight );
        //   console.log(res.windowWidth);
      		// console.log(res.windowHeight)
          that.scrollHeight = (res.windowHeight - uni.upx2px(that.top) - h)/(uni.upx2px(10)/10) + 'rpx'
          console.log('--------------scrollHeight'+that.scrollHeight );
          that.scrollHeight1 = (res.windowHeight - uni.upx2px(800) - h)/(uni.upx2px(10)/10) + 'rpx'
          console.log('--------------scrollHeight1'+that.scrollHeight1 );
          that.scrollHeight2 = (res.windowHeight - uni.upx2px(368) - h)/(uni.upx2px(10)/10) + 'rpx'
          console.log('--------------scrollHeight2'+that.scrollHeight2 );
      	}
      });
    },
    onShow() {
      
    },
    methods:{
      ...mapMutations('m_user', ['updateRedirectInfo','updateImageList','updateImageState','updateAllImageState','deleteImageList','updatenewImageList','updateimageSrc','updateImagedeleteState']),
      getBarHeight(){
                      const res = uni.getSystemInfoSync()
                      if(res.platform==='ios'){
                          return 44+res.statusBarHeight
                      }else if(res.platform==='android'){
                          return 48+res.statusBarHeight
                      }else{
                          return 0;
                      }
                  },
            // 更改图片的勾选状态
            radioClickHandler(e){
              const index = e.target.dataset.id
              // console.log(e);
              // console.log(this.imageList[index].isdelete);
              this.updateImagedeleteState({index:index,isdelete:!this.imageList[index].isdelete})
            },
            isFulldeleteChange(){
              this.isfull = !this.isfull
              this.updateAllImageState(!this.isFullDelete)
            },
            deleteImage(){
              // this.$refs.alertDialog.open()
               // this.deleteImageList()
               const that = this
               uni.showModal({
                   title: 'Delete',
                   content: 'Do you want to detete pictures?',
                   confirmText: "Confirm",//这块是确定按钮的文字
               	cancelText:"Cancel",//这块是取消的文字
                   success(res) {
                     if (res.confirm) {
                       // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                       that.deleteImageList()
                     }
                   }
                 });
            },
            dialogConfirm(){
              this.deleteImageList()
            },
            dialogClose(){
              // this.updateAllImageState(false)
            },
      // 返回键
      changeIscheckbox(){
              // console.log(111);
              this.ischeckbox = !this.ischeckbox
              this.updateAllImageState(false)
      },
      preImage(i){
        // console.log(e);
        
          uni.previewImage({
            // 预览时，默认显示图片的索引
              current: i,
        			urls: this.imageList.map(x=>x.poster),
        			longPressActions: {
        				itemList: ['发送给朋友', '保存图片', '收藏'],
        				success: function(data) {
        					console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
        				},
        				fail: function(err) {
        					console.log(err.errMsg);
        				}
        			}
        		});
      },
      preImage1(i){
        // console.log(e);
        
          uni.previewImage({
            // 预览时，默认显示图片的索引
              current: i,
        			urls: this.imageExamples.map(x=>x),
        			longPressActions: {
        				itemList: ['发送给朋友', '保存图片', '收藏'],
        				success: function(data) {
        					console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
        				},
        				fail: function(err) {
        					console.log(err.errMsg);
        				}
        			}
        		});
      },
      loveChange(e){
        const index = e.target.dataset.id
        // console.log(e.target.dataset.id);
        this.updateImageState({index:index,islove:!this.imageList[index].islove})
      },
      // 展示倒计时的提示消息
      showTips(n) {
        // 调用 uni.showToast() 方法，展示提示消息
        uni.showToast({
          // 不展示任何图标
          icon: 'none',
          // 提示的消息
          title: '请登录后再进行海报生成！' + n + ' 秒后自动跳转到登录页',
          // 为页面添加透明遮罩，防止点击穿透
          mask: true,
          // 1.5 秒后自动消失
          duration: 1500
        })
      },
      // 延迟导航到 my 页面
      delayNavigate() {
        // 把 data 中的秒数重置成 3 秒
        this.seconds = 3
        this.showTips(this.seconds)
      
        this.timer = setInterval(() => {
          this.seconds--
      
          if (this.seconds <= 0) {
            clearInterval(this.timer)
            uni.switchTab({
              url: '/pages/poster/poster',
              // 页面跳转成功之后的回调函数
              success: () => {
                // 调用 vuex 的 updateRedirectInfo 方法，把跳转信息存储到 Store 中
                this.updateRedirectInfo({
                  // 跳转的方式
                  openType: 'switchTab',
                  // 从哪个页面跳转过去的
                  from: '/pages/main/main'
                })
              }
            })
            return
          }
      
          this.showTips(this.seconds)
        }, 1000)
      },
      takePhoto(){
        // uni.navigateTo({
        // 	url: '/pages/main-takePhoto/main-takePhoto'
        // });
        // 判断用户是否登录了，如果没有登录，则调用 delayNavigate() 进行倒计时的导航跳转
        // if (!this.token) return uni.$showMsg('请先登录！')
        if (!this.token) return this.delayNavigate()
        this.$refs.popup.open('center')
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
        this.$refs.popup.close()
        uni.navigateTo({
        	url: `/pages/main-poster/main-poster?name=${this.name}`
        });
        // this.imageList = [...res.newPosterImg,...this.imageList]
      },
      chooseImage(e){
        // camera
        console.log(e);
        if(+e.target.dataset.id===1) this.type='camera'
        else this.type='album'
        uni.chooseImage({
          //指定可以上传的数量
            count: 1, //默认9
          	sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
          	sourceType: [this.type], //从相册选择
          	success:  (res)=> {
              // console.log( res)
               // console.log(res.tempFilePaths[0]);
              //当用户上传照片成功之后， res.tempFilePaths[0]表示图片
          		// this.imageSrc = res.tempFilePaths[0]
              this.updateimageSrc(res.tempFilePaths[0])
              
              // console.log(res.tempFilePaths[0]);
              this.getImage(res.tempFilePaths[0])
              
          	}
        })
      },
      scroll(){
          const that = this
          uni.getSystemInfo({
          	success: function (res) {
            //   console.log(res.windowWidth);
          		// console.log(res.windowHeight)
              that.scrollHeight = (res.windowHeight - uni.upx2px(368) - that.getBarHeight())/(uni.upx2px(10)/10) + 'rpx'
          	}
          });
          this.top = 368
        
        this.bottom_animin = 0
        this.bottom_ani = 1
        // this.scrollHeight = '742rpx'
      },
      pullDown(){
        const that = this
        uni.getSystemInfo({
        	success: function (res) {
            console.log(res.windowWidth);
        		console.log(res.windowHeight)
            that.scrollHeight = (res.windowHeight - uni.upx2px(800) - that.getBarHeight())/(uni.upx2px(10)/10) + 'rpx'
        	}
        });
        this.top = 800
        this.bottom_animin = 1
        this.bottom_ani = 0
      },
      bottomTouchstart(e){
       this.touchStartX = e.touches[0].clientX;  
       this.touchStartY = e.touches[0].clientY; 
      },
      bottomTouchend(e){ 
                        let deltaX = e.changedTouches[0].clientX - this.touchStartX;  
                        let deltaY = e.changedTouches[0].clientY - this.touchStartY;  
                        if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {  
                            if (deltaX >= 0) {  
                                console.log("左滑")  
                            } else {  
                                console.log("右滑")  
                            }  
                        } else if(Math.abs(deltaY) > 50&& Math.abs(deltaX) < Math.abs(deltaY)) {  
                            if (deltaY < 0) {  
                                console.log("上滑")  
                                this.scroll()
                            } else {  
                                console.log("下滑")  
                                this.pullDown()
                            }  
                        } else {  
                            console.log("可能是误触！")  
                        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  // @font-face{
  //    	font-weight: 'DingTalk'; // 给字体起个名字
  //    	src:url('~@/static/DingTalk JinBuTi.ttf'); 
  // }
 
  page{
    height: 100%;
  }
  .main-container{
    position: relative;
    .top-container{
      width: 100%;
      position: fixed;
      .bg1{
        width: 100%;
        height: 900rpx;
      }
      .bg2{
        position: absolute;
        right: 0rpx;
        top: 481rpx;
        width: 400rpx;
        
      }
      .text-container{
        position: absolute;
        top: 100rpx;
        left: 50rpx;
        .text1{
          font-family: DingTalkJinBuTi;
          display: block;
          font-size: 72rpx;
          color: #fff;
          font-weight: 700;
          margin-bottom: 13rpx;
        }
        .text2{
          font-family: DingTalkJinBuTi;
          display: block;
          font-size: 40rpx;
          color: #fff;
          font-weight: 400;
          margin-bottom: 24rpx;
        }
        button{
          font-family: HarmonyOS_Sans_SC_Bold;
          width: 244rpx;
          height: 69rpx;
          font-size: 24rpx;
          line-height: 69rpx;
          margin: 0;
          color: #B56C30;
          border-radius: 69rpx;
        }
      }
    
    }
    .bottom-container{
      transition: all .5s;
      position: fixed;
      // top: 800rpx;
      left: 0;
      width: 100%;
      background-color: #fff;
      border-radius: 38rpx;
      // padding-bottom: 160rpx;
      box-sizing: border-box;
      .bottomslide{
        position: absolute;
        top: -4rpx;
        left: 359rpx;
      }
      .bottomslide1{
        position: absolute;
        top: -4rpx;
        left: 359rpx;
      }
      .grid-container{
         position: relative;
          height: 100%;
          // margin-top: 40rpx;
          padding: 0 49rpx;
          flex: 1;
          display: flex;
          flex-direction: column;
          .delete-container{
            position: absolute;
            top: 29rpx;
            right: 35rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            // height: 100rpx;
            width: 312rpx;
            background-color: #fff;
            checkbox{
              // position: absolute;
              // top: 31rpx;
              // right: 170rpx;
            }
            button{
              // position: absolute;
              // right: 20rpx;
              // width: 118rpx;
              text-align: center;
              height: 50rpx;
              line-height: 50rpx;
              border-radius: 29rpx;
              background-color: #de9152;
              color: #fff;
              font-size: 30rpx;
            }
            uni-icons{
                  // position: absolute;
                  // top: 33rpx;
                  // left: 4rpx;
            }
          }
          // .alertDialog{
          //   // z-index: 100;
          //   width: 300rpx;
          //   height: 300rpx;
          //   uni-popup{
          //     width: 100%;
          //     height: 100%;
          //   }
          // }
          scroll-view{
            height: 100%;
            // box-sizing: border-box;
            // padding-bottom: 180rpx;
            // padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
            box-sizing: border-box;
          }
          .title{
            font-family: DingTalkJinBuTi;
            display: inline-block;
            padding-left: 0rpx;
            margin-bottom: 20rpx;
            font-size: 35rpx;
            padding-top: 34rpx;
            // font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            line-height: 52rpx;
          }
         .grid{
           padding-bottom: 120rpx;
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
                right: 7rpx;
              }
              .isdeleteIcon{
                position: absolute;
                    top: 7rpx;
                    right: 7rpx;
                    border: 1px solid transparent;
                    background-color: transparent;
                    border-radius: 50%;
                checkbox{
                  // border: 1px solid #ffffff;
                  background-color: transparent;
                  border-radius: 50%;
                }
              }
           }
           
           
         }
      }
      .grid-container1{
          // margin-top: 40rpx;
          padding: 0 49rpx;
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          scroll-view{
            height: 100%;
            // box-sizing: border-box;
            // padding-bottom: 180rpx;
          }
          .title{
            font-family: DingTalkJinBuTi;
            margin-bottom: 20rpx;
            font-size: 35rpx;
            padding-top: 34rpx;
            // font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            line-height: 52rpx;
          }
         .grid{
           padding-bottom: 120rpx;
           width: 100%;
           display: flex;
           flex-wrap: wrap;
           justify-content: space-between;
           .grid-image{
              width: 48%;
              position: relative;
              // border-radius: 24rpx;
              image{
                // border-radius: 24rpx;
                width: 100%;
              }
           }
           
           
         }
      }
      
    }
    
    .takePhoto-pop{
      background-color: #fff;
      .uniPopup{
        display: flex;
        flex-direction: column;
        // align-items: center;
        // justify-content: center;
        padding: 27rpx 40rpx;
        height: 322rpx;
        width: 343rpx;
        background-color: #fff;
        border-radius: 24rpx;
        .text1{
          display: block;
          color: #777777;
          margin-left: 0;
          font-size: 32rpx;
          margin-bottom: 9rpx;
          font-weight: 700;
        }
        .text2{
          color: #A0A0A0;
          display: block;
          margin-bottom: 7rpx;
          font-size: 21rpx;
        }
        .uni-input{
          box-sizing:border-box;
          border: #777777 solid 1px;
          border-radius: 8rpx;
          font-size: 27rpx;
          line-height: 24rpx;
          margin-bottom: 44rpx;
          padding-left: 10rpx;
          width: 100%;
          height: 56rpx;
        }
        button{
          background-color: #B56C30;
          width: 259rpx;
          height: 52rpx;
          font-size: 24rpx;
          line-height: 54rpx;
          // margin: 0;
          color: #fff;
          border-radius: 69rpx;
          margin-bottom: 31rpx;
          font-weight: 700;
        }
        .text3{
          text-align: center;
          color: #B56C30;
          font-size: 24rpx;
          font-weight: 700;
          // text-decoration: underline;
        }
      }
    }
  }
</style>
