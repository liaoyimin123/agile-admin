<template>
    <div class="app-container">
        <el-form :inline="true" :model="searchParams" @keyup.native.enter="search">
            <el-form-item label="模块名称">
                <el-select v-model="searchParams.model" placeholder="模块名称">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="用户模块" value="user"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="操作用户">
                <el-select v-model="searchParams.userId" placeholder="操作用户">
                    <el-option label="全部" value="all"></el-option>
                    <el-option v-for="item in userNameList" :key="item.id" :label="item.username"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="searchParams.status" placeholder="执行状态">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="待执行" value="0"></el-option>
                    <el-option label="成功" value="1"></el-option>
                    <el-option label="失败" value="2"></el-option>
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
        <el-table style="margin-top: 10px;" v-loading="listLoading" :data="list" element-loading-text="Loading" border fit
            highlight-current-row @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" width="55">
            </el-table-column>
            <el-table-column align="center" label="序号" width="95">
                <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                </template>
            </el-table-column>
            <el-table-column label="模块名称" align="center">
                <template slot-scope="scope">
                    {{ scope.row.modelStr }}
                </template>
            </el-table-column>
            <el-table-column label="操作用户" align="center">
                <template slot-scope="scope">
                    {{ scope.row.username }}
                </template>
            </el-table-column>
            <el-table-column label="文件下载" align="center">
                <template slot-scope="scope">
                    <el-link type="success" :href="scope.row.excel_path_url">下载文件</el-link>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="warning" effect="plain">待执行</el-tag>
                    <el-tag v-if="scope.row.status == 1" type="success" effect="plain">成功</el-tag>
                    <el-tag v-if="scope.row.status == 2" type="danger" effect="plain">失败</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="失败原因" align="center">
                <template slot-scope="scope">
                    <el-popover v-if="scope.row.status == 2" placement="top-start" title="错误信息" width="200" trigger="hover"
                        :content="scope.row.fails">
                        <el-button slot="reference">查看错误</el-button>
                    </el-popover>
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
                    <el-popconfirm v-if="scope.row.status == 2" title="确定要重新执行吗？" icon="el-icon-info" icon-color="red"
                        @onConfirm="reExecute(scope.row.id)">
                        <el-button type="warning" icon="el-icon-refresh" circle slot="reference"></el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination class="page" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="searchParams.page" background prev-text="上一页" next-text="下一页" :page-sizes="[10, 20, 30, 40]"
            :page-size="searchParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>
  
<script>
import { getList, reExecute } from '@/api/system/importRecord.js'
import { getUserNameList } from '@/api/system/user.js'

export default {
    data() {
        return {
            list: null,
            listLoading: true,
            userNameList: [],
            searchParams: {
                model: 'all',
                userId: 'all',
                status: 'all',
                createDateTime: [],
                page: 1,
                pageSize: 10,
            },
            selectedIdArr: [],
            total: 0,
            formLabelWidth: '120px'
        }
    },
    created() {
        this.getList()
        this.getUserNameList()
    },
    methods: {
        search() {
            this.getList();
        },
        getUserNameList() {
            getUserNameList().then(response => {
                this.userNameList = response.data
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
                this.total = response.data.total
                this.listLoading = false
            })
        },
        reExecute(id) {
            reExecute({ id: id }).then(response => {
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
  