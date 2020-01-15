<template>
  <div id="agendaManage">
    <el-dialog title="新增议程内容" :visible.sync="dialogFormVisible">
      <!-- 新建议程内容dialog -->
      <el-form :model="dialogForm" ref="ruleForm">
        <el-form-item label="时间 : " :label-width="formLabelWidth" prop="time">
          <el-time-picker
            is-range
            v-model="dialogForm.timeline"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="hh:mm A"
            placeholder="选择时间范围（hh:mm）"
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
              placeholder="请输入主持人"
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
        <el-button type="default" @click.stop="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.stop="addNewAgenda('ruleForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-button type="default" @click="deleteAgenda">删除议程</el-button>
    <div class="baseMsg">
      <div class="header">议程基本信息</div>
      <el-form
        ref="agendaMsg"
        label-position="left"
        label-width="80px"
        :model="agendaMsg"
      >
        <el-form-item label="议程名称" style="width: 600px">
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

        <el-form-item label="议程地点" style="width: 600px">
          <el-input
            placeholder="请输入议程地址"
            v-model="agendaMsg.agenda_department"
            :disabled="baseMsgDisabled"
            :title="agendaMsg.agenda_department"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editOrSaveAgenda">{{
            baseMsgDisabled ? "编辑" : "保存"
          }}</el-button>
          <el-button
            v-if="!baseMsgDisabled"
            @click="cancelAgenda('agendaMsg')"
            type="default"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="contentMsg">
      <div class="header">
        议程内容编辑
        <el-button type="primary" @click="editAllContents">一键编辑</el-button>
        <el-button type="default" @click="saveAllContents">一键保存</el-button>
      </div>

      <table class="table" cellspacing="0" cellpadding="0">
        <!-- 初始化表头 -->
        <thead class="thead-dark">
          <tr>
            <th
              scope="col"
              v-for="item in initTable"
              :key="item.id"
              :style="`width: ${item.widthPercent * clientWidth}px`"
            >
              {{ item.label }}
            </th>
          </tr>
        </thead>

        <draggable
          v-if="tableContents.length !== 0"
          v-model="tableContents"
          tag="tbody"
          @end="dropColumn"
        >
          <!-- tr的高度根据图片的高度0.12来调整 -->
          <tr
            v-for="(item, index) in tableContents"
            :ref="`row${index}`"
            :key="item.id"
            class="row"
            @mouseenter="putBg(`row${index}`)"
            @mouseleave="moveBg(`row${index}`)"
            :style="`height:${0.12 * clientWidth * 0.5 + 10}px`"
          >
            <!-- 显示数量index -->
            <td scope="row">{{ index }}</td>
            <!-- 时间 -->
            <td :style="`width: ${0.1 * clientWidth}px`">
              <div v-if="item.editable">
                <el-time-picker
                  style="width: 200px"
                  is-range
                  align="left"
                  v-model="item.timeline"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  format="hh:mm A"
                  placeholder="选择时间范围（hh:mm）"
                >
                </el-time-picker>
              </div>
              <div
                v-else
                :title="
                  `${item.timeline_start} - ${item.timeline_end}`
                "
              >
                {{
                  `${(
                    new Date(item.timeline_start).getHours() + ""
                  ).padStart(2, "0")}:${(
                    new Date(item.timeline_start).getMinutes() + ""
                  ).padStart(2, "0")}
               - ${(new Date(item.timeline_end).getHours() + "").padStart(
                 2,
                 "0"
               )}:${(
                    new Date(item.timeline_end).getMinutes() + ""
                  ).padStart(2, "0")}`
                }}
              </div>
            </td>
            <!-- 所属板块 -->
            <td :style="`width: ${0.2 * clientWidth}px`">
              <el-input
                v-if="item.editable"
                type="textarea"
                placeholder="请输入所属板块"
                :autosize="{ minRows: 1, maxRows: 4 }"
                v-model="item.plate"
              ></el-input>
              <div :style="`width: ${0.2 * clientWidth}px`" v-else :title="item.plate" class="ellipsis">
                {{ item.plate }}
              </div>
            </td>
            <!-- 具体内容 -->
            <td :style="`width: ${0.35 * clientWidth}px`">
              <div class="input">
                主题 :
                <el-input
                  v-if="item.editable"
                  v-model="item.theme"
                  placeholder="请输入主题"
                ></el-input>
                <span
                  class="tableItem ellipsis"
                  v-else
                  :title="item.theme"
                  >{{ item.theme }}</span
                >
              </div>
              <div class="input">
                主持人 :
                <el-input
                  v-if="item.editable"
                  v-model="item.host"
                  placeholder="请输入主持人"
                ></el-input>
                <span class="tableItem" v-else :title="item.host">{{
                  item.host
                }}</span>
              </div>
              <div class="input">
                嘉宾 :
                <el-input
                  class="guests"
                  type="textarea"
                  :autosize="{ minRows: 1, maxRows: 4 }"
                  v-if="item.editable"
                  v-model="item.guest"
                  placeholder="请输入嘉宾"
                ></el-input>
                <span
                  class="tableItem ellipsis"
                  v-else
                  :title="item.guest"
                  >{{ item.guest }}</span
                >
              </div>
            </td>
            <td>
              <el-button
                size="mini"
                type="primary"
                @click="editAgendaCon(index, item)"
                >{{ item.editable ? "保存" : "编辑" }}</el-button
              >
              <el-button
                size="mini"
                type="default"
                @click="deleteAgendaCon(index, item)"
                >{{ item.editable ? "取消" : "删除" }}</el-button
              >
            </td>
          </tr>
        </draggable>
      </table>

      <el-button @click="dialogFormVisible = true" type="primary" class="add"
        >新增议程内容</el-button
      >
      <div class="center">
        <el-button type="primary" class="add" @click="publicAgenda(agendaMsg.status)">
          <i
            class="iconfont"
            :class="agendaMsg.status === 2 ? 'iconlinshi' : 'iconyifabu'"
          ></i
          >{{ agendaMsg.status === 2 ? " 取消发布" : " 发布议程" }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { axiosPost } from '../assets/js/axios';
import draggable from 'vuedraggable';
import { getLocalData } from '../assets/js/base';
import { mapMutations, mapGetters } from 'vuex';
export default {
  inject: ['changeAgendaStatus'],
  name: 'agendaManage',
  data () {
    return {
      baseMsgDisabled: true,
      agendaMsg: {
        // 议程基本信息
        agenda_name: '',
        agenda_time: '',
        agenda_department: ''
      },
      dialogForm: {
        // 新增弹出dialog信息
        a_id: '',
        timeline: '', // 接受elementUI组件的时间戳数组
        timeline_start: '',
        timeline_end: '',
        plate: '',
        theme: '',
        host: '',
        guest: ''
      },
      initTable: [ // 初始化表格表头
        {
          label: '序号', // 表头名
          widthPercent: 0.05, // 表头占父类长度百分比
          key: 'index'
        },
        {
          label: '时间', // 表头名
          widthPercent: 0.12, // 表头占父类长度百分比
          key: 'timeline'
        },
        {
          label: '所属板块', // 表头名
          widthPercent: 0.15, // 表头占父类长度百分比
          key: 'plate'
        },
        {
          label: '具体内容', // 表头名
          widthPercent: 0.2, // 表头占父类长度百分比
          key: 'detailCon'
        },
        {
          label: '操作', // 表头名
          widthPercent: 0.1, // 表头占父类长度百分比
          key: 'detailCon'
        }
      ],
      tableContents: [], // 保存议程内容信息
      dialogFormVisible: false,
      formLabelWidth: '80px'
    };
  },
  computed: {
    ...mapGetters(['getTemporaryAgenda'])
  },
  created () {
    let that = this;
    this.clientWidth = document.body.clientWidth;
    this.agendaMsg = getLocalData([
      'columnMsg'
    ])[0]; /* 这里获取到用户点击的议程信息，利用id去抓取数据 */
    console.log(this.agendaMsg, 'agendaMsg');
    axiosPost(
      `${this.$store.state.api}/agenda/getAgendaContent`,
      {
        a_id: this.agendaMsg.a_id
      },
      res => {
        //
        let data = res.data;
        console.log(data, 'agendaContentData');
        if (data.code === '1') {
          let result = data.data; // Array
          if (result.length !== 0) {
            // 这里获取的时间需要加工一下，将时间戳 timeline_start以及timeline_end合并成timeline数组
            for (let i = 0; i < result.length; i++) {
              result[i].timeline = [
                new Date(result[i].timeline_start),
                new Date(result[i].timeline_end)
              ];
              result[i].editable = false; // 状态为不可编辑状态
            }
            this.tableContents = result;
          }
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
    /*
    作用： 新增议程内容,提交dialogForm,但是需要修改一下 timeline = [Fri Jan 10 2020 09:15:39 GMT+0800 (中国标准时间), Fri Jan 10 2020 10:15:39 GMT+0800 (中国标准时间)] ，
    把它拆成 timeline_start = Date.parse(timeline[0]) 和 timeline_end = Date.parse(timeline[1]),转成时间戳
    @return void
    */
    addNewAgenda () {
      let that = this;
      console.log(this.dialogForm, 'dialogForm');
      this.dialogForm.a_id = this.agendaMsg.a_id;
      this.dialogForm.timeline_start = Date.parse(this.dialogForm.timeline[0]); // 取出日期对象,转成时间戳
      this.dialogForm.timeline_end = Date.parse(this.dialogForm.timeline[1]);
      axiosPost(
        `${this.$store.state.api}/agenda/newAgendaContent`,
        this.dialogForm,
        res => {
          //
          let data = res.data;
          console.log(data, 'addAgendaContentData');
          if (data.code === '1') {
            this.dialogFormVisible = false;
            let result = data.data;
            // 初始化
            console.log(result, 'result');
            console.log(
              new Date(result.timeline_start),
              'new Date(result.timeline_start)'
            );
            result.timeline = [
              new Date(result.timeline_start),
              new Date(result.timeline_end)
            ]; // 将时间戳转成日期对象，供elementUI时间组件展示数据
            result.editable = false; // 状态为不可编辑状态
            this.tableContents.push(result);
            that.$message({
              message: data.msg,
              type: 'success'
            });
          } else {
            this.$message.error(data.msg);
          }
        },
        err => {
          this.$message.error('新增议程内容失败，请重试！' + err);
        }
      );
    },
    /*
    作用：删除议程,删除后默认跳到下一个或者上一个路由
     */
    editOrSaveAgenda (disabled) {
      if (!this.baseMsgDisabled) {
        /* 可编辑状态false,需保存，先验证所填信息是否正确 */
        this.saveAgenda('agendaMsg'); // 保存,发送请求保存为草稿
      }
      this.baseMsgDisabled = !this.baseMsgDisabled;
    },
    /*
    作用：保存修改议程
     */
    saveAgenda (formName) {
      let that = this;
      this.$confirm('此操作将修改该议程信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          axiosPost(
            `${this.$store.state.api}/agenda/updateAgenda`,
            this.agendaMsg,
            res => {
              //
              let data = res.data;
              console.log(data, 'updateAgendaData');
              if (data.code === '1') {
                this.changeAgendaStatus();
                that.$message({
                  message: data.msg,
                  type: 'success'
                });
              } else {
                this.$message.error(data.msg);
              }
            },
            err => {
              this.$message.error('更新议程信息失败，请重试！' + err);
            }
          );
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          });
        });
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
            `${this.$store.state.api}/agenda/updateAgenda`,
            this.agendaMsg,
            res => {
              //
              let data = res.data;
              console.log(data, 'updateAgendaData');
              if (data.code === '1') {
                this.changeAgendaStatus(this.agendaMsg.a_id);
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
    },
    /*
    作用：取消编辑议程 保留之前的状态，表单恢复正原来的数据
    */
    cancelAgenda (formName) {
      this.baseMsgDisabled = !this.baseMsgDisabled;
    },
    /*
    作用：一键编辑，注意：点击一键编辑后，要判断状态如果已经是编辑状态editable = true就不需要再改变状态了，
     */
    editAllContents () {
      for (let i = 0; i < this.tableContents.length; i++) {
        if (!this.tableContents[i].editable) {
          for (let j of Object.keys(this.tableContents[i])) {
            // 保存旧值
            this.tableContents[i][`old${j}`] = this.tableContents[i][j];
          }
          this.tableContents[i].editable = true; // 编辑状态
        }
      }
    },
    /*
    作用：一键保存，需要跳过editable = false
     */
    saveAllContents () {
      this.$confirm('此操作将保存所有改动过的该议程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          let agendaContents = [];
          for (let i = 0; i < this.tableContents.length; i++) {
            if (this.tableContents[i].editable) {
              agendaContents.push(this.tableContents[i]); // 将编辑过的议程内容收集
            }
          }
          // 向后台发送数据
          let that = this;
          axiosPost(
            `${this.$store.state.api}/agenda/updateAgContByOneClick`,
            { agendaContents: JSON.stringify(agendaContents) },
            res => {
              //
              let data = res.data;
              console.log(data, 'saveAllContentsData');
              if (data.code === '1') {
                for (let i = 0; i < this.tableContents.length; i++) {
                  if (this.tableContents[i].editable) {
                    this.tableContents[i].editable = false; // 设为不可编辑状态
                  }
                }
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
    },
    /*
    作用：发布议程
     */
    publicAgenda (status) {
      let that = this;
      let confirmInfo, errorInfo;
      if (status === 2) {
        // 表示需要取消发布
        confirmInfo = '此操作将取消发布该议程, 是否继续?';
        errorInfo = '取消发布议程失败，请重试！';
        status = 1;
      } else {
        // 发布
        confirmInfo = '此操作将发布该议程, 是否继续?';
        errorInfo = '发布议程失败，请重试！';
        status = 2;
      }
      this.$confirm(confirmInfo, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.agendaMsg.status = status;
          axiosPost(
            `${this.$store.state.api}/agenda/updateAgenda`,
            this.agendaMsg,
            res => {
              //
              let data = res.data;
              console.log(data, 'updateAgendaData');
              if (data.code === '1') {
                this.changeAgendaStatus();
                that.$message({
                  message: data.msg,
                  type: 'success'
                });
              } else {
                this.$message.error(data.msg);
              }
            },
            err => {
              this.$message.error(errorInfo + err);
            }
          );
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消此操作'
          });
        });
    },
    /*
    作用：编辑/保存议程内容 保存与一键保存功能类似，都是修改处于编辑状态的数据，将初始数据保存起来（设置对应的old***存入对象里）
    */
    editAgendaCon (index, row) {
      let that = this;
      // 保存初始对象,在取消的时候利用其恢复旧值
      for (let i of Object.keys(row)) {
        row[`old${i}`] = row[i];
      }
      console.log(index, row);
      //  此时是保存按钮
      if (row.editable) {
        this.$confirm('是否确定保存?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            row.timeline_start = Date.parse(row.timeline[0]); // 取出日期对象,转成时间戳
            row.timeline_end = Date.parse(row.timeline[1]);
            axiosPost(
              `${this.$store.state.api}/agenda/updateAgendaContent`,
              row,
              res => {
                //
                let data = res.data;
                console.log(data, 'EditAgendaContentData');
                if (data.code === '1') {
                  this.dialogFormVisible = false;
                  let result = data.data;
                  // 初始化
                  console.log(result, 'result');
                  row.editable = !row.editable;
                  that.$message({
                    message: data.msg,
                    type: 'success'
                  });
                } else {
                  this.$message.error(data.msg);
                }
              },
              err => {
                this.$message.error('修改议程内容失败，请重试！' + err);
              }
            );
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
    /*
    作用： 删除议程内容
    */
    deleteAgendaCon (index, row) {
      let that = this;
      console.log(index, row);
      // 此时是删除，需要提示
      if (!row.editable) {
        this.$confirm('此操作将永久删除该行内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            row.status = 0;
            axiosPost(
              `${this.$store.state.api}/agenda/updateAgendaContent`,
              row,
              res => {
                //
                let data = res.data;
                if (data.code === '1') {
                  this.tableContents.splice(index, 1);
                  that.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  row.editable = !row.editable;
                } else {
                  this.$message.error(data.msg);
                }
              },
              err => {
                this.$message.error('修改议程内容失败，请重试！' + err);
              }
            );
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      } else {
        // 取消操作，恢复旧值
        for (let i of Object.keys(row)) {
          if (i.indexOf('old') !== -1) {
            let key = i.slice(3);
            row[key] = row[i];
          }
        }
        row.editable = false;
      }
    },
    /*
    作用：发送更新栏目内容顺序sort请求给后台
    @data: Array 对应更新顺序的表格的数据
    @return void
    */
    dropColumn () {
      let sortData = [];
      let that = this;
      // 改变每个议程的sort信息，对应索引值
      this.tableContents.map((item, index) => {
        sortData.push(item.ag_content_id);
      });
      // 更新栏目内容排序
      axiosPost(
        `${this.$store.state.api}/column/sortColumn`,
        {
          sortData: JSON.stringify(sortData),
          type: 5
        },
        res => {
          //
          let data = res.data;
          if (data.code === '1') {
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
    /*
    作用：给鼠标hover的那行表格数据更改背景
    @ref: String 该行tr的ref
    @return void
    */
    putBg (ref) {
      this.$refs[ref][0].style.background = '#f5f7fa'
    },
    /*
    作用：给鼠标移出的那行表格数据恢复白色背景
    @ref: String 该行tr的ref
    @return void
    */
    moveBg (ref) {
      this.$refs[ref][0].style.background = 'white'
    }
  },
  components: { draggable }
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
.center
  text-align: center
#agendaManage
  #header
    margin-bottom: 20px
  .baseMsg
    margin-top: 10px
    .el-form
      background: white
      padding: 40px
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
    .el-date-editor .el-range-separator
      padding: 0
      width: 12%
    .tableItem
      width: 500px
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
      vertical-align: bottom
      font-weight: 500
    .add
      margin: 30px
.table
  .thead-dark
    background: #545c64
    color: white
    font-size: 18px
    tr
      height: 50px
      th
        border-bottom: 1px solid #ebeef5
  .el-button
    padding: 10px
    font-size: 16px
.row
  text-align: center
  td
    border-bottom: 1px solid #f2f2f2
  .el-select>.el-input
    margin: 0 auto
  .el-input
    width: 80%
</style>
