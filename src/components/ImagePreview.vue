<template>
	<div>
		<img :src="img_src" :alt="img_alt" @click="toggler = !toggler"/>

		<FsLightbox
			:toggler="toggler"
			:sources="sources"
		 />
	</div>
</template>
<script>
import FsLightbox from "fslightbox-vue/v3"

export default {
	components: { FsLightbox },
  props: {
    sources: [],
    img_src: '',
    img_alt: 'Image',
  },
	data() {
		return {
			toggler: false
		}
	}
}
</script>

<style scoped>
img{
  max-width: 80px;
  border: 3px solid #0d6efd;
  padding: 3px;
  border-radius: 10px;
}
img:hover{
  cursor: pointer;
  border: 3px solid #347cf4;
}
</style>