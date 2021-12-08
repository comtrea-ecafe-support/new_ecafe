<template>
  <Modal v-model="open" :title="title">
     <Table
      :columns="columns"
      :data="formItem.selectFoods"
      :height="tablesHeight"
      border
    ></Table>
    <span>take Meal Time</span>
     <TimePicker v-model="formItem.takeMealTime" type="time" placeholder="Select time" style="width: 168px"></TimePicker>
     <br>
     <span>is done</span>
     <!-- <Switch v-model="formItem.isDone" ></Switch> -->
     <Select v-model="formItem.isDone" style="width:200px">
        <Option  :value="2" >{{ 'reject' }}</Option>
        <Option  :value="1" >{{ 'yes' }}</Option>
         <Option  :value="0" >{{ 'unread' }}</Option>
    </Select>
    <div slot="footer" style="text-align: center;">
      <Button @click="cancel('formItem')">closure</Button>
      <Button type="primary" :loading="loading" @click="ok('formItem')">submit</Button>
    </div>
    <AddUpdate @reload="getList" ref="AddUpdate"></AddUpdate>
  </Modal>
</template>
<script>
import { orderUpdate, orderAdd } from "@/api/order";
import { imgUpload } from "@/api/upload";
import { goodsPage, goodsDel } from "@/api/goods";
import AddUpdate from "./GoodsAddUpdate";
export default {
  name: "Goods",
  components: {
    AddUpdate,
  },
  data () {
    return {
          columns: [
        {
          title: "name",
          key: "name",
        },
        {
          title: "price",
          key: "price",
        },
        {
          title: "count",
          key: "count",
        },
        {
          title: "describe",
          key: "desc",
        },
      ],
      tablesHeight: 0,
      takeMealTime:'',
      formItem: {
       takeMealTime:'',
      },
      ruleValidate: {
        name: [{ required: true, message: "Please enter the order name", trigger: "blur" }],
        price: [{ required: true, message: "Please enter the price", trigger: "blur" }],
        desc: [{ required: true, message: "Please enter a description", trigger: "blur" }],
        typeid: [
          {
            required: true,
            message: "Please enter the order name",
            trigger: "blur",
            type: "number",
          },
        ],
      },
      typeList: [
        { id: 33, name: "fenlei" },
        { id: 2, name: "Hot dishes" },
      ],
      open: false,
      title: "order modification",
      loading: false,
      imgUrl: "",
    };
  },
  methods: {
    change (status) {
                this.$Message.info('开关状态：' + status);
            },
     getList() {
      goodsPage(this.searchInfo)
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
    init (params) {
      if (params) {
        this.title = "order modification";
        this.formItem = JSON.parse(JSON.stringify(params));
      } else {
        this.title = "order add";
      }
      this.open = true;
    },
    ok (name) {
      var that= this;
       orderUpdate(this.formItem)
            .then((res) => {
              if (res.data.code === 200) {
                that.$Message.success("order modification successfully");
                that.cancel("formItem");
                that.$emit("reload");
              } else {
                that.$Message.error(res.data.msg);
              }
            })
            .catch((err) => {
              this.$Message.error(err);
            });
    },
    cancel (name) {
      this.formItem = {
        name: "",
        price: "",
        desc: "",
        typeid: "",
      };
      this.open = false;
      this.$refs[name].resetFields();
    },
    handleUpload (file) {
      if (file) {
        if (file.size > 500 * 1024) {
          this.$Message.error("Picture size is too large");
          this.$refs["addUpload"].clearFiles();
        } else {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const _base64 = reader.result;
            this.imgUrl = _base64; 
          };
          let formData = new FormData();
          formData.append("avatar", file);
          imgUpload(formData)
            .then((res) => {
              if (res.data.code === 200) {
                this.formItem.img = res.data.imgUrl;
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
  },
  mounted () { },
};
</script>
<style lang="less" scoped>
.uploadImgUrl {
  width: 50px;
  height: 50px;
}
</style>
