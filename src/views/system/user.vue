<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchParams" @keyup.native.enter="search">
      <el-form-item label="用户名">
        <el-input v-model="searchParams.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchParams.status" placeholder="用户状态">
          <el-option label="全部" value="all"></el-option>
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker v-model="searchParams.createDateTime" type="datetimerange" range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" value-format="timestamp">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="openAddForm">添加用户</el-button>
    <el-popconfirm style="margin: 0 10px" title="确定要批量删除吗？" icon="el-icon-info" icon-color="red" @onConfirm="batchDel">
      <el-button type="danger" icon="el-icon-delete" slot="reference">批量删除</el-button>
    </el-popconfirm>
    <el-button type="success" icon="el-icon-download" @click="ExportDialogFormVisible = true">导出</el-button>
    <el-button type="success" icon="el-icon-download" @click="downloadTemplate">下载模板</el-button>
    <el-upload style="display: inline-block; margin-left: 10px;" :action="excelUploadUrl" :show-file-list="false"
      :on-success="handleExcelSuccess" :before-upload="beforeExcelUpload" :headers="headers" name="excel">
      <el-button type="success" icon="el-icon-upload">导入</el-button>
    </el-upload>
    <el-table style="margin-top: 10px;" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit
      highlight-current-row @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="55">
      </el-table-column>
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="头像" width="110" align="center">
        <template slot-scope="scope">
          <el-avatar :src="scope.row.avatar_url" fit="cover"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="changeStatus(scope.row.id, scope.row.status)" :active-value=1
            :inactive-value=0>
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="getInfo(scope.row.id)"></el-button>
          <el-button style="margin-right: 10px;" icon="el-icon-s-custom" circle @click="getGrantRole(scope.row.id)"></el-button>
          <el-popconfirm title="确定要删除吗？" icon="el-icon-info" icon-color="red" @onConfirm="del(scope.row.id)">
            <el-button type="danger" icon="el-icon-delete" circle slot="reference"></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="searchParams.page" background prev-text="上一页" next-text="下一页" :page-sizes="[10, 20, 30, 40]"
      :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 表单框区域 -->
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" @close="closeForm">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="头像" :label-width="formLabelWidth" prop="avatar">
          <el-upload class="avatar-uploader" :action="uploadUrl" :show-file-list="false" :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload" :headers="headers" name="img">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" :placeholder="isAdd ? '请输入密码，不输入默认为123456' : '请输入密码，不输入密码不变'"
            autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="isAdd ? add() : edit()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 导出框区域 -->
    <el-dialog title="用户导出" :visible.sync="ExportDialogFormVisible">
      <el-form :model="exportForm" :rules="exportFormRules" ref="exportForm">
        <el-form-item label="创建时间" prop="exportDateTime">
          <el-date-picker v-model="exportForm.exportDateTime" type="datetimerange" value-format="timestamp"
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ExportDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="exportUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 授角框区域 -->
    <el-dialog title="用户授角" :visible.sync="AddRoleDialogFormVisible" @close="closeRole">
      <el-checkbox-group v-model="checkedRoleArr">
        <el-checkbox v-for="item in roleNameList" :key="item.id" :label="item.id"
        :disabled="item.status == 0 ? true : false" border>{{ item.name }}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button @click="AddRoleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getList, del, getInfo, edit, add, changeStatus, batchDel,
  exportUser, downloadTemplate, Import, grantRole, getGrantRole
} from '@/api/system/user.js'
import { getRoleNameList } from '@/api/system/role.js'
import { getToken } from '@/utils/auth'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      searchParams: {
        username: '',
        status: 'all',
        createDateTime: [],
        page: 1,
        pageSize: 10,
      },
      selectedIdArr: [],
      total: 0,
      dialogFormVisible: false,
      imageUrl: '',
      uploadUrl: process.env.VUE_APP_BASE_API + '/common/uploadImg',
      headers: {
        "X-Token": getToken(),
      },
      formTitle: "编辑用户",
      isAdd: false,
      form: {
        username: '',
        avatar: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
        ],
        avatar: [
          { required: true, message: '请上传头像', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
      },
      formLabelWidth: '120px',
      ExportDialogFormVisible: false,
      exportForm: {
        exportDateTime: []
      },
      exportFormRules: {
        exportDateTime: [
          { required: true, message: '请选择时间', trigger: 'change' }
        ]
      },
      excelUploadUrl: process.env.VUE_APP_BASE_API + '/common/uploadExcel',
      checkedUid: 0,
      AddRoleDialogFormVisible: false,
      checkedRoleArr: [],
      roleNameList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    search() {
      this.getList();
    },
    handleSelectionChange(val) {
      this.selectedIdArr = [];
      if (val.length == 0) {
        return;
      }
      for (var i = 0; i < val.length; i++) {
        this.selectedIdArr.push(val[i].id);
      }
    },
    changeStatus(id, status) {
      changeStatus({ id: id, status: status }).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        });
      })
    },
    handleSizeChange(val) {
      this.searchParams.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.searchParams.page = val;
      this.getList();
    },
    handleAvatarSuccess(res, file) {
      // console.log(file);
      if (file.response.code == 200) {
        this.form.avatar = file.response.data.img;
        this.imageUrl = URL.createObjectURL(file.raw);
      } else {
        this.$message.error(file.response.msg);
      }
    },
    beforeAvatarUpload(file) {
      console.log(file);
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isGIF = file.type === 'image/gif';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG && !isGIF) {
        this.$message.error('上传头像图片只允许 JPG,PNG,gif 格式!');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
        return false;
      }
    },
    handleExcelSuccess(res, file) {
      // console.log(file);
      if (file.response.code == 200) {
        var excelPath = file.response.data.excel;
        Import({ excelPath: excelPath }).then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          });
          this.getList();
        })
      } else {
        this.$message.error(file.response.msg);
      }
    },
    beforeExcelUpload(file) {
      // console.log(file);
      const isXLSX = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      if (!isXLSX) {
        this.$message.error('上传的文件不是xlsx的格式');
        return false;
      }
    },
    getList() {
      this.listLoading = true
      console.log(this.searchParams);
      getList(this.searchParams).then(response => {
        this.list = response.data.items
        // console.log(this.list);
        this.total = response.data.total
        this.listLoading = false
      })
    },
    del(id) {
      del({ id: id }).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        });
        // 重新获取列表
        this.getList()
      })
    },
    getInfo(id) {
      this.dialogFormVisible = true;
      this.formTitle = "编辑用户";
      this.isAdd = false;
      getInfo({ id: id }).then(response => {
        this.form.id = response.data.id;
        this.form.avatar = response.data.avatar;
        this.form.username = response.data.username;
        this.imageUrl = response.data.avatar_url;
        // this.form.password = response.data.password;
      })
    },
    edit() {
      // 校验
      var vd = false;
      this.$refs['form'].validate((valid) => {
        if (valid) vd = true;
      });
      if (!vd) return;
      edit(this.form).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        });
        this.dialogFormVisible = false;
        // 重新获取列表
        this.getList()
      })
    },
    closeForm() {
      // 重置表单内容
      this.$refs['form'].resetFields();
      // 重置头像
      this.imageUrl = "";
    },
    openAddForm() {
      this.dialogFormVisible = true;
      this.formTitle = "添加用户";
      this.isAdd = true;
    },
    add() {
      // 校验
      var vd = false;
      this.$refs['form'].validate((valid) => {
        if (valid) vd = true;
      });
      if (!vd) return;
      add(this.form).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        });
        this.dialogFormVisible = false;
        // 重新获取列表
        this.getList()
      })
    },
    batchDel() {
      if (this.selectedIdArr.length == 0) {
        this.$message({
          message: '请先勾选需要删除的数据',
          type: 'error'
        });
        return;
      }
      batchDel({ ids: this.selectedIdArr }).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        });
        // 重新获取列表
        this.getList()
      })
    },
    exportUser() {
      // 校验
      var vd = false;
      this.$refs['exportForm'].validate((valid) => {
        if (valid) vd = true;
      });
      if (!vd) return;
      exportUser(this.exportForm).then(response => {
        this.$message({
          message: '导出成功',
          type: 'success'
        });
        this.ExportDialogFormVisible = false;
      })
    },
    downloadTemplate() {
      downloadTemplate().then(response => {
        this.$message({
          message: '下载模板成功',
          type: 'success'
        });
      });
    },
    getRoleNameList() {
      getRoleNameList().then(response => {
        this.roleNameList = response.data;
      });
    },
    getGrantRole(id) {
      this.checkedUid = id;
      this.AddRoleDialogFormVisible = true;
      this.getRoleNameList();
      getGrantRole({id: id}).then(response => {
        this.checkedRoleArr = response.data;
        console.log(this.checkedRoleArr);
      });
    },
    grantRole() {
      // 判断是否选中角色
      if (this.checkedRoleArr.length == 0) {
        this.$message.error('请至少选择一个角色');
        return;
      }
      grantRole({id: this.checkedUid, roleIds: this.checkedRoleArr}).then(response => {
        this.$message({
          message: response.msg,
          type: 'success'
        });
        this.AddRoleDialogFormVisible = false;
      });
    },
    closeRole() {
      // 清空选中的角色
      this.checkedRoleArr = [];
    }
  }
}
</script>
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 64px;
  height: 64px;
  line-height: 64px;
  text-align: center;
}

.avatar {
  width: 64px;
  height: 64px;
  display: block;
}</style>
