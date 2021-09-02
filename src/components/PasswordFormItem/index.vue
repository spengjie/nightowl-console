<template>
  <el-form-item v-bind="$attrs" :rules="finalRules">
    <slot />
    <template #error>
      <div class="validation-wrapper">
        <el-alert
          :closable="false"
          show-icon
          :title="$t('message.password.len')"
          :type="lengthResult" />
        <el-alert
          :closable="false"
          show-icon
          :title="$t('message.password.note')"
          :type="charResult" />
        <el-alert
          :closable="false"
          show-icon
          :title="$t('message.password.uppercase')"
          :type="uppercaseResult"
          class="sub-validation" />
        <el-alert
          :closable="false"
          show-icon
          :title="$t('message.password.lowercase')"
          :type="lowercaseResult"
          class="sub-validation" />
        <el-alert
          :closable="false"
          show-icon
          :title="$t('message.password.number')"
          :type="numberResult"
          class="sub-validation" />
        <el-alert
          :closable="false"
          show-icon
          :title="$t('message.password.specialCharacter')"
          :type="specialCharResult"
          class="sub-validation" />
      </div>
    </template>
  </el-form-item>
</template>

<script>
export default {
  name: 'PasswordFormItem',
  props: {
    rules: Array,
    allowDefault: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      passwordRules: [{ validator: this.passwordValidator }],
      lengthValid: false,
      uppercaseValid: false,
      lowercaseValid: false,
      numberValid: false,
      specialCharValid: false,
    };
  },
  computed: {
    finalRules() {
      if (!this.rules || this.rules.lengthValid === 0)  return this.passwordRules;
      return this.rules.concat(this.passwordRules);
    },
    charValid() {
      return Number(this.uppercaseValid)
        + Number(this.lowercaseValid)
        + Number(this.numberValid)
        + Number(this.specialCharValid) >= 3;
    },
    lengthResult() {
      if (this.lengthValid) {
        return 'success';
      }
      return 'error';
    },
    charResult() {
      if (this.charValid) {
        return 'success';
      }
      return 'error';
    },
    uppercaseResult() {
      if (this.uppercaseValid) {
        return 'success';
      }
      if (this.charValid) {
        return 'info';
      }
      return 'error';
    },
    lowercaseResult() {
      if (this.lowercaseValid) {
        return 'success';
      }
      if (this.charValid) {
        return 'info';
      }
      return 'error';
    },
    numberResult() {
      if (this.numberValid) {
        return 'success';
      }
      if (this.charValid) {
        return 'info';
      }
      return 'error';
    },
    specialCharResult() {
      if (this.specialCharValid) {
        return 'success';
      }
      if (this.charValid) {
        return 'info';
      }
      return 'error';
    },
    valid() {
      return this.lengthValid && this.charValid;
    }
  },
  methods: {
    passwordValidator(rule, value, callback) {
      if (this.allowDefault && value === '$encrypted') {
        callback();
        return;
      }
      this.lengthValidator(value);
      this.uppercaseValidator(value);
      this.lowercaseValidator(value);
      this.numberValidator(value);
      this.specialCharValidator(value);
      if (!this.lengthValid) {
        callback(new Error('Password is too short'));
      } else if (!this.charValid) {
        callback(new Error('Weak password'));
      } else {
        callback();
      }
    },
    lengthValidator(value) {
      this.lengthValid = value.length >= 12;
    },
    uppercaseValidator(value) {
      this.uppercaseValid = /[A-Z]/.test(value);
    },
    lowercaseValidator(value) {
      this.lowercaseValid = /[a-z]/.test(value);
    },
    numberValidator(value) {
      this.numberValid = /\d/.test(value);
    },
    specialCharValidator(value) {
      this.specialCharValid = /[!"#$%&\\'()*+,-./:;<=>?@[\]^_`{|}~]/.test(value);
    },
  }
};
</script>

<style lang="scss">
.validation-wrapper {
  margin: 5px;
  line-height: normal;
  .el-alert {
    background-color: transparent;
    padding: 0;
  }
  .el-alert+.el-alert {
    margin-top: 5px;
  }
  .sub-validation {
    margin-left: 20px;
  }
}
</style>
