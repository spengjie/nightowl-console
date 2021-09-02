<template>
  <div class="extended-table">
    <div
      v-if="filterable || showPagination"
      ref="toolbar"
      :class="{ 'has-pagination': showPagination, 'toolbar': !showPagination }">
      <filterbox
        v-if="filterable"
        ref="filterbox"
        :filter-keys="filterKeys"
        :keyword-filter="!!keywordKeys"
        :fetch-value-suggestions="fetchFilterValueSuggestions"
        :placeholder="filterPlaceholder"
        :storage-key="filterStorageKey"
        @filter="filter" />
      <pagination
        v-if="showPagination"
        :page="page"
        :limit="limit"
        :total="totalCount"
        style="margin-left: 6px"
        @page-change="pageChange" />
    </div>
    <el-table
      ref="table"
      :key="tableKey"
      v-loading="loading"
      v-bind="$attrs"
      element-loading-background="rgba(255, 255, 255, 0.5)"
      :data="filteredData"
      border
      show-overflow-tooltip
      :height="tableHeight"
      :row-key="rowKey"
      @row-click="clickRow"
      @selection-change="selectRow">
      <el-table-column
        v-if="selectable"
        type="selection"
        :fixed="fixedSelectionColumn"
        :selectable="rowSelectable"
        :reserve-selection="reserveSelection" />
      <slot />
    </el-table>
  </div>
</template>

<script>
import Filterbox from '@/components/Filterbox';
import Pagination from './Pagination';

export default {
  name: 'ExtendedTable',
  components: {
    Filterbox,
    Pagination,
  },
  props: {
    tableKey: Number,
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    fixedSelectionColumn: {
      type: Boolean,
      default: false,
    },
    rowSelectable: Function,
    reserveSelection: {
      type: Boolean,
      default: true,
    },
    fixedHeader: {
      type: Boolean,
      default: false,
    },
    rowKey: String,
    excludeClickRows: {
      type: Array,
      default() {
        return [];
      },
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    filterPlaceholder: {
      type: String,
      default() {
        return this.$t('ui.filterByProperties');
      }
    },
    filterKeys: {
      type: Array,
      default() {
        return [];
      },
    },
    keywordFilterKeys: {
      type: [Boolean, Array],
      default() {
        return false;
      },
    },
    fetchValueSuggestions: Function,
    filterMethod: Function,
    remoteMethod: Function,
    filterStorageKey: String,
  },
  data() {
    return {
      page: 0,
      selection: [],
      filters: [],
      tableHeight: undefined,
    };
  },
  computed: {
    fetchFilterValueSuggestions() {
      if (!this.fetchValueSuggestions)  return this.defaultValueSuggestion;
      return this.fetchValueSuggestions;
    },
    localFilterMethod() {
      if (!this.filterMethod)  return this.defaultFilter;
      return this.filterMethod;
    },
    filteredData() {
      if (this.remoteMethod)  return this.data;
      return this.localFilterMethod(this.filters, this.keywordKeys);
    },
    keywordKeys() {
      let keywordKeys = this.keywordFilterKeys;
      if (keywordKeys === true) {
        keywordKeys = this.filterKeys.map(filterKeyDef => filterKeyDef.value);
      }
      return keywordKeys;
    },
    showPagination() {
      return this.limit !== 0;
    },
    totalCount() {
      return this.total ? this.total : this.data.length;
    },
  },
  watch: {
    data(value) {
      if (!this.selectable) return;
      if (!this.reserveSelection) return;
      const oldSelection = new Set(
        this.selection.map(row => row[this.rowKey]));
      this.$nextTick(() => {
        this.$refs.table.clearSelection();
        value.forEach(row => {
          if (oldSelection.has(row[this.rowKey])) {
            this.$refs.table.toggleRowSelection(row, true);
          }
        });
        if (this.selection.length === 0 && value.length === 1) {
          this.$refs.table.toggleRowSelection(value[0], true);
        }
      });
    },
    filters() {
      this.setTableHeight();
    }
  },
  mounted() {
    this.setTableHeight();
    window.onresize = this.setTableHeight;
  },
  methods: {
    setTableHeight() {
      if (!this.fixedHeader) return;
      this.$nextTick(() => {
        if (this.filterable || this.showPagination) {
          const toolbarHeight = this.$refs.toolbar.offsetHeight;
          const parentHeight = this.$refs.toolbar.parentNode.offsetHeight;
          const computedStyle = window.getComputedStyle(this.$refs.toolbar);
          const tableHeight = parentHeight - toolbarHeight -
            parseInt(computedStyle.marginTop) - parseInt(computedStyle.marginBottom);
          this.tableHeight = tableHeight + 'px';
        }
      });
    },
    clickRow(row, column) {
      if (column.type === 'selection') return;
      if (this.excludeClickRows.includes(column.property)) return;
      if (this.selection.length === 1 &&
          row[this.rowKey] === this.selection[0][this.rowKey]) return;
      this.$refs.table.clearSelection();
      this.$refs.table.toggleRowSelection(row, true);
    },
    selectRow(selection) {
      this.selection = selection;
      this.$emit('selection-change', selection);
    },
    addFilter(filter) {
      this.$refs.filterbox.addFilter(filter);
    },
    defaultValueSuggestion(key, value, cb) {
      const duplicateDetection = {};
      let suggestions = [];
      this.data.forEach(row => {
        const suggestion = row[key];
        if (duplicateDetection[suggestion]) return;
        duplicateDetection[suggestion] = 1;
        if (suggestion.toLowerCase().includes(value.toLowerCase())) {
          suggestions.push(suggestion);
        }
      });
      cb(suggestions.sort());
    },
    defaultFilter(filters, keywordKeys) {
      if (filters.length === 0)  return this.data;
      const filtered = [];
      const filterMap = {};
      filters.forEach(filter => {
        if (filterMap[filter.key]) {
          filterMap[filter.key].push(filter);
        } else {
          filterMap[filter.key] = [filter];
        }
      });

      this.data.forEach(row => {
        for (const filterKey in filterMap) {
          const keyFilters = filterMap[filterKey];
          let filterKeyMatched = false;
          keyFilters.forEach(filter => {
            if (filter.key === '') {
              keywordKeys.forEach(keywordKey => {
                const keywordValue = row[keywordKey];
                if (keywordValue && keywordValue.toLowerCase().includes(filter.value.toLowerCase())) {
                  filterKeyMatched = true;
                }
              });
              return;
            }
            let value = row[filter.key];
            if (filter.operator === '<empty>') {
              if ([undefined, null, ''].includes(value))  filterKeyMatched = true;
              return;
            }
            if (filter.operator === '<non-empty>') {
              if (![undefined, null, ''].includes(value))  filterKeyMatched = true;
              return;
            }
            if (filter.type === 'date') {
              value = new Date(value);
              if (filter.operator === ':') {
                const dates= filter.value.split('/');
                const startDate = new Date(dates[0]);
                const endDate = new Date(dates[1]);
                if (value >= startDate && value < endDate)  filterKeyMatched = true;
              } else if (filter.operator === '=') {
                const date = new Date(filter.value);
                if (value === date)  filterKeyMatched = true;
              } else if (filter.operator === '>') {
                const date = new Date(filter.value);
                if (value > date)  filterKeyMatched = true;
              } else if (filter.operator === '<') {
                const date = new Date(filter.value);
                if (value > date)  filterKeyMatched = true;
              }
              return;
            }
            if (filter.operator === ':') {
              if (value.toLowerCase().includes(filter.value.toLowerCase()))  filterKeyMatched = true;
            } else if (filter.operator === '=') {
              if (value === filter.value)  filterKeyMatched = true;
            }
          });
          if (!filterKeyMatched) return;
        }
        filtered.push(row);
      });
      return filtered;
    },
    filter(filters) {
      this.filters = filters;
      if (this.remoteMethod) {
        this.remoteMethod(filters, this.keywordKeys);
      }
      if (this.showPagination)  this.page = 0;
    },
    pageChange(page) {
      this.page = page;
      this.$emit('page-change', this.page);
    },
  }
};
</script>
