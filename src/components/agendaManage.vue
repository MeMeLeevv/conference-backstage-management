<template>
  <div id="agendaManage">
    <el-dialog title="新增议程内容" :visible.sync="dialogFormVisible">
      <!-- 新建议程内容dialog -->
      <el-form :model="dialogForm" ref="ruleForm">
        <el-form-item label="时间 : " :label-width="formLabelWidth" prop="time">
          <el-time-picker
            is-range
            v-model="dialogForm.timeline"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="hh:mm A"
            placeholder="选择时间范围（hh:mm）"
            @change="timeChange"
            >
          </el-time-picker>
        </el-form-item>
        <el-form-item label="所属板块 : " :label-width="formLabelWidth">
          <el-input
            v-model="dialogForm.plate"
            autocomplete="off"
            placeholder="请输入所属板块"
          ></el-input>
        </el-form-item>
        <el-form-item label="具体内容 : " :label-width="formLabelWidth">
          <el-form-item label="主题" label-width="50px">
            <el-input
              v-model="dialogForm.theme"
              autocomplete="off"
              placeholder="请输入议程地点"
            ></el-input>
          </el-form-item>
          <el-form-item label="主持" style="margin: 10px 0" label-width="50px">
            <el-input
              v-model="dialogForm.host"
              autocomplete="off"
              placeholder="请输入主持"
            ></el-input>
          </el-form-item>
          <el-form-item label="嘉宾" label-width="50px">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入嘉宾"
              v-model="dialogForm.guest"
            >
            </el-input>
          </el-form-item>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.stop="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click.stop="
            isAddNewA
              ? addNewAgenda('ruleForm')
              : isAddNewC
              ? addNewColumn('ruleForm')
              : editColumn('ruleForm')
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <div class="baseMsg">
      <el-button @click="deleteAgenda">删除议程</el-button>
      <div class="header">议程基本信息</div>
      <el-form
        ref="agendaMsg"
        label-position="left"
        label-width="80px"
        :model="agendaMsg"
      >
        <el-form-item label="议程名称" style="width: 500px">
          <el-input
            v-model="agendaMsg.agenda_name"
            placeholder="请输入议程名称"
            :disabled="baseMsgDisabled"
            :title="agendaMsg.agenda_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="议程时间">
          <el-date-picker
            :title="agendaMsg.agenda_time"
            v-model="agendaMsg.agenda_time"
            :disabled="baseMsgDisabled"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="议程地点" style="width: 500px">
          <el-input
            placeholder="请输入议程地址"
            v-model="agendaMsg.agenda_department"
            :disabled="baseMsgDisabled"
            :title="agendaMsg.agenda_department"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="save" @click="editOrSave">{{
            baseMsgDisabled ? "编辑" : "保存"
          }}</el-button>
          <el-button
            v-if="!baseMsgDisabled"
            @click="cancel('agendaMsg')"
            class="cancel"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="contentMsg">
      <div class="header">
        议程内容编辑
        <el-button @click="editAllContents">一键编辑</el-button>
        <el-button @click="saveAllContents">一键保存</el-button>
      </div>
      <el-table
        ref="singleTable"
        :data="tableContents"
        highlight-current-row
        @current-change="handleCurrentChange"
        style="width: 100%"
      >
        <el-table-column align="center" type="index" width="100">
        </el-table-column>
        <el-table-column
          align="center"
          property="time"
          label="时间"
          width="200"
        >
          <template slot-scope="scope">
            <!-- <el-input placeholder="请输入时间"  v-model="scope.row.time"></el-input> -->
            <div v-if="scope.row.editable">
              <el-time-select
                placeholder="起始时间"
                @change="pickUpTime(scope.row, 'start')"
                v-model="scope.row.startTime"
                :picker-options="{
                  start: '08:00',
                  step: '00:15',
                  end: '23:30'
                }"
              >
              </el-time-select>
              <el-time-select
                placeholder="结束时间"
                @change="pickUpTime(scope.row, 'end')"
                v-model="scope.row.endTime"
                :picker-options="{
                  start: '08:00',
                  step: '00:15',
                  end: '23:30',
                  minTime: scope.row.startTime
                }"
              >
              </el-time-select>
            </div>
            <div
              v-else
              :title="`${scope.row.startTime} - ${scope.row.endTime}`"
            >
              {{ `${scope.row.startTime} - ${scope.row.endTime}` }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          property="plate"
          label="所属板块"
          width="250"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.editable"
              type="textarea"
              placeholder="请输入所属板块"
              :autosize="{ minRows: 1, maxRows: 4 }"
              v-model="scope.row.plate"
            ></el-input>
            <div v-else :title="scope.row.plate">{{ scope.row.plate }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" property="content" label="具体内容">
          <template slot-scope="scope">
            <div class="input">
              主题 :
              <el-input
                v-if="scope.row.editable"
                v-model="scope.row.theme"
                placeholder="请输入主题"
              ></el-input>
              <span class="tableItem" v-else :title="scope.row.content.theme">{{
                scope.row.theme
              }}</span>
            </div>
            <div class="input">
              主持人 :
              <el-input
                v-if="scope.row.editable"
                v-model="scope.row.host"
                placeholder="请输入主持人"
              ></el-input>
              <span class="tableItem" v-else :title="scope.row.content.host">{{
                scope.row.host
              }}</span>
            </div>
            <div class="input">
              嘉宾 :
              <el-input
                class="guests"
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 4 }"
                v-if="scope.row.editable"
                v-model="scope.row.guest"
                placeholder="请输入嘉宾"
              ></el-input>
              <span class="tableItem" v-else :title="scope.row.guest">{{
                scope.row.guest
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              >{{ scope.row.editable ? "保存" : "编辑" }}</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >{{ scope.row.editable ? "取消" : "删除" }}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="dialogFormVisible = true" class="add">新增</el-button>
      <div class="center">
        <el-button class="add">发布议程</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { axiosPost } from '../assets/js/axios';

import { getLocalData } from '../assets/js/base';
import { mapMutations, mapGetters } from 'vuex';

export default {
  inject: ['changeAgendaName'],
  name: 'agendaManage',
  data () {
    return {
      baseMsgDisabled: true,
      agendaMsg: {
        agenda_name: '2018广东互联网大会开幕式',
        agenda_time: '',
        agenda_department: '单行输入'
      },
      dialogForm: {
        a_id: '',
        timeline: '',
        plate: '',
        theme: '',
        host: '',
        guest: ''
      },
      tableContents: [
        {
          startTime: '',
          endTime: '',
          plate: '往届大会回顾视频、嘉宾签到、自由交流',
          content: {
            title:
              '123432453555555555555555555555555555555555555555555555555555555555555555',
            host: '1323',
            guests: '131'
          },
          editable: false
        },
        {
          startTime: '',
          endTime: '',
          plate: '主持人开场',
          content: {
            title: '234345',
            host: '王世军（广东电视台 知名主持人）',
            guests: '2342'
          },
          editable: false
        }
      ],
      currentRow: null,
      dialogFormVisible: false,
      formLabelWidth: '80px'
    };
  },
  computed: {
    ...mapGetters(['getTemporaryAgenda'])
  },
  created () {
    let that = this;
    this.agendaMsg = getLocalData([
      'columnMsg'
    ])[0]; /* 这里获取到用户点击的栏目，利用id去抓取数据 */
    console.log(this.agendaMsg, 'agendaMsg');
    // 根据
    axiosPost(
      '/api/agenda/getAgendaContent',
      {
        a_id: this.agendaMsg.a_id
      },
      res => {
        //
        let data = res.data;
        console.log(data, 'agendaContentData');
        if (data.code === '1') {
          this.tableContents = data.data;
          that.$message({
            message: data.msg,
            type: 'success'
          });
        } else {
          this.$message.error(data.msg);
        }
      },
      err => {
        this.$message.error('排序栏目失败，请重试！' + err);
      }
    );
  },
  methods: {
    ...mapMutations(['setTemporaryAgenda', 'setaAgendaBtnDisabled']),
    timeChange () {
      console.log(this.dialogForm.timeline)
      console.log(this.dialogForm.timeline[0])
    },
    /*
    作用： 新增议程内容
    */
    addContent () {
      /* 由于每个item都有保存功能，点击保存后会发送请求后台保存草稿，那么我新建的时候不需要发送请求，如果点击保存后没有id那么表示新增，是否可拖动？还是需要后台增加排序号？ */
    },
    pickUpTime (item, who) {
      /* 首先要区分：假设数据库不存在startTime和endTime 那么新增时候和已存在time的情况下
      新增情况下：环境内只有一对startTime和endTime，这个不行，如果用户点击多个编辑那么这将会不够用
      还是需要在每个item里都有这对，那么新增的时候，用
      {
          time: '-',
          startTime: '',
          endTime: '',
          plate: '请输入所属板块',
          content: {
            title: '请输入',
            host: '',
            guests: ''
          },
          editable: false
        }
        time = `${startTime} - ${endTime}`
      */
    },
    /*
  初始化议程列表先去本地拉已发布和草稿的议程
  nav新增的时候用户点击多少store就push多少数据，保存了才发送到后台,删除也需要发送到后台，一键保存全部发送到后台、
  议程——如何区分是本地临时草稿，还是后台的草稿或者已发布的议程？！分配id，本地临时草稿的id位数与后台不一样
  在store里，保存
  agendaMsg: {
    name: '2018广东互联网大会开幕式',
    date: '2018/11/02 AM',
    address: '广州越秀区',
    contents: [
      {
        startTime: '',
        endTime: '',
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
    /*
    作用：一键编辑
     */
    editAllContents () {},
    /*
    作用：一键保存
     */
    saveAllContents () {
      /* 一键保存，发送所有的this.agendaMsg到后台 */
    },
    handleEdit (index, row) {
      console.log(index, row);
      if (row.editable) {
        /* 此时是保存按钮，需要更新本地的数据，被分配的id需要传进去， */
        this.$confirm('是否确定保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
            row.editable = !row.editable;
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消保存'
            });
          });
      } else {
        row.editable = !row.editable;
      }
    },
    handleDelete (index, row) {
      console.log(index, row);
      if (!row.editable) {
        /* 此时是删除，需要提示 */
        this.$confirm('此操作将永久删除该行内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.tableContents.splice(index, 1);
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            row.editable = !row.editable;
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      } else {
        row.editable = !row.editable;
      }
    },
    editOrSave (disabled) {
      if (!this.baseMsgDisabled) {
        /* 可编辑状态false,需保存，先验证所填信息是否正确 */
        this.save('agendaMsg'); // 保存,发送请求保存为草稿
      }
      this.baseMsgDisabled = !this.baseMsgDisabled;
    },
    save (formName) {
      let that = this;
      axiosPost(
        '/api/agenda/updateAgenda',
        this.agendaMsg,
        res => {
          //
          let data = res.data;
          console.log(data, 'updateAgendaData');
          if (data.code === '1') {
            this.changeAgendaName();
            that.$message({
              message: data.msg,
              type: 'success'
            });
          } else {
            this.$message.error(data.msg);
          }
        },
        err => {
          this.$message.error('排序栏目失败，请重试！' + err);
        }
      );
    },
    cancel (formName) {
      /* 保留之前的状态 */
      // 表单恢复正原来的数据
      this.baseMsgDisabled = !this.baseMsgDisabled;
    },
    /*
    作用：删除议程,删除后默认跳到下一个或者上一个路由
     */
    deleteAgenda () {
      let that = this;
      this.$confirm('此操作将永久删除该议程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          /* 在数据库中删除好后提示 */
          this.agendaMsg.status = 0;
          axiosPost(
            '/api/agenda/updateAgenda',
            this.agendaMsg,
            res => {
              //
              let data = res.data;
              console.log(data, 'updateAgendaData');
              if (data.code === '1') {
                this.changeAgendaName(this.agendaMsg.a_id);
                that.$message({
                  message: data.msg,
                  type: 'success'
                });
              } else {
                this.$message.error(data.msg);
              }
            },
            err => {
              this.$message.error('排序栏目失败，请重试！' + err);
            }
          );
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    }
  },
  components: {}
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
    right: -70%
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
    .el-date-editor.el-input
      width: 150px
      margin: 5px 0
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
