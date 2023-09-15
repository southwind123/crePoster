export default {
  // 开启命名空间
  namespaced: true,

  // state 数据
  state: () => ({
    // 登录成功之后的 token 字符串
    token: uni.getStorageSync('token') || '',
    // 用户的基本信息
    userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{"avatarUrl":"https://pic4.zhimg.com/50/v2-6afa72220d29f045c15217aa6b275808_hd.jpg?source=1940ef5c","nickName":""}'),
    // 重定向的 object 对象 { openType, from }
    redirectInfo: null,
    // 生成的全部海报列表
    imageList : JSON.parse(uni.getStorageSync('imageList') || '[]'),
    // 喜欢的海报列表
    loveimageList : JSON.parse(uni.getStorageSync('loveimageList') || '[]'),
    // 用户新上传的文物图片
    imageSrc : '',
    //新生成的海报列表（path格式）
    newImageList:[],
  }),

  // 方法
  mutations: {
    // 更新用户的基本信息
    updateUserInfo(state, userinfo) {
        state.userinfo.avatarUrl = userinfo[0]
        state.userinfo.nickName = userinfo[1]
        // 通过 this.commit() 方法，调用 m_user 模块下的 saveUserInfoToStorage 方法，将 userinfo 对象持久化存储到本地
        this.commit('m_user/saveUserInfoToStorage')
    },
    
    // 将 userinfo 持久化存储到本地
    saveloveimageListToStorage(state) {
        uni.setStorageSync('loveimageList', JSON.stringify(state.loveimageList))
    },
    saveUserInfoToStorage(state) {
        uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
    },
    // 更新 token 字符串
    updateToken(state, token) {
        state.token = token
        // 通过 this.commit() 方法，调用 m_user 模块下的 saveTokenToStorage 方法，将 token 字符串持久化存储到本地
        this.commit('m_user/saveTokenToStorage')
    },
    
    // 将 token 字符串持久化存储到本地
    saveTokenToStorage(state) {
        uni.setStorageSync('token', state.token)
    },
    // 更新重定向的信息对象
    updateRedirectInfo(state, info) {
      state.redirectInfo = info
    },
    saveImageListToStorage(state){
      uni.setStorageSync('imageList', JSON.stringify(state.imageList))
    },
    updateImageList(state,poster){
      state.imageList = [poster,...state.imageList]
      this.commit('m_user/saveImageListToStorage')
    },
    // 更改图片的喜欢的选中状态
    updateImageState(state, image) {
        // 更新对应图片的勾选状态
        state.imageList[image.index].islove = image.islove
        state.loveimageList = state.imageList.filter(x=>x.islove == true)
        // 持久化存储到本地
        this.commit('m_user/saveImageListToStorage')
        this.commit('m_user/saveloveimageListToStorage')
    },
    updateImagedeleteState(state, image) {
        // 更新对应图片的勾选状态
        state.imageList[image.index].isdelete = image.isdelete
        // 持久化存储到本地
        this.commit('m_user/saveImageListToStorage')
    },
    // 更新所有图片的删除勾选状态
    updateAllImageState(state, newState) {
      state.imageList.forEach(x => x.isdelete = newState)
      // 持久化存储到本地
      this.commit('m_user/saveImageListToStorage')
    },
    deleteImageList(state){
      state.imageList = state.imageList.filter(x=>!x.isdelete)
      state.loveimageList = state.imageList.filter(x=>x.islove == true)
      this.commit('m_user/saveImageListToStorage')
      this.commit('m_user/saveloveimageListToStorage')
    },
    updateimageSrc(state, imageSrc) {
      state.imageSrc = imageSrc
    },
    updatenewImageList(state, newImageList) {
      state.newImageList = newImageList
    },
  
  },

  // 数据包装器
  getters: {
    // 勾选的图片的总数量
    checkedCount(state) {
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品总数量进行累加
      // reduce() 的返回值就是已勾选的商品的总数量
      return state.imageList.filter(x => x.isdelete).reduce((total, item) => total += 1, 0)
    },
    total(state){
      return state.imageList.length
    }
  },
}