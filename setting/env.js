const { env } = require("process")
env.PROT = '8080'
env.APP_COS_SECRET_ID = 'COS_SECRET_ID'
env.APP_COS_SECRET_KEY = 'COS_SECRET_KEY'
env.SERVER_BASE_URL = '127.0.0.1'

module.exports = { env }