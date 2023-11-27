<template>
    <div class="app-container">
        <el-form :inline="true" :model="searchParams" @keyup.native.enter="search">
            <el-form-item label="操作用户">
                <el-select v-model="searchParams.userId" placeholder="操作用户">
                    <el-option label="全部" value="all"></el-option>
                    <el-option v-for="item in userNameList" :key="item.id" :label="item.username"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="请求方法">
                <el-input v-model="searchParams.method" placeholder="请输入请求方法"></el-input>
            </el-form-item>
            <el-form-item label="请求地址">
                <el-input v-model="searchParams.path" placeholder="请输入请求地址"></el-input>
            </el-form-item>
            <el-form-item label="ip地址">
                <el-input v-model="searchParams.ip" placeholder="请输入ip地址"></el-input>
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
            <el-table-column label="操作用户" align="center">
                <template slot-scope="scope">
                    {{ scope.row.username }}
                </template>
            </el-table-column>
            <el-table-column label="请求方法" align="center">
                <template slot-scope="scope">
                    {{ scope.row.method }}
                </template>
            </el-table-column>
            <el-table-column label="请求地址" align="center">
                <template slot-scope="scope">
                    {{ scope.row.path }}
                </template>
            </el-table-column>
            <el-table-column label="请求参数" align="center">
                <template slot-scope="scope">
                    {{ scope.row.params }}
                </template>
            </el-table-column>
            <el-table-column label="ip地址" align="center">
                <template slot-scope="scope">
                    {{ scope.row.ip }}
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" width="200">
                <template slot-scope="scope">
                    <i class="el-icon-time" />
                    <span>{{ scope.row.created_at }}</span>
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
import { getList } from '@/api/system/systemLog.js'
import { getUserNameList } from '@/api/system/user.js'

export default {
    data() {
        return {
            list: null,
            listLoading: true,
            userNameList: [],
            searchParams: {
                userId: 'all',
                method: '',
                path: '',
                ip: '',
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
        }
    }
}
</script>
<style scoped></style>
  