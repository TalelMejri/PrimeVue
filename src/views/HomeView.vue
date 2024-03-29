<template>
  <div class="home">
    <div class="header">
      <div class="card">
        <Toolbar class="content">
          <template #start>
            <img src="../assets/neoledge.png" alt="">
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
    <div class="config">
      <div class="card">
        <Toolbar class="config_content">
          <template #start>
            <Button label="Execution" icon="pi pi-play" iconPos="right" raised disabled />
          </template>
          <template #center>
          </template>
          <template #end>
            <SpeedDial :model="items" :transitionDelay="80" direction="left" style="right: 1em;"
              buttonClass="p-button-warning" />
            <input type="file" accept=".bpmn" @change="handleFileImport" ref="fileInput" style="display: none" />
          </template>
        </Toolbar>
      </div>
    </div>
    <div class="flow-container">
      <div ref="content" class="containers">
        <div id="canvas" ref="canvas" class="canvas"></div>
      </div>
      <div class="card_error" style="padding: 15px; text-align: center;">
        Problems({{ errors.length }})
        <Button icon="pi pi-exclamation-triangle" class="mx-2" severity="secondary"
          @click="visibleErrors = !visibleErrors" />
      </div>
      <Sidebar class="panel" v-model:visible="visibleRight" header="Neoledge Panel" position="right">
        {{ element }}
      </Sidebar>
    </div>
  </div>
</template>

<script setup>
import {
  openLocalDiagram,
  SaveSvg,
  ResetDiagramLocal,
  saveDiagramToLocal,
  saveDiagram,
  RefreshDiagram
} from "../Utils/diagram_util.js"
import { createElement, AddElementComposer, DeleteElement, UpdateElement } from "../properties_custom/utils.js";
import { ref, onMounted, toRaw } from 'vue';
import ColorsBpm from "../colors/index";
import Modeler from "bpmn-js/lib/Modeler.js";
import gridModule from 'diagram-js-grid';
import NeoledgeDescriptor from '../descriptor/NeoledgeDescriptor.json';
import LinterModule from "../LinterElement/index.js";
import { errors } from "../LinterElement/util.js";
const error = ref(errors);
let modeler;
const canvas = ref(null);
const element = ref(null);
const visibleRight = ref(false);
const visibleErrors = ref(false);
const fileInput = ref(null);
let zoomLevel = ref(1);
let bpmnElementRegistry;
let bpmnElementfactory;

onMounted(() => {
  initializeModeler();
});

const initializeModeler = () => {
  modeler = new Modeler({
    container: canvas.value,
    keyboard: { bindTo: window },
    additionalModules: [
      gridModule,
      LinterModule,
      ColorsBpm
    ],
    moddleExtensions: { neo: NeoledgeDescriptor }
  });
  bpmnElementRegistry = modeler.get('elementRegistry');
  bpmnElementfactory = modeler.get('bpmnFactory');

  bindModelerEvents();
  openLocalDiagram(modeler);
};

const bindModelerEvents = () => {
  modeler.on('selection.changed', handleSelectionChange);
  modeler.on('element.changed', handleElementChange);
};

const handleSelectionChange = (event) => {
  const selectedElement = event.newSelection[0];
  if (selectedElement !== undefined) {
    element.value = [selectedElement.id, selectedElement.labels, selectedElement.type, selectedElement.businessObject];
    CheckStatus(element.value);
    visibleRight.value = true;
  } else {
    element.value = null;
    visibleRight.value = false;
  }
};

const CheckStatus = (element) => {
  if (element[3]["status"] == undefined) {
    const elementNew = bpmnElementRegistry.get(element[3]["id"]);
    modeler.get('modeling').updateProperties(elementNew, { status: 0 });
  } else {
    console.log('null');
  }
}

const handleElementChange = (event) => {
  const changedElement = event.element;
  if (changedElement !== undefined) {
    element.value = [changedElement.id, changedElement.labels, changedElement.type, changedElement.businessObject];
    visibleRight.value = true;
  } else {
    element.value = null;
    visibleRight.value = false;
  }
};

const importDiagram = () => {
  fileInput.value.click();
};

const handleFileImport = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    modeler.destroy();
    modeler = new Modeler({
      container: canvas.value,
      keyboard: { bindTo: window },
      additionalModules: [
        gridModule,
        LinterModule,
        ColorsBpm
      ],
      moddleExtensions: { neo: NeoledgeDescriptor }
    });

    bpmnElementRegistry = modeler.get('elementRegistry');
    bpmnElementfactory = modeler.get('bpmnFactory');

    bindModelerEvents();
    openLocalDiagram(modeler, e.target.result);
  };
  reader.readAsBinaryString(file);
};

const resetDiagram = () => {
  modeler.destroy();
  ResetDiagramLocal();
  initializeModeler();
};

const downloadDiagramXml = () => {
  saveDiagram(toRaw(modeler))
};
const SaveDiagram = () => {
  saveDiagramToLocal(modeler);
}
const downloadDiagramSvg = async () => {
  SaveSvg(modeler);
};


const items = ref([
  {
    label: 'Download',
    icon: 'pi pi-download',
    command: () => {
      downloadDiagramXml();
    }
  },
  {
    label: 'Save',
    icon: 'pi pi-image',
    command: () => {
      downloadDiagramSvg();
    }
  },
  {
    label: 'Refresh',
    icon: 'pi pi-refresh',
    command: () => {
      resetDiagram();
    }
  },

  {
    label: 'Upload',
    icon: 'pi pi-upload',
    command: () => {
      importDiagram();
    }
  },
  {
    label: 'Save',
    icon: 'pi pi-save',
    command: () => {
      SaveDiagram();
    }
  }
])

</script>
<style>
@import '~bpmn-js/dist/assets/diagram-js.css';
@import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
@import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
@import 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css';

.djs-popup.color-picker .djs-popup-body .entry {
  margin: 2px;
}

.djs-popup.color-picker .djs-popup-body {
  display: grid;
  grid: auto-flow / 1fr 1fr 1fr;
}

.titre {
  font-size: 18px;
  font-weight: bold;
}

.content {
  background: linear-gradient(120deg, white 50%, yellow 50%) !important;
  padding: .5em;
}

.config_content {
  padding: .5em;
}

.config_content Button {
  padding: .5em;
}

.containers {
  background-color: #ffffff;
  width: 100%;
  height: 75vh;
}

.canvas {
  width: 100%;
  height: 100%;
}

.bjs-powered-by {
  display: none;
}

img {
  width: 50px;
}

.panel {
  padding: 1em;
}
</style>