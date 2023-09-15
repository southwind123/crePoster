<template>
  <view class="my-userinfo-container">
      <!-- 头像昵称区域 -->
      <view class="top-box">
        <image :src="userinfo.avatarUrl" class="avatar"></image>
        <view class="nickname">{{userinfo.nickName}}</view>
      </view>
      <view class="panel-list">
        <view class="panel">
          <view class="panel-list-item">
            <text>关于我们</text>
            <uni-icons type="arrowright" size="15"></uni-icons>
          </view>
          <view class="panel-list-item">
            <text>更新日志</text>
            <uni-icons type="arrowright" size="15"></uni-icons>
          </view>
          <view class="panel-list-item"  @click="logout">
            <text>退出登录</text>
            <uni-icons type="arrowright" size="15"></uni-icons>
          </view>
        </view>
      </view>
      
  </view>
</template>

<script>
  
  // 按需导入辅助函数
  import { mapState, mapMutations } from 'vuex'

  export default {
    name:"my-userinfo",
    data() {
      return {
        
      };
    },
    computed: {
        // 将 m_user 模块中的 userinfo 映射到当前页面中使用
        ...mapState('m_user', ['userinfo']),
    },
    methods:{
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken']),
      // 退出登录
      async logout() {
        // 询问用户是否退出登录
        const [err, succ] = await uni.showModal({
          title: '提示',
          content: '确认退出登录吗？'
        }).catch(err => err)
      
        if (succ && succ.confirm) {
           // 用户确认了退出登录的操作
           // 需要清空 vuex 中的 userinfo、token 和 address
           this.updateUserInfo({})
           this.updateToken('')
        }
      },
    },
  }
</script>

<style lang="scss">
  .my-userinfo-container {
    height: 100%;
    // 为整个组件的结构添加浅灰色的背景
    background-color: #f4f4f4;
    // padding-top: 20rpx;
  
    .top-box {
      height: 500rpx;
      background-color: #c00000;
      // background-image: url('../../static/bg/userbg.jpg');
      background-repeat: no-repeat;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
  
      .avatar {
        display: block;
        width: 90px;
        height: 90px;
        border-radius: 45px;
        border: 2px solid white;
        box-shadow: 0 1px 5px black;
      }
  
      .nickname {
        color: white;
        font-weight: bold;
        font-size: 16px;
        margin-top: 10px;
      }
    }
  }
  .panel-list {
    padding: 0 10px;
    position: relative;
    top: -10px;
    }
  .panel {
    background-color: white;
    border-radius: 3px;
    margin-bottom: 8px;
    }
  .panel-list-item {
    height: 45px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    padding: 0 10px;
  }
</style>