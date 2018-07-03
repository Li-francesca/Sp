Page({
  data: {
    imgs: [],
    text: '',
    plusShow: true,
    courseId: 1,
    userId: 1,
    userRole: 4

  },
  onLoad: function (e) {
    //读出courseId
    wx.getStorage({
      key: "organHomeworkListConf",
      success: function (res) {
        that.setData({
          courseId: e.currentTarget.dataset.courseId
        });
      }
    });
    //读出login里的userId userRole
    wx.getStorage({
      key: "loginConf",
      success: function (res) {
        that.setData({
          userId: e.currentTarget.dataset.classid,
          userRole: e.currentTarget.dataset.role
        });
      }
    });
  },
  //获取文字内容
  textInput: function (e) {
    this.setData({
      text: e.detail.value
    });
  },
  //上传文字
  upLoadText: function () {
    var that = this;
    var imgs = this.data.imgs;
    wx.request({
      url: 'http://192.168.1.220:8000/courseWork/add/',
      data: {
        user_id: this.data.userId,
        role: this.data.userRole,
        course_id: this.data.courseId,
        work_content: this.data.text
      },
      header: { 'content-type': 'application/json' },
      success: function (res) {
        if (res.data.code == 0) {
          if (imgs.length > 0) {
            that.upLoadImg({//调用upLoadImg
              url: 'http://192.168.1.220:8000/courseWork/image/',//这里是你图片上传的接口
              imgs: imgs,
              coursework_id: res.data.coursework_id
            });
          } else {
            wx.redirectTo({
              url: '../organ-homework-teacherMore/organ-homework-teacherMore',
            })
          }
        }
      }
    })
  },
  chooseImg: function (e) {
    var that = this;
    var imgs = this.data.imgs;//存图片地址的变量
    wx.chooseImage({
      count: 9 - imgs.length,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        for (var i = 0; i < tempFilePaths.length; i++) {
          imgs.push(tempFilePaths[i]);
        }
        that.setData({
          imgs: imgs
        });
        that.showHide();
      }
    });
  },
  /*
      删除图片
  */
  deleteImg: function (e) {
    var imgs = this.data.imgs;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.setData({
      imgs: imgs
    });
    this.showHide();
  },
  /*
      预览图片
  */
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var imgs = this.data.imgs;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
  },
  /*
      控制添加图片按钮是否显示出来
  */
  showHide: function (e) {
    if (this.data.imgs.length == 9) {
      this.setData({
        plusShow: false
      });
    } else if (this.data.imgs.length < 9) {
      this.setData({
        plusShow: true
      });
    }
  },
  /*提交*/
  submit: function (e) {
    wx.switchTab({
      url: '../ucenter/index/index',
    })

  },
  //上传图片
  upLoadImg: function (data) {
    var that = this,
      i = data.i ? data.i : 0,//当前上传的哪张图片
      success = data.success ? data.success : 0,//上传成功的个数
      fail = data.fail ? data.fail : 0;//上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.imgs[i],
      name: 'file',
      formData: {
        id: data.id
      },
      success: (resp) => {
        success++;//图片上传成功，图片上传成功的变量+1
        console.log(resp);
        console.log(i);
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        fail++;//图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        console.log(i);
        i++;//这个图片执行完上传后，开始上传下一张
        if (i == data.imgs.length) {   //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else {//若图片还没有传完，则继续调用函数
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.a(data);
        }
      }
    });
  }
})