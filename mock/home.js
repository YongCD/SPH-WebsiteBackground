const data = require('./data.json')
module.exports = [
  {
    url: '/home/list',
    type: 'get',
    response: config => {
      return {
        code: 200,
        data
      }
    }
  }
]
