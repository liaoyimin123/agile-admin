<template>
    <div class="app-container">
        <el-form :inline="true" :model="searchParams" @keyup.native.enter="search">
            <el-form-item label="角色名">
                <el-input v-model="searchParams.name" placeholder="请输入角色名"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="searchParams.status" placeholder="角色状态">
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
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="openAddForm">添加角色</el-button>
        <el-popconfirm style="margin-left: 10px;" title="确定要批量删除吗？" icon="el-icon-info" icon-color="red"
            @onConfirm="batchDel">
            <el-button type="danger" icon="el-icon-delete" slot="reference">批量删除</el-button>
        </el-popconfirm>
        <el-table style="margin-top: 10px;" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit
            highlight-current-row @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="55">
            </el-table-column>
            <el-table-column align="center" label="序号" width="95">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column label="角色名" align="center">
                <template slot-scope="scope">
                    {{ scope.row.name }}
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
                    <el-button style="margin-right: 10px;" icon="el-icon-lock" circle
                        @click="getGrantAuth(scope.row.id)"></el-button>
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
                <el-form-item label="角色名" :label-width="formLabelWidth" prop="name">
                    <el-input v-model="form.name" placeholder="请输入角色名" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="isAdd ? add() : edit()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 授权框区域 -->
        <el-dialog title="角色授权" :visible.sync="AuthDialogFormVisible" @close="closeAuth">
            <el-tree :data="authList" :props="defaultProps" @check-change="authChange" show-checkbox node-key="id" :default-expanded-keys="defaultExpandedKeys"
                :default-checked-keys="defaultCheckedKeys" ref="tree">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="AuthDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="grantAuth">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
  
<script>
import { getList, del, getInfo, edit, add, changeStatus, batchDel, getGrantAuth, grantAuth } from '@/api/system/role.js'
import { getAuthList } from '@/api/system/auth.js'

export default {
    data() {
        return {
            list: null,
            listLoading: true,
            searchParams: {
                name: '',
                status: 'all',
                createDateTime: [],
                page: 1,
                pageSize: 10,
            },
            selectedIdArr: [],
            total: 0,
            dialogFormVisible: false,
            formTitle: "编辑角色",
            isAdd: false,
            form: {
                name: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入角色名', trigger: 'blur' }
                ]
            },
            formLabelWidth: '120px',
            defaultProps: {
                children: 'children',
                label: 'name',
            },
            AuthDialogFormVisible: false,
            checkrid: 0,
            authList: [],
            checkedAuthIds: [],
            defaultCheckedKeys: [],
            defaultExpandedKeys: [5, 8]
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
        getList() {
            this.listLoading = true
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
            this.formTitle = "编辑角色";
            this.isAdd = false;
            getInfo({ id: id }).then(response => {
                this.form.id = response.data.id;
                this.form.name = response.data.name;
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
        openAddForm() {
            this.dialogFormVisible = true;
            this.formTitle = "添加角色";
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
        authChange(data, checked, indeterminate) {
            //获取所有选中的节点 start
            let res = this.$refs['tree'].getCheckedNodes()
            this.checkedAuthIds = [];
            res.forEach((item) => {
                this.checkedAuthIds.push(item.id)
            })
        },
        closeAuth() {
            // 清空选中权限(选中样式)
            this.defaultCheckedKeys = [];
            // 清空回显选中权限(真实选中值)
            this.checkedAuthIds = [];
        },
        getGrantAuth(id) {
            this.AuthDialogFormVisible = true;
            this.checkrid = id;
            this.getAuthList();
            getGrantAuth({id: id}).then(response => {
                this.defaultCheckedKeys = response.data;
                this.checkedAuthIds = response.data;
                // console.log(this.defaultCheckedKeys);
            })
        },
        getAuthList() {
            getAuthList().then(response => {
                this.authList = response.data;
                // console.log(this.authList);
                // 选出顶级模块作为默认展开
                this.defaultExpandedKeys = this.authList.map(v => {return v.id})
            })
        },
        grantAuth() {
            grantAuth({id: this.checkrid, authIds: this.checkedAuthIds}).then(response => {
                this.$message({
                    message: response.msg,
                    type: 'success'
                });
                this.AuthDialogFormVisible = false;
            })
        }
    }
}
</script>
<style scoped></style>
  