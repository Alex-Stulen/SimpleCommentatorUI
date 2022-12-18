<template>
  <Editor
    api-key="no-api-key"
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