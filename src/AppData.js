import Api from './Api'

class AppData {
  constructor () {
    this.users = []
  }

  load () {
    return this.loading = this.loading || this._load()
  }

  async _load () {
    const [users] = await Promise.all([
      Api.loadUsers(),
    ])
    this.users = users
  }
}

export default AppData
