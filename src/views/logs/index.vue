<template>
  <div>
    <el-row :gutter="20" style="margin: 10px">
      <el-col :span="7">
        <div style="display: flex; flex-direction: row;">
          <el-input v-model="searchKey" placeholder="请输入内容" size="small" clearable></el-input>
          <el-button
            type="info"
            icon="el-icon-search"
            size="small"
            style="margin-left: 10px"
            @click="handleSearch"
          >搜索</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row style="padding:10px">
      <el-table :data="logsList" style="width: 100%">
        <el-table-column fixed prop="createdDatetimeString" label="日期" width="180"></el-table-column>
        <el-table-column prop="name" label="操作人" width="180"></el-table-column>
        <el-table-column prop="whatHappened" label="操作内容" width="480"></el-table-column>
      </el-table>
    </el-row>
    <div style="margin-bottom: 10px; display: flex; justify-content: center;">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="totalCount"
        :page-size="15"
        :pager-count="11"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
  </div>
</template>  

<script>
import { getLogsList, searchLogs } from"@/api/logs"
export default {
  data() {
    return {
      logsList: [],
      searchKey: '',
      totalCount: 0,
      pageIndex: 0
    };
  },

  methods: {
    fetchlogsList(pageIndex) {
      getLogsList(pageIndex)
        .then(res => {
          console.log(res)
          this.logsList = res.data.pageList;
          this.totalCount = res.data.totalRecord;
        })
        .catch(err => {
          console.log(err);
        });
    },

    //搜索
    handleSearch(){
      console.log(this.searchKey);
      searchLogs(1, this.searchKey).then(res=>{
        // console.log(res)
        this.logsList = res.data.pageList;
        this.totalCount = res.data.totalRecord;
      }).catch( err => {
        console.log(err)
      })
    },

    //分页
    handlePageChange(page) {
      this.pageIndex = page;
      // console.log(this.pageIndex);
      if(!this.searchKey){
        this.fetchlogsList(this.pageIndex);
      }
      else{
        searchLogs(this.pageIndex, this.searchKey).then(res=>{
        // console.log(res)
          this.logsList = res.data.pageList;
          this.totalCount = res.data.totalRecord;
        }).catch( err => {
          console.log(err)
        })
      }
    }
  },

  created() {
    this.fetchlogsList(1);
  }
};
</script>