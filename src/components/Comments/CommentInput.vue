<template>
  <Editor
    api-key="hr2slk33fmj2wnk3g38k2t797crhxu00nn3nwmsjcgk9llor"
    :init="{
          menubar: 'edit insert view format table tools help',
          max_chars:10
        }"
  />
</template>

<script>
import Editor from '@tinymce/tinymce-vue'

export default {
  name: "CommentInput",
  components: {
    Editor
  }
}
</script>

<style scoped>

</style>