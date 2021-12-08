/* eslint-disable vue/no-parsing-error */
<template>
  <div id="Home">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo">Backstage management system</div>
          <Icon
            @click.native="collapsedSider"
            :class="rotateIcon"
            style="margin:0 20px;color: #fff;"
            type="md-menu"
            size="24"
          ></Icon>
          <Dropdown class="log_out" @on-click="downMenuClick">
              <Icon type="md-contact" size="30" />
              <DropdownMenu slot="list" >
                  <DropdownItem name="updatePs" >change Password</DropdownItem>
                  <DropdownItem name="logOut" >sign out</DropdownItem>
              </DropdownMenu>
          </Dropdown>
        </Menu>
      </Header>
      <Layout>
        <Sider
          hide-trigger
          ref="siderRef"
          collapsible
          :collapsed-width="78"
          :style="{ background: '#fff' }"
          v-model="isCollapsed"
        >
          <Menu
            :default-active="activeName"
            :active-name="activeName"
            theme="dark"
            width="auto"
            :open-names="['1']"
            v-for="item in menuList"
            :key="item.id"
            @on-select="onSelectMenu"
            :class="menuitemClasses"
          >
            <Submenu v-if="item.children.length" :name="item.name">
              <template slot="title">
                <Icon :type="item.icon" />{{ isCollapsed ? '' : item.name }}
              </template>
              <MenuItem
                v-for="child in item.children"
                :key="child.id"
                :name="child.path"
              >
                <Icon :type="child.icon" />
                {{ isCollapsed ? '' : child.name }}
              </MenuItem>
            </Submenu>
            <MenuItem v-else :name="item.path">
              <Icon :type="item.icon" />
              {{ isCollapsed ? '' : item.name }}
            </MenuItem>
          </Menu>
        </Sider>
        <Layout :style="{ padding: '0 12px 24px' }">
          <!-- 路由占位符 -->
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </Layout>
      </Layout>
    </Layout>
    <!-- 修改密码 -->
    <Modal
      v-model="updatePsModal"
      title="change Password"
      @on-cancel="updatePsCancel('formValidate')">
       <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="Old Password" prop="oldPs">
            <Input v-model="formValidate.oldPs" placeholder="Old Password"></Input>
        </FormItem>
        <FormItem label="new password" prop="newPs">
            <Input v-model="formValidate.newPs" placeholder="new password"></Input>
        </FormItem>
        <FormItem label="new password" prop="newPsAgain">
            <Input v-model="formValidate.newPsAgain" placeholder="Confirm the new password"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="updatePsCancel('formValidate')">Cancel</Button>
        <Button type="primary" @click="updatePsOk('formValidate')">Sure</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { usersUpdatePs } from '@/api/user'
export default {
  name: "Home",
  data() {
    return {
      menuList: [],
      activeName: "welcome",
      isCollapsed: false,
      updatePsModal: false,
      formValidate: {
        oldPs: '',
        newPs: '',
        newPsAgain: ''
      },
      ruleValidate: {
        oldPs: [
          { required: true, message: 'Please enter the old password', trigger: 'blur' }
        ],
        newPs: [
          { required: true, message: 'Please enter a new password', trigger: 'blur' }
        ],
        newPsAgain: [
          { required: true, message: 'Please confirm new password', trigger: 'blur' },
          { validator: (rule, value, callback) => {
              if (value !== this.formValidate.newPs) {
                  callback(new Error('Confirm password and new password are inconsistent'));
              } else {
                  callback();
              }
            }, trigger: 'blur' }
        ]
      },
      loading: true
    };
  },
  computed: {
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
  },
  methods: {
    getMenus() {
      const menus = window.sessionStorage.getItem('menus')
      this.menuList = JSON.parse(menus)
    },
    onSelectMenu(val) {
      if (this.$route.name === val) return;
      this.$router.push({ name: val });
      this.activeName = val;
    },
    collapsedSider() {
      this.$refs.siderRef.toggleCollapse();
    },
    downMenuClick(val) {
      if (val === 'logOut') {
        this.$router.push({ name: 'login' }, () => {
          this.$Message.success('exit successfully')
          window.sessionStorage.removeItem('token')
        })
      } else if (val === 'updatePs') {
        this.updatePsModal = true
      }
    },
    updatePsOk(name) {
      this.$refs[name].validate((valid) => {
        if (!valid) return
        usersUpdatePs(this.formValidate)
          .then((res) => {
            if (res.data.code === 200) {
              this.$Message.success('Password reset complete')
              setTimeout(() => {
                this.$router.push({ name: 'login' }, () => {
                  window.sessionStorage.removeItem('token')
                })
              }, 1000)
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .catch((err) => {
            this.$Message.error(err)
          })
      })
    },
    updatePsCancel(name) {
      this.formValidate = {
        oldPs: '',
        newPs: '',
        newPsAgain: ''
      }
      this.$refs[name].resetFields();
      this.updatePsModal = false
    }
  },
  mounted() {
    this.activeName = this.$route.name;
    this.getMenus()
  },
};
</script>
<style lang="less">
#Home {
  height: 100%;
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  .ivu-layout {
    height: 100%;
    .ivu-layout-header {
      padding: 0;
      .log_out {
        margin: 0px 20px;
        color: #fff;
        float: right;
        cursor: pointer;
        .ivu-icon {
          vertical-align: middle;
        }
      }
    }
    .ivu-layout-content {
      height: 100%;
      padding: 24px;
      background-color: #fff;
    }
    .ivu-layout-sider {
      background: #515a6e !important;
    }
  }
  .layout-logo {
    font-size: 20px;
    text-align: center;
    width: 200px;
    height: 100%;
    color: #fff;
    background: #5b6270;
    border-radius: 3px;
    float: left;
  }
  .layout-nav {
    width: 420px;
    margin: 0 auto;
    /* margin-right: 20px; */
  }
}
</style>
