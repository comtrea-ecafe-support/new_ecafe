<template>
  <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"
>
  <van-cell v-for="(item,index) in list" :key="index" :title="item.name" >
      <span>{{'X' + item.count}}</span>
  </van-cell>
  
</van-list>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
    };
  },
  methods: {
    onLoad() {
      var that = this;
          axios.post('http://localhost:6166/payment/page',{
          
        })
        .then((res) => {
              if (res.data.code === 200) {
                that.list = res.data.data;
                that.finished = true;
              } else {
              }
            })
    },
  },
};
</script>

<style>

</style>