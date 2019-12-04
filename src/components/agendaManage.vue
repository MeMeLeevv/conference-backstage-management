<template>
  <div id="agendaManage">
    <ConfigHeader title="议程" @deleteAgenda="deleteAgenda" :needDialog="false" :needDeleteBtn="true">新增议程</ConfigHeader>
    <div class="baseMsg">
      <div class="header">议程基本信息</div>
      <el-form ref="formMsg" label-position="left" label-width="80px" :rules="BaseMsgRules" :model="formMsg">
        <el-form-item label="议程名称" prop="title" style="width: 500px">
          <el-input v-model="formMsg.title" placeholder="请输入议程名称" :disabled="baseMsgDisabled" :title="formMsg.title"></el-input>
        </el-form-item>
        <el-form-item label="议程时间" prop="date">
          <el-select v-model="formMsg.date" placeholder="请选择议程时间" :title="formMsg.date" :disabled="baseMsgDisabled">
            <el-option label="2018/11/02 AM" value="2018/11/02 AM" ></el-option>
            <el-option label="2018/11/03 AM" value="2018/11/03 AM"></el-option>
            <el-option label="2018/11/04 AM" value="2018/11/04 AM"></el-option>
            <el-option label="2018/11/05 AM" value="2018/11/05 AM"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="议程地点" prop="address" style="width: 500px">
          <el-input placeholder="请输入议程地址" v-model="formMsg.address" :disabled="baseMsgDisabled" :title="formMsg.address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="save" @click="editOrSave">{{baseMsgDisabled ? '编辑' : '保存'}}</el-button>
          <el-button v-if="!baseMsgDisabled" @click="cancel('formMsg')" class="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="contentMsg">
      <div class="header">议程内容编辑
        <el-button>一键保存</el-button>
      </div>
      <el-table
        ref="singleTable"
        :data="formMsg.contents"
        highlight-current-row
        @current-change="handleCurrentChange"
        style="width: 100%">
        <el-table-column
          align="center"
          type="index"
          width="100">
        </el-table-column>
        <el-table-column
          align="center"
          property="time"
          label="时间"
          width="200">
          <template slot-scope="scope">
            <el-input placeholder="请输入时间" v-if="scope.row.editable" v-model="scope.row.time"></el-input>
            <div v-else :title="scope.row.time">{{scope.row.time}}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          property="plate"
          label="所属板块"
          width="250">
          <template slot-scope="scope">
            <el-input  v-if="scope.row.editable" type="textarea"
            placeholder="请输入所属板块"
            :autosize="{ minRows: 1, maxRows: 4}"
            v-model="scope.row.plate"></el-input>
            <div v-else :title="scope.row.plate">{{scope.row.plate}}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          property="content"
          label="具体内容">
          <template slot-scope="scope">
            <div class="input">
              主题 :
              <el-input v-if="scope.row.editable" v-model="scope.row.content.title" placeholder="请输入主题"></el-input>
              <span class="tableItem" v-else :title="scope.row.content.title">{{scope.row.content.title}}</span>
            </div>
            <div class="input">
              主持人 :
              <el-input v-if="scope.row.editable" v-model="scope.row.content.host" placeholder="请输入主持人"></el-input>
              <span class="tableItem" v-else :title="scope.row.content.host">{{scope.row.content.host}}</span>
            </div>
            <div class="input">
              嘉宾 :
            <el-input class="guests" type="textarea" :autosize="{ minRows: 1, maxRows: 4}"
            v-if="scope.row.editable" v-model="scope.row.content.guests" placeholder="请输入嘉宾"></el-input>
            <span class="tableItem" v-else :title="scope.row.content.guests">{{scope.row.content.guests}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">{{scope.row.editable ? '保存' : '编辑'}}</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">{{scope.row.editable ? '取消' : '删除'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="add">新增</el-button>
      <div class="center">
        <el-button class="add">发布议程</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ConfigHeader from './common/configHeader'
export default {
  name: 'agendaManage',
  data () {
    return {
      baseMsgDisabled: true,
      formMsg: {
        title: '2018广东互联网大会开幕式',
        date: '2018/11/02 AM',
        address: '单行输入',
        contents: [{
          time: '08:00 - 08:40',
          plate: '往届大会回顾视频、嘉宾签到、自由交流',
          content: {
            title: '123432453555555555555555555555555555555555555555555555555555555555555555',
            host: '1323',
            guests: '131'
          },
          editable: false
        }, {
          time: '09:00 - 09:05',
          plate: '主持人开场',
          content: {
            title: '234345',
            host: '王世军（广东电视台 知名主持人）',
            guests: '2342'
          },
          editable: false
        }]
      },
      BaseMsgRules: {
        title: [
          { required: true, message: '请输入议程名称', trigger: 'blur' },
          { max: 30, message: '请输入长度为30个字符', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请填写议程地址', trigger: 'blur' }
        ]
      },
      currentRow: null
    };
  },
  created () {
  },
  computed: {
  },
  methods: {/*
  初始化议程列表先去本地拉已发布和草稿的议程
  nav新增的时候用户点击多少store就push多少数据，保存了才发送到后台,删除也需要发送到后台，一键保存全部发送到后台、
  议程——如何区分是本地临时草稿，还是后台的草稿或者已发布的议程？！分配id，本地临时草稿的id位数与后台不一样
  在store里，保存
  temporaryAgenda: {
    title: '2018广东互联网大会开幕式',
    date: '2018/11/02 AM',
    address: '广州越秀区',
    contents: [
      {
        time: '08:00 - 08:40',
        plate: '主持人开场',
        content： {
          title: '234345',
          host: '王世军（广东电视台 知名主持人）',
          guests: '2342'
        },
        editable: false
      }
    ]
  }
  */
    setCurrent (row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange (val) {
      this.currentRow = val;
    },
    handleEdit (index, row) {
      console.log(index.content, row)
      if (row.editable) { /* 此时是保存按钮，需要更新本地的数据 */
        this.$confirm('是否确定保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          });
          row.editable = !row.editable
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消保存'
          })
        });
      } else {
        row.editable = !row.editable
      }
    },
    handleDelete (index, row) {
      console.log(index, row);
      if (!row.editable) { /* 此时是删除，需要提示 */
        this.$confirm('此操作将永久删除该行内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.formMsg.contents.splice(index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          row.editable = !row.editable
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      } else {
        row.editable = !row.editable
      }
    },
    editOrSave (disabled) {
      if (!this.baseMsgDisabled) { /* 可编辑状态false,需保存，先验证所填信息是否正确 */
        this.save('formMsg') // 保存到本地
      }
      this.baseMsgDisabled = !this.baseMsgDisabled
    },
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    cancel (formName) { /* 保留之前的状态 */
      // 表单恢复正原来的数据
      this.baseMsgDisabled = !this.baseMsgDisabled
    },
    deleteAgenda () { /* 删除议程 */
      this.$confirm('此操作将永久删除该议程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => { /* 在数据库中删除好后提示 */
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  components: {
    ConfigHeader
  }
};
</script>
<style lang="sass" scoped>
.header
  height: 50px
  padding-left: 40px
  background: #E0E0E0
  line-height: 50px
  font-weight: 700
  .el-button
    position: relative
    right: -83%
#agendaManage
  #header
    margin-bottom: 20px
  .baseMsg
    .el-form
      background: white
      padding: 40px
      .save
        background: #AA476C 100%
        border: #AA476C
      .cancel
        color: #AA476C
        border: 1px solid #AA476C
      .cancel:hover
        background: #f2f2f2
  .contentMsg
    background: white
    .el-table
    .input
      margin: 10px 0
      font-weight: 700
      .guests
        width: 70%
      .el-input
        width: 500px
        margin-left: 10px
    .tableItem
      width: 500px
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
      vertical-align: bottom
      font-weight: 500
    .add
      margin: 30px
</style>
