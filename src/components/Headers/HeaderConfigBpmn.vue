<template>
    <div class="config">
        <div class="card">
            <Toolbar class="config_content">
                <template #start>
                    <Button label="Execution" icon="pi pi-play" iconPos="right" raised @click="ToggleSimulation()" />
                </template>
                <template #center>
                </template>
                <template #end>
                    <SpeedDial :model="items" :transitionDelay="80" direction="left" style="right: 1em;"
                        buttonClass="p-button-warning" />
                </template>
            </Toolbar>
        </div>
    </div>
</template>

<script>
import { computed, ref, toRaw, defineComponent } from 'vue'
export default defineComponent({
    props: {
    },
    emits: ['importDiagram', 'resetDiagram', 'downloadDiagramXml', 'SaveDiagram', 'downloadDiagramSvg', 'ToggleSimulation'],
    setup(props, { emit }) {
        const ToggleSimulation = () => {
            emit("ToggleSimulation")
        }
        const items = ref([
            {
                label: 'Download',
                icon: 'pi pi-download',
                command: () => {
                    emit("downloadDiagramXml");
                }
            },
            {
                label: 'Save',
                icon: 'pi pi-image',
                command: () => {
                    emit("downloadDiagramSvg")
                }
            },
            {
                label: 'Refresh',
                icon: 'pi pi-refresh',
                command: () => {
                    emit("resetDiagram")
                }
            },

            {
                label: 'Upload',
                icon: 'pi pi-upload',
                command: () => {
                    emit("importDiagram");
                }
            },
            {
                label: 'Save',
                icon: 'pi pi-save',
                command: () => {
                    emit("SaveDiagram")
                }
            }
        ])

        return {
            items,
            ToggleSimulation,
        }
    }

})
</script>

<style scoped>
.config_content{
    padding: 15px;
}
.config_content Button{
    padding: 5px;
}
</style>