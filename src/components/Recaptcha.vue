<template>
  <VueRecaptcha
      ref="recaptcha"
      :sitekey="sitekey"
  />
</template>

<script>
import { VueRecaptcha } from 'vue-recaptcha';

export default {
  components: {
    VueRecaptcha
  },
  data () {
    return {
      sitekey: '6LdFT4kjAAAAAAyqyIXSIukylprFFCPPFwNTtGRz',
    }
  },
  methods: {
    reset() {
      // when you need a reCAPTCHA challenge
      this.$refs.recaptcha.reset();
    }
  }
}
</script>