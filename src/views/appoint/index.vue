<template>
  <div>
    <el-row style="padding: 30px 10px">
      <el-table :data="appointList" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}">
        <el-table-column prop="rid" label="ID" width="180"></el-table-column>
        <el-table-column prop="bookerName" label="姓名" width="120"></el-table-column>
        <el-table-column prop="bookerPhone" label="手机号" width="120"></el-table-column>
        <el-table-column prop="bookerRoleString" label="身份" width="120"></el-table-column>
        <el-table-column prop="bookerGrade" label="年级" width="120"></el-table-column>
        <el-table-column prop="bookerGenderString" label="性别" width="120"></el-table-column>
        <el-table-column prop="solutionString" label="形式" width="120"></el-table-column>
        <el-table-column prop="topic" label="咨询主题" width="120"></el-table-column>
        <el-table-column prop="statusString" label="状态" width="120"></el-table-column>
        <el-table-column prop="solverName" label="对接老师" width="120"></el-table-column>
        <el-table-column prop="solvedDatetimeString" label="时间" width="180" sortable></el-table-column>
        <el-table-column fixed="right" label="操作" width="240">
          <template slot-scope="scope">
            <el-row :gutter="5">
              <el-col :span="10">
                <el-button
                  @click.native.prevent="handleGetAppointDetail(scope.row)"
                  size="small"
                  :disabled="false"
                >查看详情</el-button>
              </el-col>
              <el-col :span="7" v-show="scope.row.statusString=='待指派'">
                <el-button
                  @click.native.prevent="handleAppoint(scope.row)"
                  size="small"
                  :disabled="false"
                >指派</el-button>
              </el-col>
              <el-col :span="7" v-show="scope.row.statusString =='待指派'">
                <el-button
                  @click.native.prevent="handleClaim(scope.row)"
                  size="small"
                  :disabled="false"
                >认领</el-button>
              </el-col>
              <el-col :span="7" v-show="scope.row.statusString =='待确认'">
                <el-button
                  @click.native.prevent="handleWithdraw(scope.row)"
                  size="small"
                  :disabled="false"
                >撤回</el-button>
              </el-col>
              <el-col :span="7" v-show="scope.row.statusString =='待确认'&& $store.getters.name == scope.row.solverName">
                <el-button
                  @click.native.prevent="handleAllocateTime(scope.row)"
                  size="small"
                  :disabled="false"
                >分配时间</el-button>
              </el-col>
              <el-col :span="14" v-show="scope.row.statusString=='待开展'">
                <el-button
                  @click.native.prevent="handleFinish(scope.row)"
                  size="small"
                  :disabled="false"
                >完成</el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-dialog title="详情" :visible.sync="dialogAppointDetailVisible" width="70%" :close-on-click-modal="false">
      <el-table :data="appointDetail" style="width: 100%">
        <el-table-column prop="topic" label="咨询主题" width="120"></el-table-column>
        <el-table-column prop="situationDesc" label="主题描述" width="360"></el-table-column>
        <el-table-column prop="reservedDatetimes" label="有空时段" width="120"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="指派" :visible.sync="dialogAppointVisible" width="70%" :close-on-click-modal="false">
      <el-select v-model="adminsList.name" clearable placeholder="请选择老师" style="width:70%" @change="showTeacherMessage($event)">
        <el-option
          v-for="item in adminsList"
          :key="item.aid"
          :label="item.name"
          :value="item.aid">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAppointSubmit">确 定</el-button>
        <el-button @click="dialogAppointVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="认领" :visible.sync="dialogClaimVisible" width="70%" :close-on-click-modal="false">
      <span>认领该生？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClaimSubmit">确 定</el-button>
        <el-button @click="dialogClaimVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="撤回" :visible.sync="dialogWithdrawVisible" width="70%" :close-on-click-modal="false">
      <span>撤回指派/认领该生？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleWithdrawSubmit">确 定</el-button>
        <el-button @click="dialogWithdrawVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="分配时间" :visible.sync="dialogAllocateTimeVisible" width="70%" :close-on-click-modal="false">
      <div style=" display: flex; flex-direction: column">
        <span style="padding: 0px 0px 10px; font-size: 15px">时间描述</span>
        <span style="padding: 15px 0px; color: #A9A9A9">{{ timeDes }}</span>
        <span style="padding: 10px 0px 25px; font-size: 15px">分配时间</span>
        <el-row>
          <el-col :span="8">
            <el-date-picker
              v-model="date"
              type="date"
              placeholder="请选择日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              @change="showDateMessage($event)">
            </el-date-picker>
          </el-col>  
          <el-col :span="16">
            <el-time-picker
              v-model="time"
              placeholder="请选择开始时间"
              value-format="HH:mm"
              @change="showTimeMessage($event)">
            </el-time-picker>
          </el-col>  
        </el-row>  
        <span style="padding: 25px 0px; font-size: 15px">分配地点</span>
        <el-row>
          <el-col :span="7">
          <el-input
            placeholder="请输入地点"
            v-model="solvedplace"
            clearable>
          </el-input>
          </el-col>
          <el-col :span="12" :offset="18">
            <el-button type="primary" @click="handleAllocateTimeSubmit">确 定</el-button>
            <el-button @click="dialogAllocateTimeVisible = false">取 消</el-button>
          </el-col> 
        </el-row> 
      </div>
    </el-dialog>
    <el-dialog title="完成" :visible.sync="dialogFinishVisible" width="70%" :close-on-click-modal="false">
      <span>已完成该预约？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleFinishSubmit">确 定</el-button>
        <el-button @click="dialogFinishVisible = false">取 消</el-button>
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
import { getAppointDetail, getAdminsList, Appoint, Claim, Withdraw, Confirm, FinishReserve } from "@/api/account";
import { getAppointList } from "@/api/appoint";

export default {
  data() {
    return {
      appointList: [],
      adminsList: [],
      appointDetail: [],
      //用于指派&确认&分配时间
      rid: '',
      assignedAid: '',
      timeDes: '',
      date: '',
      time: '',
      solvedplace: '',
      //弹窗
      dialogAppointVisible: false,
      dialogClaimVisible: false,
      dialogWithdrawVisible: false,
      dialogAllocateTimeVisible: false,
      dialogFinishVisible: false,
      dialogAppointDetailVisible: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() // 选当前时间之后的时间
        }
      },
      //分页
      totalCount: 0,
      pageIndex: 1
    };
  },

  methods: {
    fetchAppointList(pageIndex) {
      console.log('测试存储信息')
      console.log(this.$store.getters.name)
      getAppointList(pageIndex)
        .then(res => {
          console.log(res);
          console.log(this.$store.getters.roles)
          this.appointList = res.data.pageList;
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

    //知心预约详情
    handleGetAppointDetail(row) {
      const rid = row.rid;
      console.log(rid)
      getAppointDetail(rid)
        .then(res => {
          console.log(res.data);
          this.appointDetail[0] = res.data;
          this.dialogAppointDetailVisible = true;
        })
        .catch(err => {
          console.log(err);
        });
    },

    //知心预约指派
    handleAppoint(row){//点击"指派"弹窗，获取该行rid    
      this.dialogAppointVisible = true;
      this.rid = row.rid;
    },
    showTeacherMessage(e){//获取assignedAid
      // console.log(e)
      this.assignedAid = e;
    },
    handleAppointSubmit(){//指派
      const rid = this.rid;
      const assignedAid = this.assignedAid;
      console.log(rid,assignedAid)
      Appoint(rid, assignedAid)
        .then(res => {
          this.$message({
            type: "success",
            message: "指派成功！"
          });
          this.dialogAppointVisible = false;
          this.fetchAppointList(this.pageIndex);
        })
        .catch(err => {
          console.log(err);
        })
    },

    //知心预约认领
    handleClaim(row){//点击"认领"弹窗，获取该行rid
      this.dialogClaimVisible = true;
      this.rid = row.rid;
    },
    handleClaimSubmit(){//认领
      const rid = this.rid;
      console.log(rid)
      Claim(rid)
        .then(res => {
          console.log(res)
          this.$message({
            type: "success",
            message: "认领成功！"
          });
          this.dialogClaimVisible = false;
          this.fetchAppointList(this.pageIndex);
        })
        .catch(err => {
          console.log(err);
        })
    },

    //知心预约撤回
    handleWithdraw(row){//点击"认领"弹窗，获取该行rid
      console.log(row)
      this.dialogWithdrawVisible = true;
      this.rid = row.rid;
    },
    handleWithdrawSubmit(){//认领
      const rid = this.rid;
      console.log(rid)
      Withdraw(rid)
        .then(res => {
          this.$message({
            type: "success",
            message: "撤回成功！"
          });
          this.dialogWithdrawVisible = false;
          this.fetchAppointList(this.pageIndex);
        })
        .catch(err => {
          console.log(err);
        })
    },

    //知心预约分配时间
    handleAllocateTime(row){//点击"分配时间"弹窗，获取该行rid
      this.rid = row.rid;
      const rid = this.rid;
      this.dialogAllocateTimeVisible = true;
      getAppointDetail(rid)//获取时间描述
        .then(res => {
          console.log(res.data);
          this.timeDes = res.data.reservedDatetimes;
        })
        .catch(err => {
          console.log(err);
        });
    },
    showDateMessage(e){//获取日期
      this.date = e;
      console.log(this.date)
    },
    showTimeMessage(e){//获取时间
      this.time = e;
      console.log(this.time)
    },
    handleAllocateTimeSubmit(){//分配时间
      const rid = this.rid;
      console.log(rid)
      // const solvedDatetime = parseTime(this.date);
      const solvedDatetime = this.date + ' '+ this.time;
      const solvedPlace = this.solvedplace;
      console.log(solvedDatetime)
      Confirm(rid, solvedDatetime, solvedPlace)
        .then(res => {
          this.$message({
            type: "success",
            message: "分配时间成功！"
          });
          this.dialogAllocateTimeVisible = false;
          this.fetchAppointList(this.pageIndex);
        })
        .catch(err => {
          console.log(err);
        })
    },

    //知心预约完成预约
    handleFinish(row){
      this.rid = row.rid;
      this.dialogFinishVisible = true;
    },
    handleFinishSubmit(){
      const rid = this.rid;
      console.log(rid)
      FinishReserve(rid)
        .then(res => {
          console.log(res.data);
          this.$message({
            type: "success",
            message: "已确认完成！"
          });
          this.dialogFinishVisible = false;
          this.fetchAppointList(this.pageIndex);
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 分页
    handlePageChange(page){
      this.pageIndex = page;
      console.log(this.pageIndex)
      this.fetchAppointList(this.pageIndex);
    }
  },

  created() {
    this.fetchAppointList(1);
    this.fetchAdminsList(1);
  }
};
</script>