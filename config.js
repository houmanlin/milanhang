/**
 * 小程序配置文件
 */

var host1 = "https://www.milanhang.com";


var config = {
  // 下面的地址配合云端 Server 工作
  host1,
  //1 获取用户的openid接口
  getOpenId: `${host1}/rest/login/getOpenId`,
  //2 完善用户微信信息
  register: `${host1}/rest/login/register`,
  //3 验证用户微信信息是否补全
  authWxMessage: `${host1}/rest/login/authWxMessage`,
  //4 获取活动列表
  allActivities: `${host1}/rest/activity/allActivities`,
  //5 获取课程列表
  allCources: `${host1}/rest/course/allCources`,
  //6 报名活动
  enroll: `${host1}/rest/ActiEnroll/enroll`,
  //7 报名课程
  SetCourseEnroll: `${host1}/rest/CourseEnroll/SetCourseEnroll`,
  // 8 判断绑定的电话号是否被别人用了
  checkPhone: `${host1}/rest/login/checkPhone`,
  // 9 判断用户是否已经绑定过电话号
  authPhoneMsg: `${host1}/rest/login/authPhoneMsg`,
  //10 去完成手机号绑定接口
  completePhone: `${host1}/rest/login/completePhone`,
  //11 获取6位的短信的验证码
  getPhoneCode: `${host1}/rest/login/getPhoneCode`,
  //12 验证用户是否是会员
  authMemberByUser: `${host1}/rest/mkMember/authMemberByUser`,
  //13 注册会员信息
  submitMember: `${host1}/rest/mkMember/submitMember`,
  // 14 支付接口
  pay: `${host1}/rest/wxpay/pay`,
  // 15 获取用户的会员信息
  getUserMemberMsg: `${host1}/rest/mkMember/getUserMemberMsg`,
  // 16 检验用户是否已经报名过某个活动
  checkActiByUser: `${host1}/rest/ActiEnroll/checkActiByUser`,
  // 17 验证某个用户是否重复报名了某个课程
  checkCourseByUser: `${host1}/rest/CourseEnroll/checkCourseByUser`,
  // 18 检验用户是否已经报名了某个课程
  SetCourseEnroll: `${host1}/rest/CourseEnroll/SetCourseEnroll`,
  // 19 获取优惠券
  getCoupons: `${host1}/rest/coupon/getCoupons`,
  // 我的活动列表
  findOwerActivity: `${host1}/rest/ActiEnroll/findOwerActivity`,
  // 获取报名此活动的头像路径
  findActiHeadUrl: `${host1}/rest/ActiEnroll/findActiHeadUrl`,
  // 获取我的课程列表
  findOwerCourse: `${host1}/rest/CourseEnroll/findOwerCourse`,
  // 获取报名此课程的头像路径
  findCourseHeadUrl: `${host1}/rest/CourseEnroll/findCourseHeadUrl`,
  // 获取我的优惠卷信息
  findUserCouponMsg: `${host1}/rest/mkMember/findUserCouponMsg`,
  // 获取活动课程页应该支付的钱数
  getPreMoney: `${host1}/rest/wxpay/getPreMoney`,
  // 改变优惠券状态
  changeUserCoupState: `${host1}/rest/mkMember/changeUserCoupState`,
  // 校园代理申请接口
  applyCampusAgent: `${host1}/rest/agent/applyCampusAgent`,
  // 获取单个课程
  oneCource: `${host1}/rest/course/oneCource`,
  // 验证代理绑定的手机号是否重复
  checkAgentPhone: `${host1}/rest/agent/checkAgentPhone`,
  // 获取单个活动
  oneActivity: `${host1}/rest/activity/oneActivity`,
  // 获取视频列表
  allMkVideo: `${host1}/rest/video/allMkVideo`,
  // 查询是否是代理
  checkAgent: `${host1}/rest/agent/checkAgent`,
  // 获取代理码
  getAgentId: `${host1}/rest/agent/getAgentId`,
  // 展示课程分类接口
  allcoursetype: `${host1}/rest/course/allcoursetype`,
  // 提现接口
  applyrefunds: `${host1}/rest/wxpay/applyrefunds`,
  // 计算提现金额
  calcrefunds: `${host1}/rest/wxpay/calcrefunds`,
  // 查询代理下一级会员人数
  getAgentCount: `${host1}/rest/agent/getAgentCount`,
  // 获取申请提现信息
  getBankAccount: `${host1}/rest/wxpay/getBankAccount`,
  // 获取首页图片信息
  getHomePagePath: `${host1}/rest/homepagePath/getHomePagePath`,
  // 会员钱数
  getSecCode: `${host1}/rest/SecCode/getSecCode`,
  // 查询二级代理人数
  getAgentIICount: `${host1}/rest/agent/getAgentIICount`,
  // 获取用户统计信息接口
  getMkCount: `${host1}/rest/MkCount/getMkCount`,
};

module.exports = config;


