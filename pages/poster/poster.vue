<template>
    <view class="poster-container">
      <!-- 顶部 -->
      <view class="top-container">
        <view class="top-content">
          <image src="../../static/bg/bg4.png" mode="widthFix" class="bg4"></image>
          <!-- 用户头像 -->
          <button class="avatar" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
            <image :src="avatarUrl"></image>
          </button>
          <!-- 用户名字 -->
          <input type="nickname" class="weui-input" placeholder="Entry name" v-model="username"/>
        </view>
      </view>
      <!-- 底部 喜欢的海报 -->
      <view class="bottom-container"  :style="{height:scrollHeight ,top:top}">
        <!-- 喜欢的海报 -->
        <view class="grid-container">
          <text class="title">Like</text> 
          <scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-Y">
                    
                    <view class="grid" >
                        <view class="grid-image" v-for="(item,index) in loveimageListAll" :key="index">
                          <image :src="item.poster" mode="widthFix"  :data-id1="index+1" @click="preImage(index)" @longtap="changeIscheckbox"></image>
                        </view> 
                    </view>
          </scroll-view>
        </view>
      </view>

      <!-- 提醒用户登录的弹出层 -->
      <view class="login-pop">
        <!-- 弹出层 -->
        <uni-popup ref="popup" type="center">
          <view class="uniPop">
            <text>Login</text>
            <button @click="wxlogin">Login with Wechat Account</button>
          </view>
        </uni-popup>
      </view>
      <!-- 底下让用户选头像以及用户名的弹出层 -->
      <view class="bottom-pop">
        <!-- 弹出层 -->
        <uni-popup ref="bottompopup" type="bottom" style="padding-bottom: 0;">
          <view class="bottompopup">
            <view class="top">
              <text>Login</text>
              <uni-icons type="closeempty" size="19" color="#555555" @click="closebottompopup"></uni-icons>
            </view>
            <view class="middle">
              <text>Profile photo</text>
              <button class="bottom-avatar" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
                <image :src="avatarUrl"></image>
              </button>
            </view>
            <view class="bottom">
              <text>Nickname*</text>
              <input type="nickname" class="weui-input" placeholder="Entry name" v-model="username"/>
            </view>
            <text class="text-bottom">*Chinese name cannot be displayed. Please enter an English name</text>
          </view>
        </uni-popup>
      </view>
    </view>
</template>

<script>
  import {pathToBase64,base64ToPath} from '../../js_sdk/mmmm-image-tools/index.js'
  import { mapState, mapMutations,mapGetters } from 'vuex'
  export default {
    data() {
      return {
        // 'https://img.zcool.cn/community/01dc1b58ae3d6ca801219c77314f09.png@2o.png'
        avatarUrl:'https://img.zcool.cn/community/01dc1b58ae3d6ca801219c77314f09.png@2o.png',
        scrollHeight:'650rpx',
        top:'460rpx',
        // 用户名称
        username:'',
      };
    },
    watch:{
      avatarUrl:{
        handler(newName,oldName){
          this.updateUserInfo([newName,this.username])
        }
      },
      username:{
        handler(newName,oldName){
          this.updateUserInfo([this.avatarUrl,newName])
        }
      }
    },
    computed: {
        // 将 m_user 模块中的 userinfo 映射到当前页面中使用
        ...mapState('m_user', ['userinfo','token','imageList','loveimageList','redirectInfo']),
        ...mapGetters('m_user', ['checkedCount','total']),
        loveimageListAll(){
          return this.token !== '' ? this.loveimageList : []
          
        },
        // username(){
        //   return this.userinfo.nickName
        // },
        // avatarUrl(){
        //   return this.userinfo.avatarUrl
        // },
        
    },
    methods:{
      ...mapMutations('m_user', ['updateRedirectInfo','updateImageList','updateImageState','updateAllImageState','deleteImageList','updateUserInfo', 'updateToken',]),
      closebottompopup(){
        this.$refs.bottompopup.close()
      },
      loginpop(){
        if(!this.token) this.$refs.popup.open('center')
      },
      // 调用登录接口，换取永久的 token
      async getToken(info) {
        // 调用微信登录接口
        const [err, res] = await uni.login().catch(err => err)
        // 判断是否 uni.login() 调用失败
        if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
         // console.log(res);
        // 准备参数对象
        const query = {
          //执行小程序登录后获取
          code: res.code,
          // 用户信息加密数据
          encryptedData: info.encryptedData,
          // 加密算法的初始向量
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
      
        // 换取 token
        const { data: loginResult } = await uni.$http.post('https://pangu.didalab.cn/api/poster/login', query)
        console.log(loginResult);
        if (loginResult.status !== 200) return uni.$showMsg('登录失败！')
        // 2. 更新 vuex 中的 token
        this.updateToken(loginResult.token)
        // 登陆成功之后显示底部的弹出层
        this.$refs.popup.close()
        this.$refs.bottompopup.open('bottom')
        // console.log(loginResult);
        // uni.$showMsg('登录成功')
        // 判断 vuex 中的 redirectInfo 是否为 null
        // 如果不为 null，则登录成功之后，需要重新导航到对应的页面
        this.navigateBack()
      },
      // 返回登录之前的页面
      navigateBack() {
        // redirectInfo 不为 null，并且导航方式为 switchTab
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          // 调用小程序提供的 uni.switchTab() API 进行页面的导航
          uni.switchTab({
            // 要导航到的页面地址
            url: this.redirectInfo.from,
            // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
            complete: () => {
              this.updateRedirectInfo(null)
            },
          })
        }
      },
      // 登录
      wxlogin(){
        uni.getUserProfile({
          desc: '请求授权',
          success: (res) => {
              console.log(res)
              // 将用户的基本信息存储到 vuex 中
              this.updateUserInfo(["https://img.zcool.cn/community/01dc1b58ae3d6ca801219c77314f09.png@2o.png",""])
              // {"avatarUrl":"https://img.zcool.cn/community/01dc1b58ae3d6ca801219c77314f09.png@2o.png","nickName":""}
              // 获取登录成功后的 Token 字符串
              this.getToken(res)
          },
          fail: (res) => {
            return uni.$showMsg("已取消登录授权")
          },
        
        })
      },
      onChooseAvatar(e) {
        console.log(e);
        this.avatarUrl = e.detail.avatarUrl
        this.updateUserInfo(e.detail.avatarUrl,this.username)
      },
      preImage(i){
        // console.log(e);
        
          uni.previewImage({
            // 预览时，默认显示图片的索引
              current: i,
        			urls: this.loveimageListAll.map(x=>x.poster),
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
    },
    onload(){
    
      
    },
    onShow(){
      
      
      
    },
    onReady() {
      if(!this.token){
        this.avatarUrl = "https://pic4.zhimg.com/50/v2-6afa72220d29f045c15217aa6b275808_hd.jpg?source=1940ef5c"
        this.username = ''
      }
      else{
        this.avatarUrl = this.userinfo.avatarUrl
        this.username = this.userinfo.nickName
      }
      const that = this
      this.loginpop()
      uni.getSystemInfo({
        
      	success: function (res) {
        //   console.log(res.windowWidth);
      		// console.log(res.windowHeight)
          that.scrollHeight = (res.windowHeight - uni.upx2px(460))/(uni.upx2px(10)/10) + 'rpx'
      	}
      });
    },
    
  }
</script>

<style lang="scss">
  *{
    box-sizing: border-box;
  }
  .poster-container{
    width: 100%;
    height: 100%;
    background-color: #FAF8F4;
    .top-container{
      box-sizing: border-box;
      padding: 39rpx 69rpx;
      width: 100%;
      height: 461rpx;
      .top-content{
        position: relative;
        width: 100%;
        height: 100%;
        background-color: #fff;
        border-radius: 24rpx;
        .bg4{
          width: 100%;
          border-radius: 24rpx;
        }
        .avatar{
          position: absolute;
          top: 137rpx;
          left: 223rpx;
          padding: 0;
          width: 170rpx;
          height: 170rpx;
          border-radius: 170rpx;
          image{
            width: 100%;
            height: 100%;
            border-radius: 170rpx;
          }
        }
        input{
          font-family: SourceHanSansSC-Bold;
          margin-top: 101rpx;
          width: 100%;
          text-align: center;
        }
      }
    }
    .bottom-container{
      position: fixed;
      // top: 800rpx;
      left: 0;
      width: 100%;
      background-color: #fff;
      border-radius: 24rpx;
      box-sizing: border-box;
      // padding-bottom: 173rpx;
      .grid-container{
          height: 100%;
          margin-top: 40rpx;
          padding: 0 45rpx;
          flex: 1;
          display: flex;
          flex-direction: column;
          scroll-view{
            height: 100%;
            box-sizing: border-box;
            padding-bottom: 170rpx;
          }
          .title{
            font-family: DingTalkJinBuTi;
            display: inline-block;
            margin-bottom: 20rpx;
            padding-left: 19rpx;
            font-size: 35rpx;
            // font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: #000000;
            line-height: 52rpx;
            .des{
              display: inline-block;
              margin-left: 31rpx;
              color: #9D9D9D;
              font-size: 26rpx;
              margin-bottom: 0rpx;
            }
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
           }
           
           
         }
      }
    }
    .login-pop{
      background-color: #fff;
      .uniPop{
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding:  32rpx 40rpx;
        height: 225rpx;
        width: 423rpx;
        background-color: #fff;
        border-radius: 24rpx;
        text{
          color: #777777;
          font-size: 31rpx;
          text-align: center;
          font-weight: 700;
        }
        button{
          width: 307rpx;
          height: 93rpx;
          color: #fff;
          background-color: #B56C30;
          border-radius: 24rpx;
          text-align: center;
          line-height: 33rpx;
          font-weight: 700;
          font-size: 25rpx;
          padding: 13rpx 0;
        }
      }
    }
    .bottom-pop{
      box-sizing: border-box;
          width: 100%;
          position: fixed;
          bottom: 0;
      .bottompopup{
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 400rpx;
        width: 100%;
        background-color: #fff;
        border-radius: 24rpx 24rpx 0 0;
        padding: 0 50rpx;
        .top{
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: #D9D9D9 solid 2rpx;
          width: 100%;
          height: 100rpx;
          text{
            font-size: 36rpx;
            font-weight: 700;
            color: #535353;
          }
        }
        .middle{
          display: flex;
          align-items: center;
          height: 100rpx;
          width: 100%;
          border-bottom: #D9D9D9 solid 2rpx;
          text{
            font-size: 32rpx;
            color: #535353;
          }
          .bottom-avatar{
            margin-left: 35rpx;
            padding: 0;
            width: 85rpx;
            height: 76rpx;
            border-radius: 15rpx;
            background-color: #DCDCDC;
            text-align: center;
            line-height: 76rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            image{
              width: 60rpx;
              height: 60rpx;
              border-radius: 40rpx;
            }
          }
        }
        .bottom{
          display: flex;
          align-items: center;
          width: 100%;
          height: 100rpx;
          border-bottom: #D9D9D9 solid 2rpx;
          text{
            font-size: 32rpx;
            color: #535353;
            margin-right: 63rpx;
          }
          input{
            flex: 1;
            font-size: 32rpx;
          }
        }
        .text-bottom{
          display: block;
          margin-top: 15rpx;
          font-size: 21rpx;
          color: #9A9A9A;
        }
      }
    }
  }
    
</style>