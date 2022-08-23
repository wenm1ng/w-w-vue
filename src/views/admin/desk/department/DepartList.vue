<template>

  <div class="app-container">

    <div class="custom-tree-container">

      <el-row :gutter="60">
        <el-col :span="10" :offset="6">
          <el-tree
            :data="data"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
          >
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>{{ node.data.name }}</span>
                <span>
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => addDialog(node.data)">
                    添加
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => addDialog(node.data,'edit')">
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => remove(node.data)">
                    删除
                  </el-button>
                </span>
              </span>
          </el-tree>


        </el-col>
      </el-row>

    </div>

    <add params="{}" ref="RefAdd" @getList="getList()"></add>

  </div>


</template>

<script>

import {departmentcDestroy, departmentIndex} from "@/api/admin/department";
import Add from "@/views/admin/desk/department/Add";

export default {
  name: "DepartList",
  data() {

    return {

      data: [],
    }
  },
  async created() {
    await this.getList()
  },
  methods: {
    async getList() {
      this.listLoading = true
      departmentIndex(this.listQuery).then(response => {
        if (response.status === 20000) {
          this.data = JSON.parse(JSON.stringify(response.data))
        }
        this.listLoading = false
      })
    },
    append(data) {
      const newChild = {id: id++, label: 'testtest', children: []};
      if (!data.children) {
        this.$set(data, 'children', []);
      }
      data.children.push(newChild);
    },
    addDialog(node, is_edit = false) {
      console.log(123123, node)
      this.$refs.RefAdd.showDialog(node, is_edit);

    },
    remove(node) {
      departmentcDestroy({id: node.id}).then(response => {
        if (response.status === 20000) {
          this.$base.message({message: response.message});
          this.getList();
        }
      })

    },

  }, components: {
    Add,
  },
};
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
