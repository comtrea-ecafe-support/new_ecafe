<template>
  <Content class="goodsBox">
    <Button type="primary" style="margin-bottom: 24px" @click="show"
      >Add to</Button
    >
       <Button type="warning" style="margin-bottom: 24px;margin-right: 10px;" @click="exportAll()"
      >Export all</Button
    >
    <Form id="searchForm" :model="formItem" :label-width="80" inline>
      <FormItem label="account">
        <Input v-model="formItem.key" placeholder="Fuzzy search" clearable />
      </FormItem>
      <FormItem :label-width="20">
        <Button type="primary" @click="search">Inquire</Button>
        <Button style="margin-left: 8px" @click="clear">Reset</Button>
      </FormItem>
    </Form>
    <Table
      :columns="columns"
      :data="tableData"
      :height="tablesHeight"
      border
    ></Table>
    <Page
      class="table_page_css"
      v-show="total"
      :total="total"
      :current="searchInfo.pageNo"
      :page-size="searchInfo.pageSize"
      :page-size-opts="pageSizeOpts"
      @on-change="pageNoChange"
      @on-page-size-change="pageSizeChange"
      show-sizer
      show-elevator
      show-total
    />
    <AddUpdate @reload="getList" ref="AddUpdate"></AddUpdate>
    <UsersRole @reload="getList" ref="UsersRole"></UsersRole>
  </Content>
</template>
<script>
import { usersPage, usersDel, usersUpdateState } from '@/api/user'
import AddUpdate from "./UsersAddUpdate"
import UsersRole from "./UsersRole"
export default {
  name: 'Users',
  components: {
    AddUpdate, UsersRole
  },
  data() {
    return {
      columns: [
        {
          title: 'id',
          key: '_id',
        },
        {
          title: 'account',
          key: 'us',
        },
        {
          title: 'state',
          key: 'state',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'i-switch',
                {
                  props: {
                    value: params.row.state ? true : false
                  },
                  on: {
                    'on-change': (state) => {
                      this.updateState(params.row._id, state)
                    },
                  },
                },
                'View'
              )
            ])
          },
        },
        {
          title: 'operate',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small',
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      this.$refs.UsersRole.init(params.row)
                    },
                  },
                },
                'Assigning Roles'
              ),
              h(
                'Poptip',
                {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: 'Are you sure to delete this content?',
                  },
                  on: {
                    'on-ok': () => {
                      this.remove(params.row._id)
                    },
                  },
                },
                [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'error',
                        size: 'small',
                      },
                    },
                    'delete'
                  ),
                ]
              ),
            ])
          },
        },
      ],
      tableData: [],
      total: 0,
      searchInfo: {
        pageNo: 1,
        pageSize: 5,
      },
      pageSizeOpts: [1, 2, 5, 10],
      formItem: {
        key: '',
      },
      tablesHeight: 0,
    }
  },
  methods: {
      exportAll(){
      var filename  = 'export'
      var fileType  = 'json'
      var data = JSON.stringify(this.tableData);
     let url = window.URL.createObjectURL(new Blob([data]));
  let link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.${fileType}`);
  document.body.appendChild(link);
  link.click();
    },
    setTablesHeight() {
      let aH = 0
      let oA = document.getElementById('app')
      let oH = oA.clientHeight || oA.offsetHeight
      let sA = document.getElementById('searchForm')
      let sH = sA.clientHeight || sA.offsetHeight
      aH = oH - sH - 220
      this.tablesHeight = aH
    },
    getList() {
      usersPage(this.searchInfo)
        .then((res) => {
          if (res.data.code === 200) {
            const data = res.data
            this.tableData = data.data
            this.total = data.total
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch((err) => {
          this.$Message.error(err)
        })
    },
    search() {
      this.searchInfo = {
        key: this.formItem.key,
        pageNo: 1,
        pageSize: this.searchInfo.pageSize,
      }
      this.getList()
    },
    clear() {
      this.formItem = {
        key: '',
      }
      this.searchInfo = {
        pageNo: 1,
        pageSize: 5,
      }
      this.getList()
    },
    show(params) {
      this.$refs.AddUpdate.init()
    },
    updateState(id, state) {
      usersUpdateState({ id, state })
        .then((res) => {
          if (res.data.code === 200) {
            this.$Message.success('Status modified successfully')
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch((err) => {
          this.$Message.error(err)
        })
    },
    remove(_id) {
      usersDel({ _id: _id })
        .then((res) => {
          if (res.data.code === 200) {
            this.$Message.success('successfully deleted')
            this.getList()
          } else {
            this.$Message.error(res.data.msg)
          }
        })
        .catch((err) => {
          this.$Message.error(err)
        })
    },
    pageNoChange(current) {
      this.searchInfo.pageNo = current
      this.getList()
    },
    pageSizeChange(val) {
      this.searchInfo.pageNo = 1
      this.searchInfo.pageSize = val
      this.getList()
    },
  },
  mounted() {
    this.getList()
    setTimeout(() => {
      this.setTablesHeight()
    }, 50)
    window.onresize = () => {
      this.setTablesHeight()
    }
  },
}
</script>
<style lang="less" scoped>
.goodsBox {
  .ivu-form-inline .ivu-form-item {
    width: 267px;
  }
}
</style>
