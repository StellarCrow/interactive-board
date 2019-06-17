<template>
  <div>
    <div class="modal">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <img :src="link" alt="Image" class="full-image">
            <button @click="close">close</button>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'ImageFull',
    props: ['link'],
    methods: {
      close () {
        this.$emit('close', {
          imageFull: false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../styles/basics/base";
  @import "../styles/components/board";

  .full-image {
    max-width: 100vh;
    height: auto;
    overflow: auto;
  }

</style>
