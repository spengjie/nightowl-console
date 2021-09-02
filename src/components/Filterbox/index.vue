<template>
  <div
    v-clickoutside="handleClickOutside"
    class="filterbox el-input"
    :class="[filterSize ? 'el-input--' + filterSize : '']"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false">
    <span class="el-input__prefix">
      <i class="el-input__icon filterbox-input__icon el-icon-search" />
    </span>
    <div
      class="filterbox__inner"
      :class="{ 'is-focus': focusing }"
      tabindex="0"
      @focus="handleContainerFocus">
      <span>
        <el-tag
          v-for="filter in filters"
          :key="filter.label + filter.operator + filter.value"
          closable
          :type="filter.invalid ? 'danger' : 'info' "
          :hit="filter.selected"
          @close="deleteFilter(filter)">
          <span>{{ displayFilter(filter) }}</span>
        </el-tag>
      </span>
      <el-popover
        ref="popper"
        v-model="showDropdown"
        trigger="manual"
        placement="bottom-start"
        style="flex-grow: 1; display: flex"
        popper-class="filterbox-popover"
        :visible-arrow="false">
        <el-scrollbar
          wrap-class="el-select-dropdown__wrap">
          <suggestion-menu v-if="suggestionMode === 'key' && keySuggestions.length > 0">
            <suggestion-item
              v-for="suggestion in keySuggestions"
              :key="suggestion.label"
              :value="suggestion.value"
              :label="suggestion.label"
              :hint="displaySuggestionHint(suggestion)"
              :match="input"
              @command="handleSelect" />
          </suggestion-menu>
          <suggestion-menu
            v-else-if="suggestionMode === 'operator' &&
              (fixedSuggestions.length > 0 || operatorSuggestions.length > 0)">
            <suggestion-item
              v-for="suggestion in fixedSuggestions"
              :key="suggestion"
              :value="suggestion"
              :match="currentFilter.operator"
              @command="handleSelect" />
            <template v-if="operatorSuggestions.length > 0">
              <el-divider v-if="fixedSuggestions.length > 0" />
              <suggestion-item
                v-for="suggestion in operatorSuggestions"
                :key="suggestion"
                :value="suggestion"
                :hint="operatorHint(suggestion)"
                :match="currentFilter.operator"
                @command="handleSelect" />
            </template>
          </suggestion-menu>
          <template v-else-if="suggestionMode === 'value'">
            <div v-if="['date', 'datetime'].includes(currentFilter.type)" style="padding: 10px 20px">
              <el-date-picker
                v-model="daterange"
                range-separator="/"
                :type="datePickerType"
                @focus="handleDatePickerFocus"
                @blur="handleDatePickerBlur" />
              <el-button type="primary" style="margin-left: 10px" :disabled="!daterange" @click="setDate">
                {{ $t('ui.set') }}
              </el-button>
            </div>
            <suggestion-menu v-else-if="valueSuggestions.length > 0">
              <suggestion-item
                v-for="suggestion in valueSuggestions"
                :key="suggestion"
                :value="suggestion"
                :match="currentFilter.value"
                @command="handleSelect" />
            </suggestion-menu>
          </template>
        </el-scrollbar>
        <el-input
          slot="reference"
          ref="input"
          v-model="input"
          clearable
          tabindex="-1"
          :placeholder="placeholder"
          @keydown.native.enter.prevent="handleKeyEnter"
          @keydown.native.delete="handleKeyDelete"
          @keydown.native.down.stop.prevent="navigateSuggestions('next')"
          @keydown.native.up.stop.prevent="navigateSuggestions('prev')"
          @keydown.native.esc.stop.prevent="showSuggestion = false"
          @keydown.native.tab="showSuggestion = false"
          @keydown.native="handleKeyDown"
          @input="handleInputChange"
          @focus="handleInputFocus"
          @blur="handleInputBlur" />
      </el-popover>
    </div>
    <span class="el-input__suffix">
      <span class="el-input__suffix-inner">
        <i
          v-if="showClear"
          class="el-input__icon filterbox-input__icon el-icon-close"
          style="cursor: pointer"
          @click="clearFilters" />
      </span>
    </span>
  </div>
</template>

<script>
import { debounce } from 'throttle-debounce';
import { formatDate } from '@/utils/datetime';
import SuggestionMenu from './SuggestionMenu';
import SuggestionItem from './SuggestionItem';

export default {
  name: 'Filterbox',
  components: {
    SuggestionMenu,
    SuggestionItem,
  },
  props: {
    filterKeys: {  // value, label
      type: Array,
      default() {
        return [];
      },
    },
    fetchValueSuggestions: {
      type: Function,
      default: null,
    },
    keywordFilter: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    storageKey: String,
    size: String,
  },
  provide() {
    return {
      filterbox: this,
    };
  },
  data() {
    const filterKeyMap = {};
    this.filterKeys.forEach(filterKeyDef => {
      filterKeyMap[filterKeyDef.label || filterKeyDef.value] = filterKeyDef;
    });
    return {
      hovering: false,
      focusing: false,
      shouldBlur: true,
      datePickerVisible: false,
      filterKeyMap,
      loading: false,
      debounce: 200,
      suggestionMode: 'key',
      currentFilter: {},
      operators: {
        str: [':', '='],
        bool: ['true', 'false'],
        int: ['=', '!=', '>', '>=', '<', '<='],
        float: ['=', '!=', '>', '>=', '<', '<='],
        date: [':', '=', '>', '<'],
        datetime: [':', '=', '>', '<'],
      },
      fixedOperators: ['<empty>', '<non-empty>'],
      keySuggestions: [],
      fixedSuggestions: [],
      operatorSuggestions: [],
      valueSuggestions: [],
      selectedSuggestion: null,
      selectedSuggestionIndex: -1,
      input: '',
      filters: [],
      showSuggestion: false,
      daterange: null,
    };
  },
  computed: {
    filterSize() {
      return this.size || (this.$ELEMENT || {}).size;
    },
    showClear() {
      return this.filters.length && (this.hovering || this.focusing);
    },
    datePickerType() {
      if (this.currentFilter.operator === ':') {
        if (this.currentFilter.type === 'date') {
          return 'daterange';
        } else {
          return 'datetimerange';
        }
      } else {
        if (this.currentFilter.type === 'date') {
          return 'date';
        } else {
          return 'datetime';
        }
      }
    },
    showDropdown: {
      get() {
        if (!this.showSuggestion)  return false;
        if (this.suggestionMode === 'key' && this.keySuggestions.length > 0)  return true;
        if (this.suggestionMode === 'operator' &&
          (this.fixedSuggestions.length > 0 || this.operatorSuggestions.length > 0)) { return true }
        if (this.suggestionMode === 'value' &&
          (['date', 'datetime'].includes(this.currentFilter.type)
            || this.valueSuggestions.length > 0)) { return true }
        return false;
      },
      set() {}
    },
    validFilters() {
      const filters = [];
      this.filters.forEach(filter => {
        if (!filter.invalid) {
          filters.push({
            key: filter.key,
            operator: filter.operator,
            value: filter.value,
            type: filter.type,
          });
        }
      });
      return filters;
    }
  },
  watch: {
    input: {
      handler(input) {
        const filter = {
          key: '',
          operator: '',
          value: '',
          selected: false,
        };
        let suggestionMode = 'key';
        const segs = input.split(' ');
        let foundKeyDef = false;
        for (let index = 0; index < segs.length; index++) {
          if (!foundKeyDef) {
            filter.key = segs.slice(0, index + 1).join(' ');
            filter.label = filter.key;
            const filterKeyDef = this.filterKeyMap[filter.key];
            if (filterKeyDef !== undefined) {
              foundKeyDef = true;
              filter.key = filterKeyDef.value;
              filter.label = filterKeyDef.label || filterKeyDef.key;
              filter.labelText = filterKeyDef.labelText || filter.label;
              filter.type = filterKeyDef.type || 'str';
              if (segs.length - index > 1)  suggestionMode = 'operator';
              continue;
            }
          }
          if (suggestionMode === 'operator') {
            const operator = segs[index];
            if (operator === '')  continue;
            filter.operator = operator;
            if (!this.fixedOperators.includes(filter.operator) &&
                !this.operators[filter.type].includes(filter.operator)) { filter.invalid = true }
            if (segs.length - index > 1) {
              suggestionMode = 'value';
              filter.value = segs.slice(index + 1).join(' ').trim();
            }
            break;
          }
        }
        if (!foundKeyDef)  filter.key = filter.key.trim();
        if (filter.type === 'bool' && suggestionMode === 'operator')  suggestionMode === 'value';

        this.currentFilter = filter;
        this.suggestionMode = suggestionMode;
      },
      immediate: true,
    }
  },
  mounted() {
    this.popperElm = this.$refs.popper.$refs.popper;
    this.debouncedGetSuggestions = debounce(this.debounce, this.getSuggestions);
    this.loadFilters();
  },
  methods: {
    displaySuggestionHint(suggestion) {
      const labelText = suggestion.labelText || suggestion.label;
      return this. $te('ui.' + labelText) ? this.$t('ui.' + labelText) : labelText;
    },
    displayFilter(filter) {
      if (!filter.key) {
        return `${this.$t('ui.search')}: ${filter.value}`;
      }
      let labelText = filter.labelText || filter.label;
      if (this.$te('ui.' + labelText))  labelText = this.$t('ui.' + labelText);
      if (this.fixedOperators.includes(filter.operator)) {
        return `${labelText}: ${filter.operator}`;
      }
      if (filter.type === 'bool') {
        return `${labelText} = ${filter.value}`;
      } else if (['date', 'datetime'].includes(filter.type)) {
        const dateFormat = filter.type === 'date' ?'%Y-%m-%d' : '%Y-%m-%d %H:%M:%S';
        if (Array.isArray(filter.value)) {
          return `${labelText}: ${formatDate(filter.value[0], dateFormat)} / ${formatDate(filter.value[1], dateFormat)}`;
        } else {
          return `${labelText} ${filter.operator} ${formatDate(filter.value, dateFormat)}`;
        }
      } else if (!filter.operator || filter.operator === ':') {
        return `${labelText}: ${filter.value}`;
      } else {
        return `${labelText} ${filter.operator} ${filter.value}`;
      }
    },
    operatorHint(operator) {
      if (this.currentFilter.type === 'str') {
        if (operator === ':') {
          return this.$t('ui.search');
        } else if (operator === '=') {
          return this.$t('ui.exactMatch');
        }
      } else if (['date', 'datetime'].includes(this.currentFilter.type)) {
        if (operator === ':') {
          return this.$t('ui.daterange');
        }
      }
      return '';
    },
    handleDatePickerFocus() {
      this.shouldBlur = false;
      this.datePickerVisible = true;
    },
    handleDatePickerBlur() {
      this.shouldBlur = true;
      this.datePickerVisible = false;
    },
    fetchTypeSuggestions() {
      const { label } = this.currentFilter;
      const labelLowerCase = label.toLowerCase();
      this.keySuggestions = label ? this.filterKeys.filter(filterKeyDef => {
        return filterKeyDef.label.toLowerCase().includes(labelLowerCase);
      }) : this.filterKeys;
      if (this.selectedSuggestion && !this.selectedSuggestion.toLowerCase().includes(labelLowerCase)) {
        this.resetSelectedSuggestion();
      }
    },
    fetchOperatorSuggestions() {
      const { operator, type } = this.currentFilter;
      const operatorlowerCase = operator.toLowerCase();
      const operators = this.operators[type] || [];
      this.operatorSuggestions = operator ? operators.filter(op => {
        return op.includes(operatorlowerCase);
      }) : operators;
      this.fixedSuggestions = operator ? this.fixedOperators.filter(op => {
        return op.includes(operatorlowerCase);
      }) : this.fixedOperators;
      if (this.selectedSuggestion &&
          this.operatorSuggestions.indexOf(this.selectedSuggestion) === -1 &&
          !this.selectedSuggestion.toLowerCase().includes(operator)) {
        this.resetSelectedSuggestion();
      }
    },
    doFetchValueSuggestions() {
      if (!this.fetchValueSuggestions) {
        return;
      }
      const { key, value, type } = this.currentFilter;
      if (type !== 'str') {
        this.valueSuggestions = [];
        return;
      }
      if (this.selectedSuggestion && !this.selectedSuggestion.toLowerCase().includes(value.toLowerCase())) {
        this.resetSelectedSuggestion();
      }
      if (this.valueSuggestions.length === 0)  this.loading = true;
      this.fetchValueSuggestions(key, value, suggestions => {
        if (Array.isArray(suggestions)) {
          this.loading = false;
          this.valueSuggestions = suggestions;
        }
      });
    },
    getSuggestions() {
      const input = this.input.trim();
      if (!input) {
        this.resetSelectedSuggestion();
      }
      if (this.suggestionMode === 'key') {
        this.fetchTypeSuggestions();
      } else if (this.suggestionMode === 'operator') {
        this.fetchOperatorSuggestions();
      } else {
        this.doFetchValueSuggestions();
      }
    },
    resetSelectedSuggestion() {
      this.selectedSuggestion = null;
      this.selectedSuggestionIndex = -1;
    },
    toggleLastFilterState(state) {
      if (this.filters.length >= 1) {
        const lastFilter = this.filters[this.filters.length - 1];
        const currentState = lastFilter.selected;
        if (currentState && state) {
          return true;
        }
        lastFilter.selected = state;
        return false;
      }
      return false;
    },
    handleKeyEnter() {
      if (this.suggestionMode === 'key') {
        if (this.selectedSuggestion) {
          this.input = this.selectedSuggestion + ' ';
          this.resetSelectedSuggestion();
          this.debouncedGetSuggestions();
          return;
        }
      }
      if (this.suggestionMode === 'operator') {
        if (this.selectedSuggestion) {
          this.input = this.currentFilter.label + ' ' + this.selectedSuggestion + ' ';
          this.resetSelectedSuggestion();
          this.$nextTick(() => {
            if (this.currentFilter.type === 'bool' || this.fixedOperators.includes(this.currentFilter.operator)) {
              this.completeFilter();
            } else {
              this.debouncedGetSuggestions();
            }
          });
          return;
        }
      }
      if (this.suggestionMode === 'value') {
        if (this.selectedSuggestion) {
          this.input = this.currentFilter.label + ' ' + this.currentFilter.operator + ' ' + this.selectedSuggestion;
          this.resetSelectedSuggestion();
        } else {
          this.input = this.currentFilter.label + ' ' + this.currentFilter.operator + ' ' + this.currentFilter.value;
        }
        this.$nextTick(() => {
          this.completeFilter();
        });
        return;
      }
      if (this.keywordFilter && this.input) {
        this.currentFilter.key = '';
        this.currentFilter.operator = ':';
        this.currentFilter.value = this.input;
        this.currentFilter.type = 'str';
        this.completeFilter();
      }
    },
    handleSelect(value, label) {
      if (this.suggestionMode === 'key') {
        this.input = (label || value) + ' ';
        this.$refs.input.focus();
      } else if (this.suggestionMode === 'operator') {
        this.input = this.currentFilter.label + ' ' + value + ' ';
        this.$nextTick(() => {
          if (this.currentFilter.type === 'bool' || this.fixedOperators.includes(this.currentFilter.operator)) {
            this.completeFilter();
          } else {
            this.$refs.input.focus();
          }
        });
      } else {
        this.input = this.currentFilter.label + ' ' + this.currentFilter.operator + ' ' + value;
        this.$nextTick(() => {
          this.completeFilter();
        });
      }
      this.resetSelectedSuggestion();
      this.debouncedGetSuggestions();
    },
    setDate() {
      this.completeFilter();
      this.debouncedGetSuggestions();
    },
    handleKeyDelete() {
      if (this.input === '' && this.toggleLastFilterState(true)) {
        this.filters.pop();
        this.$emit('filter', this.validFilters);
        this.saveFilters();
        this.showSuggestion = false;
      }
    },
    navigateSuggestions(direction) {
      if (!this.showSuggestion) {
        this.showSuggestion = true;
        return;
      }
      let items;
      if (this.suggestionMode === 'key')
      {
        items = this.keySuggestions.map(suggestion => suggestion.label || suggestion.value);
      } else if (this.suggestionMode === 'operator') {
        items = [].concat(this.fixedSuggestions, this.operatorSuggestions);
      } else {
        items = this.valueSuggestions;
      }
      if (direction === 'prev') {
        this.selectedSuggestionIndex--;
        if (this.selectedSuggestionIndex < 0) {
          this.selectedSuggestionIndex = items.length - 1;
        }
      } else {
        this.selectedSuggestionIndex++;
        if (this.selectedSuggestionIndex >= items.length) {
          this.selectedSuggestionIndex = 0;
        }
      }
      this.selectedSuggestion = items[this.selectedSuggestionIndex];
    },
    handleKeyDown(event) {
      if (event.keyCode !== 8) {
        this.toggleLastFilterState(false);
      }
    },
    handleInputChange(value) {
      this.$emit('input', value);
      this.debouncedGetSuggestions();
      this.showSuggestion = true;
    },
    handleContainerFocus() {
      this.$refs.input.focus();
      this.focusing = true;
    },
    handleInputFocus(event) {
      this.$emit('focus', event);
      this.focusing = true;
      this.shouldBlur = false;
      this.showSuggestion = true;
      this.debouncedGetSuggestions();
    },
    handleInputBlur(event) {
      this.shouldBlur = true;
      setTimeout(() => {
        if (!this.shouldBlur) return;
        this.$emit('blur', event);
        this.focusing = false;
        this.toggleLastFilterState(false);
      }, 100);
    },
    handleClickOutside() {
      if (this.datePickerVisible) return;
      this.showSuggestion = false;
    },
    clearFilters() {
      this.filters = [];
      this.input = '';
      this.daterange = null;
      this.$refs.input.focus();
      this.$emit('filter', this.validFilters);
      this.saveFilters();
    },
    completeFilter() {
      this.addFilter(this.currentFilter);
      this.input = '';
      this.daterange = null;
      this.suggestionMode = 'key';
      this.showSuggestion = false;
      this.debouncedGetSuggestions();
    },
    addFilter(filter) {
      if (!this.keywordFilter && filter.invalid === undefined) {
        const filterKeyDef = this.filterKeyMap[filter.label];
        if (filterKeyDef === undefined) {
          filter.invalid = true;
        } else if (!this.operators[filter.type] ||
            (!this.operators[filter.type].includes(filter.operator) &&
            !this.fixedOperators.includes(filter.operator))) {
          filter.invalid = true;
        }
      }
      if (this.keywordFilter && !filter.key) {
        // Do nothing
      } else if (filter.type === 'int' || filter.type === 'float') {
        if (!this.fixedOperators.includes(filter.operator) && typeof filter.value !== 'number') {
          const parsed = Number(filter.value);
          if (isNaN(parsed)) {
            filter.invalid = true;
          } else {
            filter.value = parsed;
          }
        }
      } else if (filter.type === 'bool') {
        const operatorLowerCase = filter.operator.toLowerCase();
        filter.value = filter.operator;
        filter.operator = '=';
        if (operatorLowerCase === 'true') {
          filter.value = true;
        } else if (operatorLowerCase === 'false') {
          filter.value = false;
        } else {
          filter.invalid = true;
        }
      } else if (['date', 'datetime'].includes(filter.type)) {
        if (Array.isArray(this.daterange)) {
          try {
            filter.value = [new Date(this.daterange[0]), new Date(this.daterange[1])];
          } catch {
            filter.invalid = true;
          }
        } else {
          try {
            filter.value = new Date(this.daterange);
          } catch {
            filter.invalid = true;
          }
        }
        this.daterange = null;
      }

      let hasFilter = false;
      this.filters.forEach(f => {
        if (f.key === filter.key && f.value === filter.value && f.operator === filter.operator) {
          hasFilter = true;
        }
      });
      if (!hasFilter) {
        this.filters.push(filter);
        this.$emit('filter', this.validFilters);
        this.saveFilters();
      }
    },
    deleteFilter(filter) {
      const index = this.filters.indexOf(filter);
      if (index > -1) {
        this.filters.splice(index, 1);
        this.$emit('filter', this.validFilters);
        this.saveFilters();
      }
      this.showSuggestion = false;
    },
    saveFilters() {
      if (!this.storageKey) {
        return;
      }
      localStorage.setItem(this.storageKey + '.filters', JSON.stringify(this.filters));
    },
    loadFilters() {
      if (!this.storageKey) {
        return;
      }
      const savedFilters = localStorage.getItem(this.storageKey + '.filters');
      if (savedFilters) {
        this.filters = JSON.parse(savedFilters);
      }
      this.$emit('filter', this.validFilters);
    },
  }
};
</script>
