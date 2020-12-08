<template>
  <v-dialog v-model="dialog" persistent max-width="40%">
    <template v-slot:activator="{ on, attrs}">
      <v-btn
        dense block
        v-bind="attrs"
        v-on="on"
      >
        导出
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">导出报表</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="3">
              <v-subheader>导出名称</v-subheader>
            </v-col>
            <v-col cols="9">
              <v-text-field
                v-model="fileName"
                outlined
                dense
                :rules="nameRules"
                clearable
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <v-subheader>导出格式</v-subheader>
            </v-col>
            <v-col cols="9">
              <v-radio-group v-model="fileType" row dense>
                <v-radio label="图片" value="jpeg"></v-radio>
                <v-radio label="PDF" value="pdf"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">取消</v-btn>
          <v-btn color="blue darken-1" text @click="saveFile">确定</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import domtoimage from 'dom-to-image';
import { jsPDF } from 'jspdf';

export default {
  props: ['defaultName'],
  data() {
    return {
      dialog: false,
      nameRules: [
        (v) => !!v || '文件名不能为空',
      ],
      fileName: this.defaultName,
      fileType: 'jpeg',
    };
  },
  methods: {
    saveFile() {
      this.dialog = false;
      if (this.fileType === 'jpeg') {
        this.$emit('save-as-image', this.fileName);
      } else {
        this.$emit('save-as-pdf', this.fileName);
      }
    },
  },
};
</script>
