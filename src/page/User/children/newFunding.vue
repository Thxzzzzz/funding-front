// TODO 发起众筹
<template>
  <div>
    <y-shelf title="发起众筹">
      <div slot="content">
        <div class="content">
          <div class="steps">
            <el-steps :active="step"
                      align-center>
              <el-step title="产品信息"
                       description=""></el-step>
              <el-step title="套餐信息"
                       description=""></el-step>
              <el-step title="产品详情"
                       description=""></el-step>
              <el-step title="提交审核"
                       description=""></el-step>
            </el-steps>
          </div>
          <!-- 产品信息 -->
          <div class="editZone"
               v-if="step === 1">
            产品信息
          </div>
          <!-- 套餐信息 -->
          <div class="editZone"
               v-else-if="step === 2">
            套餐信息
          </div>
          <!-- 产品详情 -->
          <div class="editZone"
               v-else-if="step === 3">
            产品详情
          </div>
          <!-- 提交审核 -->
          <div class="editZone"
               v-else-if="step === 4">
            提交审核
          </div>
          <div class="stepControl">
            <el-button type="normal"
                       @click="switchStep(step - 1)"
                       :disabled="lastStepDisable">上一步</el-button>
            <el-button type="normal"
                       @click="switchStep(step + 1)"
                       :disabled="nextStepDisable">下一步</el-button>
          </div>
        </div>
      </div>
    </y-shelf>
  </div>
</template>
<script>
  import YShelf from '/components/shelf'
  export default {
    data () {
      return {
        // 步骤
        step: 1
      }
    },
    computed: {
        // 禁用上一步的条件
      lastStepDisable () {
        return this.step < 2
      },
        // 禁用下一步的条件
      nextStepDisable () {
        return this.step > 3
      }
    },
    methods: {
      switchStep (step) {
        console.log(step)
        this.step = step
      }
    },
    created () {
        // 获取 url 中的参数，存在的话就查询数据库（编辑模式）不存在则是新发起众筹
    },
    components: {
      YShelf
    }
  }
</script>
<style lang="scss" scoped>
  .content {
      margin: 12px;
  }
  .editZone {
      margin:15px;
  }
  .stepControl {
    padding: 10px 10px;
    text-align: center;
  }
  .support {
    line-height: 2em;
    font-size: 22px;
    color: #999;
  }
</style>
