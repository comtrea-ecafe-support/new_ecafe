<template>
  <Modal v-model="open" :title="title">
    <Form ref="formItem" :model="formItem" :label-width="80" :rules="ruleValidate">
      <FormItem label="account" prop="name">
        <Input v-model="formItem.us" placeholder="Please enter the product name" clearable />
      </FormItem>
      <FormItem label="password" prop="ps">
        <Input v-model="formItem.ps" placeholder="Please enter the price" clearable />
      </FormItem>
       <FormItem label="number" prop="number">
        <Input v-model="formItem.number" placeholder="Please enter the number" clearable />
      </FormItem>
      <FormItem label="gender">
        <RadioGroup v-model="formItem.sex">
            <Radio :label="0">male</Radio>
            <Radio :label="1">Female</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="state">
        <i-switch v-model="formItem.state" />
      </FormItem>
    </Form>
    <div slot="footer" style="text-align: center;">
      <Button @click="cancel('formItem')">closure</Button>
      <Button type="primary" :loading="loading" @click="ok('formItem')">submit</Button>
    </div>
  </Modal>
</template>
<script>
import { usersAdd } from "@/api/user";
export default {
  name: "UsersAddUpdate",
  data () {
    return {
      formItem: {
        us: "",
        ps: "",
        sex: 1,
        state: true,
      },
      ruleValidate: {
        us: [{ required: true, message: "Please input Username", trigger: "blur" }],
        ps: [{ required: true, message: "Please enter the password", trigger: "blur" }],
      },
      typeList: [

      ],
      open: false,
      title: "User added",
      loading: false
    };
  },
  methods: {
    init () {
      this.title = "User added";
      this.open = true;
    },
    ok (name) {
      this.$refs[name].validate((valid) => {
        if (!valid) return;
        const postData = JSON.parse(JSON.stringify(this.formItem))
        postData.state = this.formItem.state ? 1 : 0
        usersAdd(postData)
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
      });
    },
    cancel (name) {
      this.formItem = {
        us: "",
        ps: "",
        sex: 1,
        state: true,
      };
      this.$refs[name].resetFields();
      this.open = false;
    }
  },
  mounted () { },
};
</script>
