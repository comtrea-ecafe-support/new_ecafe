<template>
  <Modal v-model="open" :title="title">
    <Form
      ref="formItem"
      :model="formItem"
      :label-width="80"
      :rules="ruleValidate"
    >
      <FormItem label="Role Name" prop="roleName">
        <Input
          v-model="formItem.roleName"
          placeholder="Please enter the role name"
          clearable
        />
      </FormItem>
      <FormItem label="Role description" prop="roleDesc">
        <Input
          v-model="formItem.roleDesc"
          placeholder="Please enter a role description"
          clearable
        />
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
import { rolesAdd, rolesUpdate } from '@/api/role'
export default {
  name: 'rolesAddUpdate',
  data() {
    return {
      formItem: {
        roleName: '',
        roleDesc: '',
      },
      ruleValidate: {
        roleName: [
          { required: true, message: 'Please enter the role name', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: 'Please enter a role description', trigger: 'blur' },
        ],
      },
      open: false,
      title: 'Role addition',
      loading: false,
    }
  },
  methods: {
    init(params) {
      if (params) {
        this.title = "Role modification";
        this.formItem = JSON.parse(JSON.stringify(params));
      } else {
        this.title = "Role addition";
      }
      this.open = true
    },
    ok(name) {
      this.$refs[name].validate((valid) => {
        if (!valid) return
        const postData = JSON.parse(JSON.stringify(this.formItem))
        if (this.formItem.roleId) {
          rolesUpdate(this.formItem)
            .then((res) => {
              if (res.data.code === 200) {
                this.$Message.success('Role modified successfully')
                this.cancel('formItem')
                this.$emit('reload')
              } else {
                this.$Message.error(res.data.msg)
              }
            })
            .catch((err) => {
              this.$Message.error(err)
            })
        } else {
          rolesAdd(postData)
            .then((res) => {
              if (res.data.code === 200) {
                this.$Message.success('Role added successfully')
                this.cancel('formItem')
                this.$emit('reload')
              } else {
                this.$Message.error(res.data.msg)
              }
            })
            .catch((err) => {
              this.$Message.error(err)
            })
        }
      })
    },
    cancel(name) {
      this.formItem = {
        roleName: '',
        roleDesc: '',
      }
      this.$refs[name].resetFields()
      this.open = false
    },
  },
  mounted() {},
}
</script>
