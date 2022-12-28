import db from '@/plugin/db'

function Init ({ dbName = 'database', argu = '', user = true, validator = () => true, defaultValue = '' }) {
  const currentUserStr = window.localStorage.getItem('userInfo')
  let currentUser = { userId: 0, loginTime: 0 }
  if (currentUserStr) currentUser = JSON.parse(currentUserStr)
  const currentPath = `${dbName}.${user ? `${currentUser.userId}` : `user`}${argu ? `.${argu}` : ''}`
  const value = db.get(currentPath).value()
  if (!(value !== undefined && validator())) {
    db.set(currentPath, defaultValue).write()
  }
  return currentPath
}
export default {
  namespaced: true,
  actions: {
    // eslint-disable-next-line no-empty-pattern
    set({}, { dbNameProp = 'database', argu = '', value = '', user = false }) {
      let dbName = dbNameProp
      if (user) dbName = 'user'
      db.set(Init({ dbName, argu, user }), value).write()
    },
    // eslint-disable-next-line no-empty-pattern
    get({}, { dbNameProp = 'database', argu = '', defaultValue = '', user = false }) {
      let dbName = dbNameProp
      if (user) dbName = 'user'
      return new Promise(resolve => {
        resolve(db.get(Init({ dbName, argu, user, defaultValue })).value())
      })
    }
  }
}