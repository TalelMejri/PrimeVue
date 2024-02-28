<template>
  <div class="home">
    <Button label="Check" icon="pi pi-check" />
    <InputText type="text" />
    <Calendar  />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {
   
  },
})
export default class HomeView extends Vue {
  
}
</script>
