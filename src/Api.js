const httpism = require('httpism/browser')

class Api {
  static async loadUsers () {
    return httpism.get('users')
  }
}

export default Api
