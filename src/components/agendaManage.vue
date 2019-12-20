<template>
  <div id="agendaManage">
    <ConfigHeader title="议程" @deleteAgenda="deleteAgenda" :needDialog="false" :needDeleteBtn="true">新增议程</ConfigHeader>
    <div class="baseMsg">
      <div class="header">议程基本信息</div>
      <el-form ref="agendaTableMsg" label-position="left" label-width="80px" :rules="BaseMsgRules" :model="agendaTableMsg">
        <el-form-item label="议程名称" prop="name" style="width: 500px">
          <el-input v-model="agendaTableMsg.name" placeholder="请输入议程名称" :disabled="baseMsgDisabled" :title="agendaTableMsg.name"></el-input>
        </el-form-item>
        <el-form-item label="议程时间" prop="date">
          <el-select v-model="agendaTableMsg.date" placeholder="请选择议程时间" :title="agendaTableMsg.date" :disabled="baseMsgDisabled">
            <el-option label="2018/11/02 AM" value="2018/11/02 AM" ></el-option>
            <el-option label="2018/11/03 AM" value="2018/11/03 AM"></el-option>
            <el-option label="2018/11/04 AM" value="2018/11/04 AM"></el-option>
            <el-option label="2018/11/05 AM" value="2018/11/05 AM"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="议程地点" prop="address" style="width: 500px">
          <el-input placeholder="请输入议程地址" v-model="agendaTableMsg.address" :disabled="baseMsgDisabled" :title="agendaTableMsg.address"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="save" @click="editOrSave">{{baseMsgDisabled ? '编辑' : '保存'}}</el-button>
          <el-button v-if="!baseMsgDisabled" @click="cancel('agendaTableMsg')" class="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="contentMsg">
      <div class="header">议程内容编辑
        <el-button @click="saveAllContents">一键保存</el-button>
      </div>
      <el-table
        ref="singleTable"
        :data="agendaTableMsg.contents"
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
                }">
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
                }">
              </el-time-select>
            </div>
            <div v-else :title="`${scope.row.startTime} - ${scope.row.endTime}`">{{`${scope.row.startTime} - ${scope.row.endTime}`}}</div>
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
      <el-button @click="addContent" class="add">新增</el-button>
      <div class="center">
        <el-button class="add">发布议程</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ConfigHeader from './common/configHeader'
import { getLocalData } from '../assets/js/base'
import { mapMutations, mapGetters } from 'vuex'

export default {
  name: 'agendaManage',
  data () {
    return {
      baseMsgDisabled: true,
      agendaTableMsg: {
        name: '2018广东互联网大会开幕式',
        date: '2018/11/02 AM',
        address: '单行输入',
        contents: [{
          startTime: '',
          endTime: '',
          plate: '往届大会回顾视频、嘉宾签到、自由交流',
          content: {
            title: '123432453555555555555555555555555555555555555555555555555555555555555555',
            host: '1323',
            guests: '131'
          },
          editable: false
        }, {
          startTime: '',
          endTime: '',
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
        name: [
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
    this.init()
    /* 如果采用每个临时的都有一个后台发的id，那么temp是否就不需要了，新增的按钮也可以多次点击，不需要设置不可编辑状态，store也不需要保存临时状态了 */
    if (this.agendaMsg.temp) { /* 是临时数据 否则为undefined */
      this.agendaTableMsg = this.getTemporaryAgenda /* 数据初始化  */
    } else {
      /* 此时需要利用id去后台抓取数据 */
    }
  },
  watch: {
    '$route': function (to, form) { /* 监听路由变化，刷新网页 */
      this.init()
    }
  },
  computed: {
    ...mapGetters([
      'getTemporaryAgenda'
    ])
  },
  methods: {
    ...mapMutations([
      'setTemporaryAgenda',
      'setaAgendaBtnDisabled'
    ]),
    init () { /* 初始化页面 */
      this.agendaMsg = getLocalData(['columnMsg'])[0]/* 这里获取到用户点击的栏目，利用id去抓取数据 */
      console.log(this.agendaMsg, 'agendaMsg')
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
  agendaTableMsg: {
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
    addContent () { /* 由于每个item都有保存功能，点击保存后会发送请求后台保存草稿，那么我新建的时候不需要发送请求，如果点击保存后没有id那么表示新增，是否可拖动？还是需要后台增加排序号？ */
      this.agendaTableMsg.contents.push({
        startTime: '',
        endTime: '',
        plate: '主持人开场',
        content: {
          title: '234345',
          host: '王世军（广东电视台 知名主持人）',
          guests: '2342'
        },
        editable: false
      })
    },
    setCurrent (row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange (val) {
      this.currentRow = val;
    },
    saveAllContents () { /* 一键保存，发送所有的this.agendaTableMsg到后台 */

    },
    handleEdit (index, row) {
      console.log(index, row)
      if (row.editable) { /* 此时是保存按钮，需要更新本地的数据，被分配的id需要传进去， */
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
          this.agendaTableMsg.contents.splice(index, 1)
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
        this.save('agendaTableMsg') // 保存,发送请求保存为草稿
      }
      this.baseMsgDisabled = !this.baseMsgDisabled
    },
    save (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
          /* 发送请求 */
          /* 此时agenda列表的name也要响应更新，获取全局设置几个navNeedChange变量，动态监听，如果有变化就去拉取对应列表的数据，及时更新，此时应该是不会刷新页面的吧……害怕基本信息保存后，原本已有的table会被初始化 */
          if (this.agendaMsg.temp) { /* 另外，如果是临时数据，那么它一定是在agendaNav的最后一个，保存后也要将btn设为可编辑状态 */
            this.setTemporaryAgenda(this.agendaTableMsg)
            this.setaAgendaBtnDisabled(false) // 将按钮设置成可编辑状态
          } else { /* 如果是后台数据，更新的同时也需要navbar也更新 可是如果重复点击！！（把它当成刷新页面了！给提示！。。。不会刷新），新增的议程里基本信息又已经保存，但是table的数据没有保存，那么点击后是属于哪个？ */
            /* 从btn的状态可知，你讲状态保存到store是可以同步的，只要改变了就可以同步，所以列表这边
            如果将列表数据保存到store中的话，新增的页push进去，考虑到尽量减少请求的话，那么保存后利用agendaId去查找对应值然后更改，这样前端也会相应改变
            */
          }
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
