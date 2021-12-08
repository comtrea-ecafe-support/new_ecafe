<template>
  <Modal v-model="open" :title="title">
    <Form
      ref="formItem"
      :model="formItem"
      :label-width="100"
      :rules="ruleValidate"
    >
      <FormItem label="Current user">
        {{ formItem.us }}
      </FormItem>
      <FormItem label="Role" prop="roleId">
        <Select v-model="formItem.roleId" style="width:200px">
          <Option
            v-for="item in roleList"
            :value="item.roleId"
            :key="item.roleId"
            >{{ item.roleName }}</Option
          >
        </Select>
      </FormItem>
    </Form>
    <div slot="footer" style="text-align: center;">
      <Button @click="cancel('formItem')">closure</Button>
      <Button type="primary" :loading="loading" @click="ok('formItem')"
        >submit</Button
      >
    </div>
  </Modal>
</template>
<script>
import { usersAdd, usersUpdateRole } from '@/api/user'
import { rolesPage } from '@/api/role'
export default {
  name: 'UsersAddUpdate',
  data() {
    return {
      formItem: {
        us: '',
        id: '',
        roleId: '',
      },
      ruleValidate: {
        roleId: [
          { required: true, message: 'please choose Role', trigger: 'change', type: 'number' },
        ],
      },
      roleList: [

      ],
      open: false,
      title: 'Assigning Roles',
      loading: false,
    }
  },
  methods: {
    init(params) {
      console.log('params', params)
      this.formItem = params
      this.title = 'Assigning Roles'
      this.open = true
    },
    ok(name) {
      this.$refs[name].validate((valid) => {
        if (!valid) return

        usersUpdateRole(this.formItem)
          .then((res) => {
            if (res.data.code === 200) {
              this.$Message.success('Product added successfully')
              this.cancel('formItem')
              this.$emit('reload')
            } else {
              this.$Message.error(res.data.msg)
            }
          })
          .catch((err) => {
            this.$Message.error(err)
          })
      })
    },
    cancel(name) {
      this.formItem = {
        us: '',
        id: '',
        roleId: ''
      }
      this.$refs[name].resetFields()
      this.open = false
    },
    getRolesList() {
      rolesPage()
        .then((res) => {
          if (res.data.code === 200) {
            const data = res.data
            this.roleList = data.data
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch((err) => {
          this.$Message.error(err)
        })
    },
  },
  created() {
    this.getRolesList()
  }
}
</script>
