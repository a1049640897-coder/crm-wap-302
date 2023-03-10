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
 @Author:   ??????
 @Date:     2019-8-29
 @QQ:       568483280
 @Note:     ???js???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????.
 @version:  1.0????????????????????????????????????
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
          // ?????? ??????
          const { security } = result.data
          let states = result.data.state
          if (!security || !states) {
            reject('??????????????????')
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
              reject('????????????')
            }
          }).catch(err => {
            console.log('????????????: ', err)
            reject(err)
          })
        })
      })
    },
    /**
     * @description ?????????????????????????????????
     * @param {Object} param context
     * @param {Object} param vm {Object} vue ??????
     * @param {Object} param confirm {Boolean} ??????????????????
     */
    logout({ dispatch }, { vm, confirm = false }) {
      // ????????????????????????
      if (confirm) {
        vm.$confirm('??????????????????????', '????????????', {
          confirmButtonText: '????????????',
          cancelButtonText: '??????',
          type: 'warning'
        }).then(() => {
          dispatch('out')
        }).catch(() => {
          vm.$message('??????????????????')
        })
      }
    }
  }
}

export default user