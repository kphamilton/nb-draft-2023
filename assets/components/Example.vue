<template>
  <div>
    <h2 class="center">My Application</h2>
    <div v-text="message"></div>
    {{ message }}

    <v-select :options="['Canada', 'United States']"></v-select>

  </div>
</template>

<script>
import vSelect from 'vue-select'

export default {
  components: {
    vSelect
  },
  data() {
    return {
      message: "A list of words",
      name: ''
    };
  },
  created() {
    console.log("Hey created()");
  },
  mounted() {
console.log(document.querySelector("div[data-params]"));
    let el = document.querySelector("div[data-params]");
    let my_params = el.dataset.params;
    console.log(my_params);
//    this.words.push.apply(this.words, mywords);
  }
};
</script>

<style>
.center {
  text-align: center;
}
</style>