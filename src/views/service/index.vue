<template>
  <div>
    <el-row style="padding: 30px 10px">
      <el-table :data="serviceList" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}">
        <el-table-column prop="mid" label="ID" width="180"></el-table-column>
        <el-table-column prop="title" label="标题" width="180"></el-table-column>
        <el-table-column prop="leaverName" label="姓名" width="120"></el-table-column>
        <el-table-column prop="leaverPhone" label="手机号" width="120"></el-table-column>
        <el-table-column prop="leaverEmail" label="邮箱地址" width="180"></el-table-column>
        <el-table-column prop="leftDatetimeString" label="留言时间" width="120" sortable></el-table-column>
        <el-table-column prop="content" label="内容" width="300"></el-table-column>
        <el-table-column prop="statusString" label="状态" width="90"></el-table-column>
        <el-table-column fixed="right" label="操作" width="240">
          <template slot-scope="scope">
            <el-row :gutter="5">
              <el-col :span="10">
                <el-button
                  @click.native.prevent="handleGetServiceDetail(scope.row)"
                  size="small"
                  :disabled="false"
                >查看详情</el-button>
              </el-col>
              <el-col :span="7" v-show="scope.row.statusString=='未回复'">
                <el-button
                  @click.native.prevent="handleAppoint_(scope.row)"
                  size="small"
                  :disabled="false"
                >指派</el-button>
              </el-col>
              <el-col :span="7" v-show="scope.row.statusString=='已指派'">
                <el-button
                  @click.native.prevent="handleWithdraw_(scope.row)"
                  size="small"
                  :disabled="false"
                >撤回</el-button>
              </el-col>
              <el-col :span="7" v-show="scope.row.statusString=='已指派'||scope.row.statusString=='未回复'">
                <el-button
                  @click.native.prevent="handleConfirmReply(scope.row)"
                  size="small"
                  :disabled="false"
                >确认已回复</el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-dialog title="详情" :visible.sync="dialogServiceDetailVisible" width="70%" :close-on-click-modal="false">
      <el-table :data="serviceDetail" style="width: 100%">
        <el-table-column prop="title" label="标题" width="180"></el-table-column>
        <el-table-column prop="content" label="内容" width="360"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="指派" :visible.sync="dialogAppoint_Visible" width="70%" :close-on-click-modal="false">
      <el-select v-model="adminsList.name" clearable placeholder="请选择老师" style="width:70%" @change="showTeacher_Message($event)">
        <el-option
          v-for="item in adminsList"
          :key="item.aid"
          :label="item.name"
          :value="item.aid">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAppoint_Submit">确 定</el-button>
        <el-button @click="dialogAppoint_Visible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="撤回" :visible.sync="dialogWithdraw_Visible" width="70%" :close-on-click-modal="false">
      <span>撤回指派该生？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleWithdraw_Submit">确 定</el-button>
        <el-button @click="dialogWithdraw_Visible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="确认已回复" :visible.sync="dialogConfirmReplyVisible" width="70%" :close-on-click-modal="false">
      <span>已回复该留言？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleReply">确 定</el-button>
        <el-button @click="dialogConfirmReplyVisible = false">取 消</el-button>
      </span>
    </el-dialog> 
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
import { getServiceList } from "@/api/service";
import { getServiceDetail, getAdminsList, Reply, Appoint_, Withdraw_ } from "@/api/account";


export default {
  data() {
    return {
      serviceList: [],
      serviceDetail: [],
      adminsList: [],
      //用于指派&确认回复
      mid: '',
      assignedAid: '',
      //弹窗
      dialogServiceDetailVisible: false,
      dialogAppoint_Visible: false,
      dialogWithdraw_Visible: false,
      dialogConfirmReplyVisible: false,
      //分页
      totalCount: 0,
      pageIndex: 1,
    };
  },

  methods: {
    fetchServiceList(pageIndex) {//尽心服务留言页表
      getServiceList(pageIndex)
        .then(res => {
          console.log(res);
          this.serviceList = res.data.pageList;
          this.totalCount = res.data.totalRecord;
        })
        .catch(err => {
          console.log(err);
        });
    },

    fetchAdminsList(pageIndex) {
      getAdminsList(pageIndex)
      .then(res => {
        // console.log(res);
        this.adminsList = res.data.pageList;
      })
      .catch(err => {
        console.log(err);
      });
    },

    //尽心服务详情
    handleGetServiceDetail(row) {
      const mid = row.mid;
      console.log(mid)
      getServiceDetail(mid)
        .then(res => {
          console.log(res);
          this.serviceDetail[0] = res.data;
          this.dialogServiceDetailVisible = true;
        })
        .catch(err => {
          console.log(err);
        });
    },

    //尽心服务指派
    handleAppoint_(row){//点击"指派"弹窗，获取该行mid    
      this.dialogAppoint_Visible = true;
      this.mid = row.mid;
    },
    showTeacher_Message(e){//获取assignedAid
      // console.log(e)
      this.assignedAid = e;
    },
    handleAppoint_Submit(){//指派
      const mid = this.mid;
      const assignedAid = this.assignedAid;
      console.log(mid,assignedAid)
      Appoint_(mid, assignedAid)
        .then(res => {
          this.$message({
            type: "success",
            message: "指派成功！"
          });
          this.dialogAppoint_Visible = false;
          this.fetchServiceList(this.pageIndex);
        })
        .catch(err => {
          console.log(err);
        })
    },

    //尽心服务撤回
    handleWithdraw_(row){//点击"认领"弹窗，获取该行mid
      this.dialogWithdraw_Visible = true;
      this.mid = row.mid;
    },
    handleWithdraw_Submit(){//认领
      const mid = this.mid;
      console.log(mid)
      Withdraw_(mid)
        .then(res => {
          this.$message({
            type: "success",
            message: "撤回成功！"
          });
          this.dialogWithdraw_Visible = false;
          this.fetchServiceList(this.pageIndex);
        })
        .catch(err => {
          console.log(err);
        })
    },

    //尽心服务确认回复
    handleConfirmReply(row){//点击"确认已回复"弹窗，获取该行mid
      this.dialogConfirmReplyVisible = true;
      this.mid = row.mid;
    },
    handleReply(){//确认回复
      const mid = this.mid;
      console.log(mid)
      Reply(mid)
        .then(res => {
          console.log(res);
          this.$message({
            type: "success",
            message: "已确认回复该留言！"
          });
          this.dialogConfirmReplyVisible = false;
          this.fetchServiceList(this.pageIndex);
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 分页
    handlePageChange(page){
      this.pageIndex = page;
      console.log(this.pageIndex)
      this.fetchServiceList(this.pageIndex);
    }
  },

  created() {
    this.fetchServiceList(1);
    this.fetchAdminsList(1);
  }
};
</script>