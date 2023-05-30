<template>
    <h1>Social Login</h1>
    <button>Login with Google</button>
    <button>Login with Facebook</button>
    <button>Login with Twitter</button>
    <button>Login with Github</button>
  </template>
  
  <script>

  
  export default {
    name: "social-vue",
    props: {
      data: Object
    },
    data() {
      return {
        opened: false
      }
    },
    computed: {
      
    },
    methods:{

    }
  }
  </script>
  
  <style lang="scss" scoped>
  </style>
  