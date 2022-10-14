<script>
import Vue from 'vue'
import AuxVueAmisEditor from '@/aux-vue-amis-editor'

export default Vue.extend({
  name: 'ServeDev',
  components: {
    AuxVueAmisEditor,
  },
  data() {
    return {
      dictArr:  {
    "title": "药品订单-dy",
    "date": "2017-10-13"
     },
      preview: false,
      mobile: false,
      theme: 'antd',
      schema: {
  "type": "page",
  "title": "药品订单",
  "body": [
    {
      "type": "button-group-select",
      "name": "a",
      "options": [
        {
          "label": "全部",
          "value": "a"
        },
        {
          "label": "待支付",
          "value": "b"
        },
        {
          "label": "待配药",
          "value": "待配药"
        },
        {
          "label": "待发货",
          "value": "待发货"
        },
        {
          "label": "已发货",
          "value": "已发货"
        },
        {
          "label": "已完成",
          "value": "已完成"
        },
        {
          "label": "已关闭",
          "value": "已关闭"
        },
        {
          "label": "已退款",
          "value": "已退款"
        }
      ],
      "id": "u:00a064ceaa14",
      "multiple": false,
      "vertical": false,
      "tiled": true,
      "value": "a",
      "mode": "inline",
      "size": "lg",
      "onEvent": {
        "change": {
          "weight": 0,
          "actions": [
          ]
        }
      },
      "autoFill": {
      },
      "btnLevel": "default",
      "btnActiveLevel": "primary",
      "className": "b-primary"
    },
    {
      "type": "crud",
      "syncLocation": false,
      "api": "",
      "bulkActions": [
      ],
      "itemActions": [
      ],
      "features": [
        "filter"
      ],
      "filterColumnCount": 3,
      "id": "u:196a5fba3a59",
      "placeholder": "暂无数据",
      "footable": {
        "expand": "none"
      },
      "columnsTogglable": true,
      "visible": true,
      "perPageAvailable": [
        10
      ],
      "messages": {
      },
      "filter": {
        "title": "",
        "body": [
          {
            "type": "input-text",
            "name": "keywords",
            "label": "输入搜索:",
            "id": "u:3038d3b6647c",
            "clearable": true,
            "size": "sm"
          },
          {
            "type": "input-text",
            "label": "就诊人",
            "name": "patientName",
            "id": "u:0d2c2df7f1a8",
            "clearable": true,
            "showCounter": false,
            "labelRemark": {
              "icon": "fa fa-question-circle",
              "trigger": [
                "hover"
              ],
              "className": "Remark--warning",
              "placement": "top",
              "content": "就诊人姓名/手机号",
              "title": "说明"
            },
            "size": "sm"
          },
          {
            "type": "input-date-range",
            "label": "提交时间",
            "name": "date-range",
            "id": "u:eda6ab0b9645",
            "embed": false,
            "format": "X",
            "ranges": [
              "prevweek",
              "thismonth",
              "prevmonth",
              "prevquarter",
              "thisyear",
              "yesterday",
              "thisweek",
              "7daysago"
            ],
            "startPlaceholder": "开始时间",
            "endPlaceholder": "结束时间",
            "value": "",
            "size": "full"
          },
          {
            "type": "select",
            "label": "支付方式",
            "name": "select",
            "options": [
              {
                "label": "微信支付",
                "value": "A"
              },
              {
                "label": "支付宝支付",
                "value": "B"
              },
              {
                "label": "医保个账支付",
                "value": "医保个账支付"
              },
              {
                "label": "线下支付",
                "value": "线下支付"
              },
              {
                "label": "医保统筹支付",
                "value": "医保统筹支付"
              },
              {
                "label": "渠道结算",
                "value": "渠道结算"
              }
            ],
            "id": "u:a9c6e42f8edc",
            "multiple": false,
            "clearable": true,
            "searchable": true,
            "size": "sm"
          },
          {
            "type": "select",
            "label": "订单状态",
            "name": "select",
            "options": [
              {
                "label": "微信支付",
                "value": "A"
              },
              {
                "label": "支付宝支付",
                "value": "B"
              },
              {
                "label": "医保个账支付",
                "value": "医保个账支付"
              },
              {
                "label": "线下支付",
                "value": "线下支付"
              },
              {
                "label": "医保统筹支付",
                "value": "医保统筹支付"
              },
              {
                "label": "渠道结算",
                "value": "渠道结算"
              }
            ],
            "id": "u:29a52307c30a",
            "multiple": false,
            "clearable": true,
            "searchable": true,
            "size": "sm",
            "className": ""
          },
          {
            "type": "select",
            "label": "订单类型",
            "name": "select",
            "options": [
              {
                "label": "微信支付",
                "value": "A"
              },
              {
                "label": "支付宝支付",
                "value": "B"
              },
              {
                "label": "医保个账支付",
                "value": "医保个账支付"
              },
              {
                "label": "线下支付",
                "value": "线下支付"
              },
              {
                "label": "医保统筹支付",
                "value": "医保统筹支付"
              },
              {
                "label": "渠道结算",
                "value": "渠道结算"
              }
            ],
            "id": "u:fadbf763a48b",
            "multiple": false,
            "clearable": true,
            "searchable": true,
            "size": "sm"
          },
          {
            "type": "input-text",
            "label": "处方医生",
            "name": "patientName",
            "id": "u:9a83afc10785",
            "clearable": true,
            "showCounter": false,
            "labelRemark": {
              "icon": "fa fa-question-circle",
              "trigger": [
                "hover"
              ],
              "className": "Remark--warning",
              "placement": "top",
              "content": "就诊人姓名/手机号",
              "title": "说明"
            },
            "size": "sm"
          },
          {
            "type": "select",
            "label": "取货方式",
            "name": "select",
            "id": "u:1cbdb6a344fc",
            "clearable": true,
            "size": "sm",
            "options": [
              {
                "label": "微信支付",
                "value": "A"
              },
              {
                "label": "支付宝支付",
                "value": "B"
              },
              {
                "label": "医保个账支付",
                "value": "医保个账支付"
              },
              {
                "label": "线下支付",
                "value": "线下支付"
              },
              {
                "label": "医保统筹支付",
                "value": "医保统筹支付"
              },
              {
                "label": "渠道结算",
                "value": "渠道结算"
              }
            ],
            "multiple": false,
            "searchable": true
          },
          {
            "type": "select",
            "label": "订单渠道",
            "name": "select",
            "id": "u:1cbdb6a344fc",
            "clearable": true,
            "size": "sm",
            "options": [
              {
                "label": "微信支付",
                "value": "A"
              },
              {
                "label": "支付宝支付",
                "value": "B"
              },
              {
                "label": "医保个账支付",
                "value": "医保个账支付"
              },
              {
                "label": "线下支付",
                "value": "线下支付"
              },
              {
                "label": "医保统筹支付",
                "value": "医保统筹支付"
              },
              {
                "label": "渠道结算",
                "value": "渠道结算"
              }
            ],
            "multiple": false,
            "searchable": true
          },
          {
            "type": "select",
            "label": "渠道应用",
            "name": "select",
            "id": "u:1cbdb6a344fc",
            "clearable": true,
            "size": "sm",
            "options": [
              {
                "label": "微信支付",
                "value": "A"
              },
              {
                "label": "支付宝支付",
                "value": "B"
              },
              {
                "label": "医保个账支付",
                "value": "医保个账支付"
              },
              {
                "label": "线下支付",
                "value": "线下支付"
              },
              {
                "label": "医保统筹支付",
                "value": "医保统筹支付"
              },
              {
                "label": "渠道结算",
                "value": "渠道结算"
              }
            ],
            "multiple": false,
            "searchable": true
          },
          {
            "type": "select",
            "label": "流量入口",
            "name": "select",
            "id": "u:1cbdb6a344fc",
            "clearable": true,
            "size": "sm",
            "options": [
              {
                "label": "微信支付",
                "value": "A"
              },
              {
                "label": "支付宝支付",
                "value": "B"
              },
              {
                "label": "医保个账支付",
                "value": "医保个账支付"
              },
              {
                "label": "线下支付",
                "value": "线下支付"
              },
              {
                "label": "医保统筹支付",
                "value": "医保统筹支付"
              },
              {
                "label": "渠道结算",
                "value": "渠道结算"
              }
            ],
            "multiple": false,
            "searchable": true
          },
          {
            "type": "select",
            "label": "订单费别",
            "name": "select",
            "id": "u:1cbdb6a344fc",
            "clearable": true,
            "size": "sm",
            "options": [
              {
                "label": "微信支付",
                "value": "A"
              },
              {
                "label": "支付宝支付",
                "value": "B"
              },
              {
                "label": "医保个账支付",
                "value": "医保个账支付"
              },
              {
                "label": "线下支付",
                "value": "线下支付"
              },
              {
                "label": "医保统筹支付",
                "value": "医保统筹支付"
              },
              {
                "label": "渠道结算",
                "value": "渠道结算"
              }
            ],
            "multiple": false,
            "searchable": true
          }
        ],
        "id": "u:727bd01a9cf4",
        "autoFocus": true,
        "submitOnChange": false,
        "resetAfterSubmit": true,
        "mode": "inline",
        "className": "m-t-lg",
        "persistData": true,
        "rules": [
        ]
      },
      "filterTogglable": false,
      "mode": "table",
      "columns": [
        {
          "name": "orderNo",
          "label": "订单编号",
          "type": "text",
          "id": "u:3c3d453669ae"
        },
        {
          "name": "patientName",
          "label": "就诊人",
          "type": "text",
          "id": "u:d9603abc45b2",
          "placeholder": "-",
          "sortable": true
        },
        {
          "type": "text",
          "label": "客户",
          "name": "username",
          "id": "u:8d416c7cb4fe"
        },
        {
          "type": "text",
          "name": "mobile",
          "id": "u:fe43c8449fee",
          "label": "手机号",
          "placeholder": "-",
          "sortable": true
        },
        {
          "type": "text",
          "label": "订单类型",
          "name": "ordType",
          "id": "u:36a58fa7715e"
        },
        {
          "type": "text",
          "label": "优惠金额",
          "name": "discountAmount",
          "id": "u:4c4a817e84e3"
        },
        {
          "type": "date",
          "label": "支付时间",
          "name": "payTime",
          "id": "u:31bec77d422b",
          "placeholder": "-",
          "sortable": true
        },
        {
          "type": "text",
          "label": "订单来源",
          "name": "sourceFrom",
          "id": "u:0ab1d8587cc0"
        },
        {
          "type": "operation",
          "label": "操作",
          "id": "u:c08089e049b7",
          "buttons": [
          ]
        }
      ]
    }
  ],
  "id": "u:260f4d36fc32",
  "messages": {
  },
  "pullRefresh": {
  },
  "regions": [
    "body",
    "toolbar",
    "header"
  ],
  "style": {
    "marginLeft": "120",
    "borderTopLeftRadius": 0,
    "borderTopRightRadius": 0,
    "borderBottomLeftRadius": 0,
    "borderBottomRightRadius": 0,
    "backgroundColor": "rgba(255, 255, 255, 1)"
  },
  "onEvent": {
  },
  "initApi": {
    "method": "get",
    "url": "/api/order/list",
    "data": {
      "&": "$$"
    },
    "dataType": "form",
    "replaceData": false,
    "responseData": {
      "&": "$$"
    }
  },
  "interval": 3000,
  "silentPolling": true
},
    }
  },
  mounted() {
    this.$nextTick((e) => {
      // console.log(this.$refs) 
      // this.$refs.amisEditor.onChange(this.schema)
    })
  },
})
</script>

<template>
  <div id="app">
    <aux-vue-amis-editor :schema="schema"  :amis-data="dictArr" :is-debug="true" :is-preview="preview" ref="amisEditor" :is-tools="false" :is-phone="false" :is-design-mode="true" />
  </div>
</template>
