<template>
  <div id="app" class="container-fluid">
    <h1>Simple Commentator</h1>
    <div class="row justify-content-center">
      <div class="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-7 col-xxl-6 px-2">
        <CommentsContainer />
      </div>
    </div>
  </div>
</template>

<script>

import CommentsContainer from "@/components/Comments/CommentsContainer";

export default {
  name: 'App',
  components: {
    CommentsContainer
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
