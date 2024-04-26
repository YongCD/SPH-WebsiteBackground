<template>
  <div>
    <Card/>
    <Sale/>
    <Observe/>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import Card from './Card'
import Sale from './Sale'
import Observe from './Observe'
export default {
  name: 'Dashboard',
  components: {
    Card,
    Sale,
    Observe
  },
  mounted() {
    this.getData()
  },
  methods: {
    ...mapActions('home', ['getData'])
  }
}
</script>

<style>

</style>
