<template>
  <div>
    <el-row style="margin-top: 20px">
      <el-col :span="2" :offset="21">
        <el-button @click="handleAddIdentity">新增</el-button>
      </el-col>
    </el-row>
    <el-row style="padding: 10px 10px">
      <el-table :data="identityList" style="width: 100%">
        <el-table-column prop="aid" label="ID" width="240"></el-table-column>
        <el-table-column prop="name" label="用户名" width="160"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="160"></el-table-column>
        <!--<el-table-column prop="password" label="密码" width="180"></el-table-column>-->
        <el-table-column prop="powerString" label="权限" width="160"></el-table-column>
        <el-table-column fixed="right" label="操作" width="240">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" size="small">维护</el-button>
            <el-popconfirm title="确定删除此数据？" @onConfirm="handleDelete(scope.row)">
              <el-button slot="reference" size="small" style="margin-left:10px">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-dialog title="新增" :visible.sync="dialogFormAddVisible" width="70%" :close-on-click-modal="false">
      <identity-form
        :identity="identity"
        :from="'add'"
        @on-success="handleSubmitIdentity"
        @on-cancel="handleCancel">
      </identity-form>
    </el-dialog>
    <el-dialog title="维护" :visible.sync="dialogFormEditVisible" width="70%" :close-on-click-modal="false">
      <identity-form
        :identity="identity"
        :from="'edit'"
        @on-success="handleChangeIdentity"
        @on-cancel="handleCancel">
      </identity-form>
    </el-dialog>
    <div style="margin: 10px 0px; display: flex; justify-content: center;">
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
import IdentityForm from "../../components/IdentityForm/index";
import {
  getIdentityList,
  addIdentity,
  editIdentity,
  deleteIdentity
} from "@/api/identity";

export default {
  components: {
    IdentityForm
  },

  data() {
    return {
      identityList: [],
      identity: {},
      dialogFormAddVisible: false,
      dialogFormEditVisible: false,
      totalCount: 0,
      pageIndex: 1
    };
  },
  methods: {
    fetchIdentityList(pageIndex) {
      getIdentityList(pageIndex)
        .then(res => {
          // res.data.pageList.map(item=>{
          // delete item.power
          // })
          // console.log(res.data);
          this.identityList = res.data.pageList;
          this.totalCount = res.data.totalRecord;
        })
        .catch(err => {
          console.log(err);
        });
    },

    handleEdit(row) {
      const obj = JSON.parse(JSON.stringify(row));
      this.identity = obj;
      this.dialogFormEditVisible = true;
    },

    handleAddIdentity() {
      this.identity = {};
      this.dialogFormAddVisible = true;
    },

    handleSubmitIdentity(result) {
      addIdentity(result)
        .then(res => {
          console.log(res)
          this.$message({
            type: "success",
            message: "新增身份成功！"
          });
          this.dialogFormAddVisible = false;
          console.log(this.pageIndex)
          this.fetchIdentityList(this.pageIndex);
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 维护
    handleChangeIdentity(result) {
      editIdentity(result)
        .then(res => {
          this.$message({
            type: "success",
            message: "修改成功"
          });
          this.dialogFormEditVisible = false;
          console.log(this.pageIndex)
          this.fetchIdentityList(this.pageIndex);
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 取消新增/取消修改
    handleCancel() {
      this.dialogFormAddVisible = false;
      this.dialogFormEditVisible = false;
    },


    // 删除
    handleDelete(row) {
      console.log(row.aid)
      const aid = row.aid;
      deleteIdentity(aid)
        .then(res => {
          console.log(res)
          this.$message({
            type: "success",
            message: "已删除！"
          });
          this.fetchIdentityList(this.pageIndex);
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 分页
    handlePageChange(page) {
      this.pageIndex = page;
      console.log(this.pageIndex);
      this.fetchIdentityList(this.pageIndex);
    }
  },
  created() {
    this.fetchIdentityList(1);
  }
};
</script>