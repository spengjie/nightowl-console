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

export default {
  name: 'CodeEditor',
  props: {
    value: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
    },
    theme: {
      type: String,
      default: 'default',
    },
    readOnly: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      editor: null,
    };
  },
  async created() {
    try {
      await import(`codemirror/mode/${this.mode}/${this.mode}.js`);
      if (this.theme !== 'default') await import(`codemirror/theme/${this.theme}.css`);
    } catch {
      // Do nothing;
    }
  },
  mounted() {
    this.editor = CodeMirror(this.$refs.editor, {
      height: 'auto',
      lineNumbers: true,
      // foldGutter: true,
      foldOptions: {
        widget: '\u00B7\u00B7\u00B7'
      },
      mode: this.mode,
      theme: this.theme,
      readOnly: this.readOnly,
      extraKeys: { 'Alt-F': 'findPersistent', 'F3': 'findNext' },
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    });
    this.editor.setValue(this.value);
  },
};
</script>
