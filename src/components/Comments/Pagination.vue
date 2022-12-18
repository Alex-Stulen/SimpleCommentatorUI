<template>
  <div class="row w-100">
    <div class="col-sm-12 text-center">
      <span @click="$emit('load-more')">Show more</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    url: String
  },

}
</script>

<style scoped>
span{
  color: #0d6efd;
}
span:hover{
  cursor: pointer;
  color: #347cf4;
}
</style>