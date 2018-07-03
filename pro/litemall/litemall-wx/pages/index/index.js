 const util = require('../../utils/util.js');
 const api = require('../../config/api.js');
 const user = require('../../utils/user.js');

//获取应用实例
const app = getApp()
Page({
  data: {
    newGoods: [],
    hotGoods: [],
    topics: [],
    brands: [],
    floorGoods: [],
    banner: [
      {
        url:"http://gw.alicdn.com/tps/i3/TB19zkLJXXXXXc3XFXXhXAC0FXX-640-247.jpg"
      },
      {
        url: "//img13.360buyimg.com/n1/s450x450_jfs/t15817/150/2071629603/15753/10b2bfe6/5a7945b8Nd782a445.jpg"
      },
      {
        url: "http://img3m4.ddimg.cn/43/12/23822314-1_w_5.jpg"
      }
    ],
    channel: []
  },
  onShareAppMessage: function () {
    return {
      title: '奶牛易物',
      desc: '奶牛易物',
      path: '/pages/index/index'
    }
  },

  getIndexData: function () {
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          newGoods: res.data.newGoodsList,
          hotGoods: res.data.hotGoodsList,
          topics: res.data.topicList,
          brands: res.data.brandList,
          floorGoods: res.data.floorGoodsList,
          // banner: res.data.banner,
          channel: res.data.channel
        });
      }
    });
  },
  onLoad: function (options) {
    this.getIndexData();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
})
