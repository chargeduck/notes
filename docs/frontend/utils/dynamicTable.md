::: tip
前端动态表格的配置
:::
# 1. 动态增减表格
> 点击增加可以在表格中动态增加一行，表格最后有删除按钮，可以进行删除动态表格的数据

# 2. 效果展示
<script setup>
import AddRecipe from '../../components/addRecipe.vue'
</script>
<AddRecipe/>

# 3. 代码

## 3.1 Vue2
> Vue2 + ElementUi + Axios

```vue
<template>
  <div style="margin: 20px 20px">
    <el-form inline label-width="100px" label-position="right">
      <el-form-item>
        <el-button type="primary" @click="addRecipe">添加配方</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dynamicTableData" border style="width: 100%">
      <el-table-column type="index" label="序号" width="100"/>
      <el-table-column prop="recipeType" label="配方类型">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.recipeType"
            filterable
            clearable
            @change="changeRecipeType(scope.row)"
          >
            <el-option
              v-for="(item, index) in recipeTypeItems"
              :key="index"
              :value="item.dictValue"
              :label="item.dictLabel"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="recipeId" label="配方名称">
        <template v-slot="scope">
          <el-select
            v-model="scope.row.recipeId"
            filterable
            clearable
            @change="changeRecipeType(scope.row)"
          >
            <el-option
              v-for="(item, index) in scope.row.recipeList"
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
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @keydown.tab.native="tabKeyHandler"
            @click="chooseMaterial(scope.row)"
          >
            选择原料
          </el-button>
          <el-button
            size="mini"
            type="primary"
            plain
            @keydown.tab.native="tabKeyHandler"
            @click="addRecipe"
          >
            添加
          </el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            @keydown.tab.native="tabKeyHandler"
            @click="delProperty(scope.$index, scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getDictItemsByType } from '@/api/sysDictItem'
import { allRecipeList } from '@/api/recipe'
import { popAutoHeightDialog } from '@/utils/popDialog'

export default {
  name: 'AddRecipe',
  data() {
    return {
      dynamicTableData: [],
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
  created() {
    this.getAllRecipeType()
    this.getRecipeMap()
  },
  methods: {
    getRecipeMap() {
      allRecipeList({ mapFlag: true }).then(resp => {
        this.recipeMap = resp.data
      })
    },
    getAllRecipeType() {
      getDictItemsByType({ dictType: 'recipe_type' }).then(res => {
        this.recipeTypeItems = res.data
      })
    },
    addRecipe() {
      const property = this.dynamicTableData
      const length = property.length
      this.dynamicTableData.push(
        {
          index: parseInt(length),
          recipeType: '',
          recipeId: null,
          remark: ''
        }
      )
    },
    changeRecipeType(row) {
      const index = row.index
      const recipeType = row.recipeType
      this.dynamicTableData[index].recipeList = this.recipeMap[recipeType]
    },
    changeData() {
      this.$emit('update-table-data', this.dynamicTableData)
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
            this.$message({ message: '删除成功', duration: 2000, type: 'success' })
          }
        }
      }).catch(() => {
        // 点取消的提示
        this.$message({ message: '删除失败', duration: 2000, type: 'error' })
      })
      this.changeData()
    },
    tabKeyHandler(event) {
      console.log(event)
      this.addProperty()
    },
    chooseMaterial(row) {
      if (row.recipeId) {
        const recipeName = this.recipeMap[row.recipeType].find(item => item.id === row.recipeId).recipeName
        popAutoHeightDialog('views/determined/chooseMaterial', '800px', this.setMaterial, {
          recipeName,
          materialData: row.materialData,
          recipeId: row.recipeId
        })
      } else {
        this.$message.error('请选择配方种类和具体配方')
      }
    },
    setMaterial(data) {
      console.log(data)
    }
  }
}
</script>
<style></style>

```
## 3.2 Vue3
> Vue3 + ElementPlus + Axios
> 
> Vue3不会写，只是改成了ElementPlus，将就着看吧

```vue
<template>
  <div style="margin: 20px 20px">
    <el-form inline label-width="100px" label-position="right">
      <el-form-item>
        <el-button type="primary" @click="addRecipe">添加配方</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dynamicTableData" border style="width: 100%">
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

```
