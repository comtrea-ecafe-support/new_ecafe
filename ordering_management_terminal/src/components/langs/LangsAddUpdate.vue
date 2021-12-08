<template>
  <Modal v-model="open" :title="title">
    <Form ref="formItem" :model="formItem" :label-width="80" :rules="ruleValidate">
      <FormItem label="variable name" prop="key">
        <Input v-model="formItem.key" placeholder="Please enter the variable name" clearable />
      </FormItem>
      <FormItem label="Chinese" prop="zh-CN">
        <Input v-model="formItem['zh-CN']" placeholder="Please enter Chinese" clearable />
      </FormItem>
      <FormItem label="Explain Chinese" prop="notice">
        <Input v-model="formItem.notice" placeholder="Please enter an explanation in Chinese" clearable />
      </FormItem>
      <FormItem label="English" prop="en-US">
        <Input v-model="formItem['en-US']" placeholder="Please enter English" clearable />
      </FormItem>
      <FormItem label="Vietnamese" prop="vi-VN">
        <Input v-model="formItem['vi-VN']" placeholder="Please enter Vietnamese" clearable />
      </FormItem>
      <FormItem label="Thai" prop="th-TH">
        <Input v-model="formItem['th-TH']" placeholder="Please enter Thai" clearable />
      </FormItem>
      <FormItem label="Hindi" prop="en-IN">
        <Input v-model="formItem['en-IN']" placeholder="Please enter Hindi" clearable />
      </FormItem>
    </Form>
    <div slot="footer" style="text-align: center;">
      <Button @click="cancel('formItem')">closure</Button>
      <Button type="primary" :loading="loading" @click="ok('formItem')">submit</Button>
    </div>
  </Modal>
</template>
<script>
import { langsUpdate, langsAdd } from "@/api/langs";
export default {
  name: "Goods",
  data () {
    return {
      formItem: {
        key: '',
        'zh-CN': '',
        notice: '',
        'en-US': '',
        'vi-VN': '',
        'th-TH': '',
        'en-IN': '',
      },
      ruleValidate: {
        key: [{ required: true, message: "Please enter the variable name", trigger: "blur" }],
        'zh-CN': [{ required: true, message: "Please enter Chinese", trigger: "blur" }],
        notice: [{ required: true, message: "Please enter an explanation in Chinese", trigger: "blur" }],
        'en-US': [{ required: true, message: "Please enter English", trigger: "blur" }],
        'vi-VN': [{ required: true, message: "Please enter Vietnamese", trigger: "blur" }],
        'th-TH': [{ required: true, message: "Please enter Thai", trigger: "blur" }],
        'en-IN': [{ required: true, message: "Please enter Hindi", trigger: "blur" }],
      },
      open: false,
      title: "Multi-language modification",
      loading: false,
    };
  },
  methods: {
    init (params) {
      if (params) {
        this.title = "Multi-language modification";
        this.formItem = JSON.parse(JSON.stringify(params));
      } else {
        this.title = "Multi-language addition";
      }
      this.open = true;
    },
    ok (name) {
      this.$refs[name].validate((valid) => {
        if (!valid) return;
        if (this.formItem._id) {
          langsUpdate(this.formItem)
            .then((res) => {
              if (res.data.code === 200) {
                this.$Message.success("Multi-language modification succeeded");
                this.cancel("formItem");
                this.$emit("reload");
              } else {
                this.$Message.error(res.data.msg);
              }
            })
            .catch((err) => {
              this.$Message.error(err);
            });
        } else {
          langsAdd(this.formItem)
            .then((res) => {
              if (res.data.code === 200) {
                this.$Message.success("Multi-language added successfully");
                this.cancel("formItem");
                this.$emit("reload");
              } else {
                this.$Message.error(res.data.msg);
              }
            })
            .catch((err) => {
              this.$Message.error(err);
            });
        }
      });
    },
    cancel (name) {
      this.formItem = {
        name: "",
        price: "",
        desc: "",
        typeid: "",
      };
      this.$refs[name].resetFields();
      this.open = false;
    },
  },
  mounted () { },
};
</script>
<style lang="less" scoped>
</style>
