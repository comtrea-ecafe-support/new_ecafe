<template>
  <div>
      <!--列表渲染-->
<ul class="cart-item-list">
    <li v-for="(item,index) in cartList" :key="index" v-if="item.checked=='1'">
        <!-- 商品图片和商品名称 -->
        <div class="cart-tab-1">
            <div class="cart-item-pic">
                <img :src="'/static/'+item.productImage" :alt="item.productName">
            </div>
            <div class="cart-item-title">
                <div class="item-name">{{item.productName}}</div>
            </div>
        </div>
        <!-- 商品单价 -->
        <div class="cart-tab-2">
            <div class="item-price">{{item.salePrice}}</div>
        </div>
        <!-- 商品数量 -->
        <div class="cart-tab-3">
            <div class="item-quantity">
                <div class="select-self">
                    <div class="select-self-area">
                        <span class="select-ipt">×{{item.productNum}}</span>
                    </div>
                </div>
                <div class="item-stock item-stock-no">In Stock</div>
            </div>
        </div>
        <!-- 商品总金额 -->
        <div class="cart-tab-4">
            <div class="item-price-total">{{(item.salePrice*item.productNum)}}</div>
        </div>
    </li>
</ul>
 
 
<!-- Price count -->
<div class="price-count-wrap">
    <div class="price-count">
      <ul>
        <li>
          <span>Item subtotal:</span> <!-- 订单总金额 -->
          <span>{{subTotal}}</span>
        </li>
        <li>
          <span>Shipping:</span> <!-- 配送费 -->
          <span>{{shipping}}</span>
        </li>
        <li>
          <span>Discount:</span> <!-- 折扣 -->
          <span>{{discount}}</span>
        </li>
        <li>
          <span>Tax:</span> <!-- 税费 -->
          <span>{{tax}}</span>
        </li>
        <li class="order-total-price">
          <span>Order total:</span> <!-- 用户支付总金额 -->
          <span>{{orderTotal}}</span>
        </li>
      </ul>
    </div>
</div>
  </div>
</template>

<script>
import axios from 'axios'
 
export default {
    data(){
      return {
        shipping: 100, // 配送费
        discount:200, // 折扣
        tax:400, // 扣税
 
        subTotal:0, // 订单总金额(是购物车选中商品的总金额)
 
        orderTotal:0, // 总金额+配送费-折扣+税费 = orderTotal用户需要支付的金额,默认为0
 
        cartList:[] // 购物车列表
      }
    },
    mounted(){
      this.init();
    },
    methods:{
      init(){
        axios.get('/users/cartList').then((response)=>{ // 订单确认列表不需要再写接口，直接用购物车列表的接口，渲染页面时选取选中的商品作为订单确认的商品
          let res= response.data;
          this.cartList = res.result;
 
          this.cartList.forEach((item)=>{ // 遍历购物车商品，获取选中商品的总金额
            if(item.checked == '1'){
              this.subTotal += item.salePrice*item.productNum;
            }
          })
 
          this.orderTotal = this.subTotal+this.shipping-this.discount+this.tax; // 获取用户最终支付的金额，(总金额+配送费-折扣+税费)
        })
      }
    }
}
</script>

<style>

</style>