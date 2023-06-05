<template>
    <div class="app-container">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="openAddForm">添加权限</el-button>
        <el-popconfirm style="margin-left: 10px;" title="确定要批量删除吗？" icon="el-icon-info" icon-color="red"
            @onConfirm="batchDel">
            <el-button type="danger" icon="el-icon-delete" slot="reference">批量删除</el-button>
        </el-popconfirm>
        <el-table style="margin-top: 10px;" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit
            highlight-current-row @selection-change="handleSelectionChange" row-key="id" :default-expand-all="true">
            <el-table-column type="selection" align="center" width="55">
            </el-table-column>
            <el-table-column align="center" label="序号" width="95">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column label="权限名称" align="center">
                <template slot-scope="scope">
                    {{ scope.row.name }}
                </template>
            </el-table-column>
            <el-table-column label="权限路由" align="center">
                <template slot-scope="scope">
                    {{ scope.row.path }}
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status" @change="changeStatus(scope.row.id, scope.row.status)"
                        :active-value=1 :inactive-value=0>
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
                    <el-popconfirm style="margin-left: 10px;" title="确定要删除吗？" icon="el-icon-info" icon-color="red" @onConfirm="del(scope.row.id)">
                        <el-button type="danger" icon="el-icon-delete" circle slot="reference"></el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 表单框区域 -->
        <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" @close="closeForm">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="上级模块" :label-width="formLabelWidth" prop="pid">
                    <el-select v-model="form.pid" placeholder="请选择上级模块">
                        <el-option label="无" :value="0"></el-option>
                        <el-option v-for="item in authNameList" :key="item.id" :label="item.name"
                            :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="权限名" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" placeholder="请输入权限名" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限路由" :label-width="formLabelWidth" prop="path">
                    <el-input v-model="form.path" placeholder="请输入权限路由" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="isAdd ? add() : edit()">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getList, del, getInfo, getAuthNameList, edit, add, changeStatus, batchDel } from '@/api/system/auth.js'

export default {
    data() {
        return {
            list: [],
            listLoading: true,
            dialogFormVisible: false,
            formTitle: '编辑权限',
            isAdd: false,
            formLabelWidth: '120px',
            selectedIdArr: [],
            authNameList: [],
            form: {
                pid: 0,
                name: '',
                path: ''
            },
            rules: {
                pid: [
                    { required: true, message: '请选择顶级模块', trigger: 'change' }
                ],
                name: [
                    { required: true, message: '请输入权限名', trigger: 'blur' }
                ],
                path: [
                    { required: true, message: '请输入权限路由', trigger: 'blur' }
                ]
            },
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getList().then(response => {
                this.list = response.data;
                console.log(this.list);
                this.listLoading = false
            })
        },
        changeStatus(id, status) {
            changeStatus({ id: id, status: status }).then(response => {
                this.$message({
                    message: response.msg,
                    type: 'success'
                });
                // 重新获取列表
                this.getList()
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
        handleSelectionChange(val) {
            this.selectedIdArr = [];
            if (val.length == 0) {
                return;
            }

            for (var i = 0; i < val.length; i++) {
                this.selectedIdArr.push(val[i].id);
            }
        },
        openAddForm() {
            this.dialogFormVisible = true;
            this.formTitle = "添加权限";
            this.isAdd = true;
            this.getAuthNameList();
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
        getAuthNameList() {
            getAuthNameList().then(response => {
                this.authNameList = response.data;
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
        },
        getInfo(id) {
            this.dialogFormVisible = true;
            this.formTitle = "编辑权限";
            this.isAdd = false;
            this.getAuthNameList();
            getInfo({ id: id }).then(response => {
                this.form.id = response.data.id;
                this.form.name = response.data.name;
                this.form.pid = response.data.pid;
                this.form.path = response.data.path;
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
        }
    }
}
</script>
<style scoped></style>