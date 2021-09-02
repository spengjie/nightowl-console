<template>
  <div style="border: solid 1px #eee; border-radius: 2px">
    <div ref="editor" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/theme/monokai.css';
import './mode';
import { fetchNetworkDeviceConfig } from '@/api/networkObjects';

export default {
  name: 'NetworkObjectConfiguration',
  data() {
    return {
      refreshing: false,
      config: '',
      editor: null,
    };
  },
  watch: {
    $route: {
      handler() {
        this.fetchNetworkDeviceConfig();
      },
      immediate: true,
    }
  },
  mounted() {
    this.editor = CodeMirror(this.$refs.editor, {
      height: 'auto',
      lineNumbers: true,
      foldGutter: true,
      foldOptions: {
        widget: '\u00B7\u00B7\u00B7'
      },
      mode: 'cisco-like_config',
      theme: 'monokai',
      readOnly: true,
      indentUnit: 1,
      extraKeys: { 'Alt-F': 'findPersistent', 'F3': 'findNext' },
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    });
  },
  methods: {
    fetchNetworkDeviceConfig() {
      const _id = this.$route.params && this.$route.params._id;
      this.refreshing = true;
      fetchNetworkDeviceConfig(_id)
        .then(response => {
          const { config } = response.data;
          this.config = config || '';
          this.editor.setValue(this.config);
        })
        .catch(() => {})
        .finally(() => {
          this.refreshing = false;
        });
    },
    refresh() {
      this.fetchNetworkDeviceConfig();
    },
  }
};
</script>
