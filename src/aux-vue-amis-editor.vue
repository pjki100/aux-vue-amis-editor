<!-- eslint-disable -->
<template>
  <div class="editor-amis">
    <div class="editor-header" v-if="isTools&&isDesignMode">
        <div class="grid-content bg-purple">

          <a-switch
            style="display: block;margin-right: 20px;"
            v-model="isMobile"
          >
            <span slot="checkedChildren">移动端</span>
            <span slot="unCheckedChildren">PC端</span>
          </a-switch>

          <a-switch
            style="display: block;margin-right: 20px;"
            v-model="preview"
          >
            <span slot="checkedChildren">预览</span>
            <span slot="unCheckedChildren">编辑</span>
          </a-switch>
          <a href="https://aisuda.bce.baidu.com/amis/" style="display: block;margin-right: 20px;" target="_blank"> amis文档 </a>
          <a href="https://aisuda.bce.baidu.com/amis/examples/form/full" style="display: block;margin-right: 20px;" target="_blank"> amis示例 </a>
        </div>
    </div>
    <div class="main-show" v-if="isDesignMode">
      <amis-editor
        id="btAmisEditor"
        ref="btAmisEditor"
        :theme="theme"
        :preview="preview"
        :isMobile="isMobile"
        @onChange="onChange"
        @onPreview="onPreview"
        @onSave="onSave"
        @schemaFilter="schemaFilter"
        @isHiddenProps="isHiddenProps"
        :ctx="amisCtx"
        :data="amisData"
        :value="schemaData"
        :plugins="plugins"
        :disableBultinPlugin="disableBultinPlugin"
        :previewProps="previewProps"
        :iframeUrl="iframeUrl"
        :autoFocus="autoFocus"
        :amisEnv="amisEnv"
        :showCustomRenderersPanel="showCustomRenderersPanel"
      />
    </div>
     <div v-else>
      <aux-vue-amis-view  :theme="theme" :amis-data="amisData" :is-debug="isDebug" :schema="schema" :amisEnv="amisEnv" :locale="locale" :updateLocation="updateLocation" :onAction="onAction" />
    </div>
  </div>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'amis/lib/helper.css'
import "amis/lib/themes/cxd.css";
import "amis/lib/themes/ang.css";
import "amis/lib/themes/antd.css";
import "amis/lib/themes/dark.css";
import "amis/lib/themes/default.css";
import "amis-editor/dist/style.css";
import "amis/sdk/sdk.css";
import { Editor } from "amis-editor";
import { ReactInVue } from "vuera";
import 'ant-design-vue/dist/antd.css';
import { Switch} from 'ant-design-vue';
import AuxVueAmisView from './aux-vue-amis-view';
export default {
  name: 'AuxAmisEditor',
  components: {
    AmisEditor: ReactInVue(Editor),
    ASwitch:Switch,
    AuxVueAmisView
  },
  props:{
      //编辑器属性 begin-----
      isDesignMode: {
      type: Boolean,
      require: false,
      default: true,
    },
       //开启调试模式
       isDebug: {
      type: Boolean,
      require: false,
      default: true,
    },
    isPreview: {
      type: Boolean,
      require: false,
      default: true,
    },
    isPhone: {
      type: Boolean,
      require: false,
      default: false,
    },
    autoFocus: {
      type: Boolean,
      require: false,
      default: true,
    },
    isTools: {
      type: Boolean,
      require: false,
      default: false,
    },
    disableBultinPlugin: {
      type: Boolean,
      require: false,
      default: false,
    },
    theme: {
      type: String,
      require: false,
      default: 'cxd',
    },
    iframeUrl: {
      type: String,
      require: false,
    },
    showCustomRenderersPanel: {
      type: Boolean,
      default: true,
    },
    plugins: {
      type: Array,
      default: () => [],
    },

    schema: {
      type: Object,
      require: false,
      default: function () {
        return localStorage.getItem('amis-viewMode') ? JSON.parse(localStorage.getItem('amis-viewMode')) : {
          message: 'message',
        }
      },
    },
     // 查看器属性---begin---
    amisEnv: {
      type: Object,
      required: false,
      default: function () {
        return {}
      }
    },
    amisCtx: {
      type: Object|Array,
      required: false,
      default: function () {
        return {}
      }
    },
    amisData:  {
      type: Object|Array,
      required: false,
      default: function () {
        return {}
      }
    },
    //中可以设置语言，默认是中文
     locale: {
      type: String,
      required: false,
      default: "zh-CN"
    },
    previewProps: {
      type: Object,
      required: false,
      default: function () {
        return {}
      }
    },
    schemaFilter: {
      type: Function,
      required: false,
      default: () => {}
    },
    isHiddenProps: {
      type: Function,
      required: false,
      default: () => {}
    },
    updateLocation: {
      type: Function,
      required: false,
      default: () => {}
    },
    onAction: {
      type: Function,
      required: false,
      default: () => {}
    }

  },
  data() {
    return {
        updateKey: new Date().valueOf(),
        editTheme:'antd',
        isMobile:false,
        preview:false,
        schemaData:{},
        themes:[
          {label:'antd',value:'antd'},
          {label:'cxd',value:'cxd'},
          {label:'ang',value:'ang'},
          {label:'dark',value:'dark'},
        ]

    }
  },
  mounted(){
    this.preview = this.isPreview;
    this.editTheme = this.theme;
    this.isMobile = this.isPhone;
    console.info('schema-edit:',this.schema);
    this.schemaData = this.schema;
  },
  methods: {
    onChange(e) {
      this.schemaData = e;
      this.$emit("onChange", e);
    },
    onSave(e) {
      console.log(e)
      this.$emit("onSave", e);
    },
    onPreview(e) {
      console.log(e)
      this.$emit("onPreview", e);
    },
   
  }
}
</script>
<style lang="less">

.editor-amis {
}
.editor-amis > .editor-header {
  height: 60px;
  .grid-content{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background: #f3f4f6;
    padding: 20px;
    a,button{
      margin-right:15px;
      font-size:14px;
    }
  }
}
.ae-Editor .ae-Editor-inner{
  min-height:90vh;
}
.ae-Preview .ae-Preview-body {
  padding: 24px 0 16px;
}
.ae-Preview .ae-Preview-body {
  padding: 0 0 16px;
}
</style>
