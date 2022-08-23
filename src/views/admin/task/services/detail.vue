<template>
  <div class="task_page">
    <el-dialog
      center
      :fullscreen="true"
      :visible.sync="dialogVisible"
      width="100%"
      :before-close="handleClose">
      <!-- 任务需求头部 -->
      <div slot="title">
        <div class="dialog-title">
          <el-avatar class="avatar-css" shape="square" size="medium" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar>
          <p>{{originTaskInfo.bwd_issuer}}发起任务需求</p>
        </div>
        <div class="task_status">
          <div class="status_desc"></div>
          <div class="status_desc">
            <span class="status_title">当前状态：</span>
            <div style="margin-top:10px;">
              <span v-if="taskStatus === 2" class="set_tag_color">{{taskStatusNode[2]}}</span>
              <el-tag v-else :type="colorByTaskStatus(taskStatus)">{{taskStatusNode[taskStatus]}}</el-tag>
            </div>
          </div>
          <div class="status_desc">
            <span class="status_title">发起人</span>
            <p>{{originTaskInfo.bwd_issuer}}</p>
          </div>
          <div class="status_desc">
            <span class="status_title">发起人部门</span>
            <p>IT(F)</p>
          </div>
          <div class="status_desc"></div>
        </div>
      </div>

      <div style="width:1200px;margin:0 auto;">
        <!-- 任务信息 -->
        <div class="task-content">
          <el-card>
            <div slot="header" class="task_title">
              <span>任务信息</span>
            </div>
            <div class="task-info">
              <div class="d-flex">
                <span class="info-title">任务编号：</span>
                <span class="info-desc">{{originTaskInfo.bwd_no}}</span>
              </div>
              <div class="d-flex">
                <span class="info-title">发起人：</span>
                <span class="info-desc">{{originTaskInfo.bwd_issuer}}</span>
                <span class="info-desc">1级部门/2级部门(F)</span>
                <span class="info-desc">人事专员(F)</span>
              </div>
              <!-- 第一次进入详情页面时，流程类型 与 预估时间 可选，点击确认提交后才显示 与之相对应的详情 -->
               <template v-if="taskStatusVal === '10'">
                  <div class="d-flex">
                    <span class="info-title">任务类型：</span>
                    <span class="info-desc">{{originTaskInfo.bwd_type}}</span>
                    <span class="info-type">流程类型：</span>
                    <el-select v-model="taskInfo.type" style="width:200px;" @change="getTaskType" clearable placeholder="请选择流转方式">
                      <el-option label="串行" value="1"></el-option>
                      <el-option label="并行" value="2"></el-option>
                    </el-select>
                  </div>
                  <div class="d-flex">
                    <span class="info-title">任务名：</span>
                    <span class="info-desc">{{originTaskInfo.bwd_name}}</span>
                    <span class="info-estimate-time">预估时间：</span>
                    <s-date-picker :date="taskInfo.dateTime" @changeDateTime="getDateTime"></s-date-picker>
                  </div>
               </template>

              <template v-else>
                <div class="d-flex">
                  <span class="info-title">任务类型：</span>
                  <span class="info-desc">{{originTaskInfo.bwd_type}}</span>
                  <span class="info-desc">流程类型：</span>
                  <span class="info-desc">{{taskInfo.type === 1 ? '串行' : '并行'}}</span>
                </div>
                <div class="d-flex">
                  <span class="info-title">任务名：</span>
                  <span class="info-desc">{{originTaskInfo.bwd_name}}</span>
                  <span class="info-desc" style="width:150px;">预估时间：</span>
                  <span class="info-desc">{{taskInfo.showDateTime}}</span>
                </div>
              </template>

              <div class="d-flex">
                <span class="info-title">任务内容：</span>
                <div class="info-content">
                  {{originTaskInfo.bwd_content}}
                </div>
              </div>
              <div class="d-flex">
                <span class="info-time">创建时间：</span>
                <span class="info-date">{{originTaskInfo.created_at}}</span>
                <span class="info-time">截止时间：</span>
                <span class="info-date">{{originTaskInfo.updated_at}}</span>
              </div>
            </div>

            <!-- 固定显示区--任务指派 -->
              <el-card class="task_devide">
                <div slot="header" class="task_devide_title">
                  <span>任务指派</span>
                </div>
                <div v-if="listData.length">
                  <div class="listData_css" v-for="(item, index) in listData" :key="index">
                    <div class="listData_f">
                      <div class="task_t" style="color: blue;">任务{{index + 1}}</div>
                      <div class="task_t">任务名称：{{item.taskname}}</div>
                      <div class="d-flex task_t">
                        <span>任务内容：</span>
                        <div>{{item.content}}</div>
                      </div>
                      <div class="task_t" style="margin-bottom:10px;">执行人：{{item.name}}</div>
                      <div class="listData_s">
                        <el-button v-if="taskStatusVal === '10'" type="info" @click="cancelTask(index)"><i class="el-icon-close" style="margin-right:5px;"></i>取消</el-button>
                        <div v-else>
                          <div v-if="taskStatus === 2">
                            <span>状态：</span><span class="set_tag_color">{{taskStatusNode[2]}}</span>
                          </div>
                          <div v-else>
                            <span>状态：</span><el-tag :type="colorByTaskStatus(taskStatus)">{{taskStatusNode[taskStatus]}}</el-tag>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="listDataNewArr.length">
                  <div class="listData_css" v-for="(item, index) in listDataNewArr" :key="index">
                    <div class="listData_f">
                      <div class="task_t" style="color: blue;">任务{{index + 1}}</div>
                      <div class="task_t">任务名称：{{item.taskname}}</div>
                      <div class="d-flex task_t">
                        <span>任务内容：</span>
                        <div>{{item.content}}</div>
                      </div>
                      <div class="task_t" style="margin-bottom:10px;">执行人：{{item.bwd_designer}}</div>
                      <div class="listData_s">
                        <el-button v-if="taskStatusVal === '10'" type="info" @click="cancelTask(index)"><i class="el-icon-close" style="margin-right:5px;"></i>取消</el-button>
                        <div v-else>
                          <div v-if="taskStatus === 2">
                            <span>状态：</span><span class="set_tag_color">{{taskStatusNode[2]}}</span>
                          </div>
                          <div v-else>
                            <span>状态：</span><el-tag :type="colorByTaskStatus(taskStatus)">{{taskStatusNode[taskStatus]}}</el-tag>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="listData_desc">
                  暂无任务指派
                </div>

                <!-- 子任务添加 -->
                <el-card v-if="taskStatusVal === '10'">
                  <div slot="header" class="task_devide_title">
                    <span style="font-size:18px;">添加任务{{!listData.length ? '' : listData.length + 1}}</span>
                  </div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                  <el-form-item label="执行人" >
                    <div class="d-flex" style="position:relative;">
                      <el-tree 
                        class="border-r"
                        style="width:500px;"
                        :data="treeData" 
                        ref="tree"
                        @node-click="handleNodeClick"
                        node-key="id">
                      </el-tree>
                      <div style="width:500px;" class="border-r">
                        <p style="text-align:center;">人员列表</p>
                        <div v-if="departmentUserList.length" style="margin-left:100px;">
                          <div class="checkboxContainer">
                            <ul class="del-dot">
                              <li v-for="(item, index) in departmentUserList" :key="index">
                                <el-checkbox v-model="item.checked" @change="checkUserChange(item, index)">{{ item.name }}</el-checkbox>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div v-else style="padding:20px; color: gray;">
                          <p style="text-align:center;">该部门暂无人员</p>
                        </div>
                        </div>
                        <span class="warn-star" style="position:absolute;left:-65px;"></span>
                    </div>
                  </el-form-item>
                  <el-form-item label="任务名" prop="taskname">
                    <el-input style="width: 400px;" clearable v-model="ruleForm.taskname"></el-input>
                  </el-form-item>
                  <el-form-item label="任务内容" prop="content">
                    <el-input style="width: 400px;" type="textarea" v-model="ruleForm.content"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')"><i class="el-icon-circle-plus-outline" style="margin-right:5px"></i>添加</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                  </el-form-item>
                </el-form>
                </el-card>
              </el-card>

              <!-- 任务评价 -->
              <el-card v-if="taskStatus === 4">
                <div slot="header" class="task_estimate">
                  <span style="font-size:18px;">任务评价</span>
                </div>
                <div class="block">
                  <el-rate
                    v-model="taskScore"
                    :colors="taskScoreColors">
                  </el-rate>
                </div>
              </el-card>
          </el-card>
        </div>


        <!-- 审批进度及变更记录 -->
        <div class="bottom-content">
          <el-card>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane label="审批进度" name="first">
                <div class="block">
                  <el-timeline>
                    <el-timeline-item timestamp="2022.07.29" type="success" placement="top">
                      <el-card :body-style="{ padding: '10px' }">
                        <div style="display: flex;">
                          <el-avatar style="margin-top:10px;margin-right: 10px;" shape="square" size="medium" :src="f_url"></el-avatar>
                          <div>
                            <p style="height:10px;">李洋 2022.07.29 12:09</p>
                            <p style="color:#a2b1c5;height:10px;">提交申请</p>
                            <div>
                              <span style="font-weight: bold;color: #00b042; margin-right:5px;">提交申请</span><span>(无)</span>
                            </div>
                          </div>
                        </div>
                      </el-card>
                    </el-timeline-item>
                    <el-timeline-item :hide-timestamp="true" type="success" placement="top">
                      <el-card :body-style="{ padding: '10px' }">
                        <div style="display: flex;">
                          <el-avatar style="margin-top:10px;margin-right: 10px;" shape="square" size="medium" :src="f_url"></el-avatar>
                          <div>
                            <p style="height:10px;">李洋 2022.07.29 12:10</p>
                            <p style="color:#a2b1c5;height:10px;">分配任务</p>
                            <div>
                              <span style="font-weight: bold;color: #00b042; margin-right:5px;">审核完成</span><span>(审核完成)</span>
                            </div>
                          </div>
                        </div>
                      </el-card>
                    </el-timeline-item>
                    <el-timeline-item :hide-timestamp="true" type="success" placement="top">
                      <el-card :body-style="{ padding: '10px' }">
                        <div style="display: flex;">
                          <el-avatar style="margin-top:10px;margin-right: 10px;" shape="square" size="medium" :src="f_url"></el-avatar>
                          <div>
                            <p style="height:10px;">李洋 2022.07.29 12:11</p>
                            <p style="color:#a2b1c5;height:10px;">待接受任务</p>
                            <div>
                              <span style="font-weight: bold;color: #00b042; margin-right:5px;">接受任务</span><span>(接受任务)</span>
                            </div>
                          </div>
                        </div>
                      </el-card>
                    </el-timeline-item>
                    <el-timeline-item :hide-timestamp="true" type="success" placement="top">
                      <el-card :body-style="{ padding: '10px' }">
                        <div style="display: flex;">
                          <el-avatar style="margin-top:10px;margin-right: 10px;" shape="square" size="medium" :src="f_url"></el-avatar>
                          <div>
                            <p style="height:10px;">李洋 2022.07.29 12:12</p>
                            <p style="color:#a2b1c5;height:10px;">提交申请</p>
                            <div>
                              <span style="font-weight: bold;color: #00b042; margin-right:5px;">提交任务</span><span>(hhh)</span>
                            </div>
                          </div>
                        </div>
                      </el-card>
                    </el-timeline-item>
                    <el-timeline-item :hide-timestamp="true" type="success" placement="top">
                      <el-card :body-style="{ padding: '10px' }">
                        <div style="display: flex;">
                          <el-avatar style="margin-top:10px;margin-right: 10px;" shape="square" size="medium" :src="f_url"></el-avatar>
                          <div>
                            <p style="height:10px;">李洋 2022.07.29 12:13</p>
                            <p style="color:#a2b1c5;height:10px;">待确认收货</p>
                            <div>
                              <span style="font-weight: bold;color: #00b042; margin-right:5px;">任务完结</span><span>(任务完结)</span>
                            </div>
                          </div>
                        </div>
                      </el-card>
                    </el-timeline-item>
                  </el-timeline>
                </div>
              </el-tab-pane>
              <el-tab-pane label="变更记录" name="second">
                <div class="block">
                  <div class="radio" style="margin-bottom:20px;">排序：
                    <el-radio-group v-model="reverse">
                      <el-radio :label="true">倒序</el-radio>
                      <el-radio :label="false">正序</el-radio>
                    </el-radio-group>
                  </div>

                    <el-timeline :reverse="reverse">
                      <el-timeline-item
                        placement="top"
                        v-for="(activity, index) in activities"
                        :key="index"
                        :icon="activity.icon"
                        :type="activity.type"
                        :color="activity.color"
                        :size="activity.size"
                        :timestamp="activity.timestamp">
                        {{activity.content}}
                      </el-timeline-item>
                    </el-timeline>
                  </div>
              </el-tab-pane>
            </el-tabs>
          </el-card> 
        </div>
      </div>
      

      <!-- 底部button -->
      <div slot="footer" class="dialog-footer">
        <el-button v-for="item in taskBtn" :key="item" type="primary" @click="chooseBtn(item)">{{taskInfoBtn[item]}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { departmentUser } from '@/api/admin/department'
import { taskInfo, taskAll } from '@/api/admin/task'

  export default {
    data(){
      return {
        // 是否是第一次进入任务详情页
        // firstClick: true,

        dialogVisible: true,
        // 任务当前状态
        taskStatus:1,
        // 任务评分值
        taskScore:null,
        taskScoreColors:['#99A9BF', '#F7BA2A', '#FF9900'],
        activeName: 'first',
        reverse: true,
        activities: [{
          timestamp: '2022-07-29 12:13:14',
          content: '李洋 把 评分 从 空 修改为 999',
          type: 'primary',
        }, {
          timestamp: '2022-07-29 12:12:31',
          content: '李洋 把 文件存放路径 从 空 修改为 哈哈哈',
          type: 'primary',
        },{
          timestamp: '2022-07-29 12:10:59',
          content: '李洋 把 预计完成时间 从 空 修改为 2022-07-30 12:11',
          type: 'primary',
        }, {
          timestamp: '2022-07-29 12:09:18',
          content: '李洋 把 设计师 从 空 修改为 李洋',
          type: 'primary',
        }, {
          timestamp: '2022-07-29 12:09:18',
          content: '李洋 创建记录',
          type: 'primary',
        }],
        f_url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        taskInfo:{
          type:'',
          dateTime:[],  //选择项
          showDateTime:''  //回显项
        },
        // 任务详情页-任务信息（还未选流转方式及预估时间时）
        originTaskInfo:{},
        ruleForm: {
          taskname: '',
          content: '',
        },
        rules: {
          taskname: [
            { required: true, message: '请输入任务名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请填写任务内容', trigger: 'blur' }
          ]
        },
        treeData:[],
        defaultProps: null,
        // 已指派任务列表
        listData:[],
        // 任务列表
        listDataNewArr:[],
        // 部门对应的员工列表
        departmentUserList:[],
        // 当前选中部门人员信息
        currentCheckUser: {},
        // 是否显示添加子任务框
        // showAddTaskForm: true,
        // 任务状态对应节点
        taskStatusNode:{
          1:'待分配',
          2:'待接受',
          3:'进行中',
          4:'待评价',
          5:'已完成',
          6:'已终止'
        },
        // 任务状态对应节点字段-按钮
        taskStatusBtn:{
          1:'bwd_sh',  //审核
          2:'bwd_js',  //接受
          3:'bwd_tj',  //提交
          4:'bwd_pj',  //评价
          5:'bwd_cx',  //撤销
          6:'bwd_jj',  //拒绝
          7:'bwd_zj',  //转交
          // 8:'bwd_ht',  //回退
        },
        // 任务状态对应可操作按钮显示
        taskInfoBtn:{
          'bwd_sh':'审核',
          'bwd_js':'接受',
          'bwd_tj':'提交',
          'bwd_pj':'评价',
          'bwd_cx':'撤销',
          'bwd_jj':'拒绝',
          'bwd_zj':'转交',
          'bwd_ht':'回退'
        },
        // 后端返回按钮组
        taskBtn:[],
        // 任务状态颜色
        tagStatusColor:{
          '待分配':'info',
          '待接受':'set_tag_color',
          '进行中':'primary',
          '待评价':'warning',
          '已完成':'success',
          '已终止':'danger',
        },
        // 任务流转-审核阶段-接口入参
        taskQuery:{
          // 主任务id
          id: null,
          // 流转方式
          type: null,
          // 任务状态
          bwd_flag:'',
          // 预估时间
          eapectdate:'',
          // 子任务数组
          task:[]
        },
        // 任务流转-其他阶段-必传参数
        taskBothQuery:{
          // 主任务id
          id: null,
          // 任务状态
          bwd_flag: '',
          // 子任务id
          sbwdid: null,
        },
        // 子任务id
        currentSonTaskId: null,
        // 任务状态值
        // taskStatusVal: {
        //   '申请': '10',          
        //   '待接受': '40',
        //   '任务开发中': '100',
        //   '任务完结': '150',
        //   '任务结束': '200',
        //   '任务终止': '500',
        // },
        taskStatusVal: '10',
      }
    },
    async created(){
      await this.departmentChoose();
      await this.getTaskInfo();
      // await this.getTaskAll();
    },
    methods:{
      // 选中的按钮
      chooseBtn(btn){
        console.log(btn);
        if(btn === 'bwd_sh'){
          this.confirm();
        }else if(btn === 'bwd_js'){          
         this.acceptBtn();
        }else if(btn === 'bwd_tj'){

        }else if(btn === 'bwd_pj'){

        }else if(btn === 'bwd_cx'){

        }else if(btn === 'bwd_jj'){

        }else if(btn === 'bwd_zj'){

        }else if(btn === 'bwd_ht'){

        }
      },
      // 员工列表选中
      checkUserChange(item, index) {
      // console.log(item);
      this.departmentUserList.forEach((item,i)=>{
        if(index !== i){
          return this.departmentUserList[i].checked = false;
        }
      });
      // 若当前没有选中项-某个人员，将员工列表选中设为空数组
      if(!item.checked){
        this.currentCheckUser = {};
      }else{
        this.currentCheckUser = item;
      }
     },
      // 根据任务状态选色
      colorByTaskStatus(val){
        return this.tagStatusColor[this.taskStatusNode[val]];
      },
      // 获取任务信息
      getTaskInfo(){
        const id = 1;
        taskInfo({id:id}).then(res=>{
          console.log(res);
          this.originTaskInfo = res.data.bwdinfo;
          this.taskInfo.type = res.data.bwdinfo.type;
          this.taskInfo.showDateTime = res.data.bwdinfo.eapectdate;
          this.taskQuery.id = this.originTaskInfo.id;
          // 后端回显子任务列表
          this.listDataNewArr = res.data.list || [];
          // 当前任务状态值
          this.taskStatusVal = this.originTaskInfo.bwd_status;

          // 过滤出当前操作人id，获得子任务id
          if(res.data.list.length){
            var currentPeople = res.data.list.filter(item=>{
              if(item.bwd_designerid === res.data.userinfo.id){
                return item;
              }
            })
            var result = currentPeople.find(item=> {
              return item;
            })
            this.currentSonTaskId = result.bwd_designerid;
          }

          // 页面底部显示按钮
          this.taskBtn = res.data.butinfo;
          // 判断任务当前状态
          if(this.originTaskInfo.bwd_status === '10'){
            console.log('当前显示审批-待分配');
            this.taskStatus = 1;
          }else if(this.originTaskInfo.bwd_status === '40'){
            console.log('当前显示接受-待接受');
            this.taskStatus = 2;
          }else if(this.originTaskInfo.bwd_status === '100'){
            console.log('当前显示提交-进行中');
            this.taskStatus = 3;
          }else if(this.originTaskInfo.bwd_status === '150'){
            console.log('当前显示任务完结-待评价');
            this.taskStatus = 4;
          }
          // else if(this.originTaskInfo.bwd_status === '200'){
          //   console.log('当前显示任务结束-XXX中');
          //   this.taskStatus = 5;
          // }else if(this.originTaskInfo.bwd_status === '500'){
          //   console.log('当前显示任务终结-XXX中');
          //   this.taskStatus = 6;
          // }
        })
      },
      getTaskAll(){
        console.log('开始任务流转~');
      },
      // 部门选人员
      async departmentChoose(){
        departmentUser().then(res=>{
          // console.log(res);
          if(res.status === 20000){
            var result = res.data.map((item) => {
            return {
              'id':item.id,
              'label':item.name,
              'user_list':item.user_list,
              'children':item.children.map((item) => {
                return {
                  'id':item.id,
                  'label':item.name,
                  'user_list':item.user_list,
                  'children':item.children.map((item) => {
                    return {
                      'id':item.id,
                      'label':item.name,
                      'user_list':item.user_list,
                    }
                  }),
                }
              }),
            }
          }) || [];
          this.treeData = result;
          }
        })
      },
      // 添加子任务
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(JSON.stringify(this.currentCheckUser) == "{}"){
              return this.$message.error('请选择执行人！')
            }else{
              this.listData.forEach((item,index)=>{
                console.log(item);
                console.log(this.currentCheckUser);
                if(item.name === this.currentCheckUser.name){
                  this.listData.splice(index,1);
                  return this.$message.error('不能重复选择' + item.name);
                }
              })
              const newObj = {...this.ruleForm, ...this.currentCheckUser};
              // console.log(newObj);
              this.listData.push(newObj);
              this.listDataNewArr = this.listData;
              this.taskQuery.task = this.listData.map((item)=>{
                return {
                  bwd_designerid: item.id,
                  taskname: item.taskname,
                  content: item.content,
                  // bwd_designer: item.name
                }
              })

              

              
            }
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },
      // 重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.currentCheckUser = [];
      },
      // 点击面板
      handleClick(tab, event) {
        // console.log(tab, event);
        // console.log('当前面板' + tab.name);
      },
      handleClose(){
        this.dialogVisible = false;
        this.$router.push('/admin/task/services/index');
      },
      // 确认
      confirm(){
        if(this.taskInfo.type && this.taskInfo.dateTime && this.listData.length){
          alert('准备提交');
          // localStorage.setItem('obj',this.taskInfo);
          // this.showAddTaskForm = false;
          this.taskStatusVal = this.originTaskInfo.bwd_status;
          this.taskStatus = 2;
          this.taskQuery.bwd_flag = this.taskStatusBtn[1];
          console.log(this.taskQuery);
          taskAll(this.taskQuery).then(res=>{
            console.log(res);
          })

          // this.getTaskInfo();
        }else if(!this.taskInfo.type){
          return this.$message.error('请选择流转方式！')
        }else if(!this.taskInfo.dateTime.length){
          return this.$message.error('请选择预估时间！')
        }else if(!this.listData.length){
          return this.$message.error('请添加任务！')
        }
      },
      // 接受按钮
      acceptBtn(){
        this.taskStatus = 3;
        this.taskBothQuery.id = this.originTaskInfo.id;
        this.taskBothQuery.bwd_flag = this.taskStatusBtn[2];
        this.taskBothQuery.sbwdid = this.currentSonTaskId;
        console.log(this.taskBothQuery);
        taskAll(this.taskBothQuery).then(res=>{
          console.log(res);
        })
      },
      // 完成按钮
      finishBtn(){
        // this.finishStatus = false;
        // this.estimateStatus = true;
        this.taskStatus = 4;
      },
      // 评价按钮
      estimateBtn(){
        // this.taskStatus = 5;
      },
      
      // 拒绝
      refuse(){
        console.log('当前点了拒绝');
        this.taskBothQuery.id = this.originTaskInfo.id;
        this.taskBothQuery.bwd_flag = this.taskStatusBtn[6];
        console.log(this.taskBothQuery);
        taskAll(this.taskBothQuery).then(res=>{
          console.log(res);
        })
      },
      handleNodeClick(data){
        if(data.user_list){
          this.departmentUserList = data.user_list.map(item=>{
            return {
              name: item.name,
              id: item.id,
              checked: false
            }
          })
        }else{
          this.departmentUserList = [];
        }
      },
      // 取消任务指派
      cancelTask(index){
        return this.listData.splice(index, 1);
      },
      getTaskType(val){
        console.log(typeof(val));
        this.taskQuery.type = parseInt(val);
      },
      getDateTime(val){
        this.taskInfo.dateTime = val;
        console.log('选中时间范围：' + this.taskInfo.dateTime);
        this.taskQuery.eapectdate = val[1];
      }
    }
  }
</script>


<style lang="scss" scoped>

.d-flex {
  display: flex;
}

// 添加灰色圆角边框
.border-r {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  height: 220px;
  overflow: auto;
}

// 加星提醒
.warn-star::before {
  content: "*";
  color: #ff4949;
  margin-right: 4px;
}

// 去掉ul-li小圆点
.del-dot {
  list-style: none;
}

// 自定义tag标签颜色
.set_tag_color{
  background-color: #ecdaf4;
  border-color: #e6b8ee;
  color: #a03bb0;
  display: inline-block;
  height: 28px;
  padding: 0 10px;
  line-height: 28px;
  font-size: 12px;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  white-space: nowrap;
}

.task_page {
  // 任务需求头部标题
  .dialog-title {
    display:flex;
    align-content: center;
    justify-content: center;
    margin-bottom: 20px;
    .avatar-css {
      margin-top:10px;
      margin-right: 10px;
    }
  }
  .task_status{
    display:flex;
    .status_desc {
      flex:1;
      margin-top:10px;
      .status_title{
        color: #7a818c;
        font-size:14px;
      }
    }
  }
  // 任务信息
  .task-content {
    padding: 20px;
    .task_title > span{
      font-size: 18px;
    }
    .task-info {
      // border: 1px solid red;
      .d-flex {
        display: flex;
      }
      .info-title{
        display: block;
        width: 150px;
        height: 35px;
        line-height: 35px;
        text-align: center;
        // border: 1px solid blue;
        font-size: 16px;
        margin-bottom: 10px;
      }
      .info-desc {
        display:block;
        height:35px;
        width: 200px;
        line-height:35px;
        // border:1px solid red;
        font-size: 16px;
      }

      .info-type {
        display:block;
        height:35px;
        width: 100px;
        line-height:35px;
        // border:1px solid red;
        font-size: 16px;
      }

      .info-type::before{
        content: "*";
        color: #ff4949;
        margin-right: 4px;
      }

      .info-type {
        display:block;
        height:35px;
        width: 100px;
        line-height:35px;
        // border:1px solid red;
        font-size: 16px;
      }

      .info-estimate-time {
        display:block;
        height:35px;
        width: 100px;
        line-height:35px;
        // border:1px solid red;
        font-size: 16px;
      }

      .info-estimate-time::before {
        content: "*";
        color: #ff4949;
        margin-right: 4px;
      }
      .info-content {
        width:600px;
        height:auto;
        font-size: 16px;
        padding: 10px 0;
        margin-bottom: 10px;
      }
      .info-time {
        display: block;
        width: 150px;
        height: 35px;
        color: #7a818c;
        line-height: 35px;
        text-align: center;
        // border: 1px solid blue;
        font-size: 16px;
        margin-bottom: 10px;
      }
      .info-date {
        display: block;
        width: 250px;
        height: 35px;
        line-height: 35px;
        // border: 1px solid blue;
        font-size: 16px;
        margin-bottom: 10px;
      }
    }


    .task_devide {
      .task_devide_title > span {
        font-size:18px;
      }

      .listData_css {
        margin-bottom:20px;
        border-bottom: 2px dashed #dcdfe6;
        padding:0 10px;
        .listData_f {
          position:relative;
          .task_t {
            height:30px;
            line-height:30px;
          }
          .listData_s{
            position:absolute;
            right:0;
            bottom:5px;
          }
        }
      }

      .listData_desc{
        display:flex;
        align-items: center;
        justify-content:center; 
        color:gray;
        padding:30px;
        margin-bottom:20px;
      }
    }
    .demo-ruleForm {
      margin-top: 20px;
    }
  }

  .bottom-content{
    padding: 20px;
    margin-top: -20px;
   
  }

  .dialog-footer {
    position: fixed;
    bottom: 0;
    width:100%;
    height: 60px;
    line-height: 60px;
    background-color: #fff;
  }
}
</style>

