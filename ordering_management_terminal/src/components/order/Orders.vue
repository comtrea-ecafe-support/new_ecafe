<template>
  <Content class="goodsBox">
    <!-- <Button type="primary" style="margin-bottom: 24px" @click="show()"
      >Add to</Button
    > -->
    <Button type="warning" style="margin-bottom: 24px;margin-right: 10px;" @click="exportAll()"
      >Export all</Button
    >
    <Form id="searchForm" :model="formItem" :label-width="80" inline>
      <FormItem label="order name">
        <Input v-model="formItem.key" placeholder="Fuzzy search" clearable />
      </FormItem>
      <FormItem label="Classification">
        <Select v-model="formItem.typeid" clearable placeholder="please choose"> 
          <Option v-for="item in typeList" :key="item.roleId" :value="item.roleId">{{
            item.roleDesc
          }}</Option>
        </Select>
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
  </Content>
</template>
<script>
import { orderPage, orderDel ,orderExport} from "@/api/order";
import {rolesPage} from "@/api/role";
import AddUpdate from "./AddUpdate";
import axios from 'axios';
export default {
  name: "Goods",
  components: {
    AddUpdate,
  },
  data() {
    return {
      columns: [
         {
          title: "order number",
          key: "_id",
        },
        {
          title: "username",
          key: "username",
        },
         {
          title: "createTime",
          key: "createTime",
        },
        {
          title: "isDone",
          key: "isDone",
          render(h,row){
            var result = '';
            switch (row.row.isDone) {
              case 1:
                result = 'yes';
                break;
             case 2:
                 result = 'reject';
                break;
                 case 0:
                result = 'unread';
                break;
              default:
                break;
            }
            return h('div',result) 
          }
        },
          {
          title: "pick up time",
          key: "takeMealTime",
        },
         {
          title: "patient",
          key: "patient",
            render(h,row){
            return h('div',row.row.patient ?row.row.patient :'none') 
          }
        },
        {
          title: "operate",
          key: "action",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.show(params.row);
                    },
                  },
                },
                "edit"
              ),
              h(
                "Poptip",
                {
                  props: {
                    confirm: true,
                    transfer: true,
                    title: "Are you sure to delete this content?",
                  },
                  on: {
                    "on-ok": () => {
                      this.remove(params.row._id);
                    },
                  },
                },
                [
                  h(
                    "Button",
                    {
                      props: {
                        type: "error",
                        size: "small",
                      },
                    },
                    "delete"
                  ),
                ]
              ),
            ]);
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
        key: "",
        typeid: "",
      },
      typeList: [
       
      ],
      tablesHeight: 0,
    };
  },
  methods: {
    exportAll(){
      orderExport().then((res)=>{
        var data = res.filepath;
         var filename  = 'export'
      var fileType  = 'csv'
  let url = res.data.filepath;
  let link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${filename}.${fileType}`);
  document.body.appendChild(link);
  link.click();
      })
     
    },
    setTablesHeight() {
      let aH = 0;
      let oA = document.getElementById("app");
      let oH = oA.clientHeight || oA.offsetHeight;
      let sA = document.getElementById("searchForm");
      let sH = sA.clientHeight || sA.offsetHeight;
      aH = oH - sH - 220;
      this.tablesHeight = aH;
    },
    getList() {
      orderPage(this.searchInfo)
        .then((res) => {
          if (res.data.code === 200) {
            const data = res.data;
            this.tableData = data.data;
            this.total = data.total;
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch((err) => {
          this.$Message.error(err);
        });
    },
    search() {
      this.searchInfo = {
        key: this.formItem.key,
        typeid: this.formItem.typeid,
        pageNo: 1,
        pageSize: this.searchInfo.pageSize,
      };
      this.getList();
    },
    clear() {
      this.formItem = {
        key: "",
        typeid: "",
      };
      this.searchInfo = {
        pageNo: 1,
        pageSize: 5,
      };
      this.getList();
    },
    show(params) {
      if (params) {
        this.$refs.AddUpdate.init(params);
      } else {
        this.$refs.AddUpdate.init();
      }
    },
    remove(_id) { 
      orderDel({ _id: _id })
        .then((res) => {
          if (res.data.code === 200) {
            this.$Message.success("successfully deleted");
            this.getList();
          } else {
            this.$Message.error(res.data.msg);
          }
        })
        .catch((err) => {
          this.$Message.error(err);
        });
    },
    pageNoChange(current) {
      this.searchInfo.pageNo = current;
      this.getList();
    },
    pageSizeChange(val) {
      this.searchInfo.pageNo = 1;
      this.searchInfo.pageSize = val;
      this.getList();
    },
  },
  mounted() {
    this.getList();
    rolesPage().then((data)=>{
      this.typeList = data.data.data
    })
    setTimeout(() => {
      this.setTablesHeight();
    }, 50);
    window.onresize = () => {
      this.setTablesHeight();
    };
  },
};
</script>
<style lang="less" scoped>
.goodsBox {
  .ivu-form-inline .ivu-form-item {
    width: 267px;
  }
}
</style>
