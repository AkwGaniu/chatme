//IMPORT CLIENT SOKECT
const socket = io()

const app =  new Vue({
  el: '#app',
  data: {
    msg: false,
    message: ''
  },
  mounted() {
    this.msg = true
    const msg = "Testing testing"
    io.emit('chat', msg)
  }
})