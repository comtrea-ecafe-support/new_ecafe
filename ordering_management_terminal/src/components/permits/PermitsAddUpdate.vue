<template>
  <Modal v-model="open" :title="title" @on-cancel="cancel('formItem')">
    <Form
      ref="formItem"
      :model="formItem"
      :label-width="80"
      :rules="ruleValidate"
    >
      <FormItem label="Authority name" prop="name">
        <Input
          v-model="formItem.name"
          placeholder="Please enter the permission name"
          clearable
        />
      </FormItem>
      <FormItem label="path" prop="path">
        <Input
          v-model="formItem.path"
          placeholder="Please enter the path"
          clearable
        />
      </FormItem>
      <FormItem label="Parent id" prop="fid">
        <Input
          v-model="formItem.fid"
          placeholder="Please enter the parent id"
          clearable
        />
      </FormItem>
      <FormItem label="Level" prop="level">
        <Select v-model="formItem.level">
            <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="Remark" prop="mark">
        <Input
          v-model="formItem.mark"
          placeholder="Please enter a note"
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
import { permitsAdd, permitsUpdate } from '@/api/permit'
export default {
  name: 'permitsAddUpdate',
  data() {
    return {
      formItem: {
        name: '',
        path: '',
        fid: '',
        level: 0,
        mark: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: 'Please enter the permission name', trigger: 'blur' },
        ],
        path: [
          { required: true, message: 'Please enter the path', trigger: 'blur' },
        ],
        fid: [
          { required: true, message: 'Please enter the parent id', trigger: 'change' },
        ],
      },
      open: false,
      title: 'Permission to add',
      loading: false,
      levelList: [
        { value: 0, label: 'A menu' },
        { value: 1, label: 'Secondary menu' },
        { value: 2, label: 'Operation authority' }
      ]
    }
  },
  methods: {
    init(params, level) {
      if (params) {
        if (level) {
          this.title = "Add sub-permissions";
          this.formItem.fid = params.id.toString()
          this.formItem.level = params.level + 1
        } else {
          this.title = "Permission modification";
          this.formItem = JSON.parse(JSON.stringify(params));
          this.formItem.fid = this.formItem.fid.toString()
        }
      } else {
        this.title = "Permission to add";
      }
      this.open = true
    },
    ok(name) {
      this.$refs[name].validate((valid) => {
        if (!valid) return
        const postData = JSON.parse(JSON.stringify(this.formItem))
        postData.fid = Number(postData.fid)
        if (this.formItem.id) {
          permitsUpdate(postData)
            .then((res) => {
              if (res.data.code === 200) {
                this.$Message.success('Permission modified successfully')
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
          permitsAdd(postData)
            .then((res) => {
              if (res.data.code === 200) {
                this.$Message.success('Permission added successfully')
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
        name: '',
        path: '',
        fid: '',
        level: 0,
        mark: ''
      }
      this.$refs[name].resetFields()
      this.open = false
    },
  },
  mounted() {},
}
</script>
