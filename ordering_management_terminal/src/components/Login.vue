<template>
  <div id="login_container">
    <Form ref="dataForm" :model="dataForm" :rules="dataFormRules" inline class="login_form">
      <FormItem prop="us">
        <Input type="text" v-model="dataForm.us" placeholder="Mail">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
        <Button
          v-if="isReg"
          type="primary"
          class="sendBtn"
          :disabled="sendText !== 'send'"
          @click="sendCode('dataForm')"
        >{{ sendText }}</Button>
      </FormItem>
      <FormItem prop="ps">
        <Input
          type="password"
          v-model="dataForm.ps"
          placeholder="password"
          @on-enter="handleSubmit('dataForm')"
        >
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="code" v-if="isReg">
        <Input
          type="password"
          v-model="dataForm.code"
          placeholder="Verification code"
          @on-enter="handleReg('dataForm')"
        >
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem style="display: flex;justify-content:center;">
        <Button type="primary" @click="handleSubmit('dataForm')">Log in</Button>
        <Divider type="vertical" />
        <Button @click="handleReg('dataForm')">register</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { login, getMailCode, reg } from "@/api/user";
import { getMenusList } from "@/api/permit";
export default {
  data () {
    return {
      dataForm: {
        us: "ceshi@ceshi.com",
        ps: "ceshi",
      },
      dataFormRules: {
        us: [
          {
            validator: (rule, value, callback) => {
              if (!value || value === " ") {
                callback(new Error("please input your email"));
              } else {
                const exp = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
                if (!exp.test(value)) {
                  callback(new Error("please enter your vaild email"));
                } else {
                  callback();
                }
              }
            },
            trigger: "blur",
          },
        ],
        ps: [
          {
            required: true,
            message: "Please enter the password",
            trigger: "blur",
          },
        ],
        code: [
          {
            required: true,
            message: "please enter verification code",
            trigger: "blur",
          },
        ],
      },
      isReg: false, // 注册状态
      sendText: "send",
    };
  },
  methods: {
    handleSubmit (name) {
      if (this.isReg) {
        return (this.isReg = false);
      }
      this.$refs[name].validate((valid) => {
        if (!valid) return;
        let isok = false
        login(this.dataForm)
          .then((res) => {
            if (res.data.code === 200) {
              this.$Message.success("login successful");
              window.sessionStorage.setItem("token", res.data.token);
              return getMenusList()
            } else {
              isok = true
              this.$Message.error(res.data.msg);
            }
          })
          .then((res) => {
            if (res.data.code === 200) {
              const data = res.data
              this.$router.push("/welcome");
              window.sessionStorage.setItem("menus", JSON.stringify(data.data));
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .catch((err) => {
            if (isok) return
            this.$Message.error(err)
          })
      });
    },
    handleReg (name) {
      if (!this.isReg) {
        return (this.isReg = true);
      }
      this.$refs[name].validate((valid) => {
        if (!valid) return;
        reg(this.dataForm)
          .then((res) => {
            if (res.data.code === 200) {
              this.isReg = false;
              this.$Message.success("registration success");
            } else {
              this.$Message.error(res.data.msg);
            }
          })
          .catch((err) => {
            this.$Message.error(err);
          });
      });
    },
    sendCode (name) {
      this.$refs[name].validateField("us", (valid) => {
        if (valid) return;
        getMailCode({ mail: this.dataForm.us })
          .then((res) => {
            if (res.data.code === 200) {
              this.sendText = 60;
              setInterval(() => {
                if (this.sendText > 0) this.sendText--;
              }, 1000);
              this.$Message.success("Verification code sent successfully");
            } else {
              this.$Message.error(res.data.msg);
            }
          })
          .catch((err) => {
            this.$Message.error(err);
          });
      });
    }
  },
};
</script>
<style lang="less" scoped>
#login_container {
  width: 300px;
  // min-height: 250px;
  height: auto;
  margin: auto;
  background: #ccc;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  .login_form {
    // position: absolute;
    bottom: 0;
    width: 100%;
    padding: 45px 45px 20px;
    box-sizing: border-box;
    .ivu-form-item {
      margin-right: 0;
    }
    .sendBtn {
      padding: 0px;
      position: absolute;
      right: -35px;
      top: 0;
    }
  }
}
</style>
