<template>
<div>
YO YO YO
</div>
  

</template>
<script>
import vSelect from 'vue-select'
import Modal from './Modal'
import TextareaInput from './TextareaInput'
import Icon from './Icon'
import axios from 'axios'
import vTitle from 'vuejs-title'
import { bus } from '../app'

export default {
  name: 'vuefrontend',
  components: {
    vSelect,
    Modal,
    TextareaInput,
    axios,
    vTitle,
    Icon,
  },

  data() {
    return {
      name: '',
      message: 'Hello World, ',
    }
  },
  created() {
  },
  mounted()
  {

  },
  computed: {
  },
  methods: {

  },
}
</script>