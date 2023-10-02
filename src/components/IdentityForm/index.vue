<template>
  <div>
    <el-form
      ref="identityForm"
      :model="identity"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
      style="margin-top:20px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="identity.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="identity.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
      <!--
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input v-model="identity.password"  placeholder="请输入密码"></el-input>
          </el-form-item>
        </el-col>
        -->
        <el-col :span="12">
          <el-form-item label="权限" prop="powerString">
            <el-select v-model="identity.powerString" placeholder="请选择权限" clearable>
              <el-option label="普通成员" value="普通成员"></el-option>
              <el-option label="管理员" value="管理员"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-col :span="24" :offset="18" v-if="from === 'add'">
          <el-button type="primary" @click="onSubmit('identityForm')" size="small">确认</el-button>
          <el-button @click="onCancel('identityForm')" size="small">取消</el-button>
        </el-col>
        <el-col :span="24" :offset="18" v-if="from === 'edit'">
          <el-button type="primary" @click="onSubmit('identityForm')" size="small">修改</el-button>
          <el-button @click="onCancel('identityForm')" size="small">取消</el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "IdentityForm",
  props: {
    identity: {
      type: Object,
      value: {}
    },
    from: {
      type: String,
      value: "add"
    }
  },
  data() {
    return {
      rules: {
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "手机号不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        powerString: [
          { required: true, message: "权限不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const result = JSON.parse(JSON.stringify(this.identity));
          this.$emit("on-success", result);
        } else {
          this.$message({
            type: "warning",
            message: "请将信息填写完整!"
          });
          console.log("error submit!!");
          return false;
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$emit("on-cancel");
    },

    onCancel(formName) {
      this.$refs[formName].resetFields();
      this.$emit("on-cancel");
    }
  }
};
</script>