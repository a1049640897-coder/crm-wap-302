/*****************************************************************************************************************

          _____                           _______                           _____          
         /\    \                         /::\    \                         /\    \         
        /::\____\                       /::::\    \                       /::\    \        
       /:::/    /                      /::::::\    \                     /::::\    \       
      /:::/    /                      /::::::::\    \                   /::::::\    \      
     /:::/    /                      /:::/~~\:::\    \                 /:::/\:::\    \     
    /:::/____/                      /:::/    \:::\    \               /:::/__\:::\    \    
   /::::\    \                     /:::/    / \:::\    \             /::::\   \:::\    \   
  /::::::\    \   _____           /:::/____/   \:::\____\           /::::::\   \:::\    \  
 /:::/\:::\    \ /\    \         |:::|    |     |:::|    |         /:::/\:::\   \:::\    \ 
/:::/  \:::\    /::\____\        |:::|____|     |:::|____|        /:::/  \:::\   \:::\____\
\::/    \:::\  /:::/    /         \:::\   _\___/:::/    /         \::/    \:::\   \::/    /
 \/____/ \:::\/:::/    /           \:::\ |::| /:::/    /           \/____/ \:::\   \/____/ 
          \::::::/    /             \:::\|::|/:::/    /                     \:::\    \     
           \::::/    /               \::::::::::/    /                       \:::\____\    
           /:::/    /                 \::::::::/    /                         \::/    /    
          /:::/    /                   \::::::/    /                           \/____/     
         /:::/    /                     \::::/____/                                        
        /:::/    /                       |::|    |                                         
        \::/    /                        |::|____|                                         
         \/____/                          ~~                                               
                                                                                                             
 @Name:     HQF
 @Author:   豆豆
 @Date:     2019-8-29
 @QQ:       568483280
 @Note:     本js仅限个人使用及经本人同意者使用。如未经过本人允许用于第三方任何用途，第三方使用者一辈子吃泡面没有面.
 @version:  1.0版本，模拟用户登录。。。
********************************************************************************************************************/

import { setAccessToken, setLocalStorage } from '@/utils'
import { security, loginIn, getUserInfo } from '@/api/login'
import { JSEncrypt } from 'jsencrypt'

const user = {
  namespaced: true,
  actions: {
    developLogin({ state, dispatch }, loginInfo) {
      const { password, username, currentSystemObj, devUserId, devUserTitle } = loginInfo
      if (!username) {
        return
      } else if (!password) {
        return
      }
      return new Promise((resolve, reject) => {
        security().then(result => {
          // 处理 公钥
          const { security } = result.data
          let states = result.data.state
          if (!security || !states) {
            reject('秘钥获取失败')
            return
          }
          state.publicData = result.data
          let Pubcrypt = new JSEncrypt()
          let publicKey =
            '-----BEGIN PUBLIC KEY-----' +
            security.replace(/[\r\n]/g, '') +
            '-----END PUBLIC KEY-----'
          Pubcrypt.setPublicKey(publicKey)
          let enc = Pubcrypt.encrypt(password)
          loginIn(username, enc, states).then(res => {
            let isSuccess = res.status === 200
            if (isSuccess) {
              dispatch('common/user/setAuthorization', res.data.accessToken, { root: true })
              setLocalStorage('AXIOS_JOINEAST_TARGET', devUserId)
              setLocalStorage('AXIOS_JOINEAST_TARGET_TITLE', devUserTitle)
              setAccessToken(res.data.accessToken).then(async () => {
                await setLocalStorage('isOutLimit', false).then(() => {
                  dispatch('common/user/outLimit', null, { root: true })
                })
                await dispatch('common/systems/setCurrentSystem', currentSystemObj, { root: true }).then(async () => {
                  await getUserInfo().then(info => {
                    setLocalStorage('userInfo', JSON.stringify(info.data))
                  })
                  resolve()
                }).catch(str => {
                  reject(str)
                })
              })
            } else {
              reject('登录失败')
            }
          }).catch(err => {
            console.log('登录失败: ', err)
            reject(err)
          })
        })
      })
    },
    /**
     * @description 注销用户并返回登录页面
     * @param {Object} param context
     * @param {Object} param vm {Object} vue 实例
     * @param {Object} param confirm {Boolean} 是否需要确认
     */
    logout({ dispatch }, { vm, confirm = false }) {
      // 判断是否需要确认
      if (confirm) {
        vm.$confirm('注销当前账户吗?', '确认操作', {
          confirmButtonText: '确定注销',
          cancelButtonText: '放弃',
          type: 'warning'
        }).then(() => {
          dispatch('out')
        }).catch(() => {
          vm.$message('放弃注销用户')
        })
      }
    }
  }
}

export default user