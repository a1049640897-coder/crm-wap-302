const getters = {
  devSystemList: state => state.common.systems.list, // 开发系统列表
  devUserList: state => state.common.systems.devUserList, // 开发系 统列表
  currentSystem: state => state.common.systems.currentSystem, // 当前系统
  isSafing: state => state.common.systems.isSafing, // 是否维护中
  authorization: state => state.common.user.authorization,
  isAdmin: state => state.common.permission.isAdmin, // 超级权限
  permission_btns: state => state.common.permission.btns, // 按钮权限数据
}

export default getters