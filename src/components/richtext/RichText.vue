<template>
  <quill-editor
    class="bi-ql-editor"
    v-model="content"
    :options="editorOption"
    @blur="onEditorBlur($event)"
    @focus="onEditorFocus($event)"
    @change="onEditorChange($event)"
    >
  </quill-editor>
</template>

<script>
import { quillEditor } from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { mapState } from 'vuex';

const toolbarOptions = [
  // 加粗、倾斜、下划线、删除线
  ['bold', 'italic', 'underline', 'strike'],
  // 引用格式、代码块形式
  ['blockquote', 'code-block'],
  // 标题一、标题二
  [{ header: 1 }, { header: 2 }],
  // 编序号
  [{ list: 'ordered' }, { list: 'bullet' }],
  // 下标、上标
  [{ script: 'sub' }, { script: 'super' }],
  // 左右缩进
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  // 字号
  [{ size: ['small', false, 'large', 'huge'] }],
  // 标题字号
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  // 字体颜色、背景颜色
  [{ color: [] }, { background: [] }],
  // 对齐方式
  [{ align: [] }],
  // 清除样式
  ['clean'],
];
export default {
  props: {
    status: Object,
  },
  components: {
    quillEditor,
  },
  data() {
    return {
      name: 'register-modules-example',
      // content: '<h1><strong class="ql-size-large">医保智能检测系统汇报</strong></h1>',
      isTitle: false,
      content: '<h1><strong class="ql-size-large">医保智能检测系统汇报</strong></h1>',
      editorOption: {
        scrollingContainer: '#editorcontainer',
        placeholder: '',
        // 'bubble'/'snow'
        theme: 'bubble',
        modules: {
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false,
          },
          toolbar: toolbarOptions,
        },
      },
    };
  },
  computed: {
    ...mapState({
      choseId: (state) => state.choseId,
    }),
  },
  watch: {
    status: {
      handler(newValue) {
        this.content = newValue.data.content;
        this.isTitle = newValue.data.isTitle;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    onEditorBlur(editor) {
      if (this.isTitle !== true) {
        this.$emit('fixed-text', true);
      }
    },
    onEditorFocus(editor) {
      this.$emit('fixed-text', false);
    },
    // 内容改变事件
    onEditorChange() {
      const data = {
        content: this.content,
        isTitle: this.isTitle,
      };
      this.$store.dispatch('updateTextContent', { choseId: this.choseId, data });
      // console.log(this.content);
    },
    // 准备编辑器
    onEditorReady(editor) {
    },
  },
};
</script>
<style lang="scss">
.bi-ql-editor{
  height: 100%;
  width: 100%;
}
.ql-bubble .ql-tooltip {
    border-radius: 5px;
    z-index: 1;
}
</style>
