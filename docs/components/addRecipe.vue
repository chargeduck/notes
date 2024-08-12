<template>
  <div style="margin: 20px 20px">
    <el-form inline label-width="100px" label-position="right">
      <el-form-item>
        <el-button type="primary" @click="addRecipe">添加配方</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dynamicTableData" border stripe style="width: 100%">
      <el-table-column type="index" label="序号" width="100"/>
      <el-table-column prop="recipeType" label="配方类型">
        <template #default="{row}">
          <el-select
              v-model="row.recipeType"
              filterable
              clearable
          >
            <el-option
                v-for="(item, index) in row.recipeTypeItems"
                :key="index"
                :value="item.dictValue"
                :label="item.dictLabel"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="recipeId" label="配方名称">
        <template #default="{row}">
          <el-select
              v-model="row.recipeId"
              filterable
              clearable
              @change="changeRecipeType(row)"
          >
            <el-option
                v-for="(item, index) in row.recipeList"
                :key="index"
                :value="item.id"
                :label="item.recipeName"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
          label="操作"
          width="300"
      >
        <template #default="{row}">
          <el-button
              size="mini"
              type="danger"
              plain
              @keydown.tab.native="tabKeyHandler"
              @click="delProperty(row.$index, row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'AddRecipe',
  data() {
    return {
      dynamicTableData: [{
        index: 0,
        recipeType: '',
        recipeTypeItems: [
          {
            dictValue: 0,
            dictLabel: '面种'
          },
          {
            dictValue: 1,
            dictLabel: '包体'
          },
          {
            dictValue: 2,
            dictLabel: '配方'
          }
        ],
        recipeId: null,
        remark: '',
        recipeList: [
          {
            id: 0,
            recipeName: '高筋粉'
          },
          {
            id: 1,
            recipeName: '低筋粉'
          },
          {
            id: 3,
            recipeName: '黄油'
          },
          {
            id: 4,
            recipeName: '牛奶'
          }
        ]
      }],
      recipeTypeItems: [],
      recipeMap: new Map()
    }
  },
  watch: {
    dynamicTableData: {
      deep: true,
      handler(newVal, oldVal) {
        this.changeData()
      }
    }
  },
  methods: {
    addRecipe() {
      const property = this.dynamicTableData
      const length = property.length
      this.dynamicTableData.push(
          {
            index: parseInt(length),
            recipeType: '',
            recipeTypeItems: [
              {
                dictValue: 0,
                dictLabel: '面种'
              },
              {
                dictValue: 1,
                dictLabel: '包体'
              },
              {
                dictValue: 2,
                dictLabel: '配方'
              }
            ],
            recipeId: null,
            remark: '',
            recipeList: [
              {
                id: 0,
                recipeName: '高筋粉'
              },
              {
                id: 1,
                recipeName: '低筋粉'
              },
              {
                id: 3,
                recipeName: '黄油'
              },
              {
                id: 4,
                recipeName: '牛奶'
              }
            ]
          }
      )
    },
    changeRecipeType(row) {
      const index = row.index
      const recipeType = row.recipeType
      this.dynamicTableData[index].recipeList = this.recipeMap[recipeType]
    },
    changeData() {
      console.log(this.dynamicTableData)
    },
    delProperty(index, row) {
      const that = this
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定的操作(调用接口)
        const property = that.dynamicTableData
        for (let i = 0; i < property.length; i++) {
          if (row.index === property[i].index) {
            property.splice(i, 1)
            this.$message({message: '删除成功', duration: 2000, type: 'success'})
          }
        }
      }).catch(() => {
        // 点取消的提示
        this.$message({message: '删除失败', duration: 2000, type: 'error'})
      })
      this.changeData()
    },
    tabKeyHandler(event) {
      console.log(event)
      this.addProperty()
    }
  }
}
</script>
<style></style>
