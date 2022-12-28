<template>
  <div>
    <van-popup position="bottom" safe-area-inset-bottom v-model="isDialog" round get-container="#app">
      <div class="common-popup">
        <div class="common-popup-header">
          <div></div>
          <div class="common-popup-header-title">
            <span>拒绝</span>
          </div>
          <div></div>
        </div>
        <div class="common-popup-body">
          <div style="text-align: center; font-size: 0.86rem; margin-bottom: 2rem;">
            <p>拒绝可能会导致失去一次成交的机会，你确定要拒绝吗？</p>
          </div>
          <!-- <el-form :model="rejectForm" ref="rejectForm" label-width="100px" :rules="rules">
              <el-form-item label="驳回理由：" prop="note" style="width:90%" :rules="[{required:true,message:'驳回理由不能为空',trigger:'blur'}]">
                <el-input v-model="rejectForm.note" type="textarea" :rows="4" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="上传凭证：" prop="fileImgList" :rules="[{required:true,message:'不能为空'}]">
                <el-upload v-model="rejectForm.fileImgList" :on-change="onChange" :before-remove="handleRemove" :on-exceed="onUploadExceed" :file-list="rejectForm.fileImgList" accept="image/png, image/jpeg" action :auto-upload="false" :limit="9" list-type="picture-card" multiple>
                  <div class="upload-style">
                    <i slot="default" class="el-icon-plus"></i>
                    <span>请选择</span>
                  </div>
                </el-upload>
              </el-form-item>
            </el-form> -->
          <van-form ref="recordForm" @submit="handleSubmit" :show-error-message="false" validate-trigger="onSubmit" :submit-on-enter="false" @failed="handleFailed">
            <van-field label="拒绝理由" v-model="rejectForm.note" name="reserveTime" clearable rows="3" maxlength="500" autosize :rules="[{ required: true, message: '请填写拒绝理由' }]" type="textarea" input-align="right" placeholder="请输入">
              <template #left-icon>
                <span class="required-icon">*</span>
              </template>
            </van-field>
            <van-field clearable label="拒绝凭证" right-icon="photo" class="photo-reserve" :rules="[{ required: true, message: '请上传拒绝凭证' }]">
              <template #left-icon>
                <span class="required-icon">*</span>
              </template>
              <template #input>
                <van-uploader v-model="rejectForm.fileImgList" :max-count="9" :before-read="handleFileBeforeRead" :max-size="5 * 1024 * 1024" @oversize="onOversize" />
              </template>
            </van-field>
            <div class="common-popup-footer">
              <van-button style="width: 8rem; margin-right: 1rem;" native-type="button" @click="handleClose">取消</van-button>
              <van-button type="info" style="width: 8rem;" native-type="submit">拒绝</van-button>
            </div>
          </van-form>
        </div>
      </div>
    </van-popup>
    <!-- 转交 -->
    <ConsultDeliver :is-open.sync="isConsultDeliverShow" :sId="sId" @complete="handleUpdataInfo" />
    <!-- 分配咨询 -->
    <ConsultDistribute :is-open.sync="isConsultDistributeShow" :sId="sId" @complete="handleUpdataInfo" />
  </div>
</template>

<script>
// 拒绝学员
import { rejectedStudentApi, uploadHandoverFileApi } from '@/api/potentialGuest/paymentRecord'

export default {
  name: 'ConsultSea',
  props: {
    isOpen: {
      default: false,
      type: Boolean
    },
    // 学生id
    sId: {
      require: true,
      type: Number
    },
    // 活动id
    aId: Number
  },
  components: {
    ConsultDeliver: () => import('../ConsultDeliver/index'),
    ConsultDistribute: () => import('../ConsultDistribute/index')
  },
  data() {
    return {
      fileList: [],
      imgTypeArr: ['image/jpeg', 'image/jpg', 'image/png'],
      isConsultDeliverShow: false, // 转交弹窗显示
      isConsultDistributeShow: false, // 分配咨询弹窗显示
      isDialog: false,
      rejectForm: { id: this.aId, note: null, fileImgList: [] },
      deliverId: null,
      belongName: null
    }
  },
  watch: {
    isOpen(val) {
      this.isDialog = val
    },
    isDialog(val) {
      this.$emit('update:isOpen', val)
    }
  },
  methods: {
    handleClose() {
      this.isDialog = false
    },
    handleDeliver(key) {
    },
    handleUpdataInfo() {
      this.$emit('complete')
    },
    handleFileBeforeRead(file) {
      if (!this.imgTypeArr.includes(file.type)) {
        this.$fm('只能上传图片')
        return false
      }
      return true
    },
    onOversize() {
      this.$fm('文件大小不能超过5M');
    },
    /* handleDeleteFile(e) {
      this.$loading(true)
      delRecordFile(e.id).then(res => {
        this.$sm(res.data)
      }).finally(() => {
        this.$loading(false)
      })
    }, */
    handleFailed(errorInfo) {
      this.$fm(errorInfo.errors[0].message)
    },
    handleSubmit() {
      this.$loading(true, 'ConsultReceive')
      rejectedStudentApi(this.rejectForm).then(res => {
        let formData = new FormData()
        this.rejectForm.fileImgList.forEach(item => {
          formData.append('imgList', item.file)
        })
        uploadHandoverFileApi(this.rejectForm.id, formData).then(res1 => {
          this.isDialog = false
          this.$sm('驳回成功')
          this.$loading(false, 'ConsultReceive')
          this.handleUpdataInfo()
        }).catch(_ => {
          this.$loading(false, 'ConsultReceive')
        })
      }).catch(_ => {
        this.$loading(false, 'ConsultReceive')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.common-popup-body {
  .belong-text {
    color: #666666;
  }
  .required-icon {
    font-size: 2rem;
    position: relative;
    top: 0.4rem;
    color: #f56c6c;
  }
  .van-icon {
    font-size: 0.9rem;
    margin-right: 0.3rem;
    color: #0088fe;
  }
  .photo-reserve {
    /deep/.van-field__body {
      align-items: flex-start;

      .van-icon-photo {
        color: #1989fa;
        font-size: 22px;
        position: relative;
        top: -2px;
      }
    }
  }
  .common-popup-footer {
    .deBtn {
      float: left;
      height: 1.6rem;
      color: #333;
      border-radius: 47px;
      font-size: 0.86rem;
      padding: 0 0.68rem;
      // text-align: center;
      line-height: 1.6rem;
      background: #fafafa;
    }
  }
}
</style>
