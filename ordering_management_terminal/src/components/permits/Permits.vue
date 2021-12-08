<template>
  <Content class="goodsBox">
    <Button type="primary" style="margin-bottom: 24px;margin-right: 10px;" @click="show()"
      >Add to</Button
    >
    <Button type="warning" style="margin-bottom: 24px;margin-right: 10px;" @click="showChildren(true)"
      >Expand all</Button
    >
    <Button style="margin-bottom: 24px" @click="showChildren(false)"
      >Collapse all</Button
    >
    <Form id="searchForm" :model="formItem" :label-width="80" inline>
      <FormItem label="Authority name">
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
      row-key="id"
      border
    ></Table>

    <AddUpdate @reload="getList" ref="AddUpdate"></AddUpdate>
  </Content>
</template>
<script>
import { permitsList, permitsDel } from '@/api/permit'
import AddUpdate from './PermitsAddUpdate'
export default {
  name: 'Permits',
  components: {
    AddUpdate,
  },
  data() {
    return {
      columns: [
        {
          title: 'Serial number',
          key: 'id',
          width: 100,
          // align: 'center',
          tree: true
        },
        {
          title: 'Authority name',
          key: 'name',
        },
        {
          title: 'Permission description',
          key: 'mark',
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
                      this.show(params.row)
                    },
                  },
                },
                'edit'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'warning',
                    size: 'small',
                  },
                  style: {
                    marginRight: '5px',
                  },
                  on: {
                    click: () => {
                      this.show(params.row, 1)
                    },
                  },
                },
                'Add sub-permission'
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
        // pageNo: 1,
        // pageSize: 10,
      },
      pageSizeOpts: [1, 2, 5, 10],
      formItem: {
        key: '',
      },
      tablesHeight: 0,
    }
  },
  methods: {
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
      permitsList(this.searchInfo)
        .then((res) => {
          if (res.data.code === 200) {
            const data = res.data
            this.tableData = data.data
            // this.total = data.total
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
    show(params, level) {
      if (params) {
        this.$refs.AddUpdate.init(params, level)
      } else {
        this.$refs.AddUpdate.init()
      }
    },
    remove(_id) {
      permitsDel({ _id: _id })
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
    showChildren(isShow) {
      // const temp = this.tableData
      function recursion(temp) {
        temp.map(item => {
          item._showChildren = isShow
          if (item.children.length) {
            recursion(item.children)
          }
        })
      }
      recursion(this.tableData)
    }
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
