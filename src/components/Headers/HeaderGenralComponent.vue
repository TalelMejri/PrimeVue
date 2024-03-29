<template>
    <div class="header">
        <div class="card">
            <Toolbar class="content">
                <template #start>
                    <img src="../../components/Headers/HeaderGenralComponent.vue" alt="">
                </template>
                <template #center>
                    <p class="titre">Neoledge Processus</p>
                </template>
                <template #end class="d-flex gap-4">
                    <Button icon="pi pi-bell" class="mx-2" severity="secondary" />
                    <Button icon="pi pi-user" class="mx-2 " severity="secondary" />
                </template>
            </Toolbar>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped >
.titre {
    font-size: 18px;
    font-weight: bold;
}
.content {
    background: linear-gradient(120deg, white 50%, yellow 50%) !important;
    padding: 20px !important;
}
</style>