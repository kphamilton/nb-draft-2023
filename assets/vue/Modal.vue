<template>
  <transition name="fade">
    <div class="modal" v-if="show">
      <div class="modal__backdrop" @click="closeModal2()"/>

      <div class="modal__dialog">
        <div class="modal__header border-b">
          <slot name="header"/>

        </div>

        <div class="modal__body">
          <slot name="body"/>
        </div>

        <div class="modal__footer">
          <slot name="footer"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { bus } from '../app'
  export default {
    name: "Modal",
    data() {
      return {
        show: false,
      };
    },
    methods: {
      closeModal() {
        this.show = false;
        document.querySelector("body").classList.remove("overflow-hidden");
      },
      closeModal2() {
        this.show = false;
        bus.$emit('modal-clicked-out', 'yes');
        document.querySelector("body").classList.remove("overflow-hidden");
      },
      openModal() {
        this.show = true;
        bus.$emit('modal-opened', this);
        document.querySelector("body").classList.add("overflow-hidden");
      }
    }
  };
</script>


<style lang="css" scoped>
  .modal {
    overflow-x: hidden;
    overflow-y: auto;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 900;
    display: block;
  }
  .modal__backdrop {
    background-color: rgba(0, 0, 0, 0.3);
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
  }
  .modal__dialog {
    background-color: #fff;
    position: relative;
    margin: 50px auto;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
    z-index: 2;
  }
  @media screen and (max-width: 992px) {
    .modal__dialog {
      width: 90%;
    }
  }
  .modal__close {
    width: 30px;
    height: 30px;
  }
  .modal__header {
    padding: 20px 20px 10px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }
  .modal__body {
    padding: 10px 20px 10px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }
  .modal__footer {
    padding: 10px 20px 20px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

</style>