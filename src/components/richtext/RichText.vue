<template>
  <quill-editor
    class="bi-ql-editor"
    v-model="content"
    :content="content"
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
  components: {
    quillEditor,
  },
  data() {
    return {
      name: 'register-modules-example',
      content: '123sadkjhsajkdhsakjdh爱斯达克回家哎是科技大会卡死就电话卡技术的1',
      editorOption: {
        scrollingContainer: '#editorcontainer',
        placeholder: '',
        // or 'bubble'
        theme: 'snow',
        modules: {
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false,
          },
          toolbar: [],
        },
      },
    };
  },
  methods: {
    onEditorBlur(editor) {
      this.$emit('fixed-text', true);
    },
    onEditorFocus(editor) {
      this.$emit('fixed-text', false);
    },
    // 内容改变事件
    onEditorChange() {
    },
    // 准备编辑器
    onEditorReady(editor) {
    },
  },
};
</script>
<style>
.bi-ql-editor{
  height: 100%;
  width: 100%;
}
</style>
