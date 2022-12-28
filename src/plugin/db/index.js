import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
const adapter = new LocalStorage(`erpMobile`)
const db = low(adapter)
db.defaults({user: {}, database: {}}).write()
export default db
