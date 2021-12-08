<template>
  <Content class="goodsBox">
    <Button type="primary" style="margin-bottom: 15px;" @click="show">Add to</Button>
    <Poptip
        confirm
        title="Are you sure to delete all data?"
        @on-ok="clearAll">
        <Button type="error" style="margin-bottom: 15px;margin-left: 8px">delete all</Button>
    </Poptip>
    <Upload ref="addUpload" style="display: inline-block;" :before-upload="handleUpload" action>
      <Button style="margin-bottom: 15px;margin-left: 8px">Batch add</Button>
    </Upload>
    If you need to add coverage in batches, please delete all first
    <Form id="searchForm" :model="formItem" :label-width="80" inline>
      <FormItem label="product name">
        <Input v-model="formItem.key" placeholder="Fuzzy search" clearable />
      </FormItem>
      <FormItem :label-width="20" style="width: 370px">
        <Button type="primary" @click="search">Inquire</Button>
        <Button style="margin-left: 8px" @click="clear">Reset</Button>
        <Button style="margin-left: 8px" @click="exportExcel">Export excel</Button>
        <Button style="margin-left: 8px" @click="exportJs">Export js file</Button>
      </FormItem>
    </Form>
    <Table :columns="columns" :data="tableData" :height="tablesHeight" border></Table>
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
import { langsPage, langsDel, langsDelAll } from "@/api/langs";
import { excelUpload } from "@/api/upload";
import AddUpdate from "./LangsAddUpdate";
export default {
  name: "Goods",
  components: {
    AddUpdate,
  },
  data () {
    return {
      columns: [
        {
          title: "variable name",
          key: "key",
        },
        {
          title: "Chinese",
          key: "zh-CN",
        },
        {
          title: "Annotate Chinese",
          key: "notice",
        },
        {
          title: "English",
          key: "en-US",
        },
        {
          title: "Vietnamese",
          key: "vi-VN",
        },
        {
          title: "Thai",
          key: "th-TH",
        },
        {
          title: "Hindi",
          key: "en-IN",
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
        pageSize: 9999999,
      },
      pageSizeOpts: [10, 100, 9999999],
      formItem: {
        key: "",
      },
      tablesHeight: 0,
    };
  },
  methods: {
    setTablesHeight () {
      let aH = 0;
      let oA = document.getElementById("app");
      let oH = oA.clientHeight || oA.offsetHeight;
      let sA = document.getElementById("searchForm");
      let sH = sA.clientHeight || sA.offsetHeight;
      aH = oH - sH - 220;
      this.tablesHeight = aH;
    },
    getList () {
      langsPage(this.searchInfo)
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
    search () {
      this.searchInfo = {
        key: this.formItem.key,
        pageNo: 1,
        pageSize: this.searchInfo.pageSize,
      };
      this.getList();
    },
    exportExcel () {
      window.open(window.Glob.baseUrl.dev + '/lang/export?pageNo=' + this.searchInfo.pageNo + '&pageSize=' + this.searchInfo.pageSize + '&key=' + this.formItem.key)
    },
    exportJs () {
      window.open(window.Glob.baseUrl.dev + '/lang/export/js?pageNo=' + this.searchInfo.pageNo + '&pageSize=' + this.searchInfo.pageSize + '&key=' + this.formItem.key)
    },
    handleUpload (file) {
      console.log(file)
      if (file) {
        const tempArray = file.name.split('.')
        const len = tempArray.length
        const suffix = tempArray[len - 1]

        if (suffix != 'xlsx' && suffix != 'xls') {
          this.$Message.error("Please upload excel file");
          this.$refs["addUpload"].clearFiles();
        } else {
          let formData = new FormData();
          formData.append("avatar", file);
          excelUpload(formData)
            .then((res) => {
              if (res.data.code === 200) {
                this.search()
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
    clear () {
      this.formItem = {
        key: "",
      };
      this.searchInfo = {
        pageNo: 1,
        pageSize: 9999999,
      };
      this.getList();
    },
    clearAll () {
      langsDelAll()
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
    show (params) {
      if (params) {
        this.$refs.AddUpdate.init(params);
      } else {
        this.$refs.AddUpdate.init();
      }
    },
    remove (_id) {
      langsDel({ _id: _id })
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
    pageNoChange (current) {
      this.searchInfo.pageNo = current;
      this.getList();
    },
    pageSizeChange (val) {
      this.searchInfo.pageNo = 1;
      this.searchInfo.pageSize = val;
      this.getList();
    },
  },
  mounted () {
    this.getList();
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
