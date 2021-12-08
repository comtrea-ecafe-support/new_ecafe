<template>
  <Modal v-model="open" :title="title">
    <Form ref="formItem" :model="formItem" :label-width="80" :rules="ruleValidate">
      <FormItem label="product name" prop="name">
        <Input v-model="formItem.name" placeholder="Please enter the product name" clearable />
      </FormItem>
      
    </Form>
    <div slot="footer" style="text-align: center;">
      <Button @click="cancel('formItem')">closure</Button>
      <Button type="primary" :loading="loading" @click="ok('formItem')">submit</Button>
    </div>
  </Modal>
</template>
<script>
import { goodTypeUpdate, goodTypeAdd } from "@/api/goodType";
import { imgUpload } from "@/api/upload";
export default {
  name: "Goods",
  data () {
    return {
      formItem: {
        name: "",
        price: "",
        desc: "",
        typeid: "",
      },
      ruleValidate: {
        name: [{ required: true, message: "Please enter the product name", trigger: "blur" }],
        price: [{ required: true, message: "Please enter the price", trigger: "blur" }],
        desc: [{ required: true, message: "Please enter a description", trigger: "blur" }],
        typeid: [
          {
            required: true,
            message: "Please enter the product name",
            trigger: "blur",
            type: "number",
          },
        ],
      },
      typeList: [
        { id: 33, name: "fenlei" },
        { id: 2, name: "Hot dishes" },
      ],
      open: false,
      title: "Commodity modification",
      loading: false,
      imgUrl: "",
    };
  },
  methods: {
    init (params) {
      if (params) {
        this.title = "Commodity modification";
        this.formItem = JSON.parse(JSON.stringify(params));
        this.imgUrl = window.Glob.baseUrl.dev + params.img
      } else {
        this.title = "Commodity add";
      }
      this.open = true;
    },
    ok (name) {
      this.$refs[name].validate((valid) => {
        if (!valid) return;
        if (this.formItem._id) {
          goodTypeUpdate(this.formItem)
            .then((res) => {
              if (res.data.code === 200) {
                this.$Message.success("Commodity modification successfully");
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
          goodTypeAdd(this.formItem)
            .then((res) => {
              if (res.data.code === 200) {
                this.$Message.success("Product added successfully");
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
    handleUpload (file) {
      if (file) {
        if (file.size > 500 * 1024) {
          this.$Message.error("Picture size is too large");
          this.$refs["addUpload"].clearFiles();
        } else {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const _base64 = reader.result;
            this.imgUrl = _base64; 
          };
          let formData = new FormData();
          formData.append("avatar", file);
          imgUpload(formData)
            .then((res) => {
              if (res.data.code === 200) {
                this.formItem.img = res.data.imgUrl;
              } else {
                this.$Message.error(err);
              }
            })
            .catch((err) => {
              this.$Message.error(err);
            });
          return false; 
        }
      }
      return false;
    },
  },
  mounted () { },
};
</script>
<style lang="less" scoped>
.uploadImgUrl {
  width: 50px;
  height: 50px;
}
</style>
